---
layout: page
status: publish
published: true
title: 'AngularJS for Beginners: Day 2'
author:
  display_name: Ryan Chenkie
  login: cienki
  email: ryanchenkie@gmail.com
  url: ''
author_login: cienki
author_email: ryanchenkie@gmail.com
wordpress_id: 363
wordpress_url: http://ryanchenkie.com/?page_id=363
date: '2015-07-25 10:04:19 -0400'
date_gmt: '2015-07-25 16:04:19 -0400'
categories: []
tags: []
comments: []
---
Welcome back to the second day of the course! Yesterday we learned some of the basic theory behind AngularJS, setup our development environment and then installed AngularJS and UI Bootstrap. Today we’re going to dive into some more AngularJS concepts and get moving a bit further on our real estate listing application, <code>ng-cribs</code>.

<div><p><strong>Want to get tutorials like this as a screencast instead? Check out <a href="https://angularcasts.io/?utm_source=ryanchenkie&amp;utm_campaign=angularjs-email&amp;utm_medium=angularjs-email-course" target="_blank">Angularcasts</a>!</strong></p>

<a href="https://angularcasts.io/?utm_source=ryanchenkie&amp;utm_campaign=angularjs-email&amp;utm_medium=angularjs-email-course"><img src="{{site.url}}/{{site.baseurl}}img/angularcasts-banner.png" alt="" width="900" height="200" /></a></div>

<h2 id="the-mvc-pattern">The MVC Pattern</h2>
MVC stands for model-view-controller and it’s a popular design pattern in software development. The pattern (or something similar to it) is seen in many web application frameworks today, and AngularJS is one of them. Essentially, the MVC pattern gives us a guide to follow for breaking our code out into different areas of responsibility. Let’s take a look at each:
<ul>
 	<li>Model—code that is responsible for logic, storing data, and communicating with a backend or database</li>
 	<li>View—code (usually markup) responsible for what the user sees on their screen and the associated interaction elements such as buttons, input boxes, etc</li>
 	<li>Controller—code that is a kind of middle man responsible for communicating data between the model and the view</li>
</ul>
There are a lot of opinions and debates around the MVC pattern, where and how it should be used, and even what its definition is, but for our learning we’ll keep it simple and stick to what we have above. In fact, many would argue that AngularJS is actually an MVVM framework, where VM stands for view-model. We won’t get into the differences and nuances between MVC and MVVM in this course, but you can <a href="http://stackoverflow.com/questions/20286917/angularjs-understanding-design-pattern">read about it</a> if you’re interested. The Angular team has actually declared that the framework uses more of an MVW (model-view-whatever) pattern. Knowing this, we’ll just try to get a basic understanding of MVC in general without worrying too much about the fine details.
<h2 id="the-controller">The Controller</h2>
We actually saw one piece of the MVC pattern in Day 1—the view. It didn’t do a whole lot, but the welcome message we displayed on the screen at the end of the lesson was part of the view. Let’s now jump to the controller so we can have a place to communicate data to the view.

We can define our controllers by accessing the <code>controller</code> property on the <code>angular</code> object. Let’s create a new controller within a folder called “scripts”. From the command line:
<pre><code class="language-markup">mkdir scripts
cd scripts
</code></pre>
Here we make a new directory called scripts and then change into it.
<pre><code class="language-markup">touch cribsController.js
</code></pre>
This creates a new file called <code>cribsController.js</code> which will be the controller we use for our project. There are several different naming conventions for files in AngularJS projects and the one you choose is up to you. The important part is to remain consistent across the project so that other people working on it don’t get confused. I like to be explicit and spell out the whole name, which is what we’ve done here.

Now let’s edit the file and define the controller.
<pre><code class="language-javascript">// scripts/cribsController.js
angular
  .module('cribsApp')
  .controller('cribsController', function($scope) {

    // TODO: communicate data to the view!

  });
</code></pre>
In yesterday’s lesson we used <code>angular.module</code> to define the name of our application which we called <code>cribsApp</code>. We can also use the <code>module</code> method to grab a hold of a our module to add other things to it, which is what we’re doing here. Notice that we don’t add in the module injection array as a second argument.

The <code>controller</code> method is what let’s us define our controllers and we call this one the same thing we used in the file name, <code>cribsController</code>. The second argument for the controller definition is an anonymous function, inside of which our data communication will happen. Notice that we’ve added something called <code>$scope</code> in as an argument to that function. This might look a little weird, so let’s go over what that’s all about.
<h2 id="introducing-scope">Introducing $scope</h2>
Perhaps <code>$scope</code> is totally new to you, or if you’ve looked at any AngularJS examples before, perhaps you’ve seen it already. So what exactly is it? The <a href="https://docs.angularjs.org/guide/scope">official description</a> from the AngularJS docs gets a bit complex, but for our purposes we can think of <code>$scope</code> as the piece or mechanism (really it’s an object) that lets us tie data between our views and controllers together. It is responsible for moving data between the users’s screen (aka the view) and the area in our code where we get data ready for transport (aka the controller). Rather than go any further with describing what <code>$scope</code> is or show you any kind of diagram, why don’t we dive right in and see it at work.
<h2 id="dependency-injection">Dependency Injection</h2>
You might remember from Day 1 that one of the core features of AngularJS is dependency injection. This is a pattern seen in software design that let’s us make use of individual components, services, functions or instances where and when they are needed. Dependency injection is beneficial because it makes it possible for us to abstract our code out into reusable chunks which can then be called upon later when we need them.

