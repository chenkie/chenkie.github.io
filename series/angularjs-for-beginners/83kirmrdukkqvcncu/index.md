---
layout: page
status: publish
published: true
title: 'AngularJS for Beginners: Day 7'
author:
  display_name: Ryan Chenkie
  login: cienki
  email: ryanchenkie@gmail.com
  url: ''
author_login: cienki
author_email: ryanchenkie@gmail.com
wordpress_id: 397
wordpress_url: http://ryanchenkie.com/?page_id=397
date: '2015-07-25 11:37:04 -0400'
date_gmt: '2015-07-25 17:37:04 -0400'
categories: []
tags: []
comments: []
---
Yesterday we got our application one step closer to completion by giving users the ability to create new real estate listings. Creating and reading is only half of the CRUD equation though, so today we’ll find out how we can update and delete listings as well.

<div><p><strong>Want to get tutorials like this as a screencast instead? Check out <a href="https://angularcasts.io/?utm_source=ryanchenkie&amp;utm_campaign=angularjs-email&amp;utm_medium=angularjs-email-course" target="_blank">Angularcasts</a>!</strong></p>

<a href="https://angularcasts.io/?utm_source=ryanchenkie&amp;utm_campaign=angularjs-email&amp;utm_medium=angularjs-email-course"><img src="{{site.url}}/{{site.baseurl}}img/angularcasts-banner.png" alt="" width="900" height="200" /></a></div>

<h2 id="editing-the-listings">Editing the Listings</h2>
There are several different ways we could setup the UI elements for editing listings. For example, we could make brand new elements that sit within the listing cards themselves that allow us to change values on those cards. Alternatively, we could use the dialog box that we have for adding new listings since it will already contain all the fields we need. We’ll take the latter approach as this will give us the quickest way of getting up and running with editing.

The first thing we’ll need to do is duplicate the input elements we put in place for adding new listings. The reason we’ll want to duplicate them and not just work off the same ones is that we’ll need to have a different <code>ng-model</code> object for new listings versus the existing listings that we want to edit—we don’t want to mix up concerns between the two models. Let’s duplicate the listing addition HTML and change up <code>ng-model</code> to reflect this. We’ll also want change up the button at the bottom of the form to call a different method.
<pre><code class="language-markup">&lt;!-- index.html --&gt;

...

&lt;div class="listing-form" ng-if="editListing"&gt;

 &lt;h3&gt;Edit Listing&lt;/h3&gt;

 &lt;div class="row listing-form-row"&gt;
   &lt;div class="col-sm-4"&gt;
     &lt;div class="input-group"&gt;
       &lt;span class="input-group-addon"&gt;Address&lt;/span&gt;
       &lt;input type="text" placeholder="Enter the address" class="form-control" ng-model="existingListing.address"&gt;
     &lt;/div&gt;
   &lt;/div&gt;

   &lt;div class="col-sm-4"&gt;
     &lt;div class="input-group"&gt;
       &lt;span class="input-group-addon"&gt;Price&lt;/span&gt;
       &lt;input type="text" placeholder="Enter the price" class="form-control" ng-model="existingListing.price"&gt;
     &lt;/div&gt;
   &lt;/div&gt;

   &lt;div class="col-sm-4"&gt;
     &lt;div class="input-group"&gt;
       &lt;span class="input-group-addon"&gt;Property Type&lt;/span&gt;
       &lt;select type="select" name="propertyType" id="propertyType" class="form-control" ng-model="existingListing.type"&gt;
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
       &lt;textarea type="text" placeholder="Enter the description" class="form-control" ng-model="existingListing.description"&gt;&lt;/textarea&gt;
     &lt;/div&gt;
   &lt;/div&gt;

   &lt;div class="col-sm-8"&gt;

     &lt;div class="col-sm-4"&gt;
       &lt;div class="input-group"&gt;
         &lt;span class="input-group-addon"&gt;Beds&lt;/span&gt;
         &lt;input type="text" placeholder="Bedrooms" class="form-control" ng-model="existingListing.details.bedrooms"&gt;
       &lt;/div&gt;
     &lt;/div&gt;

     &lt;div class="col-sm-4"&gt;
       &lt;div class="input-group"&gt;
         &lt;span class="input-group-addon"&gt;Baths&lt;/span&gt;
         &lt;input type="text" placeholder="Bathrooms" class="form-control" ng-model="existingListing.details.bathrooms"&gt;
       &lt;/div&gt;
     &lt;/div&gt;

     &lt;div class="col-sm-4"&gt;
       &lt;div class="input-group"&gt;
         &lt;span class="input-group-addon"&gt;SqFt&lt;/span&gt;
         &lt;input type="text" placeholder="Square Footage" class="form-control" ng-model="existingListing.details.area"&gt;
       &lt;/div&gt;
     &lt;/div&gt;

   &lt;/div&gt;

   &lt;button class="btn btn-primary listing-button" ng-click="saveCribEdit()" ng-show="editListing"&gt;Save&lt;/button&gt;

   &lt;pre&gt;{{newListing | json}}&lt;/pre&gt;

