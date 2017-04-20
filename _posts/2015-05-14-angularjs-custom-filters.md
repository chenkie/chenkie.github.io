---
layout: post
status: publish
published: true
title: AngularJS Custom Filters
feature_image: angular-filters-cover.png
author_slug: ryan-chenkie
date: '2015-05-14 05:00:56 -0400'
categories:
- AngularJS
- Filters
tags:
- AngularJS
- Filters
- Google Maps
- Angular Google Maps
- Custom Filter
comments: true
---

AngularJS filters are awesome for modifying the output of data as it is being displayed in the view and Angular comes with many of these filters built-in with the framework. For example, with the `currency` filter we can easily display numeric values with a dollar sign and two decimal places and with `date` we can format dates and times however we like. The built-in filters are great, but what if we want to make a custom filter that goes beyond these? For this we can make use of AngularJS custom filters.

Most AngualrJS custom filter examples that we see around the web deal with fairly straightforward use cases, such as the one in the [AngularJS custom filter docs](https://docs.angularjs.org/tutorial/step_09) that checks whether a value is present and returns either a checkmark or an X.

In this tutorial we will build a more complex AngularJS custom filter that will allow us to modify geographic coordinates in our views and also make use of the filter in a controller. The filter will accept geographic coordinates in degrees, minutes, and seconds notation, or in decimal degrees, and will return the conversion for us.

## Getting Started

To get a good feel for how AngularJS custom filters can be used, we will build out a small application that will incorporate an AngularJS custom filter with a Google Map to display geographic coordinates. The filter will convert the geographic coordinates from degrees, minutes and seconds notation to decimal degress notation and vice versa.

![filter cover image]({{site.url}}/{{site.baseurl}}img/post-assets/angular-filters-1.png)

## Different Types of Geographic Coordinates

You’re probably most familiar with geographic coordinates being presented in the typical degrees, minutes and seconds (DMS) notation, for example 62°26′32″N 114°23′51″W. This coordinate pair gives us latitude and longitude values that represent a single point on the earth. While this notation is common, it is cumbersome to use in many cases, and thus an alternative exists—decimal degrees (DD).

To convert from DMS to DD, we do a bit of math on the values.

1. Keep the degree value (62 and 114 above)
2. Add the minute value (denoted by ′) divided by 60 (26/60 and 23/60 above)
3. Add the second value (denoted by ″) divided by 3600 (32/3600 and 51/3600 above)

Thus, our coordinate pair above in DD notation is 62.4422N and 114.3975W. By convention, we use the negative sign to signify any coordinate that is in the Western or Southern hemisphere, which allows us to drop the N and W above. The final coordinate is 62.4422 and -114.3975.

## Creating a New Angular Project

Let’s start by creating a new directory called `angular-coordinates` and installing AngularJS, Angular Google Maps, Angular Sanitize and Bootstrap. Assuming you have Bower installed, from the command line:

~~~bash
bower install angular angular-google-maps angular-sanitize bootstrap
~~~

Next let’s create an `index.html` file in our root directory and setup its basic structure:

~~~html
<!-- index.html -->

<!DOCTYPE html>
<html>
  <head>
    <title>Angular Coordinates</title>
    <link rel="stylesheet" type="text/css" href="bower_components/bootstrap/dist/css/bootstrap.css">
    <link rel="stylesheet" type="text/css" href="css/style.css">
  </head>

  <body ng-app="angular-coordinates" ng-controller="mapController">

    <div id="map_canvas">
      <ui-gmap-google-map center="map.center" zoom="map.zoom" options="options">
        <ui-gmap-marker
          coords="marker.coords"
          options="marker.options"
          events="marker.events"
          idkey="marker.id">
        </ui-gmap-marker>
      </ui-gmap-google-map>
    </div>

    <div class="col-sm-6 col-sm-offset-3 coordinates-form">
      <div class="col-sm-6">
        <input
          type="text"
          ng-model="lat"
          class="form-control coordinate-input"
          placeholder="Enter Latitude"
        />
      </div>
      <div class="col-sm-6">
        <input
          type="text"
          ng-model="lon"
          class="form-control coordinate-input"
          placeholder="Enter Longitude"
        />
      </div>
    </div>

    <div class="info-box">

    </div>      
  </body>

  <!-- Application Dependencies -->
  <script src="bower_components/angular/angular.js"></script>
  <script src="bower_components/angular-sanitize/angular-sanitize.js"></script>
  <script src="bower_components/lodash/dist/lodash.js"></script>
  <script src="bower_components/angular-google-maps/dist/angular-google-maps.js"></script>

  <!-- Application Scripts -->
  <script type='text/javascript' src='scripts/app.js'></script>
  <script type='text/javascript' src='scripts/mapCtrl.js'></script>
  <script type='text/javascript' src='scripts/coordinateFilter.js'></script>
  <script type='text/javascript' src='scripts/functions.js'></script>
</html>
~~~

Our HTML document loads the dependencies we pulled in with Bower and has a basic page structure setup. The `#map_canvas` div is where the Angular Google Maps map goes and as you can see, we’re working with a Google Map and a Google Map Marker. We’ve passed in some options to the directives, like the centering coordinates for the map and for the marker. These coordinates and the other items you see in the Angular Google Maps directive are on `$scope` and are initialized in the controller which we will see below.

We’ve also included input boxes where we can type out the coordinate pair. Once we have everything wired up correctly, the map will pan to update it’s center and marker position as the user types coordinates in.

Finally you’ll see that there are a bunch of appication scripts that we’re pulling in that we haven’t created yet. We’ll do that below.

## Creating Custom Styles

We’ll need some custom styles for our app to make it look a bit better that what we get out of the box with Bootstrap.

~~~css
/* css/style.css */

.coordinate-input {
  height: 75px;
  font-size: 30px;
}

html, body, #map_canvas {
  height: 100%;
  width: 100%;
  margin: 0px;
}

