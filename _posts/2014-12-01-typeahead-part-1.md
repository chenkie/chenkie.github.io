---
layout: post
status: publish
published: true
title: Simple Typeahead With AngularJS and Laravel - Part 1
feature_image: typeahead1-cover.png
author_slug: ryan-chenkie
date: '2014-12-01 18:41:38 -0500'
categories:
- AngularJS
- Laravel
- Bootstrap
tags:
- AngularJS
- Laravel
- Bootstrap
- Typeahead
comments: true
---

Typeaheads are great for adding to a rich user experience in modern web applications, and luckily Twitter offers a JavaScript library called Typeahead.js which drastically simplifies setting this feature up. If you're using AngularJS and Bootstrap, you've likely come across UI Bootstrap which is a set of native Bootstrap directives for AngularJS. In this two-part tutorial, we will get an AngularJS and Laravel typeahead working. Part 1 will focus on setting up the front-end with AngularJS.

### Getting Started

The typeahead that we setup will be used to search for specific airplanes belonging to various airlines. If airplanes aren't your thing, feel free to swap out the data we create here with something less av-geeky.

#### Setting Up the Directory

There are a couple different ways we could setup our project directory, but let's keep it simple and separate the files out by their type.

~~~bash
|-- bower_components
|-- css
|-- data
|-- scripts
|-- templates
|-- index.html
~~~

We’re going to be using Bower to install our dependencies, but if you prefer to download them yourself individually, then just change the  `bower_components` folder to `vendor`.

### Installing Dependencies

For our typeahead app we will require AngularJS, Bootstrap, and UI Bootstrap, which we can easily pull into our project directory using Bower. If you haven’t used Bower before, it’s a package manager that allows you to easily find and download packages from many providers. You can find install instructions on the [Bower homepage](http://bower.io/). Additionally, [Scotch.io](http://scotch.io/) offers a great tutorial for getting started with Bower [here](http://scotch.io/bar-talk/manage-front-end-resources-with-bower).

UI Bootstrap comes with the latest version of Angular included, so we don’t need to pull it in separately.

~~~bash
bower install angular-bootstrap
~~~

### Setting Up the Javascript Files

First, let’s setup our `app.js` file.

~~~js
// scripts/app.js

'use strict';

angular.module('airplanesApp',['ui.bootstrap']);
~~~

Here we’re telling Angular that our app is called `airplanesApp` and that we want to bring in the UI Bootstrap module.

Next, we’ll setup our controller. We’ll need to make use of `$scope` and `$http`, so we’ll inject those in.

~~~js
// scripts/airplanesCtrl.js

'use strict';

angular
  .module('airplanesApp')
  .controller('AirplanesCtrl', function($scope, $http) {

  });
~~~

### Setting Up the View

We’ll need a single `index.html` file for our view. Let’s start by creating the file, putting in our basic page structure and linking up our scripts and CSS.

~~~html
<!doctype html>
<html>
  <head>
    <title>Airplanes</title>
    <link rel="stylesheet" href="bower_components/bootstrap/dist/css/bootstrap.css">
    <link rel="stylesheet" href="css/style.css">
  </head>

  <body ng-app="airplanesApp">


  <div class="container" ng-controller="AirplanesCtrl">
    <div class="row">
      <div class="col-lg-6">
        <h1>Airplane Search</h1>
      </div>
    </div>
  </div>        

  </body>

  <!-- Dependencies -->
  <script src="bower_components/angular/angular.js"></script>
  <script src="bower_components/angular-bootstrap/ui-bootstrap.js"></script>
  <script src="bower_components/angular-bootstrap/ui-bootstrap-tpls.js"></script>


  <!-- Our Application Scripts -->
  <script src="scripts/app.js"></script>
  <script src="scripts/airplanesCtrl.js"></script>
</html>
~~~

I've included one simple CSS rule to modify the text size for a specific element that we’ll see later, but feel free to add more styles as you like.

~~~css
.registration {
    font-size: 18px;
}
~~~

### Mocking Out Some Airplane Data

In this first part, we’re only going to be working with a static JSON object for our dataset because we want to focus on building out the front-end first. In the second part we’ll look at how to query a database with Laravel, but for now, let’s just create a simple JSON file with some airplanes.

~~~json
[
  {
    "registration": "C-FNND",
    "operator": "Air Canada",
    "manufacturer": "Boeing",
    "type": "777-200"
  },
  {
    "registration": "PH-BFW",
    "operator": "KLM Royal Dutch Airlines",
    "manufacturer": "Boeing",
    "type": "747-400"
  },
  {
    "registration": "N124US",
    "operator": "US Airways",
    "manufacturer": "Airbus",
    "type": "A320-200"
  },
  {
    "registration": "A6-EEU",
    "operator": "Emirates",
    "manufacturer": "Airbus",
    "type": "A380-800"
  },
  {
    "registration": "VH-LQL",
    "operator": "Qantas",
    "manufacturer": "Bombardier",
    "type": "DHC-8-400"
  }
]
~~~~

### Send a Get Requeset for the Airplane Data

Angular’s `$http` service will allow us to make XHR requests for the JSON data. For the purposes of this part of the tutorial, we’ll be making the request to the local `airplanes.json` file in our data folder and assigning the result to a `$scope` variable called `airplanes`. The returned data is accessible through the `success` callback, and we won’t worry about handling errors for now. Let’s update our `airplanesCtrl.js` file:

~~~js
// scripts/airplanesCtrl.js

'use strict';

angular
  .module('airplanesApp')
  .controller('AirplanesCtrl', function($scope, $http) {
    $http.get('data/airplanes.json').success(function(data) {
      $scope.airplanes = data;
    });
  });
~~~

At this point we can check to make sure the airplane data has successfully been retrieved with $http by displaying it on our page. There are a couple ways to do this, but a quick way that I like is to just output everything and format it as JSON.

~~~html
<!-- index.html -->

<pre>{{ "{{ airplanes | json " }}}}</pre>
~~~

