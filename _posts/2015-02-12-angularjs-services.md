---
layout: post
status: publish
published: true
title: 'Make Code Reusable with AngularJS Services'
feature_image: angular-services-cover.jpg
author_slug: ryan-chenkie
date: '2014-12-23'
categories:
- AngularJS
tags:
- AngularJS
- API
- Bootstrap
- Factory
- Service
- Weather
comments: true
---

While AngularJS certainly is an opinionated framework, it also gives developers a lot of freedom when it comes to application architecture. In many cases this can be a positive thing, but it can also lead to applications getting built in ways that aren’t the most maintainable.

One area this freedom of architecture often shows up is in the controller. When starting out with Angular, it can be tempting to put all bits of logic directly into the controller, especially given the fact that many quick examples and tutorials follow this pattern. However, when it comes to real-life applications, keeping the controllers thin is one key way to increase maintainability. To help us keep controllers thin and encourage code reusability, we can make use of services.

## Using Services Instead

Services in Angular give us a way to abstract certain parts of our application logic out into reusable objects or functions. They can be injected as dependencies across all parts of the application, including controllers, directives, filters, and even other services. Creating and using services effectively requires that they be generalized enough to be easily reused in many different areas of the app.

## Checking the Weather

To illusrate how to create and use services we will make a simple weather checking application that allows us to search for local weather by city name or by latitude and longitude coordinates. We will use the freely available [OpenWeatheMap API](http://openweathermap.org/api) to fetch current weather data and will wire everything up with all the parts of a fully functioning application so we can see how the pieces work together. The application dependencies will be Angular, Angular Route, Angular Resource, and Boostrap for some styling.

### Set Up the Directory

To start off, let’s install AngularJS, Angular Route, Angular Resource and Bootstrap with Bower and setup our directory structure.

~~~bash
bower install angular angular-route angular-resource bootstrap
~~~

#### Directory

~~~bash
|-- bower_components
|-- css
|-- scripts
    |-- controllers
    |-- services
|-- views
|-- index.html
~~~

### Set Up the View

Next, let’s setup index.html as the main view. We’ll add in references for all of the Javascript files that we’ll eventually be creating throughout the tutorial so that we don’t have to go back and do it later.

~~~html
<!doctype html>
<html>
  <head>
    <title>Weather App</title>
    <link rel="stylesheet" href="bower_components/bootstrap/dist/css/bootstrap.css">
    <link rel="stylesheet" href="css/style.css">
  </head>
  <body ng-app="weatherApp">
    <div class="container">
      <div class="col-sm-6">
        <div class="panel panel-default">
          <div class="panel-body">
            <div ng-view></div>
          </div>
        </div>                      
      </div>
    </div>        
  </body>

  <!-- Library Scripts -->
  <script src="bower_components/angular/angular.js"></script>
  <script src="bower_components/angular-route/angular-route.js"></script>
  <script src="bower_components/angular-resource/angular-resource.js"></script>

  <!-- Application Scripts -->
  <script src="scripts/app.js"></script> 
  <script src="scripts/services/weather.js"></script>    
  <script src="scripts/controllers/cityCtrl.js"></script>
  <script src="scripts/controllers/coordinatesCtrl.js"></script>
</html> 
~~~

Notice here that we declare the name of our application as `weatherApp` on the body tag. You’ll see that we have a `<div>` with the `ng-view` directive on it—this is where our smaller views will be fed to when we wire everything up with `$routeProvider`.

## Setup `app.js`

Next we’ll create our application module and configure our `$routeProvider` to serve the appropriate views and call the necessary controllers when our `city` and `coordinates` routes are hit.

~~~js
// scripts/app.js

'use strict';

angular
  .module('weatherApp', [
    'ngRoute',
    'ngResource'
  ])
  .config(function($routeProvider) {
    $routeProvider
      .when('/city', {
        templateUrl: 'views/city.html',
        controller: 'cityCtrl'
      })
      .when('/coordinates', {
        templateUrl: 'views/coordinates.html',
        controller: 'coordinatesCtrl'
      })
      .otherwise({
        redirectTo:'/'
      });
  });
~~~

Here we declare our module as `weatherApp` and inject Angular Route and Angular Resource. The config block is where we setup our routes, and as you can see, when we navigate to `/city`, we are calling the yet to be created `city.html` view and the `cityCtrl` controller. The same goes for our coordinates route. Let’s create the views and controllers we’ll need now.

## The Controllers

If we weren’t going to use services to abstract common application logic (communicating with the OpenWeatherMap API in this case) to a single location, we could put it in our controllers. However, doing so would mean that we would need to repeat the same pieces of code in multiple places. Not ideal, especially for maintaining code down the line. To illustrate the problem, let’s go ahead and put all of our weather fetching logic in the controllers first.

~~~js
// scripts/controllers/cityCtrl.js

'use strict';

angular
  .module('weatherApp')
  .controller('cityCtrl', function($scope, $resource) {

    var API_PATH = 'http://api.openweathermap.org/data/2.5/weather';

    var Weather = $resource(API_PATH);

    $scope.checkWeather = function() {

      var city = {
        q: $scope.city
      }

      Weather.get(city, function(successResult) {
        $scope.weather = successResult;
      }, function(errorResult) {
        console.log('Error: ' + errorResult);
      });
    }
});
~~~

~~~js
// scripts/controllers/coordinatesCtrl.js

'use strict';

angular
  .module('weatherApp')
  .controller('coordinatesCtrl', function($scope, $resource) {

    var API_PATH = 'http://api.openweathermap.org/data/2.5/weather';

    var Weather = $resource(API_PATH);

    $scope.checkWeather = function() {

      var coordinates = {
        lat: $scope.lat,
        lon: $scope.lon
      }

      Weather.get(coordinates, function(successResult) {
        $scope.weather = successResult;
      }, function(errorResult) {
        console.log('Error: ' + errorResult);
      });   
    }
  });
~~~

Here we are setting the url of the OpenWeatherMap API and creating a data fetching function that we can put on an `ng-click`. Within that function we use Angular’s `$resource` to make a `GET` request to the API, passing in either our city name or a set of lat and long coordinates as the parameters. We then setup some basic success and error checking and respond appropriately to the result of the `GET` request.

The biggest thing to notice here is that we have duplicated almost all of the code that is necessary for our HTTP request. Aside from providing a parameter variable that is specific to the way we want to request weather (by city or by coordinates), everything else is the same.

## The Views

~~~html
<!-- views/city.html -->

<div class="page-header">
  <h1>Check Weather by City</h1>
</div>

<div class="input-group">

  <input type="text" class="form-control" ng-model="city" placeholder="Enter City Name">

  <div class="input-group-btn">
    <button class="btn btn-primary" ng-click="checkWeather()">Get the Weather!</button>
  </div>

</div>

<pre>
{% raw %}{{ weather | json }}{% endraw %}
</pre>
~~~

~~~html
<!-- views/coordinates.html -->

<div class="page-header">
  <h1>Check Weather by Coordinates</h1>
</div>

<input type="text" class="form-control" ng-model="lat" placeholder="Enter Latitude">
<input type="text" class="form-control" ng-model="lon" placeholder="Enter Longitude">

<div class="btn-group"> 
  <button class="btn btn-primary" ng-click="checkWeather()">Get the Weather!</button>
</div>

<pre>{% raw %}{{ weather | json }}{% endraw %}</pre>
~~~

We’ve put some Bootstrap classes in for styling and added an `ng-click` on the buttons that call the `checkWeather` method. At this point, we’re only going to dump the returned `weather` data that is on the weather model out as raw JSON.

To make our elements look a bit better, let’s add a simple CSS rule.

~~~css
/* css/style.css */

input, button {
  margin-bottom: 10px;
}
~~~

If you’d like the app to look a bit nicer, see the extra credit section at the end!

![weather by city]({{site.url}}/{{site.baseurl}}img/post-assets/weather-service-1.png)

![weather by city]({{site.url}}/{{site.baseurl}}img/post-assets/weather-service-2.png)

Everything is now wired up to check the weather! Try checking for a specific city with the search box at the `/city` route and for a pair of coordinates at the `/coordinates` route. **Note:** coordinates are expected in decimal degrees and use plus/minus notation for hemispheres (more on that [here](https://msdn.microsoft.com/en-ca/library/aa578799.aspx)).

## Moving on to Services

Our weather checking app is great, but it isn’t very DRY (Don’t Repeat Yourself). Let’s fix that now with a service.

## What Kind of Service Do I Use?

If you’ve looked at services in AngularJS at all, you’ll likely have noticed that there are a few different ways to create them. Angular let’s us create services using `factory`, `service`, or `provider`, and they all serve certain purposes. We are going to use `factory` here, and this is what you’ll probably end up using most often, especially when the service’s job is to communicate with an API. We won’t get into details about the differences between each kind of service, but this [Stackoverflow question](http://stackoverflow.com/questions/15666048/service-vs-provider-vs-factory) has a lot of great answers that describe the differences.

Let’s create our `factory` service.

~~~js
//

'use strict';

angular
  .module('weatherApp')
  .factory('Weather', function($resource) {

    var API_PATH = 'http://api.openweathermap.org/data/2.5/weather';

    var Weather = $resource(API_PATH);

    return {
      getWeather: function(weatherParams) {
        return Weather.get(weatherParams, function(successResult) {
          return successResult;
        }, function(errorResult) {
          console.log(errorResult);
        });             
      }
    }
  });
~~~

As you can see, the code in this `factory` service looks very similar to what was in our controllers, but with some tweaks. We setup communication with the API, and then we return an object that has on it a function called `getWeather`. This function is responsible for making a `GET` request to the API and then either returning the data it receives back, or an error if something went wrong. You’ll see that we’ve generalized the parameters that get included in the `GET` request to be called `weatherParams`. This parameter will be provided when we make a call to this service in our controllers.

Now let’s go back and fix up the controllers to remove duplication.

~~~js
// scripts/controllers/cityCtrl.js

'use strict';

angular
  .module('weatherApp')
  .controller('cityCtrl', function($scope, Weather) {

    $scope.checkWeather = function() {

      var city = {
        q: $scope.city
      }

      $scope.weather = Weather.getWeather(city);      
    }

  });
~~~

~~~js
// scripts/controllers/coordinatesCtrl.js

'use strict';

angular
  .module('weatherApp')
  .controller('coordinatesCtrl', function($scope, Weather) {

    $scope.checkWeather = function() {

      var coordinates = {
        lat: $scope.lat,
        lon: $scope.lon
      }

      $scope.weather = Weather.getWeather(coordinates);       
    }

  });
~~~

In the revised controllers we are injecting Weather, which is a reference to our `Weather` service, as a dependency. We’ve removed the code for API communication and the logic of the `GET` request, and we are now simply calling the `getWeather` method on the Weather service, passing in either the city name or coordinates as our single parameter, and then letting the service take care of fetching the data.

## Conclusion

So there we have it—we’ve now abstracted away the common pieces of code to a single location—our Weather service—and have made the controllers much skinnier. This might not seem like a big deal when we only have two routes and two controllers, but imagine if we needed to check the weather in many different spots throughout our application. Now, instead of needing to set everything up for interacting with the API for each of those places, we have a single service that can be injected. This will save time and make it easier to maintain the code in the future.

## Extra Credit

Up until now we have only displayed the raw JSON data that the API returns between `<pre>` tags. If you want to make the app look a bit nicer when checking the weather, here is some extra HTML and CSS to get the job done.

~~~html
<!-- views/city.html -->

<div class="page-header">
  <h1>Check Weather by City</h1>
</div>

<div class="input-group">

  <input type="text" class="form-control" ng-model="city" placeholder="Enter City Name">

  <div class="input-group-btn">
    <button class="btn btn-primary" ng-click="checkWeather()">Get the Weather!</button> 
  </div>

</div>

<div class="panel panel-default weather-panel" ng-if="weather">
  <div class="panel-body">
    <div class="col-sm-6">

      <h1>{% raw %}{{weather.name}}{% endraw %}</h1>
      <h1 class="temp">{% raw %}{{weather.main.temp - 273.15 | number:1}}{% endraw %}&deg;C</h1>

    </div>

    <div class="col-sm-6 conditions">   

      <h4>{% raw %}{{ weather.weather[0].description }}{% endraw %}</h4>
      <h4>Humidity: {% raw %}{{ weather.main.humidity }}{% endraw %}%</h4>
      <h4>Pressure: {% raw %}{{ weather.main.pressure }}{% endraw %} hPa</h4>

    </div>
  </div>
</div>
~~~

![weather by city]({{site.url}}/{{site.baseurl}}img/post-assets/weather-service-3.png)

~~~html
<!-- views/coordinates.html -->

<div class="page-header">
  <h1>Check Weather by Coordinates</h1>
</div>

<input type="text" class="form-control" ng-model="lat" placeholder="Enter Latitude">
<input type="text" class="form-control" ng-model="lon" placeholder="Enter Longitude">

<div class="btn-group"> 
  <button class="btn btn-primary" ng-click="checkWeather()">Get the Weather!</button>
</div>

<div class="panel panel-default weather-panel" ng-if="weather">
  <div class="panel-body">
    <div class="col-sm-6">  

      <h1>{% raw %}{{ weather.name }}{% endraw %}</h1>
      <h1 class="temp">{% raw %}{{ weather.main.temp - 273.15 | number:1 }}{% endraw %}&deg;C</h1>

    </div>
    <div class="col-sm-6 conditions">   

      <h4>{% raw %}{{ weather.weather[0].description }}{% endraw %}</h4>
      <h4>Humidity: {% raw %}{{ weather.main.humidity }}{% endraw %}%</h4>
      <h4>Pressure: {% raw %}{{ weather.main.pressure }}{% endraw %} hPa</h4>

    </div>
  </div>
</div>
~~~

![weather by city]({{site.url}}/{{site.baseurl}}img/post-assets/weather-service-4.png)

~~~css
/* css/style.css */

.weather-panel {
  margin-top: 15px;
}

.temp {
  font-size: 50px;
}

.conditions {
  margin-top: 40px;
}

input, button {
  margin-bottom: 10px;
}
~~~

We’ve adjusted the views with new templating that pulls out some of the properties of the weather object that gets returned from the API call. OpenWeatherMap provides temperature data in degrees Kelvin, so you’ll see that we’re subtracting absolute zero from the temperature value provided by the API to get to degrees Celsius. We also put a `number` filter on this template to bring it to one decimal place.