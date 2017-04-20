---
layout: page
status: publish
published: true
title: 'AngularJS for Beginners: Day 5'
author:
  display_name: Ryan Chenkie
  login: cienki
  email: ryanchenkie@gmail.com
  url: ''
author_login: cienki
author_email: ryanchenkie@gmail.com
wordpress_id: 383
wordpress_url: http://ryanchenkie.com/?page_id=383
date: '2015-07-25 11:09:42 -0400'
date_gmt: '2015-07-25 17:09:42 -0400'
categories: []
tags: []
comments: []
---
So far in this course we’ve focused heavily on introducing new concepts and demonstrating how they play out when we wire our applications together. However, the application as it is right now isn’t very useful. While it’s necessary to get new concepts understood and out of the way, we also need to make something that works!

Today we’re going to focus on building out our application further and getting the user interface refined so that the app is both functional and good looking. We’ll be doing a lot of work with HTML and CSS, so if you’ve got a strong background with markup and styling, this lesson will be a breeze. We will, however, get to put a lot of Angular’s custom directives to work which will be new.

<div><p><strong>Want to get tutorials like this as a screencast instead? Check out <a href="https://angularcasts.io/?utm_source=ryanchenkie&amp;utm_campaign=angularjs-email&amp;utm_medium=angularjs-email-course" target="_blank">Angularcasts</a>!</strong></p>

<a href="https://angularcasts.io/?utm_source=ryanchenkie&amp;utm_campaign=angularjs-email&amp;utm_medium=angularjs-email-course"><img src="{{site.url}}/{{site.baseurl}}img/angularcasts-banner.png" alt="" width="900" height="200" /></a></div>

<h2 id="changing-the-html-structure">Changing the HTML Structure</h2>
Right now we have a pretty basic setup for how the real estate listings are displaying on the page. What we’ll actually want is more of a card-type layout where we have three listing cards per row. As a first step, we’re going to use Bootstrap to give our HTML some better structure by making use of the <a href="http://getbootstrap.com/css/#grid">grid system</a>.

We’re also going to add some extra data into our <code>cribs.json</code> file. We want to have some extra details and photos for each of our listings, and we want to have more of them overall.

Let’s first edit <code>cribs.json</code> with some new data:
<pre><code class="language-javascript">// data/cribs.json

[
  {
    "id": 1,
    "type": "Condo",
    "price": 220000,
    "address": "213 Grove Street",
    "description": "Excellent place, really nice view!",
    "details": {
      "bedrooms": 2,
      "bathrooms": 1.5,
      "area": 921 
    },
    "image":"crib-1"
  },
  {
    "id": 2,
    "type": "House",
    "price": 410500,
    "address": "7823 Winding Way",
    "description": "Beautiful home with lots of space for a large family.",
    "details": {
      "bedrooms": 4,
      "bathrooms": 3,
      "area": 2145 
    },
    "image":"crib-2"
  },
  {
    "id": 3,
    "type": "Duplex",
    "price": 395000,
    "address": "834 River Lane",
    "description": "Great neighbourhood and lot's of nice green space.",
    "details": {
      "bedrooms": 3,
      "bathrooms": 2.5,
      "area": 1500 
    },
    "image":"crib-3"
  },
  {
    "id": 4,
    "type": "House",
    "price": 755990,
    "address": "7807 Forest Avenue",
    "description": "Best house on the block!",
    "details": {
      "bedrooms": 6,
      "bathrooms": 4.5,
      "area": 3230 
    },
    "image":"crib-4"
  },
  {
    "id": 5,
    "type": "Condo",
    "price": 210500,
    "address": "1857 Andover Court",
    "description": "Nice little condo with room to grow.",
    "details": {
      "bedrooms": 2,
      "bathrooms": 1.5,
      "area": 1023 
    },
    "image":"crib-5"
  },
  {
    "id": 6,
    "type": "House",
    "price": 334900,
    "address": "7398 East Avenue",
    "description": "You'll love the view!",
    "details": {
      "bedrooms": 4,
      "bathrooms": 2.5,
      "area": 1788 
    },
    "image":"crib-6"
  }
]
</code></pre>
As you can see, we’ve doubled the number of listings in our JSON data. We’ve also added a new key, <code>image</code>, which we’ll use to load stock photos for the listings. I’ve downloaded some photos from <a href="https://stocksnap.io">StockSnap.io</a> and saved them to a folder called <code>images</code> in my main project directory. You can download images from StockSnap as well, but feel free to use any other images you like. Beyond that, we’ve also added in an <code>id</code> key which will come in handy later, and we’ve included some more information about the properties on the <code>details</code> key.