Placing `json` after the pipe character tells the template that we want to filter the output as JSON.

Now that we’ve confirmed that the data is being placed on scope, we can move on to integrating the typeahead input. First, let’s add the input element to `index.html`.

### Setting Up the Input Element

~~~html
<!-- index.html -->

<h1>Airplane Search</h1>
<input type="text" class="form-control" placeholder="Search for an airplane">
~~~

This is the standard input box without any special AngularJS or UI Bootstrap attributes placed in yet. There are several attributes that we’ll need to include, and we’ll look at them one at a time.

~~~html
ng-model="selectedAirplane"
~~~

We have all of our airplane data held on `$scope.airplanes` through the `$http` request that is sent when the page loads. For the purposes of the typeahead however, we will need another model as a place to hold the single airplane that we ultimately select from the list. This model will be `selectedAirplane`.

~~~html
typeahead="airplane as airplane.registration for airplane in airplanes | filter:$viewValue | limitTo:3"
~~~

The `typeahead` attribute calls a directive provided by UI Bootstrap that will take the input we provide and cycle through our data to find matches. The syntax used in the attribute has some similarities to a standard `ng-repeat` but goes a bit further. Of particular note is the `airplane.registration` bit. This will tell the typeahead directive that the value we want to ultimately have populated into our text box is the registration of the airplane. We could of course change this to be some other property if we wanted.

By specifying a filter of `$viewValue`, we are telling the directive that we want to limit the displayed results to only those that match our query. If we left this out, the whole list of results, up to our limit, would be displayed. Next we specify a return limit of 3 items at a time.

Adding these attributes to our input element, we end up with:

~~~html
<input 
  type="text"
  class="form-control"
  placeholder="Search for an airplane"
  ng-model="selectedAirplane"
  typeahead="airplane as airplane.registration for airplane in airplanes | filter:$viewValue | limitTo:3"
>
~~~

This is enough to get us going with a basic typeahead. Open the page in your browser and test it out by plugging in some of the known properties of the airplane data.

![typeahead]({{site.url}}/{{site.baseurl}}img/post-assets/typeahead1.png)

While this is great to show a single property of our data at a time, what we ultimately want is a more comprehensive drop down list. To accomplish this we will use a custom typeahead template. Let’s create a new html template:

~~~html
<!-- templates/airplane-tpl.html -->

<a><div>
  <span 
    style="display:block;"
    class="registration"
    bind-html-unsafe="match.model.registration | typeaheadHighlight:query">
  </span>
  <span bind-html-unsafe="match.model.operator | typeaheadHighlight:query"></span> &middot;
  <span bind-html-unsafe="match.model.manufacturer | typeaheadHighlight:query"></span>
  <span bind-html-unsafe="match.model.type | typeaheadHighlight:query"></span>        
</div></a>
~~~

As you can see, we’re creating one big anchor element that contains spans matching up to some of the properties in our data. The `bind-html-unsafe` attribute is used to securely pass sanitized html into the elements. We reference our data properties through `match.model.property_name`. The filter `typeaheadHighlight` takes our input and uses a regular expression to wrap any text from our data matching that input with `<strong>` tags.

With the template now created, we can reference it in ourinput element. All of the attributes for our typeahead are now complete.

~~~html
<!-- index.html -->

<h1>Airplane Search</h1>
<input
  type="text"
  class="form-control"
  placeholder="Search for an airplane"
  ng-model="selectedAirplane"
  typeahead="airplane as airplane.registration for airplane in airplanes | filter:$viewValue | limitTo:3" typeahead-template-url="templates/airplane-tpl.html"
>
~~~

![typeahead]({{site.url}}/{{site.baseurl}}img/post-assets/typeahead2.png)

As you’ll recall, we assign a model for our selected airplane to selectedAirplane and this model can now be used however we want. We can output the result of our selection on the page much like we did earlier.

~~~html
<!-- index.html -->

<div class="row">
  <div class="col-lg-6">
    <h1>Selected Airplane</h1>
    <pre>{{ selectedAirplane | json }}</pre>
  </div>
</div>
~~~

### Wrapping Up

In this tutorial we’ve seen how to setup a basic UI Bootstrap typeahead with a custom template that uses Angular’s `$http` to query a static JSON file. While this is great for static data, what we’ll ultimately want is something more dynamic, like a way to query a database. We’ll take a look at how to accomplish that in the second part of this tutorial by using Laravel for a PHP backend.
