---
layout: page
status: publish
published: true
title: 'AngularJS for Beginners: Day 4'
author:
  display_name: Ryan Chenkie
  login: cienki
  email: ryanchenkie@gmail.com
  url: ''
author_login: cienki
author_email: ryanchenkie@gmail.com
wordpress_id: 376
wordpress_url: http://ryanchenkie.com/?page_id=376
date: '2015-07-25 10:46:56 -0400'
date_gmt: '2015-07-25 16:46:56 -0400'
categories: []
tags: []
comments: []
---
Yesterday we saw how to make our code more reusable by moving common application logic into an AngularJS <code>factory</code>, also known as a service. We’ll be revisiting this service once again today as we take a look at how to setup communication with a backend.

As was mentioned yesterday, we’re not actually going to do any communication with a real database in this course because we want to focus on the fundamentals of Angular. However, at the end of the course we’ll talk about what options we have for integrating a backend in.

<div><p><strong>Want to get tutorials like this as a screencast instead? Check out <a href="https://angularcasts.io/?utm_source=ryanchenkie&amp;utm_campaign=angularjs-email&amp;utm_medium=angularjs-email-course" target="_blank">Angularcasts</a>!</strong></p>

<a href="https://angularcasts.io/?utm_source=ryanchenkie&amp;utm_campaign=angularjs-email&amp;utm_medium=angularjs-email-course"><img src="{{site.url}}/{{site.baseurl}}img/angularcasts-banner.png" alt="" width="900" height="200" /></a></div>

<h2 id="angularjs-as-a-front-end-framework">AngularJS as a Front-End Framework</h2>
As you’re likely aware and have come to realize by now, AngularJS is solely a front-end framework. That is, it focuses on letting developers easily create the parts of the application that users see in their web browsers. For some applications, especially those that are trivial and don’t require any ability to persist data, AngularJS alone is all that is needed to make the application run. However, for most real world applications this simply won’t do. In most cases the user will need to be able to create, read, update and delete records in a database. In most (but not all) cases, this will require the application developer to have a web server and database setup with some server-side language that takes care of database interaction and other backend logic.

So which server-side languages and frameworks is AngularJS compatible with? In short, anything! That’s the beauty of Angular—as long as you have a web server that has the ability to return data after an HTTP request is made to it, Angular is compatible with it. The arrangement between Angular and whichever server-side language is being used can vary, but in general the best way to set the two up is to have the server provide what is called a RESTful API (application programming interface). The API then becomes responsible for receiving HTTP requests from Angular and, in response, delivers data of some form.

Going any deeper into server-side languages and APIs is beyond the scope of this introductory course, but there are many resources for further learning available. However, to get a sense for how we would eventually interact with a backend, we’re going to set our AngularJS app up as if it were communicating with one. This will let us see the mechanics of it and will let our application code be a little more real world like.
<h2 id="communication-with-remote-http-servers">Communication with Remote HTTP Servers</h2>
AngularJS provides two ways of communicating with remote HTTP servers. The first way is through the <code>$http</code> service which is uses XMLHttpRequests (XHR) to send requests and handle the data that comes back from the server. This service has support and shortcut methods for all HTTP request types and also gives developers the ability to set headers and modify requests and responses as they go out and come back in.

Different HTTP methods exist for different kinds of requests. The four methods that we use the most for our applications are <code>POST</code>, <code>GET</code>, <code>PUT</code> and <code>DELETE</code> and these essentially map to the kinds of operations we perform on our databases—Create, Read, Update and Delete (CRUD).

To get a sense for how these work, let’s modify our code to use <code>$http</code> for retrieving data.
<h2 id="putting-the-data-in-its-own-file">Putting the Data in its Own File</h2>
To best demonstrate how to use <code>$http</code>, we’ll first want to move our real estate listing data to its own separate file. We’re dealing with JSON data here, so we’re going to create a file called <code>cribs.json</code> in a new folder called <code>data</code>.
<pre><code class="language-javascript">// data/cribs.json