#map_canvas {
  position: relative;
}

.angular-google-map-container {
  position: absolute;
  top: 0;
  bottom: 0;
  right: 0;
  left: 0;
}

.coordinates-form {
  position: absolute;
  top: 25px;  
}

.info-box {
  position: absolute;
  bottom: 0;
  right: 0;
  left: 0;
  background-color: rgba(0, 0, 0, 0.7);
  height: 200px;
}

h1, h2, h3, h4, h5, h6, p {
  color: #ffffff;
}
~~~

## Create the `app.js` File

Let’s create our main Angular application file, `app.js` in the scripts folder. In this file we will declare the Angular application module and load the dependencies we need.

~~~js
// scripts/app.js
    
(function() {

  'use strict';

  angular
    .module('angular-coordinates', ['uiGmapgoogle-maps', 'ngSanitize']);

})();
~~~

You can see here that we’re matching up the module name, `angular-coordinates` with what we have declared in the `ng-app` directive on the body tag. We’re loading two dependencies for this project—Angular Google Maps which will be used to render the background map, and Angular Sanitize which will be used to bind values from the filter directly to HTML.

## Creating the Map Controller

Since we’re using Angular Google Maps for this project, we’ll need a simple controller that will mostly be used for communicating coordinate information to the map directive. Let’s create a file called `mapController.js` in the scripts folder:

~~~js
// scripts/mapController.js
    
(function() {

  'use strict';

  angular
    .module('angular-coordinates')
    .controller('mapController', map);

  function map($scope) {

    $scope.map = {
      center: {
        latitude: $scope.lat || 62.4568, 
        longitude: $scope.lon || -114.3964
      },
      zoom: 7 
    }

    $scope.marker = {
      id: 0,
      coords: {
        latitude: $scope.lat || 62.4568,
        longitude: $scope.lon || -114.3964
      },
      options: {
        draggable: false
      }
    }

  }
    
})();
~~~

The objects we’ve put on `$scope` here in the controller will allow us to initialize the Angular Google Map when the page loads. We have two input boxes overtop of our map, one for the latitude coordinate and the other for the longitude coordinate. They are bound to `$scope.lat` and `$scope.lon` respectively.

## Creating a Helper Functions File

Once we get into the filter we’re going to need a way to check whether a value is between two numbers so that we can validate the coordinates the user has input. To do so it will be useful to have a custom function put on the `Number` prototype called `between` which takes two numbers and returns true if our value in question is between the two numbers and false if it isn’t.

~~~js
// scripts/functions.js

// Helpful range checker provided by David Thomas: http://stackoverflow.com/a/18881828
Number.prototype.between = function (a, b, inclusive) {
  var min = Math.min.apply(Math, [a,b]),
      max = Math.max.apply(Math, [a,b]);
  return inclusive ? this >= min && this <= max : this > min && this < max;
}
~~~

## Creating the Filter

The final JavaScript file we need is for our filter which we’ll call `coordinateFilter.js`. Let’s create this within the scripts directory and get the basics of it setup.

~~~js
// scripts/coordinateFilter.js