Now let’s change the HTML up to give us some better structure.
<pre><code class="language-markup">&lt;!-- index.html --&gt;

...

&lt;body ng-app="cribsApp" ng-controller="cribsController"&gt;

  &lt;!-- Nav Bar --&gt;
  &lt;nav class="navbar navbar-default"&gt;
    &lt;div class="container-fluid"&gt;
      &lt;div class="navbar-header"&gt;
        &lt;a class="navbar-brand" href="#"&gt;ng-cribs&lt;/a&gt;
      &lt;/div&gt;
    &lt;/div&gt;
  &lt;/nav&gt;

  &lt;!-- Real Estate Listings --&gt;
  &lt;div class="container"&gt;
    &lt;div class="col-sm-4" ng-repeat="crib in cribs"&gt;          
      &lt;div class="thumbnail"&gt;
        &lt;img ng-src="images/{{crib.image}}.jpg" alt=""&gt;
        &lt;div class="caption"&gt;
          &lt;h3&gt;{{crib.address}}&lt;/h3&gt;
          &lt;p&gt;&lt;strong&gt;Type: &lt;/strong&gt;{{crib.type}}&lt;/p&gt;
          &lt;p&gt;&lt;strong&gt;Description: &lt;/strong&gt;{{crib.description}}&lt;/p&gt;
          &lt;p&gt;&lt;strong&gt;Price: &lt;/strong&gt;{{crib.price | currency}}&lt;/p&gt;
        &lt;/div&gt;                
      &lt;/div&gt;
    &lt;/div&gt;          
  &lt;/div&gt;   

&lt;/body&gt;   

...
</code></pre>
The first thing we’ve done here is given the application a <code>&lt;navbar&gt;</code> that will help it to look more like a real app. Next, in the real estate listings section, we’ve put in a <code>container</code> <code>&lt;div&gt;</code> which allows Bootstrap to apply its grid system to the site contents. Inside the <code>container</code> <code>&lt;div&gt;</code> we have created another <code>&lt;div&gt;</code> with a class of <code>col-sm-4</code>. This class says that we want the contents within that <code>&lt;div&gt;</code> to have a column width of 4 out of 12 which equates to 1/3 of the page. The CSS that bootstrap applies will then give each of these columns a width of 33%. Inside this <code>&lt;div&gt;</code> is where the meat of the real estate listings will be. We’re using Bootstrap’s <a href="http://getbootstrap.com/components/#thumbnails">thumbnail</a> class to give each listing some padding and a nice border. Inside the <code>&lt;div&gt;</code> with class <code>caption</code> we see that the code we originally had is still in place.

You’ll see that we’re using a directive called <code>ng-src</code> on the image tag to pull in the listing image. We could use the standard <code>src</code> attribute here, but the problem is that it will send a request for the image as soon as the HTML is loaded and before the application has had a chance to bootstrap itself. This will cause a <code>404</code> error in the console because the browser thinks it needs to search for an image called, quite literally, <code>{{crib.image}}.jpg</code>. In reality however, that name will change once the template loads the proper name for each image. To overcome this, <code>ng-src</code> is used so that the application doesn’t request the image until it is ready.

If everything is wired up correctly, we should see the new look right away:

![]({{site.url}}/{{site.baseurl}}img/day-5-1.png)

We’re off to a good start! However, the layout still needs some work. Let’s think about some other things we’ll want the application to do:
<ul>
 	<li>Show the information we have on the <code>details</code> key of our <code>cribs.json</code> data, including the number of bedrooms, bathrooms and square footage.</li>
 	<li>Hide the description and address until the user clicks a button to expand the card</li>
 	<li>Make the card look a bit better by adding in icons</li>
