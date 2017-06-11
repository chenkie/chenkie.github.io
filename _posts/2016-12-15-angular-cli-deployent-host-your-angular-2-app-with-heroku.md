---
layout: post
status: publish
published: true
title: 'Angular CLI Deployment: Host Your Angular 2 App on Heroku'
feature_image: angular-cli-heroku-cover.jpg
author_slug: ryan-chenkie
date: '2016-12-15'
categories:
- Angular
- Deployment
tags:
- Angular CLI
- Deployment
- Heroku
comments: true
---

The Angular CLI is all around awesome and gives us a ton of time-saving features out-of-the-box. One that I love is the development server it comes with. If you’ve used the Angular CLI, there’s a good chance you’ve run `ng serve` and then visited `localhost:4200` to see your app.

This is great for development purposes, but what do we do when it comes time to put our apps into production? The CLI comes with a command to deploy to GitHub Pages, which may be just fine for your use case. However, there’s a good chance that you’ll need more fine-grained control over how your app is served when it’s ready to go live.

Beyond this, the Angular CLI doesn’t come with a command for, nor is it concerned with, how we put our apps into production. Those details are up to us. This is fine, but it can sometimes be confusing to figure out how all the pieces come together to actually deploy an Angular 2 app.
In this tutorial we’ll cover how to deploy an Angular 2 app (built with the Angular CLI) to Heroku. We’ll also cover how to configure the app to redirect users to HTTPS and to properly handle routes.