(function() {

  'use strict';

  angular
    .module('angular-coordinates')
    .filter('coordinateFilter', coordinateFilter);
    
    function coordinateFilter($sce) {

      return function(coordinate, conversion, type, places) {			
        // The filter will be running as we type values into the input boxes, which returns undefined
        // and brings up an error in the console. Here wait until the coordinate is defined
        if(coordinate != undefined) {}		
      }	
    }
        
})();
~~~

As you can see, the filter is declared much like how a controller or directive would be—we call `.filter` on our module to create a new filter, give it a name of `coordinateFilter` and pass in the `coordinateFilter` method that we’re creating just below. The `coordinateFilter` method is going to itself return a function, and you’ll see here that we’re declaring some parameters on the function being returned. Here’s what those parameters represent:

- **coordinate** – the input coordinate we pass to the filter
- **conversion** – an argument declared when using the filter in the view which will allow us to control whether the coordinate should be converted to DMS or to DD
- **type** – an argument to let the filter know whether the input coordinate is a latitude or longitude value which is needed because the rules for coordinate validation differ between the two
- **places** – another argument which will give us the ability to change how many decimal places are returned from the conversion

We now have all of the basics setup. If everything is wired up correctly, you should see the map rendering with the input boxes overtop:

![filter cover image]({{site.url}}/{{site.baseurl}}img/post-assets/angular-filters-2.png)

## Building Out the Filter

Now that we have the structure all setup, let’s go through the logic we’ll need for the filter to work properly.

### Matching User Input for Coordinates

We’ll need a way to grab only the relevant bits of user input so that we’re not trying to convert strings or any other gibberish. A good way to do this would be with a regular expression.

~~~js
//...
    
// Check for user input that is a positive or negative number with the option
// that it is a float. Match only the numbers and not the white space or other characters
var pattern = /[-+]?[0-9]*\.?[0-9]+/g

var match = coordinate.match(pattern);
~~~

In this regular expression we are looking for only positive or negative numbers and we are excluding any whitespace or other characters. We’re also looking for floats if the user is to pass decimal degrees as their input. Afterewards we are using the JavaScript `match` method to look at the coordinate the gets passed to the filter and match parts of the user input based on our regular expression. The `match` method returns an array of matches.

### Converting the Input to Either DMS or DD

~~~js
// ...
    
if(conversion === "toDD" && match && coordinateIsValid(match, type)) {
  // If the match array only has one item, the user has provided decimal degrees
  // and we can just return what the user typed in
  if(match.length === 1) {
    return parseFloat(match);
  }

  // If the match array has a length of three then we know degrees, minutes, and seconds
  // were provided so we can convert it to decimal degrees
  if(match.length === 3) {
    return toDecimalDegrees(match);
  }
} else if(conversion === 'toDMS' && match && coordinateIsValid(match, type)) {
  // When converting from decimal degrees to degrees, minutes and seconds, if
  // the match array has one item we know the user has input decimal degrees
  // so we can convert it to degrees, minutes and seconds
  if(match.length === 1) {
    return toDegreesMinutesSeconds(match);
  }

  // To properly format the converted coordinates we will need to add in HTML entities
  // which means we'll need to bind the returned string as HTML and thus we need
  // to use $sce (Strict Contextual Escaping) to say that we trust what is being bound as HTML
  if(match.length === 3) {
    return $sce.trustAsHtml(match[0] + '° ' + match[1] + '′ ' + match[2] + '″ ');
  }
}

// Output a notice that the coordinates are invalid if they are
else if(!coordinateIsValid(match, type)) {
  return "Invalid Coordinate!";
}
~~~

The block above is where we check whether the coordinate is to be convertd to DMS or to DD and then respond accordinly. In the top-level `if` blocks you’ll see that we first check whether the `conversion` method is `toDD` or `toDMS`. We also make sure that a `match` exists and that the coordinate is valid. Coordinate validation is done with the `coordinateIsValid` function which we will define later.

Once those checks pass, we then have two scenarios that we’ll respond to. The first is that the `match` array has a length of 1 and the second is that it has a length of 3. If it has a length of 1 then we will assume that the user has entered a value in decimal degrees and we will either return the value right back to them (it’s already in DD) or we will convert it to DMS using the `toDegreesMinutesSeconds` function that we’ll define later. If the length of the `match` array is 3 then we will assume the user has passed a value that is in DMS and we’ll respond accordinly.

Finally, if the input doesn’t make it through the top-level `if` checks, we know the coordinate is invalid and we’ll alert the user of it.

### Defining the Conversion Functions