In the code example above, <code>$scope</code> is injected simply by passing it as an argument to the callback function within the controller. This is the most popular way to do dependency injection in Angular, although there are other ways as well. When we’re dealing with simple apps the dependency injection system is great—we just call whichever piece we need when we need it.

Now that we’ve got an understanding of these concepts, let’s put <code>$scope</code> to work and get it displaying data in our view.
<h2 id="displaying-data-in-the-view">Displaying Data in the View</h2>
Let’s start small and do a simple test to get going.
<pre><code class="language-javascript">// scripts/cribsController.js
angular
  .module('cribsApp')
  .controller('cribsController', function($scope) {

    $scope.hello = "Hello World!";

  });
</code></pre>
Here’s the classic “Hello World!” example to get us going. Now that this string is on <code>$scope</code> we can make use of it in the view.
<pre><code class="language-markup">&lt;!-- index.html --&gt;
&lt;!doctype html&gt;
&lt;html&gt;
    &lt;head&gt;
        &lt;meta charset="utf-8"&gt;
        &lt;title&gt;ng-cribs&lt;/title&gt;
        &lt;link rel="stylesheet" href="node_modules/bootstrap/dist/css/bootstrap.css"&gt;
    &lt;/head&gt;
    &lt;body ng-app="cribsApp" ng-controller="cribsController"&gt;

        &lt;h1&gt;{{hello}}&lt;/h1&gt;

    &lt;/body&gt;
    &lt;script src="node_modules/angular/angular.js"&gt;&lt;/script&gt;
    &lt;script src="node_modules/angular-bootstrap/dist/ui-bootstrap.js"&gt;&lt;/script&gt;
    &lt;script src="node_modules/angular-bootstrap/dist/ui-bootstrap-tpls.js"&gt;&lt;/script&gt;
    &lt;script src="app.js"&gt;&lt;/script&gt;
    &lt;script src="scripts/cribsController.js"&gt;&lt;/script&gt;
&lt;/html&gt;
</code></pre>
There are a couple things we’ve changed up here so let’s take a look at them one at a time.

You’ll see that on the <code>body</code> tag we have added another directive called <code>ng-controller</code>. Like we mentioned in Day 1, the <code>ng-app</code> directive is used to define which parts of the HTML our application should work in. Since we put <code>ng-app</code> on the <code>&lt;body&gt;</code> tag, anything in between the start and end <code>&lt;body&gt;</code> tags will be available to the application. In the same way, putting <code>ng-controller="cribsController"</code> on the <code>&lt;body&gt;</code> tag means that we’ll be able to use that controller anywhere in the body.

Next, we’ve changed up the welcome message from what we had yesterday to something we haven’t seen yet. We’ve got the word “hello” between double curly braces within the <code>h1</code> tags here. This is called templating and it’s what allows us to have dynamic data displayed on the page that gets fed from elsewhere—in this case, our controller. Using <code>{{ hello }}</code> in this manner is known as a string expression.

This gets to the crux of communicating data between the controller and the view: the string expression lines up with what we put on <code>$scope</code> in the controller. Once we put something on <code>$scope</code> we simply have to call that something by name (without preceding it by <code>$scope</code>) in the view and it shows up for us. Awesome!

Lastly, we have a reference to our <code>cribsController</code> JavaScript file near the end of <code>index.html</code>. Let’s check this out in the browser to make sure it’s working:

![]({{site.url}}/{{site.baseurl}}img/day-2-1.png)
<h3 id="more-on-templating">More on Templating</h3>
As a quick side note, we’re not limited to string expressions in our templates. We can also do things like numerical expressions and string concatenation. For example, we can use the <code>+</code> operator and then provide a string between quotes. Let’s see an example of this:
<pre><code class="language-markup">&lt;!-- index.html --&gt;

...

&lt;body ng-app="cribsApp" ng-controller="cribsController"&gt;

    &lt;h1&gt;{{hello}}&lt;/h1&gt;
    &lt;h1&gt;{{hello + ' You\'re looking great.'}}&lt;/h1&gt;
    &lt;h1&gt;{{5 + 2}}&lt;/h1&gt;
    &lt;h1&gt;{{(7 - 3) * 20}}&lt;/h1&gt;       

&lt;/body&gt;

...
</code></pre>
Let’s refresh the page to see the results:

![]({{site.url}}/{{site.baseurl}}img/day-2-2.png)
<h2 id="setting-up-some-real-estate-listing-data">Setting Up Some Real Estate Listing Data</h2>
Now that we have a way to bring data over from the controller to the view, let’s add some real estate listings in! The best way we can do this is to put an array of objects on <code>$scope</code> that describe individual real estate listings. The objects let us be as descriptive as we want about each listing and putting them in an array let’s us iterate over them easily, which will come in handy later.
<pre><code class="language-javascript">// scripts/cribsController.js
angular
  .module('cribsApp')
  .controller('cribsController', function($scope) {

    $scope.cribs = [
      {
        "type": "Condo",
        "price": 220000,
        "address": "213 Grove Street",
        "description": "Excellent place, really nice view!"
      },
      {
        "type": "House",
        "price": 410500,
        "address": "7823 Winding Way",
        "description": "Beautiful home with lots of space for a large family."
      },
      {
        "type": "Duplex",
        "price": 395000,
        "address": "834 River Lane",
        "description": "Great neighbourhood and lot's of nice green space."
      }
    ]

  });
</code></pre>
Now let’s view the <code>cribs</code> in the browser. To do so, we’ll need to adjust the view.
<pre><code class="language-markup">&lt;!-- index.html --&gt;

...

&lt;body ng-app="cribsApp" ng-controller="cribsController"&gt;

    &lt;pre&gt;{{cribs | json}}&lt;/pre&gt;     

&lt;/body&gt;

...
</code></pre>
As you can see, we’ve added something new to our template—we now have a pipe character followed by <code>json</code>. This is known as a filter and we’ll get more into how they work later, but essentially they let us transform data in our views. We use the pipe character to say that we want to use a filter and then we call the name of the filter we want. Angular comes with several filters built in and one of them is <code>json</code> which takes the data being supplied to the view and formats it as JSON, giving us a much nicer output than if we had left it out. Let’s take a look at the output in the browser:

![]({{site.url}}/{{site.baseurl}}img/day-2-3.png)

As you can see, we now get the real estate listing data in the view. It’s not very useful in its current form though—our users aren’t going to want to read through an array of JSON objects. Let’s do a little bit of work to get the output looking nicer.
<h2 id="introducing-ng-repeat">Introducing ng-repeat</h2>
To make proper use of our data in the view, we have to introduce a new directve: <code>ng-repeat</code>. This directive can be used any time we have a collection of data that we want iterative over in our views. It let’s us make our code reusable because we just have to define the way we want something to look once and then we can apply that to all of the records in the collection. Let’s dive right in to see how this works:
<pre><code class="language-markup">&lt;!-- index.html --&gt;

...

&lt;body ng-app="cribsApp" ng-controller="cribsController"&gt;

    &lt;div class="well" ng-repeat="crib in cribs"&gt;

        &lt;h3&gt;{{crib.address}}&lt;/h3&gt;
        &lt;p&gt;&lt;strong&gt;Type: &lt;/strong&gt;{{crib.type}}&lt;/p&gt;
        &lt;p&gt;&lt;strong&gt;Description: &lt;/strong&gt;{{crib.description}}&lt;/p&gt;
        &lt;p&gt;&lt;strong&gt;Price: &lt;/strong&gt;{{crib.price | currency}}&lt;/p&gt;

    &lt;/div&gt;

&lt;/body&gt;

...
</code></pre>
We setup <code>ng-repeat</code> by putting the directive name on the element we want the iteration to apply to. Like with <code>ng-app</code> and <code>ng-controller</code>, everything in between the tag on which the directive was placed will have access to what that directive offers. The syntax for <code>ng-repeat</code> is similar to iterators in a lot of languages—we say that on each iteration we want access to a single <code>crib</code> <code>in</code> the collection of all the <code>cribs</code>.

Within the <code>&lt;div&gt;</code> tag we now have access to the properties of <code>crib</code> and can display them in our view. As you can see, we are display the address, type, description and price keys with dot notation (<code>crib.property</code>).

The last one in there, <code>crib.price</code> has another one of Angular’s built-in filters on it: <code>currency</code>. This lets us keep the price information in our data objects in number format, making it easier to do calculations on.

If everything worked out, you should be able to see a better-looking listing of the cribs in the browser:

![]({{site.url}}/{{site.baseurl}}img/day-2-4.png)

<h2 id="wrapping-up-day-2">Wrapping Up Day 2</h2>
That’s all for today! We’ve seen quite a few new concepts and put them right into practice in this lesson, including:
<ul>
 	<li>The MVC pattern in software development and why it’s important</li>
 	<li>What a controller is and how to implement one in AngularJS</li>
 	<li>What <code>$scope</code> is and how to use it with dependency injection</li>
 	<li>How to display data in the view</li>
 	<li>How to iterate over data using <code>ng-repeat</code></li>
</ul>
Tomorrow we’re going to look at another tenet of AngularJS, called “services”. These help us to abstract away common parts of our code into reusable chunks.

Great work today, see you again tomorrow!

###### If you've ended up here some other way than through the email link, I'm still glad you're here! You can <a href="#">subscribe</a> to the email list to get the rest of the course.