</ul>
<h2 id="refining-the-listing-cards">Refining the Listing Cards</h2>
Let’s use some of Angular’s built-in directives to improve our user interface. At the same time we’ll change up the HTML to reflect the other things we want to accomplish.
<pre><code class="language-markup">&lt;!-- index.html --&gt;

...

&lt;!-- Real Estate Listings --&gt;
&lt;div class="container"&gt;
  &lt;div class="col-sm-4" ng-repeat="crib in cribs"&gt;          
    &lt;div class="thumbnail"&gt;
      &lt;img ng-src="images/{{crib.image}}.jpg" alt=""&gt;

      &lt;div class="caption"&gt;
        &lt;div ng-hide="showDetails === true"&gt;
          &lt;h3&gt;&lt;i class="glyphicon glyphicon-tag"&gt;&lt;/i&gt; {{crib.price | currency}}&lt;/h3&gt;
          &lt;h4&gt;&lt;i class="glyphicon glyphicon-home"&gt;&lt;/i&gt; {{crib.address}} 
            &lt;span class="label label-primary label-sm"&gt;{{crib.type}}&lt;/span&gt;
          &lt;/h4&gt;

        &lt;/div&gt;             

        &lt;button class="btn btn-xs btn-success" 
                ng-hide="showDetails === true" 
                ng-click="showDetails = !showDetails"&gt;
                Details
        &lt;/button&gt;

        &lt;button class="btn btn-xs btn-danger" 
                ng-show="showDetails === true"
                ng-click="showDetails = !showDetails"&gt;
                Close
        &lt;/button&gt;

        &lt;div class="details" ng-show="showDetails === true"&gt;
          &lt;h4&gt;
            &lt;span class="label label-primary"&gt;Beds: {{crib.details.bedrooms}}&lt;/span&gt;
            &lt;span class="label label-primary"&gt;Baths: {{crib.details.bathrooms}}&lt;/span&gt;
            &lt;span class="label label-primary"&gt;SqFt: {{crib.details.area}}&lt;/span&gt;
          &lt;/h4&gt;
          &lt;p&gt;{{crib.description}}&lt;/p&gt;              
        &lt;/div&gt;

      &lt;/div&gt;                
    &lt;/div&gt;
  &lt;/div&gt;          
&lt;/div&gt;

...
</code></pre>
As you can see, we’ve changed quite a few things, all within the <code>&lt;div&gt;</code> with class <code>caption</code>. You’ll likely first notice that we’ve put an Angular directive called <code>ng-hide</code> on the <code>&lt;div&gt;</code> directly beneath <code>caption</code>. To get a sense for what this does, let’s take a look at the two buttons towards the middle.
<h3 id="ng-click">ng-click</h3>
Both buttons have another Angular directive on them called <code>ng-click</code>. This directive lets us define some behaviour that should happen when an element is clicked. This could be any kind of element, and in our case we’re using a button. We’re providing the directive with an expression that should be run when the element is clicked and here we’re using negation to say that we want to set a model called <code>showDetails</code> to be the opposite of whatever it currently is. In other words, if the <code>showDetails</code> model is currently <code>true</code>, we want to set it to <code>false</code> and vice versa.

The text for the first button is “Details” and for the second is “Close. As you’ll probably guess, we want one of the buttons to open up the details panel and the other to close it.
<h3 id="ng-show-and-ng-hide">ng-show and ng-hide</h3>
Angular provides us with ways to conditionally show and hide elements on a page simply by putting an <code>ng-show</code> or <code>ng-hide</code> attribute on the element and specifying the conditions under which they should show or not. As we mentioned above, the <code>showDetails</code> model is getting set to either <code>true</code> or <code>false</code> depending on what it’s current state is. It is this <code>showDetails</code> model that will tell us whether we should show or hide certain portions of the UI.