Above we called on the `toDecimalDegress` and `toDegreesMinutesSeconds` functions, but we haven’t defined them yet.

~~~js
// ...

function toDecimalDegrees(coord) {
  // Setup for all parts of the DMS coordinate and the necessary math to convert
  // from DMS to DD
  var degrees = parseInt(coord[0]);
  var minutes = parseInt(coord[1]) / 60;
  var seconds = parseInt(coord[2]) / 3600;

  // When the degrees value is negative, the math is a bit different
  // than when the value is positive. This checks whether the value is below zero
  // and does subtraction instead of addition if it is. 
  if(degrees < 0) {
    var calculated = degrees - minutes - seconds;
    return calculated.toFixed(places || 4);
  }
  else {
    var calculated = degrees + minutes + seconds
    return calculated.toFixed(places || 4);
  }
}

// This function converts from DD to DMS. Math.abs is used a lot because
// for the minutes and seconds, negative values are not valid 
function toDegreesMinutesSeconds(coordinate) {
  var degrees = coordinate[0].split('.')[0];
  var minutes = Math.abs(Math.floor(60 * (Math.abs(coordinate[0]) - Math.abs(degrees))));
  var seconds = 3600 * (Math.abs(coordinate[0]) - Math.abs(degrees) - Math.abs(minutes) / 60).toFixed(2);

  return $sce.trustAsHtml(degrees + '° ' + minutes + '′ ' + seconds + '″ ');
                                    
}
~~~

The first function above allows us to convert from DMS to DD. The `toDecimalDegress` function takes an array of coordinates and sets up the initial math on them. As you’ll see, `degrees` is just the first value of the coordinates array, but the `minutes` and `seconds` variables have some math done on them to set them up for our calculations to follow.

The math we do to get the DD coordinate depends on whether the degree value is positive or negative—if it is positive, we need to add the `degrees`, `minutes` and `seconds` together which will give us a positive float value. However, if they are negative then we need to subtract them to get the correct value. Once we have done the math on the values, we return them to a fixed number of decimal places, which is either the value that we specify in our view with an argument on the filter, or a default of 4 which is a reasonable number of places.

Since the math to convert from DD to DMS is a bit differet, the `toDegreesMinutesSeconds` function is going to look a bit different as well. In this function we first define the value of `degrees` by splitting the input at the decimal place and grabbing the first element in the resulting array. Since negative values are meaningless for `minutes` and `seconds` in DMS notation, we will require the absolute values for these to properly do the math, which we do by passing values into `Math.abs`.

Finally in the `toDegreesMinutesSeconds` function we are returning a string that will be directly bound to HTML in the view. To do this we need to use Angular’s Strict Contextual Escaping with `$sce`. We build up the string with some HTML entities that are used for standard DMS notation.

## Validating the Coordinates

There are some rules that we need to apply to the user input to make sure the coordinates are valid and they differ depending on whether the user enters a latitude or a longitude coordinate.

~~~js
// ...

// This function checks whether the coordinate value the user enters is valid or not. 
// If the coordinate doesn't pass one of these rules, the function will return false
// which will then alert the user that the coordinate is invalid.
function coordinateIsValid(coordinate, type) {
  if(coordinate) {

    // The degree values of latitude coordinates have a range between -90 and 90
    if(coordinate[0] && type === 'lat') {
      if(!parseInt(coordinate[0]).between(-90, 90)) return false;
    }
    // The degree values longitude coordinates have a range between -180 and 180
    else if(coordinate[0] && type === 'lon') {
      if(!parseInt(coordinate[0]).between(-180, 180)) return false;
    }
    // Minutes and seconds can only be between 0 and 60
    if(coordinate[1]) {
      if(!parseInt(coordinate[1]).between(0, 60)) return false;
    }
    if(coordinate[2]) {
      if(!parseInt(coordinate[2]).between(0, 60)) return false;
    }
  }

	// If the coordinate made it through all the rules above, the function
	// returns true because the coordinate is good
	return true;
}
~~~

The first thing we do is check whether the filter is meant to support a latitude or longitude value and then respond accordinly. We also need to check to see if a value exists at the 0th, 1st and 2nd indices on the coordinate array that is being checked, otherwise the function would return `false` when it wouldn’t need to, which would mess up the output. Finally, we return `true` if everything checks out which is our indication that the coordinate entered by the user is valid.

## Adjusting the View to Output Conversions

Now that our filter is complete, we can add some elements to the view that will be responsible for displaying the converted coordinates.

~~~html
<!-- index.html -->