...
</code></pre>
We’ve changed up the name of the object on <code>ng-model</code> in this set of input elements and it is now called <code>existingListing</code>. However, all of the key names on this object have remained the same so that our data can still easily map to the input elements. We are now referencing a method called <code>saveCribEdit()</code> on the <code>ng-click</code> on the “Save” button. We’ll set this method up in the controller a bit later.

Notice that we’re also doing a check at the top of the form with the <code>ng-if</code> directive to only show the form if <code>editListing</code> is set to true. We’ll also need to adjust some other areas of the UI to not show this edit form when it should be hidden. Let’s take care of those now.
<pre><code class="language-markup">&lt;!-- index.html --&gt;

...

&lt;!-- Min and Max Price Selection --&gt;
&lt;div class="col-sm-12 price-form"&gt;      
  &lt;div class="row price-form-row" ng-if="!addListing &amp;&amp; !editListing"&gt;

...

&lt;button class="btn btn-primary" ng-click="addListing = !addListing" ng-show="!addListing &amp;&amp; !editListing"&gt;Add Listing&lt;/button&gt;

...
</code></pre>
We’ve adjusted the <code>ng-if</code> and <code>ng-show</code> directives on these elements to say that we want these parts hidden if both <code>addListing</code> and <code>editListing</code> are false.

Before we get to adding in the controller methods, we’ll need to add a control to the listing cards so that we can open the editing form. We can copy one of the existing buttons that are on the cards and just change up the specifics. Just below the “Details” and “Close” button HTML, let’s add one for “Edit”:
<pre><code class="language-markup">&lt;!-- index.html --&gt;

...

&lt;button class="btn btn-xs btn-primary" ng-show="showDetails === true" ng-click="editCrib(crib)"&gt;Edit&lt;/button&gt;

...
</code></pre>
On this button we are setting <code>ng-click</code> to call a method called <code>editCrib</code> which we will define in the controller—it will be responsible for opening the editing form.
<h3 id="adding-editing-methods-to-the-controller">Adding Editing Methods to the Controller</h3>
You’ll likely have noticed that when we set the <code>editCrib</code> method on the <code>ng-click</code> directive of the “Edit” button that we are passing in an argument called <code>crib</code>. Since this button is found within an <code>ng-repeat</code> and we are iterating over the <code>cribs</code> data, this <code>crib</code> argument actually refers to the current listing. Passing it in as an argument allows us to send it to the controller where we can operate on it.

We’ll need to define these two new methods in the controller—one for opening the edit form and the other for saving the edits.
<pre><code class="language-javascript">// scripts/cribsController.js

...

$scope.editCrib = function(crib) {
  $scope.editListing = true;
  $scope.existingListing = crib;
}

$scope.saveCribEdit = function(listing) {
  $scope.existingListing = {};
  $scope.editListing = false;
}

...
</code></pre>
The <code>editCrib</code> method opens up the edit dialog and sets the <code>$scope.existingListing</code> to be the current listing that we passed through as an argument from the view. This means that whenever we click the “Edit” button on a listing card, the data from that card will be placed on the <code>ng-model</code> for our editing screen which means we’ll be able to edit it. In this method we’re also setting <code>$scope.editListing</code> to <code>true</code> so that we can show the editing dialog.

You’ll see that in the <code>saveCribEdit</code> method we’re actually just setting the <code>$scope.existingListing</code> to an empty object and then closing the edit dialog by setting <code>$scope.editListing</code> to <code>false</code> to hide it. We’re actually kind of faking editing behaviour here which Angular makes very easy for us to do. Because Angular has two-way data binding, the data for each listing card is going update automatically as we type. Because we’re only working with in-memory data on the front-end for this course, once we’ve typed our changes out in the input elements, our “editing” is effectively done and we can just close edit dialog box. Of course, when we refresh the page the changes will be lost since we have no database persistence.
<h2 id="deleting-listings">Deleting Listings</h2>
Deleting listings is easily done and will just require us to setup a new button and method to remove a given listing object from the <code>$scope.cribs</code> array.

