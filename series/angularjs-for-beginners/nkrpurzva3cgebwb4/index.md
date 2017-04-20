---
layout: page
status: publish
published: true
title: 'AngularJS for Beginners: Day 3'
author:
  display_name: Ryan Chenkie
  login: cienki
  email: ryanchenkie@gmail.com
  url: ''
author_login: cienki
author_email: ryanchenkie@gmail.com
wordpress_id: 372
wordpress_url: http://ryanchenkie.com/?page_id=372
date: '2015-07-25 10:21:42 -0400'
date_gmt: '2015-07-25 16:21:42 -0400'
categories: []
tags: []
comments: []
---
So far we’ve seen a few of the fundamentals of AngularJS by going over some theory and then putting the concepts into practice. Today we’re going to dive into the concept of services which are very important in AngularJS.

In software development, it’s a best practice to make our code as DRY (don’t-repeat-yourself) and reusable as possible. This is an intuitive concept and it’s likely easy for you to see why we’d want to be as DRY as possible with our code, but if you are newer to coding it might not seem like that big of a deal to repeat a little code here and there. It’s true that there are some occasions that necessitate being repetitive a little bit, and for trivial applications maybe it’s not that big of a deal to not have DRY code. However, when applications get larger and more complex, it quickly becomes a maintenance nightmare to be updating the same pieces of code all across the application. Updating something simple could turn into a ton of wasted time that could have been used for something more important.

<div><p><strong>Want to get tutorials like this as a screencast instead? Check out <a href="https://angularcasts.io/?utm_source=ryanchenkie&amp;utm_campaign=angularjs-email&amp;utm_medium=angularjs-email-course" target="_blank">Angularcasts</a>!</strong></p>

<a href="https://angularcasts.io/?utm_source=ryanchenkie&amp;utm_campaign=angularjs-email&amp;utm_medium=angularjs-email-course"><img src="{{site.url}}/{{site.baseurl}}img/angularcasts-banner.png" alt="" width="900" height="200" /></a></div>

<h2 id="what-is-a-service">What is a Service?</h2>
In AngularJS, using services is one great way we can keep our code DRY. A service in Angular is essentially a generalized piece of code that is given some kind of responsibility or job. This piece of code can then be shared across different parts of the application to deliver on whatever that responsibility or job is. A service’s purpose can be anything we want really, but one of the most common things they are responsible for is communication with an API (application programming interface), which is often to perform operations that retrieve and save data in a database.

To make matters somewhat confusing for programmers who are new to AngularJS, the framework provides several different ways to create services and the occasions that we are supposed to use each kind aren’t terribly clear. For applications that need to perform CRUD (create, read, updated, delete) operations on a database, the most appropriate service to use—and the one we’ll focus on in this course—is the <a href="https://docs.angularjs.org/guide/services">factory service</a>. The <code>factory</code> service type lets us use other services within them and they help with performance because they’re only instantiated when needed. The terms “factory” and “service” are used somewhat interchangeably in the AngularJS world since a <code>factory</code> is a type of service.
<h2 id="putting-a-factory-service-to-use">Putting a Factory Service to Use</h2>
We’re not going to be doing CRUD operations on an actual database in this course (although we’ll mimic it), but we can still setup a <code>factory</code> service to get a sense of how it works. For our purposes we’re going to want to have a <code>factory</code> that returns the cribs data that we currently have being placed on <code>$scope</code> within the <code>cribsController</code>.