<div class="info-box">
  <div class="col-sm-6">
    <h3>Degees, Minutes, Seconds</h3>
    <h3><span class="label label-primary">Latitude</span> <span ng-bind-html="lat | coordinateFilter:'toDMS':'lat'"></span></h3> 
    <h3><span class="label label-primary">Longitude</span> <span ng-bind-html="lon | coordinateFilter:'toDMS':'lon'"></span></h3>
  </div>      
  <div class="col-sm-6">
    <h3>Decimal Degrees</h3>
    <h3><span class="label label-primary">Latitude</span> {{lat | coordinateFilter:'toDD':'lat':4}}</h3>
    <h3><span class="label label-primary">Longitude</span> {{lon | coordinateFilter:'toDD':'lon':4}}</h3>
  </div>
</div>
~~~

There are two ways that we’re making use of the filter in the view. First, we’re binding values directly to HTML under the Degrees, Minutes, Seconds section. This is necessary because we wanted to return a string with the HTML entities relevant to DMS notation from the filter. We use `ng-bind-html` to do this and specify that we want to output `lat` and `long`. We use the pipe character to denote that we’re using a filter and the call the `coordinateFilter`. You can see that we’re also passing the arguments we talked about earlier which are `conversion` and `type`.

Things work similarly in the Decimal Degrees section, but there we are calling the filter directly in the templating. In that section we’re also specifying a third argument for the filter which is the number of decimal places we want the output to go to, which in our case is four places.

Once the `.info-box` is ready in our view, you should see the converted coordinates at the bottom of the page:

![map image]({{site.url}}/{{site.baseurl}}img/post-assets/angular-filters-3.png)

## Using Filters in the Controller

Angular also allows us to use filters in our controllers which can come in handy in some cases. This is true in our case because we’ll need to give Angular Google Maps coordinates in DD notation for it to properly update the center and marker position as coordinates are entered by the user.

To make use of filters in our controllers we can simply inject them. All filters in Angular have `Filter` appended to the filter name, so we’ll need to inject `coordinateFilterFilter`.

~~~js
// scripts/mapController.js

(function() {

  'use strict';

  angular
    .module('angular-coordinates')
    .controller('mapController', map);

  function map($scope, coordinateFilterFilter) {

    $scope.map = {
      center: {
        latitude: $scope.lat || 62.4568, 
        longitude: $scope.lon || -114.3964
      },
      zoom: 7 
    }

    $scope.marker = {
      id: 0,
      coords: {
        latitude: $scope.lat || 62.4568,
        longitude: $scope.lon || -114.3964
      },
      options: {
        draggable: false
      }
    }

    var updateCenter = function() {

      $scope.marker.coords = {
        latitude: parseFloat(coordinateFilterFilter($scope.lat, 'toDD')) || 62.4568,
        longitude: parseFloat(coordinateFilterFilter($scope.lon, 'toDD')) || -114.3964
      }

      $scope.map.center = {
        latitude: parseFloat(coordinateFilterFilter($scope.lat, 'toDD')) || 62.4568,
        longitude: parseFloat(coordinateFilterFilter($scope.lon, 'toDD')) || -114.3964
      }
        
    }

    $scope.$watch('lat', updateCenter);
    $scope.$watch('lon', updateCenter);
  }
})();
~~~

As you can see, we’ve injected `coordinateFilterFilter` and we are using it in the new `updateCenter` function. This function is used along with Angular’s `$watch` to look for updates to values. If a value change is detected, the `updateCenter` function is triggered. Since the user will in many cases be entering coordinates in DMS notation, and since that format isn’t accepted by Angular Google Maps, we’ll need to convert to DD notation first.

Since we’re not using the pipe character to make use of the filter like we do in the view, we need to pass arguments like we would to any normal function. When we call `coordinateFilterFilter` here, the first argument we pass in is the input from the user and the second is what kind of conversion we are doing. We then use JavaScript’s `||` operator to default to our home values so that our marker doesn’t end up in the middle of nowhere.

## Wrapping Up

In this tutorial we’ve seen how we can create a complex AngularJS custom filter and use it a number of different ways. We saw how we can bind values that are returned from the filter directly to HTML using Angular’s `$sce` and also how we can make use of filters in our controllers.

I’d love to hear about any suggestions for improvements that you might have for this filter. Feel free to leave a comment below or get in touch by email. The code for this tutorial can be found on [GitHub](https://github.com/chenkie/angular-coordinates) and there is a demo site [here](http://angular-coordinates.ryanchenkie.com/).

