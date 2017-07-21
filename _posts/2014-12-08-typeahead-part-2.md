---
layout: post
status: publish
published: true
title: Simple Typeahead With AngularJS and Laravel &ndash; Part 2
feature_image: typeahead2-cover.jpg
author_slug: ryan-chenkie
date: '2014-12-08 19:04:46 -0500'
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

Now that we’ve got our front-end in place for our typeahead input, let’s work on retrieving data from a database instead of just from a static JSON file on disk. For the back-end we’ll be using Laravel 4.2 with a MySQL database.

This tutorial will assume a basic working knowledge of Laravel, so if you’re brand new to the framework, it’s worth getting familiar with the basics before we dive into things here. To get started, the [Laravel docs](http://laravel.com/docs/4.2/quick#installation) have good instructions for installation, and [Laracasts](https://laracasts.com/) provides a [great free screencast](https://laracasts.com/lessons/laravel-installation-for-newbs) that will go a bit deeper.

We’ll need a webserver for this part of the tutorial. I’ll be using MAMP which is an easy solution for Mac. An even better tool for Laravel is [Laravel Homestead](http://laravel.com/docs/4.2/homestead), but setup is a bit more involved.

{% include securing-angular-applications.md %}

## Creating our Project

Once you have Laravel installed, create a new project by using the Laravel command in the terminal

~~~bash
laravel new typeahead
~~~

This will create a new project directoy called `typeahead`. We can check to make sure everything is working by using Artisan to serve the page.

~~~bash
php artisan serve
~~~

After running this, you should see `Laravel development server started on http://localhost:8000`. Browse to `http://localhost:8000` and make sure you get the “You’ve Arrived” page.

## Move the Angular Files to the Public Directory

The work we did in the last tutorial will need to be moved to the `public` directory in our newly created Laravel project. Grab all those files and move or copy them there, either through browsing the filesystem or using the `mv` or `cp` command in the terminal. My preference is to copy all of the files and folders from Part 1 to the public directory in our new Laravel installation using the command line.

~~~bash
cp -a /angular-typeahead/. /typeahead/public/
~~~

In this command, `cp` is for copy, the `-a` option preserves all file attributes, `/angular-typeahead/` is our directory from Part 1, and the `.` after it tells terminal to grab all files and folders, including the hidden ones. Then `typeahead/public/` is the destination in our new Laravel project.

## Setup the Index Page

In Part 1 we used `index.html` as the main page from which we accessed our typeahead input. We’ll do something very similar for this part, but we’ll need to apply it to a file called `index.php`. Out of the box, the `hello` view is served by `hello.php` from the main route, as can be seen in `routes.php`:

~~~php
// app/routes.php

Route::get('/', function()
{
  return View::make('hello');
});
~~~

Let’s rename this file to `index.php` and update `routes.php` accordinly.

~~~bash
|-- views
  |-- emails
  |-- index.php
~~~

~~~php
// app/routes.php

Route::get('/', function()
{
  return View::make('index');
});
~~~

Next, let’s copy everything that was in our `index.html` file to `index.php`.


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
        <input
          type="text"
          class="form-control"
          ng-model="selectedAirplane"
          typeahead="airplane as airplane.registration for airplane in airplanes | filter:$viewValue | limitTo:3"
          placeholder="Search for an airplane"
          typeahead-template-url="templates/airplane-tpl.html"
        >
      </div>
    </div>
    <div class="row">
      <div class="col-lg-6">
        <h1>Selected Airplane</h1>
        <pre>{{ "{{ selectedAirplane | json" }}}}</pre>
      </div>
    </div>
  </div>

</body>

<!-- Dependencies -->
<script src="bower_components/angular/angular.js"></script>
<script src="bower_components/angular-bootstrap/ui-bootstrap.js"></script>
<script src="bower_components/angular-bootstrap/ui-bootstrap-tpls.js"></script>


<!-- Scripts -->
<script src="scripts/app.js"></script>
<script src="scripts/airplanesCtrl.js"></script>
</html>
~~~

Laravel will look to the public directory for all of our `public` facing assets, so there isn’t anything else we need to do right now to set things up for those files. Browsing back to `localhost:8000`, we can see that the typeahead still works just like it did before.

## Creating the Database and Running a Migration

In Part 1 we stored our airplane data in a static `airplanes.json` file, but this time we will put the data into a MySQL database. First, let’s create a database for this purpose. We can use phpMyAdmin to create a new database. If you’re using MAMP, click ‘Open WebStart page’ on the MAMP control panel, and after opening phpMyAdmin, select `Databases`. Create a new database called `airplanes`.

Next we’ll update our Laravel database configuration file so that the application looks to our new database. We’ll also make sure our database user credentials are correct. For my installation, the username and password are both ‘root’, but of course this is just for testing and if we were in production we would have a better username with a strong password.

