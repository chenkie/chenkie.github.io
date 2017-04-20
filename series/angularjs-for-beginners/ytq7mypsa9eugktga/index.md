---
layout: page
status: publish
published: true
title: 'AngularJS for Beginners: Day 1'
author:
  display_name: Ryan Chenkie
  login: cienki
  email: ryanchenkie@gmail.com
  url: ''
author_login: cienki
author_email: ryanchenkie@gmail.com
wordpress_id: 350
wordpress_url: http://ryanchenkie.com/?page_id=350
date: '2015-07-25 09:49:18 -0400'
date_gmt: '2015-07-25 15:49:18 -0400'
categories: []
tags: []
comments: []
---
If you’ve recently been looking into creating web applications, chances are you’ve probably heard of a framework called AngularJS. Perhaps you’ve even seen the demos that are available on the <a href="https://angularjs.org/">AngularJS site</a> and have played around a little with it. Or, perhaps you haven’t gotten very far with the demos and tutorials that are available on the official site or elsewhere and you’re looking for guided and step-by-step instruction on how to get started. In either case, over the next seven days we’re going to dive into the fundamentals of AngularJS and in that time you will learn how to create your very first single-page web application with it!

AngularJS can be hard to learn through demos and tutorials scattered across the web, but it doesn’t have to be. My aim for this seven-day course is that you would come away from it feeling confident in the fundamentals of the framework and with an excitement for it that drives you to go even deeper.

<div><p><strong>Want to get tutorials like this as a screencast instead? Check out <a href="https://angularcasts.io/?utm_source=ryanchenkie&amp;utm_campaign=angularjs-email&amp;utm_medium=angularjs-email-course" target="_blank">Angularcasts</a>!</strong></p>

<a href="https://angularcasts.io/?utm_source=ryanchenkie&amp;utm_campaign=angularjs-email&amp;utm_medium=angularjs-email-course"><img src="{{site.url}}/{{site.baseurl}}img/angularcasts-banner.png" alt="" width="900" height="200" /></a></div>

<h2 id="what-is-angularjs-and-what-does-it-do">What is AngularJS and What Does it Do?</h2>
AngularJS is a JavaScript framework that helps to simplify the process of building Single Page Applications (SPAs). As opposed to traditional “round trip” websites and web applications which refresh the page every time new data needs to be displayed, SPAs generally don’t do any hard refreshing. Instead, they rely on <a href="https://developer.mozilla.org/en-US/docs/Web/API/XMLHttpRequest">XHR (XMLHttpRequest)</a> requests to retrieve useful pieces of data for the app at the time the data is needed.

You’ve probably seen XHR at work on many websites, but perhaps you haven’t realized it. Take Gmail for example: if you send a message in Gmail, the page doesn’t refresh but rather stays in place as the message is sent. When you hit the send button, Gmail does work behind the scenes to send your message’s data to its servers as an XHR request which means it doesn’t require the page to be refreshed.

This Single Page Application approach has several benefits, but likely the biggest one is a vast improvement in user experience. With SPAs, the user’s experience becomes closer to that of a native desktop application which is inherently more fluid and responsive than traditional round-trip web applications. Instead of waiting for the page to refresh on every interaction that requires data to be sent or received, only a small portion of page is refreshed.

