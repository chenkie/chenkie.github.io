---
layout: page
status: publish
published: true
title: 'AngularJS for Beginners: Day 6'
author:
  display_name: Ryan Chenkie
  login: cienki
  email: ryanchenkie@gmail.com
  url: ''
author_login: cienki
author_email: ryanchenkie@gmail.com
wordpress_id: 391
wordpress_url: http://ryanchenkie.com/?page_id=391
date: '2015-07-25 11:26:15 -0400'
date_gmt: '2015-07-25 17:26:15 -0400'
categories: []
tags: []
comments: []
---
So far we’ve learned quite a few things about how AngularJS works and we’ve been able to put all those concepts together to form a nice looking real estate listing application. We’ve got some of the major Angular concepts out of the way and we’ve got a functioning app, but it still needs some work. Today we’ll look at how we can give users the ability to add in new real estate listings.

While we’re obviously going to use Angular for this task, most of the leg work for creating new listings will be plain old JavaScript. This will be true for editing and deleting listings as well, which we’ll look at tomorrow.

As you know, we don’t yet have a backend setup for our application which means every time we create, read, update and delete listings, we’re really just affecting the current browser session in memory. In other words, when we go to refresh the page, all of our changes will be lost. Don’t worry though, at the end of the course we’ll look at some easy ways we can get simple database persistence going which will give us a more real life application.

<div><p><strong>Want to get tutorials like this as a screencast instead? Check out <a href="https://angularcasts.io/?utm_source=ryanchenkie&amp;utm_campaign=angularjs-email&amp;utm_medium=angularjs-email-course" target="_blank">Angularcasts</a>!</strong></p>

<a href="https://angularcasts.io/?utm_source=ryanchenkie&amp;utm_campaign=angularjs-email&amp;utm_medium=angularjs-email-course"><img src="{{site.url}}/{{site.baseurl}}img/angularcasts-banner.png" alt="" width="900" height="200" /></a></div>

<h2 id="setting-up-the-ui">Setting Up the UI</h2>
We’ll need some user interface elements to get us started towards adding new real estate listings. Let’s add some HTML to <code>index.html</code> directly under the select drop downs from Day 5 that will take care of this:
<pre><code class="language-markup">&lt;!-- index.html --&gt;

...

&lt;button class="btn btn-primary" ng-click="addListing = !addListing" ng-show="!addListing"&gt;Add Listing&lt;/button&gt;
&lt;button class="btn btn-danger" ng-click="addListing = !addListing" ng-show="addListing"&gt;Close&lt;/button&gt;

  &lt;div class="listing-form" ng-if="addListing"&gt;

    &lt;h3&gt;Add a Listing&lt;/h3&gt;

    &lt;div class="row listing-form-row"&gt;
      &lt;div class="col-sm-4"&gt;
        &lt;div class="input-group"&gt;
          &lt;span class="input-group-addon"&gt;Address&lt;/span&gt;
          &lt;input type="text" placeholder="Enter the address" class="form-control" ng-model="newListing.address"&gt;
        &lt;/div&gt;
      &lt;/div&gt;

      &lt;div class="col-sm-4"&gt;
        &lt;div class="input-group"&gt;
          &lt;span class="input-group-addon"&gt;Price&lt;/span&gt;
          &lt;input type="text" placeholder="Enter the price" class="form-control" ng-model="newListing.price"&gt;
        &lt;/div&gt;
      &lt;/div&gt;

      &lt;div class="col-sm-4"&gt;
        &lt;div class="input-group"&gt;
          &lt;span class="input-group-addon"&gt;Property Type&lt;/span&gt;
          &lt;select type="select" name="propertyType" id="propertyType" class="form-control" ng-model="newListing.type"&gt;
            &lt;option value="House"&gt;House&lt;/option&gt;
            &lt;option value="Condo"&gt;Condo&lt;/option&gt;
            &lt;option value="Duplex"&gt;Duplex&lt;/option&gt;
            &lt;option value="Apartment"&gt;Apartment&lt;/option&gt;
          &lt;/select&gt;
        &lt;/div&gt;
      &lt;/div&gt;
    &lt;/div&gt;

    &lt;div class="row listing-form-row"&gt;
      &lt;div class="col-sm-4"&gt;
        &lt;div class="input-group"&gt;
          &lt;span class="input-group-addon"&gt;Description&lt;/span&gt;
          &lt;textarea type="text" placeholder="Enter the description" class="form-control" ng-model="newListing.description"&gt;&lt;/textarea&gt;
        &lt;/div&gt;
      &lt;/div&gt;

      &lt;div class="col-sm-8"&gt;

        &lt;div class="col-sm-4"&gt;
          &lt;div class="input-group"&gt;
            &lt;span class="input-group-addon"&gt;Beds&lt;/span&gt;
            &lt;input type="text" placeholder="Bedrooms" class="form-control" ng-model="newListing.details.bedrooms"&gt;
          &lt;/div&gt;
        &lt;/div&gt;

        &lt;div class="col-sm-4"&gt;
          &lt;div class="input-group"&gt;
            &lt;span class="input-group-addon"&gt;Baths&lt;/span&gt;
            &lt;input type="text" placeholder="Bathrooms" class="form-control" ng-model="newListing.details.bathrooms"&gt;
          &lt;/div&gt;
        &lt;/div&gt;

        &lt;div class="col-sm-4"&gt;
          &lt;div class="input-group"&gt;
            &lt;span class="input-group-addon"&gt;SqFt&lt;/span&gt;
            &lt;input type="text" placeholder="Square Footage" class="form-control" ng-model="newListing.details.area"&gt;
          &lt;/div&gt;
        &lt;/div&gt;

      &lt;/div&gt;
    &lt;/div&gt;

    &lt;pre&gt;{{newListing | json}}&lt;/pre&gt;
  &lt;/div&gt;