~~~php
// app/config/database.php

'mysql' => array(
    'driver'    => 'mysql',
    'host'      => 'localhost',
    'database'  => 'airplanes',
    'username'  => 'root',
    'password'  => 'root',
    'charset'   => 'utf8',
    'collation' => 'utf8_unicode_ci',
    'prefix'    => '',
  ),
~~~

Next, we’ll need to create and run a Laravel migration. Migrations are created by running the `migrate` artisan command. From the terminal:

~~~bash
php artisan migrate:make create_airplanes_table
~~~

This will create a new migration file for us that gets placed into app/database/migrations. Let’s build a schema in that file.

~~~php
// app/database/migrations/[date]_create_migrations_table.php

use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class CreateAirplanesTable extends Migration {

  /**
  * Run the migrations.
  *
  * @return void
  */
  public function up()
  {
    Schema::create('airplanes', function($table)
    {
      $table->increments('id');
      $table->string('registration');
      $table->string('operator');
      $table->string('manufacturer');
      $table->string('type');
      $table->timestamps();
    });
  }

  /**
  * Reverse the migrations.
  *
  * @return void
  */
  public function down()
  {
    Schema::dropIfExists('airplanes');
  }
}
~~~

This migration class has two methods, `up` and `down`. Which will be run with the `migrate` command in the terminal. Within the `up` method, we are using Laravel’s schema builder to name the table and fields, along with their types. As you can see, we create an `id` field that auto-increments itself. We also add fields to hold the four properties we specified for our airplanes in the `airplanes.json` file. Finally, we add `timestamps` which will give us `created_at` and `updated_at` fields. The `down` method will be called when we run a rollback and will simply drop the table.

Now that the migration file is complete, let’s run it. From the terminal:

~~~bash
php artisan migrate
~~~

You should now see a message that the migration was run successfully.

## Seeding the Database

Now that our table and schema are in place, let’s populate the database with the same data that we had in Part 1. The best way to do this is to use Laravel’s database seeding utility. The Laravel install comes with a `DatabaseSeeder` class already created which we can work from in this case.

~~~php
class DatabaseSeeder extends Seeder {

    /**
    * Run the database seeds.
    *
    * @return void
    */
    public function run()
    {
        Eloquent::unguard();

        $this->call('AirplanesTableSeeder');
    }

}

class AirplanesTableSeeder extends Seeder {

  /**
  * Run the database seeds.
    *
    * @return void
  */
  public function run()
  {
    Eloquent::unguard();

    $airplanesTable = DB::table('airplanes');

    $airplanesTable->delete();

    $airplanesTable->insert(array(
      'registration' => 'C-FNND',
      'operator' => 'Air Canada',
      'manufacturer' => 'Boeing',
      'type' => '777-200',
      'created_at' => new DateTime(),
      'updated_at' => new DateTime()
    ));

    $airplanesTable->insert(array(
      'registration' => 'PH-BFW',
      'operator' => 'KLM Royal Dutch Airlines',
      'manufacturer' => 'Boeing',
      'type' => '747-400',
      'created_at' => new DateTime(),
      'updated_at' => new DateTime()
    ));

    $airplanesTable->insert(array(
      'registration' => 'N124US',
      'operator' => 'US Airways',
      'manufacturer' => 'Airbus',
      'type' => 'A320-200',
      'created_at' => new DateTime(),
      'updated_at' => new DateTime()
    ));

    $airplanesTable->insert(array(
      'registration' => 'A6-EEU',
      'operator' => 'Emirates',
      'manufacturer' => 'Airbus',
      'type' => 'A380-800',
      'created_at' => new DateTime(),
      'updated_at' => new DateTime()
    ));

    $airplanesTable->insert(array(
      'registration' => 'VH-LQL',
      'operator' => 'Qantas',
      'manufacturer' => 'Bombardier',
      'type' => 'DHC-8-400',
      'created_at' => new DateTime(),
      'updated_at' => new DateTime()
    ));
  }
} 
~~~

In this single file we have two classes, the existing `DatabaseSeeder` class, and our newly created `AirplanesTableSeeder` class. We really should put `AirplanesTableSeeder` into its own file, but since our project is small, this is fine for now. In `DatabaseSeeder` we are calling the `AirplanesTableSeeder` class in the run method. Within the `AirplanesTableSeeder` class we are simply inserting some data into our `airplanes` table. If you’re wondering why we are deleting the `airplanes` table at the start, it’s because it will allow us to refresh the table each time we run the seed. If, for instance, we wanted to add to the seeder in the future, when we run it again, the existing data will be deleted and then repopulated so that we can ensure we don’t have duplicates.

Let’s run the seed. From the terminal:

~~~bash
php artisan db:seed
~~~

If you check the database, you should now see all of our airplane data there.