First, let’s put a “Delete” button right next to the “Save” button in the edit dialog.
<pre><code class="language-markup">&lt;!-- index.html --&gt;

...

&lt;button class="btn btn-primary listing-button" ng-click="saveCribEdit()" ng-show="editListing"&gt;Save&lt;/button&gt;
&lt;button class="btn btn-danger listing-button" ng-click="deleteCrib(existingListing)" ng-show="editListing"&gt;Delete&lt;/button&gt;

...
</code></pre>
We’ve given this new button an <code>ng-click</code> that calls a method called <code>deleteCrib</code> which we’ll define next.
<pre><code class="language-javascript">// scripts/cribsController.js

...

$scope.deleteCrib = function(existingListing) {
  var index = $scope.cribs.indexOf(existingListing);
  $scope.cribs.splice(index, 1);
  $scope.existingListing = {};
  $scope.editListing = false;
}

...
</code></pre>
Since we’re operating directly on an array with our <code>$scope.cribs</code>, we’ll need to do some setup to find the right index to remove from the array. We’re passing in the <code>existingListing</code> object that is on <code>ng-model</code> to the <code>deleteCrib</code> method. We can then find the index of this object in the <code>$scope.cribs</code> array—that is, which position in the array the object is at—by using JavaScript’s <code>indexOf</code> method. We set this value on a variable called <code>index</code> and then use JavaScript’s <code>splice</code> method to remove that specific element from the array. The second argument we pass in to the <code>splice</code> method says that we only want to remove one element. After this we’re again setting <code>existingListing</code> to be an empty object to clear the form fields and then we close the edit dialog by setting <code>editListing</code> to <code>false</code>.
<h2 id="wrapping-up-the-course">Wrapping Up the Course</h2>
There we have it! We’ve made fully-functioning (on the front end anyway) CRUD app in AngularJS. Great job sticking it out all the way through this course and learning a ton of new things. AngularJS isn’t the easiest framework to learn, but if you’ve made it this far then you’ve overcome most of the initial learning hurdles and you’ll now be more comfortable as you put Angular to use in your own applications and as you continue your learning journey.
<h3 id="but-wait-front-end-only">But Wait, Front-End Only?</h3>
I’m sure you’ve been thinking throughout the course something along the lines of “well this is great and all, but what is the use when I can’t save any of this data?”. You’re absolutely right, an application that doesn’t save data isn’t very useful beyond a single person’s own browser window.

As was mentioned towards the beginning of the course, AngularJS is a front-end framework that is completely backend/database agnostic. That means that you can literally use any backend language or framework to interact with Angular, as long as it responds to standard HTTP requests. Fortunately, most do, as they wouldn’t be of much use if they didn’t. Some examples of languages and frameworks include PHP (Laravel), JavaScript (Node.js), ASP.NET and Ruby on Rails.

A very interesting and increasingly popular solution for data persistence is called <a href="https://www.firebase.com/">Firebase</a>. Firebase is a real-time datastore for applications that allows developers to focus their efforts on front-end development instead of worrying about setting up, configuring and coding for a server. This means that developers can get up and running with their applications much more quickly than if they had to use one of the aforementioned frameworks.

Knowing how to wire up a backend for your application is crucial and Firebase is a great way to get going on it easily. It’s a perfect next step to your AngularJS learning because it fits so nicely in with the AngularJS framework.
<h2 id="angularcasts">Want More Angular? Check Out Angularcasts!</h2>
Would you like to learn how to integrate Firebase in your Angular application and learn more about Angular in general? Head over to [Angularcasts](https://angularcasts.io) and check out some of the videos there. Angularcasts provides in-depth, end-to-end screencasts which will show you how to develop Angular applications from start to finish. I look forward to seeing you there!
<h2 id="thanks">Thanks!</h2>
Thanks so much for following along in this course. I’m hopeful that you found it useful and that you’ll be able to apply what you’ve learned here right away.

I’d love your feedback on the course! It would be great to know if there’s anything that I can improve to make learning easier for you, or if there’s anything in particular you’d like to see in future courses. Get in touch and let me know what you’re thinking.

If you found this course helpful, I would appreciate it a ton if you shared it with anyone you know who is wanting to learn AngularJS.

Thanks, and happy coding!

###### If you've ended up here some other way than through the email link, I'm still glad you're here! You can <a href="#">subscribe</a> to the email list to get the rest of the course.