[Get the code](https://github.com/chenkie/angular-cli-heroku) and check out the [live demo](https://angular-cli-heroku.herokuapp.com/). Also, stay tuned to [Angularcasts](https://angularcasts.io/?utm_source=medium&utm_campaign=ng2-cli-deploy&utm_medium=banner) if you’d like the screencast version of this tutorial.

## Get Set Up with Heroku

The beauty of Heroku is in its simple model: push your code to a remote Heroku repo and it will run everything necessary to deploy it. The key is that we need to tell Heroku a few things about how the app should be deployed.

Start by [creating a Heroku account](https://signup.heroku.com/) if you haven’t already done so. Once you have one, be sure to install the Heroku CLI for your platform and log in with your credentials in your terminal. Follow [Heroku’s guide](https://devcenter.heroku.com/articles/getting-started-with-nodejs#set-up) for the full instructions.

From the terminal, change directories into your Angular app and create a Heroku remote.

~~~bash
heroku create
~~~

## Prepare the Angular App’s package.json File

### Building the App

The Angular CLI provides an `ng build` command which is used to create a dist directory with all the files necessary to run the app. We can pass a number of options with this command that let us specify things like whether it's a development or production build, what the output path should be, and perhaps most importantly, whether we want the app to be compiled ahead of time. With ahead of time compilation, the compiler itself is left out of the build, meaning we get a much smaller overall app size. This is recommended for all production applications.

So when should `ng build` be run exactly? Should we run the command when all our work is done, commit everything in the project (including the dist folder), and then push to production? That's an option, but it may not be the best one. For one thing, when the built files go to version control, it can create annoying diffing issues that can be problematic when working in teams. Instead, we can have the `ng build` command be run on the server itself.

When we push code to Heroku, the `scripts` listed in the `package.json` file will be consulted, and if we have any `preinstall` or `postinstall` scripts, they will be run at the appropriate times. What we want to do in this scenario is have the build command run _after_ the dependencies have been installed.

~~~json
// package.json
"scripts": {
  // ...
  "postinstall": "ng build --aot -prod"
},
~~~

With this `postinstall` script in place, we'll get a production mode app that lives in a `dist` folder with ahead of time compilation, all on the server. No need to build the app locally and commit the `dist` folder to version control. What's more is that this all happens automatically when we push our code to Heroku.

## Move the `angular-cli` Dependency

When we push our code to Heroku, a number of events take place. One of these events is that Heroku reads which dependencies we have in our `package.json` file and installs them. By default, however, Heroku will only install the packages listed in the `dependencies` object and will ignore those in `devDependencies`. Since we want the application build step to take place on the server rather than on our local machine, we need to adjust the `package.json` file a bit.

Angular CLI apps put the `angular-cli` module itself as a dev dependency, meaning that we won't be able to access any `ng` commands on the server. To get around this, we need to move it to `dependencies`.

~~~json
// package.json

"dependencies": {
  // ...
  "angular-cli": "1.0.0-beta.22-1"
},
~~~

### Running the Server

Later on, we’re going to create a simple Node server to actually serve the application. We need to specify how the app should be started in a `script` so that Heroku can boot up the application server at the end of the deployment process.

Create another script for the `start` command.

~~~json
// package.json
"scripts": {
  // ...
  "start": "node server.js"
},
~~~

### Engines

Heroku likes to know about which version of Node and npm you’re using during development so that it can use the same ones for production. This is helpful for preventing unanticipated behavior due to version issues. Add your specific Node and npm versions in the `engines` key in `package.json`.

~~~json
// package.json

"engines": {
  "node": "6.9.2",
  "npm": "3.10.9"
}
~~~

## Create an Express Server

There are a few different ways we could serve the application once it gets to Heroku. For example, we could install and run a simple server with something like **http-server**. However, this won’t allow us to have control over the details of how the app is served, which means it’s not the best approach.

Instead we should create a simple Node server to serve the static files from our `dist` folder. This will easily allow us to handle routes properly and redirect to HTTPS for all requests.

Start by creating a new file in the application root called `server.js`. This will be an **express** application, so install and save express.

~~~bash
npm install --save express
~~~

Next, require `express` and create a simple app which serves static files from `dist`.

~~~js
// server.js

const express = require('express');
const app = express();

// Run the app by serving the static files
// in the dist directory
app.use(express.static(__dirname + '/dist'));

// Start the app by listening on the default
// Heroku port
app.listen(process.env.PORT || 8080);
~~~

This very tiny express app can now serve our Angular 2 app once it gets to Heroku. Keep in mind that the `start` script is the last one to be called in the deployment process. The `postinstall` script will run beforehand, so we'll have all the files built and ready to go in the `dist` directory.

## Force Redirect to HTTPS

All non-trivial applications should be run over HTTPS. If you don’t already have SSL set up for your Heroku app, follow [the steps](https://devcenter.heroku.com/articles/ssl) to do so.

Once the app is served over HTTPS, one remaining issue is that it will still be accessible with the unencrypted HTTP protocol. By default, unless the user specifically types in `https://` ahead of the domain, they'll get the `http` version of the app. The desired behavior is to have all requests for the application be redirected to `https`. There are a few ways to do this, but the simplest one in our case is to check the protocol in all incoming requests for the app and redirect to `https` if necessary.

~~~js
// server.js

const express = require('express');
const app = express();

// If an incoming request uses
// a protocol other than HTTPS,
// redirect that request to the
// same url but with HTTPS
const forceSSL = function() {
  return function (req, res, next) {
    if (req.headers['x-forwarded-proto'] !== 'https') {
      return res.redirect(
       ['https://', req.get('Host'), req.url].join('')
      );
    }
    next();
  }
}

// Instruct the app
// to use the forceSSL
// middleware
app.use(forceSSL());

// ...
~~~

The `forceSSL` function returns a middleware function which checks for the `x-forwarded-proto` header that comes in on all requests. If that header isn't `https`, the request will be redirected to the exact same host and URL, but with `https` ahead of it. All requests that are already using `https` will just be allowed to pass through.

## Handle PathLocationStrategy Routing

For routing, Angular apps employ `PathLocationStrategy` by default, meaning that there won't be any hashes in the URL. This is generally cleaner and more desirable, but it comes at the cost of sub-routes not being accessible when someone navigates directly to them. What's required to make `PathLocationStrategy` work properly is some configuration on the server, and fortunately, it's fairly easy with express.

~~~js
// server.js

// ...

// For all GET requests, send back index.html
// so that PathLocationStrategy can be used
app.get('/*', function(req, res) {
  res.sendFile(path.join(__dirname + '/dist/index.html'));
});
~~~

When we punch in the domain and a sub-route for our Angular app in the URL bar and hit enter, the `GET` request made to the server tries to serve a path that doesn't exist. Instead, we need to tell the server to always serve the `index.html` file for any `GET` request that comes in for any route. This will allow Angular to handle the routing instead of the server. Now when we navigate directly to a sub-route (instead of clicking our way there in the app), the route will be served as expected.

## Push to Heroku to Deploy the App

With all of this in place, it’s now time to deploy! This part is simple. Just commit your work and push it up.

~~~bash
git add .
git commit -m "first deploy"
git push heroku master
~~~

![angular cli angularcasts]({{site.url}}/{{site.baseurl}}img/post-assets/angular-cli-heroku.png)

## Bonus: Create a Script to Handle the Deploy

It’s likely that we’ll want to commit our work to a GitHub or Bitbucket repo in addition to the Heroku repo. We can set up another `script` in `package.json` to handle this for us in one step.

~~~json
// package.json

"scripts": {
  // ...
  "deploy": "git push origin master && git push heroku master"
},
~~~

Now after the work is committed, we just need to run:

~~~bash
npm run deploy
~~~

## Wrapping Up

Setting up Angular CLI apps to deploy to Heroku is fairly simple, but some modification to the `package.json` file is needed, along with a custom Node server. Setting the deployment up in this way is advantageous because we now have a lot of control over how the app is served.