[
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
</code></pre>
With the data now in its own file, it’s now as if it were coming from a web server, at least enough so that we’ll be able to make use of <code>$http</code> to retrieve it.
<h2 id="modifying-the-factory">Modifying the Factory</h2>
We’ll need to make use of the <code>$http</code> service in the <code>cribsFactory</code> we created yesterday and then use its <code>get</code> method to retrieve the data.
<pre><code class="language-javascript">// scripts/cribsFactory.js

angular
  .module('cribsApp')
  .factory('cribsFactory', function($http) {

    // Method that returns the cribs data
    function getCribs() {
      // We're now using $http to get the
      // data from a separate file
      return $http.get('data/cribs.json');
    }

    return {
      getCribs: getCribs
    }

  });
</code></pre>
We’re once again making use of dependency injection in the <code>cribsFactory</code> service and this time it’s the <code>$http</code> service that we’re injecting. We’ve modified the <code>getCribs</code> method so that it now returns an <code>$http.get</code> request which is directed to the newly created <code>cribs.json</code> file in the data folder.

Now when we access the <code>getCribs</code> method in our controller, it’s going to perform the proper <code>GET</code> request for our data. Making an <code>$http.get</code> request returns something called a <code>promise</code> which we will define a little later. For now, let’s modify the code in <code>cribsController</code> to handle this new method of retrieving the data.
<pre><code class="language-javascript">// scripts/cribsController.js

angular
  .module('cribsApp')
  .controller('cribsController', function($scope, cribsFactory) {

    $scope.cribs;

    cribsFactory.getCribs().success(function(data) {
      $scope.cribs = data;
    }).error(function(error) {
      console.log(error)
    });

  });
</code></pre>
As you’ll notice, our <code>cribsController</code> now looks quite a bit different than it did before. There are a couple new things going on, including some chaining we’re doing where we add on a <code>success</code> and an <code>error</code> method to the call to <code>getCribs</code>.

The <code>success</code> method, which is often referred to as the “success handler” takes an anonymous function as an argument and can return a number of things from that function, namely: <code>data</code>, <code>status</code>, <code>headers</code>, and <code>config</code>. For our case, we’re really only interested in the data that should be returned, so that’s the only parameter we put in the anonymous function. We do whatever we want with the resulting data, and for us it makes sense to put it on <code>$scope</code> right away, so that’s what we do here.

We’re also chaining on an <code>error</code> method which is our “error handler”. We haven’t set anything up in the application yet to do anything with any error data that we might get, so in our case we just log it to the console. So when would we get errors? It could be for many reasons—a hiccup on the server, the user not being logged in, a request to an invalid location. Basically, anything that returns an error response code will be routed to the error handler.

With this code in place, we should be able to once again see our data on the screen when we refresh.

![]({{site.url}}/{{site.baseurl}}img/day-3-1.png)

<h2 id="about-promises">About Promises</h2>
<h3 id="asynchronous-programming">Asynchronous Programming</h3>
As we mentioned earlier, when we use <code>$http</code> to make a <code>GET</code> request for our data, the <code>$http</code> service returns what is called a <code>promise</code>. <code>Promises</code> are useful due to the nature of JavaScript and the fact that it is asynchronous.

To get a feel for what asynchronous means, let’s consider some different ways a program might work. For a given script file, we might typically think that the program will run through things in sequential order. That is, it will start at the top of the script file and execute the code line by line until the end. This may well be how a given program will run and if so, we would be doing synchronous programming. The problem with synchronous programming is that since everything must happen in order, from top to bottom, long-running processes in the script will cause a stall to everything else that needs to happen in the program.

Consider, for example, a poorly-formed <em>synchronous</em> program that first loads a webpage, then retrieves some data from a web server and lastly populates some elements on a web page with that data. For illustrative purposes, let’s pretend the server is very slow and takes 10 whole seconds to respond and return the data as requested. Here’s the scenario with some pseudo code:
<ol>
 	<li><code>loadPage();</code></li>
 	<li><code>retrieveDataFromServer();</code></li>
 	<li><code>drawPageElements();</code></li>
 	<li><code>populateElementsWithData();</code></li>
</ol>
In the synchronous setup, the program is executed sequentially, steps one through four. This means that the user has to stare at a frozen-looking screen for over 10 seconds while the web server prepares the data to be sent back. After the long wait the data is returned and steps 3 and 4 can run.

Let’s rethink this scenario in the <em>asynchronous</em> fashion.
<ol>
 	<li><code>loadHeader();</code></li>
 	<li><code>retrieveDataFromServer(function(data) { return data; });</code></li>
 	<li><code>drawPageElements();</code></li>
 	<li><code>populateElementsWithData();</code></li>
</ol>
In this setup, we’ve changed the second step in a significant way. Here we’re saying that we want to ask the server for the data we need, but that we don’t want to wait for it to come back before moving on with the rest of the program. In this setup we are moving onto steps 3 and 4 <em>before</em> step 2 is finished. However, we’re also saying that once step 2 is finished, we want to do something with the data that is retrieved.

This is a trivial example, but it demonstrates a concept in JavaScript that is important to understand as we get into describing promises.
<h3 id="promises">Promises</h3>
Put simply, a promise can be thought of as a “guarantee” that something in our program will happen when it is <em>ready</em> to happen. Like we’ve described above, because JavaScript is asynchronous, that <em>when</em> is not always known. In addition, the <em>what</em> is not always known either. Since we don’t know exactly what the result of the promise will be, we have to be prepared to handle the possible outcomes. With our Angular code we can be pretty general and stick to two outcomes: the promise is either successful or it is unsuccessful.

Let’s use the new code we wrote earlier to understand this better. For review, here’s the new code we have put in:
<pre><code class="language-javascript">// scripts/cribsFactory.js

...

function getCribs() {
  return $http.get('data/cribs.json');
}

...



// scripts/cribsController.js

...

cribsFactory.getCribs().success(function(data) {
  $scope.cribs = data;
}).error(function(error) {
  console.log(error)
});

...
</code></pre>
Here’s the conversation that’s going on between the controller and the service:

<strong>Controller</strong>: cribsFactory, please send an HTTP <code>GET</code> request to retrieve the data
<strong>Service</strong>: Sounds good, I’ll grab that. I <strong>promise</strong> you that something will happen as a result of my work
<strong>Controller</strong>: Perfect, I know what I’ll do if your work is successful and also what will happen if it is not successful

<em>Some arbitrary amount of time later</em>

<strong>Service</strong>: Alright controller, my work is done. I’ve made the HTTP <code>GET</code> request and have retrieved the data. I was able to get the data, and thus I was successful
<strong>Controller</strong>: Excellent, since you were successful and have data to give me, I’m going to put that data on <code>$scope</code> to be used in the app
<h3 id="the-point">The Point</h3>
That’s a lot to take in about asynchronous programming and promises in Angular, but the point is this: we can set things up such that our program doesn’t need to execute all its parts sequentially. We can move on with the rest of the program and go back to whatever didn’t get finished later on. With promises, we get a guarantee that we’ll get something back <em>when</em> that something is ready.
<h2 id="using-resource-for-restful-apis">Using $resource for RESTful APIs</h2>
We talked about RESTful APIs earlier in this tutorial. While we won’t go into what these are and how they work, it is useful to note that Angular provides an abstraction of the <code>$http</code> service that helps us to handle RESTful APIs in a nicer way. In particular, the <code>$resource</code> factory gives us helper methods that alleviates the need to interact with the implementation details of the <code>$http</code> service. For example, with <code>$resource</code>, we can use methods such as <code>save</code>, <code>query</code> and <code>remove</code> and these methods take care of the HTTP request types and other details for us.

Since we’re using a small amount of data for our app, we’re going to stick with <code>$http</code> in this series to continue to get a feel for how HTTP communication with Angular works.
<h2 id="wrapping-up-day-4">Wrapping Up Day 4</h2>
Great job today! We learned a lot about HTTP requests and how Angular gives us a way to make these requests. We also looked some other things, including:
<ul>
 	<li>A conceptual look at asynchronous programming</li>
 	<li>What promises are and how they work</li>
 	<li>How Angular uses promises</li>
 	<li>Another option for communicating with a backend called <code>$resource</code></li>
</ul>
At this point we’re over half way through and you might be thinking “we haven’t really done much on the application yet”. If so, you’re totally right. However, I wanted to be sure that we get a lot of the core Angular concepts out of the way before we dig deeper into actually building the app. Don’t worry though, starting tomorrow we’re diving right into making the application function and look beautiful.

See you back here tomorrow!
<div class="alert alert-primary">If you've ended up here some other way than through the email link, I'm still glad you're here! You can <a href="#">subscribe</a> to the email list to get the rest of the course.</div>