Back to the <code>&lt;div&gt;</code> just under <code>caption</code>, we’re using the <code>ng-hide</code> directive to say that we want to <strong>hide</strong> that <code>&lt;div&gt;</code> and everything within it whenever <code>showDetails</code> is <code>true</code>. Further down in the <code>&lt;div&gt;</code> with class <code>details</code>, we’re using <code>ng-show</code> to say we want to <strong>show</strong> that <code>&lt;div&gt;</code> when <code>showDetails</code> is set to <code>true</code>. We’re doing the same thing with the buttons themselves because we only want to show the “details” button when the <code>details</code> <code>&lt;div&gt;</code> <strong>isn’t</strong> being shown and we only want to show the “close” button when it <strong>is</strong> shown.
<h3 id="ng-model">ng-model</h3>
We haven’t seen it yet, but <code>ng-model</code> is a very important directive that is used extensively in Angular applications. We know that we can put some data on <code>$scope</code> in our controller and then refer to that data in our view using templating with double curly braces. We can also get a reference to that data by putting the <code>ng-model</code> attribute on elements such as <code>&lt;input&gt;</code> and <code>&lt;select&gt;</code>and setting <code>ng-model</code> to be equal to the name of what we have on <code>$scope</code>. Since we have two-way data binding in Angular, any time we update an <code>&lt;input&gt;</code> element with a given <code>ng-model</code> on it, the value of that model will change to be whatever we have typed in. This might be a bit tricky to grasp right now, but we’ll see it at work later on.
<h2 id="adding-a-custom-filter">Adding a Custom Filter</h2>
So far we’re displaying all the real estate listings we have. This is great, but it will quickly get problematic once more and more listings start coming in. To help with this, what we’ll need is a way to drill down to a subset of the total listings so that we don’t have to see everything all at once. There are many different ways by which we can filter real estate listings, some of which include location, price and type. To demonstrate how to use a custom AngularJS filter, we’re going to keep it simple and demonstrate how we can filter by price. We’ll create a simple form with two <code>&lt;select&gt;</code> drop downs that allow the user to choose the price range they would like to apply to their real estate search.

Angular gives us a lot of versatility when it comes to filtering data and lets create our own custom filters using its <code>filterProvider</code>.

Let’s first create the UI elements that we’ll need for our filter. Right above our <code>ng-repeat</code> block and just below the <code>&lt;div&gt;</code> with class <code>container</code>, let’s create two <code>&lt;select&gt;</code> drop downs:
<pre><code class="language-markup">&lt;!-- index.html --&gt;

...

&lt;!-- Min and Max Price Selection --&gt;
&lt;div class="col-sm-12 price-form"&gt;      

  &lt;div class="col-sm-6"&gt;
    &lt;div class="input-group"&gt;
      &lt;span class="input-group-addon"&gt;Min Price&lt;/span&gt;
      &lt;select name="minPrice" id="minPrice" ng-model="priceInfo.min" class="form-control"&gt;
        &lt;option value="100000"&gt;$100,000&lt;/option&gt;
        &lt;option value="200000"&gt;$200,000&lt;/option&gt;
        &lt;option value="300000"&gt;$300,000&lt;/option&gt;
        &lt;option value="400000"&gt;$400,000&lt;/option&gt;
        &lt;option value="500000"&gt;$500,000&lt;/option&gt;
        &lt;option value="600000"&gt;$600,000&lt;/option&gt;
        &lt;option value="700000"&gt;$700,000&lt;/option&gt;
        &lt;option value="800000"&gt;$800,000&lt;/option&gt;
        &lt;option value="900000"&gt;$900,000&lt;/option&gt;
        &lt;option value="1000000"&gt;$1,000,000&lt;/option&gt;
      &lt;/select&gt;
    &lt;/div&gt;          
  &lt;/div&gt;

  &lt;div class="col-sm-6"&gt;
    &lt;div class="input-group"&gt;
      &lt;span class="input-group-addon"&gt;Max Price&lt;/span&gt;
      &lt;select name="maxPrice" id="maxPrice" ng-model="priceInfo.max" class="form-control"&gt;
        &lt;option value="100000"&gt;$100,000&lt;/option&gt;
        &lt;option value="200000"&gt;$200,000&lt;/option&gt;
        &lt;option value="300000"&gt;$300,000&lt;/option&gt;
        &lt;option value="400000"&gt;$400,000&lt;/option&gt;
        &lt;option value="500000"&gt;$500,000&lt;/option&gt;
        &lt;option value="600000"&gt;$600,000&lt;/option&gt;
        &lt;option value="700000"&gt;$700,000&lt;/option&gt;
        &lt;option value="800000"&gt;$800,000&lt;/option&gt;
        &lt;option value="900000"&gt;$900,000&lt;/option&gt;
        &lt;option value="1000000"&gt;$1,000,000&lt;/option&gt;
      &lt;/select&gt;
    &lt;/div&gt;          
  &lt;/div&gt;