Let’s create a new file called <code>cribsFactory.js</code> in the scripts folder. In this file we’ll define a new <code>factory</code> and give it a method that will return our cribs data.
<pre><code class="language-javascript">// scripts/cribsFactory.js
angular
  .module('cribsApp')
  .factory('cribsFactory', function() {

    // The same real estate listing data we
    // had in the controller before
    var cribsData = [
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

    // Method that returns the cribs data
    function getCribs() {
      return cribsData;
    }    

    // We need to return the methods that we want
    //  to be accessible from outside the service
    return {
      getCribs: getCribs
    }

  });
</code></pre>
To get going with creating the <code>factory</code> we once again have to reference our application module with <code>angular.module</code>. We then chain <code>.factory</code> onto the module and give it a name of “cribsFactory”. Within the callback function we are putting our array of cribs objects on a variable called <code>cribsData</code> and setting up a function called <code>getCribs</code> that returns this data. The <code>return</code> statement at the end is what the actual factory itself is going to return which in our case is an object with a <code>getCribs</code> key that references the <code>getCribs</code> function above.

So now that we have a <code>factory</code> in place, how do we make use of it? We’ll take a look at that next, but let’s first make sure we are bringing the newly created factory in with a <code>&lt;script&gt;</code> tag in <code>index.html</code>.
<pre><code class="language-markup">&lt;!-- index.html --&gt;
...

    &lt;script src="node_modules/angular/angular.js"&gt;&lt;/script&gt;
    &lt;script src="node_modules/angular-bootstrap/dist/ui-bootstrap.js"&gt;&lt;/script&gt;
    &lt;script src="node_modules/angular-bootstrap/dist/ui-bootstrap-tpls.js"&gt;&lt;/script&gt;
    &lt;script src="app.js"&gt;&lt;/script&gt;
    &lt;script src="scripts/cribsController.js"&gt;&lt;/script&gt;
    &lt;script src="scripts/cribsFactory.js"&gt;&lt;/script&gt;
  &lt;/body&gt;
&lt;/html&gt;
</code></pre>
<h2 id="using-factories-in-controllers">Using Factories in Controllers</h2>
We talked briefly about dependency injection yesterday, but let’s refresh on that concept. Dependency injection (DI) is a pattern in software development where we call upon chunks of code where and when we need them. You can probably see how that applies to our case: our <code>cribsFactory</code> is a chunk of code that we need because it is responsible for giving us our real estate listings, and we need it in our <code>cribsController</code> because that is the controller responsible for communicating listing data to the view. To make use of it, we just need to inject it in our controller much like how we injected <code>$scope</code> in yesterday.
<pre><code class="language-javascript">// scripts/cribsController.js
angular
  .module('cribsApp')
  .controller('cribsController', function($scope, cribsFactory) {

    $scope.cribs = cribsFactory.getCribs();

  });
</code></pre>
With the <code>cribsFactory</code> injected we are able to call methods that are returned from it. As we saw earlier, on this service we have a <code>getCribs</code> method that returns all of our real estate listings. Getting those listings to be on <code>$scope</code> is then a simple one-liner where <code>$scope.cribs</code> is equal to a call to the <code>getCribs</code> method.

If everything worked out we should be able to still see the real estate listings when we refresh the browser.

![]({{site.url}}/{{site.baseurl}}img/day-3-1.png)

<h2 id="what-was-the-point-of-doing-that">What Was the Point of Doing That?</h2>
So now you might be wondering why we did all that work. All it really did was move our data from one file to another and there was more code involved in the end anyway. At this early stage that is certainly true, but the benefits of it will be seen down the road when our application gets bigger. For example, imagine that we need to put in another controller and view that are responsible for something else completely—maybe something like displaying company information—but you’d still like to have a spot at the bottom of that page to show real estate listings. If we still had our <code>cribsController</code> setup the way it was before, we could always just duplicate the code from it and put it in the new controller. But then what if we have another view that needs the data? Ok, we can just duplicate the code again.

I think you can see where this is going—we’re duplicating things a lot of times and this can get nightmarish in large applications when changes needs to be made. The better way to handle our growing app’s need for real estate listing data is to <em>abstract</em> the logic that takes care of fetching the data to one central location. Then, when we have a new controller that needs to make use of that logic, we just inject the service that handles it and make use of the methods on that service, like we’ve now done in our <code>cribsController</code>. It might seem like more work upfront, but the downstream benefits to this approach are big—less time maintaining code, fewer places something can break, and much better organization which makes it easier to find things.

A tenet that some developers subscribe to is that of “skinny controllers”. This philosophy says that controllers should be kept minimal in their size and that business logic shouldn’t exist within them, but rather should be offloaded elsewhere. The controller then just becomes the traffic controller that communicates business logic to the view. Using services like we have here let’s us accomplish that skinny controller approach.
<h2 id="wrapping-up-day-3">Wrapping Up Day 3</h2>
That’s all for today—great job learning about services! We took a good look at some core concepts, including:
<ul>
 	<li>What services are and why they are useful</li>
 	<li>The different options for services in AngularJS and that for a lot of cases we’ll want to use <code>factory</code></li>
 	<li>How we can apply a <code>factory</code> service to our application and thereby abstract a common task to a central location where it can be reused later.</li>
</ul>
See you back here tomorrow for Day 4!

###### If you've ended up here some other way than through the email link, I'm still glad you're here! You can <a href="#">subscribe</a> to the email list to get the rest of the course.