...
</code></pre>
There’s quite a bit going on here! Let’s go through it from the top.

The first thing you’ll notice is that we’re adding two buttons in—one for adding a new listing and one for closing the dialog box that will be opened up. We’re handling a click event on them with <code>ng-click</code> which is used to toggle the state of <code>addListing</code>, a model value that is used to conditionally show or hide elements. We’re using <code>ng-show</code> to say that we want the “Add Listing” button to be displayed when <code>addListing</code> is false and hidden otherwise. Inversely, we are saying that we want to show the “Close” button when <code>addListing</code> is true, and close it otherwise.

In the <code>add-listing</code> <code>&lt;div&gt;</code> tag below we are using a built-in directive that we haven’t seen until now—<code>ng-if</code>. This directive is similar to <code>ng-show</code> and <code>ng-hide</code>, except that it actually removes the element in question based on a condition rather than simply showing or hiding it with CSS. The cases in which this is useful will vary depending on the needs of your application, but it’s useful to put it in here just to see how it works. If <code>addListing</code> is set to true, we are displaying a bunch of new elements, many of which are <code>&lt;input&gt;</code> tags, but we also have a <code>&lt;select&gt;</code> drop down and a <code>&lt;textarea&gt;</code>.

You’ll see that we’ve got an <code>ng-model</code> on each of the new UI elements and that each is acting on a base model object called <code>newListing</code>. The keys on this <code>newListing</code> model are given the same names as the keys on our <code>cribs.json</code> data, such as address, price, description etc.

It’s often useful to output a model right to the screen for the purposes of debugging and this is exactly what we’re doing near the end in the <code>&lt;pre&gt;</code> tag. As you see, we’re using the templating syntax to output the <code>newListing</code> model to the screen. The pipe character gives us access to filters, whether they be built-in with Angular or custom ones that we define, and in this case we’re using the built-in <code>json</code> filter to have our <code>newListing</code> model displayed nicely on the screen.

With the main UI elements in place, there are a couple other small changes we’ll want to make. First, we’ll need some extra CSS to make our elements look at bit nicer.
<pre><code class="language-css">/* css/style.css */

.price-form {
  margin-bottom: 10px;
  padding: 15px;
  background-color: #5cb85c;
}

.price-form-row {
  margin-bottom: 10px;
}

.listing-form-row, .listing-button {
  margin-top: 10px;
}

.listing-form h3 {
  color: white;
}
</code></pre>
Next, we’ll also need to adjust some of the other elements within <code>index.html</code>. We’ll add a new <code>row</code> to the select drop downs we made yesterday and we’ll also add an <code>ng-if</code> to that row to conditionally show or hide those drop downs.
<pre><code class="language-markup">&lt;!-- index.html --&gt;

...

&lt;!-- Min and Max Price Selection --&gt;
&lt;div class="col-sm-12 price-form"&gt;      
  &lt;div class="row price-form-row" ng-if="!addListing"&gt;
    &lt;div class="col-sm-6"&gt;
      &lt;div class="input-group"&gt;

...
</code></pre>
You’ll probably have noticed that the expression we’re giving to the <code>ng-if</code> and <code>ng-show</code> directives is a bit different than we’ve seen before. Instead of saying something like <code>ng-if="addListing === true"</code> we’re simply saying <code>ng-if="addListing"</code>. With JavaScript, we can determine whether something is <code>true</code> or <code>false</code> simply by asking for that thing. On the <code>price-form-row</code> <code>&lt;div&gt;</code> above we are checking whether <code>addListing</code> is <code>false</code> by negating it using <code>!</code>.

If everything is wired up correctly, we should see the new UI elements at work:

![]({{site.url}}/{{site.baseurl}}img/day-6-1.png)

![]({{site.url}}/{{site.baseurl}}img/day-6-2.png)

<h2 id="adding-new-listings">Adding New Listings</h2>
Earlier on we talked about how doing the CRUD operations on our data for this part of the tutorial will largely be plain old JavaScript at work. For adding new real estate listings, we’re going to use the <code>push</code> method to take our form input and add the object that results from that input onto the already existing <code>$scope.cribs</code> array. Just as a reminder, the data for this array is stored in and retrieved from our <code>cribs.json</code> file, but we can operate on this array directly when the application is running.