So where does AngularJS come in? It does a lot of things, but at it’s core it makes it easier for you to do things with HTML that it was never originally designed to do. For example, HTML was never designed to let you have elements on your page act dynamically, changing the way they look or the data they display. HTML was also not designed to consistently keep the data that the user sees on their screen in sync with what is under the hood of the application. These problems and more are helped with the following core features of AngularJS:
<ul>
 	<li>Two-way data binding that automatically syncs data between a model and a view (updating a text element in real time as a user types something into a text box)</li>
 	<li>Built-in and custom directives that extend what HTML is capable of doing (with Angular we can create our own HTML tags: <code>&lt;whatever-you-want&gt;&lt;/whatever-you-want&gt;</code></li>
 	<li>Separation of concerns through a Model-View-Controller (MVC) pattern—code is separated based on responsibility</li>
 	<li>Templating—application data is reflected to a user-facing view through Angular’s double-curly brace template syntax: <code>&lt;h1&gt;{{firstname}}&lt;/h1&gt;</code></li>
</ul>
There are many more features to AngularJS and we will learn about them as we go. That’s enough theory for now though, let’s learn by doing and take a look at what we’ll build for this course.
<h2 id="building-a-real-estate-listing-application">Building a Real-Estate Listing Application</h2>
To learn about some of the core features of AngularJS, we’re going to build a simple real estate listing application called <code>ng-cribs</code>. The app will be pretty basic and will simply display real estate listings in a nicely-styled card, but we’ll also be able to locally create, update and delete new real estate listings.

Why a real estate listing app? The application could be anything really—AngularJS is totally agnostic about what kind of applications we build. Since an application that handles real estate listings will need to use many of the features that AngularJS provides, it will work as an example.

![]({{site.url}}/{{site.baseurl}}img/day-1-1.png)
<h2 id="getting-your-development-environment-setup">Getting Your Development Environment Setup</h2>
<h3 id="installing-a-local-web-server">Installing a Local Web Server</h3>
Before we get going, it’s important to make sure you have your development environment properly setup. We’re not really going to need a local web server for this application, but it’s a good idea to have one setup anyway. Also, a local web server will be a requirement if you ever want to pull in any resources that are served over a content delivery network (example: Google Fonts).

If you don’t already have a local web server setup, you should do that now. There are a few options out there, but here are the common ones:

<strong>Mac Users</strong> — <a href="https://www.mamp.info/en/">MAMP</a>

<strong>Windows Users</strong> — <a href="http://www.wampserver.com/en/">WAMP</a>

<strong>All Users</strong> — <a href="https://www.apachefriends.org/index.html">XAMPP</a>

We won’t get into exactly how to install these local web servers in this tutorial, but instructions are provided on the pages for each. If you run into any trouble getting the web servers setup, Google around to find the problem—it’s likely that your issue has been solved before.
<h3 id="installing-nodejs">Installing Node.js</h3>
You might be familiar with Node.js already and perhaps you know that it is a platform which gives us a way to write server-side code in JavaScript. We’re not going to be doing any server-side code in this course, but we’ll still need Node installed so that we can use a JavaScript package manager that runs on it called. Node’s package manager is called <code>npm</code> and it essentially gives us an easy way to install packages, including AngularJS. It’s through npm that we’ll install the AngularJS framework and some other dependencies.

Node.js gives us an easy to use installer which can be downloaded from the <a href="https://nodejs.org/">Node.js website</a>. Node.js comes with npm out of the box which makes our lives easier because don’t have to do any further installations.
<h3 id="using-the-command-line">Using the Command Line</h3>
If you haven’t used the command line much before, it can seem a little bit scary at first. Don’t worry though, our use of it will be pretty minimal in this course. Plus, it’s not that bad once you get used to it. Essentially the command line is an interface that allows us to provide instructions to the computer to carry out certain tasks. We can get the computer to do pretty much anything through the command line, but for our purposes we’re only going to be using it to download code packages (like AngularJS) and to create some files.

Mac and Windows both come with command prompts built in. On Mac, it’s called Terminal and on Windows it’s called Command Prompt.

Although these work fine, you may want to install something a bit nicer to work with. These are two good solutions:

<strong>Mac</strong> — <a href="https://www.iterm2.com/">iTerm</a>
<strong>Windows</strong> — <a href="http://sourceforge.net/projects/console/files/">Console2</a>

We’ll be using Linux-style commands for this course. If you’re on Windows, some of the commands will differ a little bit, but it’s easy to find translations for them if the commands provided don’t work. If you’d like a totally Linux-like experience on Windows, you can try <a href="https://www.cygwin.com/">Cygwin</a>.
<h3 id="checking-the-nodejs-install">Checking the Node.js Install</h3>
After downloading and installing Node.js, we can now use the command line to test out whether it and <code>npm</code> are setup properly. Open the program for whichever command prompt you’ll be using, type in the following and then hit enter:
<pre><code class="language-markup">node -v
</code></pre>
This command checks which version of Node.js is installed and displays it on the screen. At the time of this writing, Node.js is at version is 0.12.6.

We can also check to make sure that npm is there:
<pre><code class="language-markup">npm -v
</code></pre>
![]({{site.url}}/{{site.baseurl}}img/day-1-2.png)
<h2 id="installing-angularjs">Installing AngularJS</h2>
Now that we have our environment setup and ready to go, let’s install AngularJS. We’ll install the framework from the command line, but first we’ll need create a home for it. You’ll want to create a new project in the directory that your local web server serves files from. I’m using MAMP and in my case it’s with in the <code>htdocs</code> directory in <code>Applications/MAMP</code>. To get some more experience on the command line, let’s create a new file in this directory from there. You can, however, create the new folder manually if you like.

First we need to change directories (<code>cd</code>) into the <code>htdocs</code> folder (or whichever one serves your files). If you’re using MAMP, the command is as follows:
<pre><code class="language-markup">cd /Applications/MAMP/htdocs
</code></pre>
Next we’ll create a new folder in this location using the <code>mkdir</code> command which, as you’ve probably guessed, makes a new directory. Let’s call the new directory <code>ng-cribs</code>:
<pre><code class="language-markup">mkdir ng-cribs
</code></pre>
If you look in the folder window for that location, you should now see a new directory called <code>ng-cribs</code>.

Next we’ll need to <code>cd</code> into this new folder:
<pre><code class="language-markup">cd ng-cribs
</code></pre>
Now that we’re in our new folder, let’s download AngularJS using <code>npm</code>. We’re going to put <code>sudo</code> at the start of this command which just means that we want to run it as the administrator. Depending on how you have Node.js setup, you might be required to prove that you’re the administrator before you’ll be allowed to use it.
<pre><code class="language-markup">sudo npm install angular
</code></pre>
You’ll be prompted for your password at this point. It will look like you’re not typing anything because the cursor won’t move at all as you type, but don’t worry, the command prompt is receiving what you’re putting in there. Once you’re done, hit enter.

![]({{site.url}}/{{site.baseurl}}img/day-1-3.png)

AngularJS should now be installed and we’ll be able to tell that it is if we can see a new folder called <code>node_modules</code> within our <code>ng-app</code> folder. We can check this the traditional way, or we can also see it using the command line:
<pre><code class="language-markup">ls
</code></pre>
This command will list the files and folders within the directory you’re currently in. In our case, we should see the <code>node_modules</code> folder. If we <code>cd</code> into it, we’ll see a folder called <code>angular</code> and then if we <code>cd</code> into that folder, we’ll see all the AngularJS files that we’ll need.
<pre><code class="language-markup">cd node_modules
ls
cd angular
ls
</code></pre>
<h2 id="creating-the-indexhtml-file">Creating the index.html File</h2>
We’re going to need a main <code>index.html</code> file from which the application will load. This is typical of most websites—they need a starting point. Let’s create a new file from the command line using the <code>touch</code> command. First, we’ll need to change directories back to our main project file:
<pre><code class="language-markup">cd ../..
</code></pre>
Two dots signify “one level up” in the folder structure and we do this twice (separated by a slash) to go two levels up.
<pre><code class="language-markup">touch index.html
</code></pre>
The touch command will create a new file and in this case it’s called <code>index.html</code>.

Now let’s open up the file and add some HTML structure to it. You probably have a text editor installed already, but in case you don’t or are looking for a new one, I like <a href="http://www.sublimetext.com/">Sublime Text</a>.

Let’s put some basic HTML structure in.
<pre><code class="language-markup">&lt;!-- index.html --&gt;
&lt;!doctype html&gt;
&lt;html&gt;
    &lt;head&gt;
        &lt;meta charset="utf-8"&gt;
        &lt;title&gt;ng-cribs&lt;/title&gt;
    &lt;/head&gt;
    &lt;body ng-app="cribsApp"&gt;

        &lt;h1&gt;Welcome to ng-cribs!&lt;/h1&gt;

    &lt;/body&gt;
    &lt;script src="node_modules/angular/angular.js"&gt;&lt;/script&gt;
    &lt;script src="app.js"&gt;&lt;/script&gt;
&lt;/html&gt;
</code></pre>
You’re likely familiar with most of what’s going on in this file; however, what might stand out as being different right away is the special attribute we’ve placed on the <code>body</code> tag that says <code>ng-app="cribsApp"</code>. So what’s going on here? This special attribute references what is known as a directive. In this case, we’re using the framework’s built-in <code>ng-app</code> directive which tells the element that it is declared on (this case the <code>body</code> tag) that everything within it is considered part of the application. The part where we say <code>="cribsApp"</code> is a way for us to give the application module a name which will be referred to in other places.

You’ll also notice that we’ve got some <code>script</code> tags at the bottom of the file which reference some JavaScript files. The first one references the AngularJS framework which we saw earlier and the second references a file called <code>app.js</code>. We haven’t created this file yet, but we’ll do that next.
<h2 id="creating-an-appjs-file">Creating an app.js File</h2>
If the <code>index.html</code> file is the starting point for the HTML portion of a website or web application then the <code>app.js</code> file is the starting point for the JavaScript bits of the application. Many JavaScript frameworks will use something like <code>app.js</code> as the point from which the application is initialized and AngularJS is no exception.

Let’s again use the command line to create this file:
<pre><code class="language-markup">touch app.js
</code></pre>
Now let’s open this file in our text editor and add some Angular to it:
<pre><code class="language-javascript">// app.js
angular.module('cribsApp', []);
</code></pre>
AngularJS takes the approach of using modules as places to store all the pieces that come together to make the application work. They are like containers for other parts of the application, many of which we’ll see later. There are several beneficial implications of the module approach and one of them is that we can easily use code that other people create to help us out in creating our own applications.

Getting the application started is a matter of us calling the <code>module</code> method on the <code>angular</code> object and referencing the name of our application module. As you’ll remember from above, we’re calling this application <code>cribsApp</code>, and this name goes in as the first argument to the <code>module</code> method. What’s that second empty array argument all about though? This is where AngularJS takes in the names of other modules that we want to include and have our application depend on. For now it is empty because we don’t have any other modules to include just yet, but we will later. Even though we don’t have any other modules to include, we still need to pass in an empty array because this is what AngularJS expects—we would get an error if we didn’t.
<h3 id="adding-a-third-party-module">Adding a Third Party Module</h3>
In the last section we talked about how AngularJS uses modules which can be thought of as containers for an application’s pieces. This is advantageous because we can also make use of third party modules that help us with our application development.

There are many third party modules out there for a range of needs—everything from directives that make it easy to create tables to services that help with translation. A good place to look for packages is <a href="http://ngmodules.org/">ngModules</a> which has a lot of popular AngularJS modules listed.

For our application we’re going to want to make use of a module called <a href="https://angular-ui.github.io/bootstrap/">UI Bootstrap</a>. You may be familiar with <a href="http://getbootstrap.com/">Bootstrap</a> which is a very popular front-end framework that provides pre-made HTML, CSS and JavaScript pieces that make website and application development easier. UI Bootstrap is the AngularJS-specific implementation of Bootstrap that comes with custom directives which can ultimately save us a lot of development time. While we won’t use UI Bootstrap directly in this series, we will make use of it in a follow-up course. Either way, it’s a useful example of how to bring in third-party modules.

To bring in UI Bootstrap we’ll once again go to the command line and use <code>npm</code>.
<pre><code class="language-markup">npm install angular-bootstrap
</code></pre>
UI Bootstrap doesn’t actually come with the the standard Bootstrap CSS, so we let’s also install the regular Bootstrap package as well.
<pre><code class="language-markup">npm install bootstrap
</code></pre>
Now that UI Bootstrap is installed we can bring it into our application by including it in the module injection array that we talked about earlier. Let’s adjust the <code>app.js</code> code to reflect this.
<pre><code class="language-javascript">// app.js
angular.module('cribsApp', ['ui.bootstrap']);
</code></pre>
To let our application know that we want to use the UI Bootstrap package, we simply have to include the package name as a string in the array.

We’ve missed one important thing though—we need to reference the Javascript file for UI Bootstrap in our <code>index.html</code> file.
<pre><code class="language-markup">&lt;!-- index.html --&gt;
&lt;!doctype html&gt;
&lt;html&gt;
    &lt;head&gt;
        &lt;meta charset="utf-8"&gt;
        &lt;title&gt;ng-cribs&lt;/title&gt;
        &lt;link rel="stylesheet" href="node_modules/bootstrap/dist/css/bootstrap.css"&gt;
    &lt;/head&gt;
    &lt;body ng-app="cribsApp"&gt;

        &lt;h1&gt;Welcome to ng-cribs!&lt;/h1&gt;

    &lt;/body&gt;
    &lt;script src="node_modules/angular/angular.js"&gt;&lt;/script&gt;
    &lt;script src="node_modules/angular-bootstrap/dist/ui-bootstrap.js"&gt;&lt;/script&gt;
    &lt;script src="node_modules/angular-bootstrap/dist/ui-bootstrap-tpls.js"&gt;&lt;/script&gt;
    &lt;script src="app.js"&gt;&lt;/script&gt;
&lt;/html&gt;
</code></pre>
You’ll see here that we’ve put in a reference to the regular Bootstrap CSS file in the <code>head</code> of the document. We’ve also put in additional <code>script</code> tags—one for the main UI Bootstrap files and another file that takes care of some templates that UI Bootstrap relies on.
<h2 id="testing-it-out-in-the-browser">Testing It Out in the Browser</h2>
Now that we have our <code>index.html</code> and <code>app.js</code> file in place, let’s fire up the browser and make sure that everything is working properly. If you’re using MAMP you need to go to localhost:8888/ng-cribs to see the application, but this might it might be different for you depending on which local web server you are using. I have my installation of MAMP setup to omit the port number (8888) from the URL.

If everything worked out you should see our welcome message. We’ll also want to make sure we don’t get any error messages in the console, so let’s check that as well. To do so, we’ll need to open the developer tools panel. In Chrome, we can right click on the page and choose Inspect Element, or we can do Option + Command + I on the keyboard (Ctrl + Shift + I on Windows).

![]({{site.url}}/{{site.baseurl}}img/day-1-4.png)
<h2 id="wrapping-up-day-1">Wrapping Up Day 1</h2>
That’s all for the first day of the course! We covered a quite a few things today which may or may not be familiar to you, including:
<ul>
 	<li>An overview of what AngularJS is and what it’s used for</li>
 	<li>A look at the application we’ll be building in this course</li>
 	<li>How to setup our development environment</li>
 	<li>How to install AngularJS with an introduction to the command line</li>
 	<li>How to setup the initial files needed for our application</li>
 	<li>How to bring in third party modules and get them ready to be used</li>
</ul>
While we went over quite a bit of theory and setup today, we didn’t do a whole lot of work on our actual application, nor did we really get to see any of Angular’s features. Don’t worry though, there’s lot’s of that to come. Tomorrow we’ll cover some new concepts and topics including Angular’s <code>$scope</code> object and how to use it. We’ll also see how to setup and use controllers and views.

Great job today—see you back here tomorrow!

###### If you've ended up here some other way than through the email link, I'm still glad you're here! You can <a href="#">subscribe</a> to the email list to get the rest of the course.