&lt;/div&gt;

...
</code></pre>
We’ve got a lot of new elements with some Bootstrap classes to help us out with positioning and styling, but the important parts here are the two <code>&lt;select&gt;</code> elements. We’ve put the <code>ng-model</code> directive right on the <code>&lt;select&gt;</code> element and assigned the first one to a <code>priceInfo</code> object with a key of <code>min</code>. Similarly, for the second <code>&lt;select&gt;</code> drop down we’re giving it an <code>ng-model</code> of <code>priceInfo.max</code>. Now that we have models for these values, we can use them in a custom filter.

We’ve also got a custom-defined class on the opening <code>&lt;div&gt;</code> tag called <code>price-form</code>. We’ll use some CSS to style this element a bit better. Let’s create a new folder called <code>css</code> and put in a new file called <code>style.css</code>.
<pre><code class="language-markup">mkdir css
cd css
touch style.css
</code></pre>
Next, let’s put the styles in.
<pre><code class="language-css">/* css/style.css */

.price-form {
  margin-bottom: 10px;
  padding: 15px;
  background-color: #5cb85c;
}
</code></pre>
Be sure to add the new stylesheet in <code>index.html</code> on a <code>&lt;link&gt;</code> tag.

<!-- index.html -->
<pre><code class="language-markup">&lt;!doctype html&gt;
&lt;html&gt;
    &lt;head&gt;
        &lt;meta charset="utf-8"&gt;
        &lt;title&gt;ng-cribs&lt;/title&gt;
        &lt;link rel="stylesheet" href="node_modules/bootstrap/dist/css/bootstrap.css"&gt;
        &lt;link rel="stylesheet" href="css/style.css"&gt;
    &lt;/head&gt;

    ...
</code></pre>
Now let’s make sure the new select drop down elements are showing up properly. If everything is correct, you should now see it in your browser:

![]({{site.url}}/{{site.baseurl}}img/day-5-2.png)

Now that the UI elements for the filter are in place, let’s create the actual filter. The <code>filterProvider</code> lets us create a filter by calling <code>.filter</code> on the <code>angular</code> object, much like how we created our <code>controller</code> and <code>factory</code>. Let’s create a new file called <code>cribsFilter.js</code>.
<pre><code class="language-markup">cd scripts
touch cribsFilter.js
</code></pre>
Our filter will need to return a function which takes care of the actual filter logic.
<pre><code class="language-javascript">// scripts/cribsFilter.js

angular
  .module('cribsApp')
  .filter('cribsFilter', function() {

    // The filter needs to return a function
    // that does the actual filtering
    return function(listings, priceInfo) {

      // Empty array that will eventually contain
      // the filtered data
      var filtered = [];

      var min = priceInfo.min;
      var max = priceInfo.max;

      // Loop through each listing and check whether
      // the price value is in range
      angular.forEach(listings, function(listing) {

        if(listing.price &gt;= min &amp;&amp; listing.price &lt;= max) {

          // If the value is in range, push it onto the array
          filtered.push(listing);
        }

      });

      // Return the filtered array
      return filtered;
    }

  });
</code></pre>
We’re creating a new <code>filter</code> on our <code>module</code> and calling it <code>cribsFilter</code>. In the callback function we are returning another function which takes two arguments, the first being the <code>listings</code> from our <code>cribs.json</code> data and the second one an object that we’ll pass in when we call the filter from our view. The <code>priceInfo</code> argument is going to be the object that we’ve put on <code>ng-model</code> which has on it <code>min</code> and <code>max</code> keys representing and minimum and maximum price. As you can see, we’re assigning these values to variables at the top of the filter function.