First, let’s setup the method that will handle adding new listings to the array. We’ll need to add in a new method on <code>$scope</code> called <code>addCrib</code>.
<pre><code class="language-javascript">// scripts/cribsController.js

angular
  .module('cribsApp')
  .controller('cribsController', function($scope, cribsFactory) {

    $scope.cribs;

    $scope.priceInfo = {
      min: 0,
      max: 1000000
    }

    $scope.newListing = {};

    $scope.addCrib = function(newListing) {
      if(newListing) {
        newListing.image = "default-crib";
        $scope.cribs.push(newListing);        
      }
    }

    cribsFactory.getCribs().success(function(data) {
      $scope.cribs = data;
    }).error(function(error) {
      console.log(error);
    });

  });
</code></pre>
We’re first initializing the <code>newListing</code> object by putting it on <code>$scope</code> which will allow us to access it directly from the method we use to handle adding listings. This new method is called <code>$scope.addCrib</code> and it expects one argument which will be an object for our new listing that comes from the data entered in the form. We first check to see if we get a new listing before proceeding so that we don’t add in an empty object to the array. Next, we’re creating an <code>image</code> key on the <code>newListing</code> object and setting its value to “default-crib”. We’re doing this is because we won’t be able to cover getting an image uploader running in this course but we’ll want something as a placeholder image to make our listings show up properly. Finally, we’re using JavaScript’s <code>push</code> method to add the <code>newListing</code> object onto the already existing <code>$scope.cribs</code> array.

NOTE: The default-crib image is available in the course downloads

With the method in place, we’ll now need to attach it to an event. For this we’ll need a new button in our form that will have an <code>ng-click</code> on it which calls this method. Let’s place this new button just above our <code>&lt;pre&gt;</code> tags that we’re currently using to output the form data to the screen.
<pre><code class="language-markup">&lt;!-- index.html --&gt;

...

&lt;button class="btn btn-primary listing-button" ng-click="addCrib(newListing)" ng-show="addListing"&gt;Add&lt;/button&gt;

&lt;pre&gt;{{newListing | json}}&lt;/pre&gt;

...
</code></pre>
Calling the <code>addCrib</code> method in the view is as simple as referencing it on <code>ng-click</code> and passing in the <code>newListing</code> object as the argument. This is a great feature of the <code>ng-click</code> and other directives in Angular—we can call methods right in our HTML. Just for review, the <code>newListing</code> object that we pass in as an argument comes from all the form inputs combined together. As you’ll remember, we set <code>ng-model</code> on each input to <code>newListing.someKey</code> which gives us an object to pass around.
<h3 id="ordering-the-data">Ordering the Data</h3>
There’s one more change we’ll want to make in the HTML before trying this out so that we get newly added listings showing at the beginning. We’ll want to tell our view how it should order our data when it displays. Thankfully, Angular gives us an easy way to do this with the <code>orderBy</code> filter. It takes an expression that it uses to determine data ordering and a simple way to make use of it is to pass in the name of a key in our data that we want it to use. We can order the data based on any of our data’s keys and in our case we’ll want to use the <code>id</code> in reverse order.
<pre><code class="language-markup">&lt;!-- index.html --&gt;

...

&lt;div class="col-sm-4" ng-repeat="crib in cribs | cribsFilter:priceInfo | orderBy:'-id'"&gt;

...
</code></pre>
You’ll see that we’re simply chaining on an additional filter with another pipe character and passing a string of <code>'-id'</code> to the <code>orderBy</code> filter which says we want to display the results in reverse order.

We can now try adding a new listing:

![]({{site.url}}/{{site.baseurl}}img/day-6-3.png)

<h3 id="clearing-the-form-data">Clearing the Form Data</h3>
You’ll likely have noticed that when we pressed the “Add” button and the new listing showed up below the form, the data within the form stuck around. This is obviously unwanted behaviour and would make for bad user experience. Let’s fix that now by adjusting the <code>$scope.addCrib</code> method to clear the data after the listing gets submitted. There are a few different ways we could do this but likely the easiest one is to just reset <code>$scope.newListing</code> to be an empty object once the listing has been pushed onto the <code>$scope.cribs</code> array.
<pre><code class="language-javascript">// scripts/cribsController.js

...

$scope.newListing = {};

$scope.addCrib = function(newListing) {
  if(newListing) {
    newListing.image = "default-crib";
    $scope.cribs.push(newListing);
    $scope.newListing = {};        
  }
}

...
</code></pre>
Now when we add new listings the form will be reset after we’ve pressed the “Add” button.

![]({{site.url}}/{{site.baseurl}}img/day-6-4.png)

<h2 id="wrapping-up-day-6">Wrapping Up Day 6</h2>
That was another big job today, great work putting the create functionality in place!

We’re nearly at the end of the course! We’ll wrap things up tomorrow by putting in edit and delete functionality for our listings.

See you tomorrow for the final day!
<div class="alert alert-primary">If you've ended up here some other way than through the email link, I'm still glad you're here! You can <a href="#">subscribe</a> to the email list to get the rest of the course.</div>