## Creating the Airplanes Controller

Now that our data is in place, let’s create a controller so that we can gain access to it. We can generate a controller from the command line:

~~~bash
php artisan controller:make AirplanesController --only=show
~~~

This will create a resourceful controller for us. By default, resourceful controllers come with many methods that allow us to build a full RESTful API. In this case though, we only need one method, `show`, which we can single out using `--only` in the command.

By default, the show method is setup to accept a single argument, `$id`, which can be used to search for a specific record in the database. In our case, we’ll need to use the `LIKE` operator to search for records that are similar to a term that we pass in, so let’s change the controller up a bit to reflect that.

~~~php
// app/controllers/AirplanesController.phpfeature_image: typeahead1-cover.png

class AirplanesController extends \BaseController {

  /**
  * Display the specified resource.
  *
  * @param  string  $term
  * @return Response
  */
  public function show($term)
  {

  }
}
~~~

In the case of our typeahead we will want the search to look at all the attributes of the airplanes. Let’s adjust our controller to return JSON data for any records matching up to our query.

~~~php
// app/controllers/AirplanesController.php

public function show($term)
{
  $airplanes = DB::table('airplanes')
    ->where('registration', 'LIKE', '%' . $term . '%')
    ->orWhere('operator', 'LIKE', '%' . $term . '%')
    ->orWhere('manufacturer', 'LIKE', '%' . $term . '%')
    ->orWhere('type', 'LIKE', '%' . $term . '%')
    ->get();

  return Response::json($airplanes, 200);
}
~~~

Here we say that we want to look in the `airplanes` table and return records where `registration`, `operator`, `manufacturer`, or `type` are `LIKE` the search term. For those records that match, we return a JSON response along with an HTTP status code of 200.

## Adding in the Routes

For this small demo we are working in a RESTful manner by utilizing a resource for our `AirplanesController`, so we are actually building out a small API. This means that we’ll need to have our `routes.php` file respond a bit differently than if we were simply wanting to serve a view when we navigate to a given route. For this we will use route grouping and route resources.

~~~php
// app/routes.php

Route::group(array('prefix'=>'api'), function()
{
  Route::resource('airplanes', 'AirplanesController', array('only' => 'show'));
});
~~~

It is best if we prefix our API routes with something unique so that these routes can be differentiated from other routes that serve views. As you can see above, we use `Route::group` and pass in a prefix. This group can hold any of our resource routes and their respective controllers. Within our API group we define a route resource for the `airplanes` endpoint and specify that it should use our `AirplanesController`. Further, we tell the resource that the only method from this controller that it needs to worry about is `show`.

This resource can now be accessed by its URL at `localhost:8000/api/airplanes/{airplanes}`. Our `show` method expects `$term` as its only argument, and this is retrieved from the end of the URL. For example, if we were to navigate to `localhost:8000/api/airplanes/qan`, we would see an array with a JSON object for the record in our database belonging to the Qantas DHC-8-400. Our controller takes the text at the end of the URL, looks up records that are like that text (as we defined in our `show` method), and returns the JSON result.

## Adjusting the Front-End

Now that the airplanes data is in a database and can be looked up from the back-end, we need to adjust the front-end Angular controller and view to respond to this change.

In Part 1, since we were looking up data from our static JSON file, we just needed to put that data on scope and tell the typeahead directive to look at it for matches. Since we are now making an HTTP request to a server dynamically, we need to create a function to handle this.

~~~js
// public/scripts/airplanesCtrl.js

'use strict';

angular
  .module('airplanesApp')
  .controller('AirplanesCtrl', function($scope, $http) {

  $scope.getAirplane = function(term) {
    return $http.get('api/airplanes/' + term).then(function(data) {
      return data.data;
    });
  };

});
~~~

Here we create a new function called `getAirplane` that will return an `$http.get` request to our API. Notice here that we’ve used Angular’s `then` method instead of `success`. This method will return an object that has a property called `data`, and on this property will reside the data passed back from the server. By returning `data.data`, we give typeahead access to the results of querying the database.

Next, let’s adjust the input element in our view so that the typeahead directive will run this function when we type.

~~~html
<input
  type="text"
  class="form-control"
  ng-model="selectedAirplane"
  typeahead="airplane as airplane.registration for airplane in getAirplane($viewValue) | filter:$viewValue | limitTo:3"
  placeholder="Search for an airplane"
  typeahead-template-url="templates/airplane-tpl.html"
>
~~~

Passing `$viewValue` into the `getAirplane` function allows it to use whatever we type as the search term.

## Wrapping up

That’s it! The typeahead should once again be populating a dropdown list, but this time the results are coming from a database and not a static file. Angular and Laravel, with help from UI Bootstrap, really make it easy to create a dynamic typeahead. Adding one to your site or app will be a nice addition and will give your users a great experience.