Along with everything else that AngularJS provides, it also gives us some helper functions that make it easier to do common tasks. We can see one of these at work here with Angular’s <code>forEach</code> method. As you might expect, this method loops through a collection and lets us operate on it. Here we’re saying that we want to iterate over the collection called <code>listings</code> which is the first argument passed into the filter function. The listings themselves are from our real estate listings data in our <code>cribs.json</code> file. For each of the listings we are checking whether the price value on them is between the <code>min</code> and <code>max</code> price that will be selected by the user. If that is the case, the listing will be pushed onto the <code>filtered</code> array. Finally, we return this array from the function.

Now that we have the JavaScript in place for the filter, let’s put it to work in our view:
<pre><code class="language-markup">&lt;!-- index.html --&gt;

...

&lt;div class="col-sm-4" ng-repeat="crib in cribs | cribsFilter:priceInfo"&gt;          
  &lt;div class="thumbnail"&gt;
    &lt;img ng-src="images/{{crib.image}}.jpg" alt=""&gt;

...
</code></pre>
Accessing the filter in the view only requires a slight change to our <code>ng-repeat</code> directive. In it we need to place a pipe character after <code>crib in cribs</code>, followed by the name of the filter. You’ll see that we’re then placing a semicolon and giving the filter the <code>priceInfo</code> object—this is how we pass in arguments with filters. You’ll recall that our filter function took two arguments, <code>listings</code> and <code>priceInfo</code>, but we are only passing in the <code>priceInfo</code> argument here. That’s because the first argument is implied to be the collection of data itself.

We’re almost there, but you’ll see that when we refresh the page we are greeted with a blank screen:

![]({{site.url}}/{{site.baseurl}}img/day-5-3.png)

The reason that no listings are showing up is that we don’t have any values initialized for <code>priceInfo.min</code> and <code>priceInfo.max</code> so when the filter runs, it’s not finding any listings that match up with these <code>null</code> values. If we select some valid price values from the <code>&lt;select&gt;</code> drop downs, we get some listings displayed:

![]({{site.url}}/{{site.baseurl}}img/day-5-4.png)

So that the user doesn’t think something is wrong with the application when it loads, let’s initialize those <code>min</code> and <code>max</code> values such that all the listings will show by default. We can do this by specifying some default values in <code>cribsController.js</code>.
<pre><code class="language-javascript">// scripts/cribsController.js

angular
  .module('cribsApp')
  .controller('cribsController', function($scope, cribsFactory) {

    $scope.cribs;

    $scope.priceInfo = {
      min: 0,
      max: 1000000
    }

...
</code></pre>
We’re giving the <code>$scope.priceInfo</code> object a <code>min</code> value of 0 and <code>max</code> value of 1,000,000 so that we get the full range of prices that we have from our drop down lists. In a real application we would anticipate that there would be some listings that are over $1,000,000 and would thus write the filter to account for those, but this is fine for demonstration.

If everything worked out, we should now see all the listings when the application loads and we should then be able to filter based on price.
<h2 id="wrapping-up-day-5">Wrapping Up Day 5</h2>
That was a lot of material today! Great job getting the application looking good and giving us some functionality. We got to see a lot of built-in AngularJS directives, including:
<ul>
 	<li><code>ng-src</code> which allows us to properly load images when the application is ready</li>
 	<li><code>ng-click</code> which allows us to hook into click events</li>
 	<li><code>ng-show</code>/<code>ng-hide</code> which allow us to conditionally show and hide elements.</li>
 	<li><code>ng-model</code> which allows us to bind data between a controller and a view</li>
</ul>
We also got to make a custom AngularJS filter that lets the user specify a price range to narrow down the results of their real estate listing search.

We’re making great progress on the application, but there are still a few things that are missing. Tomorrow we’ll be covering how to add new real estate listings.

See you tomorrow!
<div class="alert alert-primary">If you've ended up here some other way than through the email link, I'm still glad you're here! You can <a href="#">subscribe</a> to the email list to get the rest of the course.</div>
