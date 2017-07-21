---
layout: post
status: publish
published: true
title: 'Laravel PUT Requests: Updating Only Specific Fields'
feature_image: laravel-put-cover.jpg
author_slug: ryan-chenkie
date: '2014-12-23 13:14:28 -0500'
categories:
- Laravel
- REST API
tags:
- Laravel
- PUT
- Eloquent
- REST
- REST API
- Update Specific Value
comments: true
---

Using a `PUT` request to update a record in a database can be tricky when you only want to update the value for a specific field. By default, the `PUT` request will override the entire entry, and this is often undesirable. Support for `PATCH` (used to update a specific field in a record) is increasing, but for various reasons, using it is not always an option. For those times when you need to use `PUT`, there are ways to setup your API so that you can easily update only the specific values you want.

For this example, we’ll use a simple resource controller to illustrate the issue and the fix using a Laravel `PUT` request.

{% include securing-angular-applications.md %}

## The Problem

Consider the following `create` method in a Laravel resource controller that handles adding new Christmas gifts:

~~~php
// app/controllers/GiftsController.php

public function create()
{
  // Get all the input passed to the 
  // controller and save it in a variable called $gift
  $gift = Input::all();

  // Use Eloquent to create a new record with the gift data
  Gift::create(
    array(
      'type' => $gift['type'],
      'description' => $gift['description'],
      'gender' => $gift['gender'],
      'price' => $gift['price']   
  ));
}
~~~

Because we are using Eloquent here, this controller assumes that we have a `Gift` model setup.

~~~php
// app/models/Gift.php

class Gift extends Eloquent {

  // Tell the model which table it is to use
  protected $table = "gifts";

  // Mass-assignment protection prevents fields 
  // from being filled by default. Tell the model which 
  // fields are fillable.
  protected $fillable = array('type', 'description', 'gender', 'price');      
}
~~~

When this endpoint is hit with some data, all of the fields will need to be populated with something or else an error will be thrown. Of course, this behavior is what we’re after in a `store` method, so that is fine. However, what if we want to update an existing record? A start at our `update` method might look something like this:

~~~php
// app/controllers/GiftsController.php

public function update($id)
{
  $gift = Input::all();

  // Use Eloquent to grab the gift record that we want 
  // to update, referenced by the ID passed to the REST endpoint
  $giftUpdate = Gift::find($id);

  $giftUpdate->type = $gift['type'];
  $giftUpdate->description = $gift['description'];
  $giftUpdate->gender = $gift['gender'];
  $giftUpdate->price = $gift['price'];

  $giftUpdate->save();      
}
~~~

On the surface, this seems like it would be fine. We find the gift we want to update and call it `$giftUpdate`. We then set the various properties of it to correspond to the new data passed to the API. However, what if whatever is used to communicate with the API doesn’t pass a key and value for every property? There are various reasons this situation might happen, and if it does, the method will fail.

## Fix #1: Set a Default Value

In Javascript the `OR` operator can be used to set default values. For example:

~~~js
var giftType = gift.type || "toy";
~~~

In this little example, the value of `giftType` is set to the `type` property on some `gift` object unless there isn’t anything for the property, in which case it will be set to the string `"toy"`.

In PHP however, using the `OR` operator in this fashion would result in a boolean being returned. What we can do instead is use the ternary operator to set default values. In our earlier update method, this would look like:

~~~php
public function update($id)
{
  // Grab our Input as individual variables so they are easier to work with
  $type = Input::get('type');
  $description = Input::get('description');
  $gender = Input::get('gender');
  $price = Input::get('price');

  // Use Eloquent to grab the gift record that we want to update,
  // referenced by the ID passed to the REST endpoint
  $gift = Gift::find($id);

  $gift->type = $type ? $type : $gift->type;
  $gift->description = $description ? $description : $gift->description;      
  $gift->gender = $gender ? $gender : $gift->gender;      
  $gift->price = $price ? $price : $gift->price;

  $gift->save();      
}
~~~

Here we have set our various pieces of input to variables so that our ternary operator can be a bit cleaner. Taking the gift `type` for example, essentially what we’re saying with our ternary operator is “update the gift record’s `type` field with the value of what is on the `$type` variable if it is defined (the `?` ‘asking’ if `$type` is defined). If it isn’t defined, set it to what was already in the type field for that record (the `:` stating ‘otherwise’)”.

Setting default values is somewhat useful, but can be problematic in some situations. For example, what if the user wants to set a certain value to be empty? With the method above, the existing value in the database would be preserved and the user would not be able to set it as empty. Thankfully Laravel offers a method that takes care of this and is even easier to use.

## Fix #2: Eloquent’s Fill Method

Laravel’s Eloquent ORM has a method called `fill` which accepts an array and will update the database with new values for only the fields passed in. The nice thing about the `fill` method is that it automatically preserves values that are already stored in the database if you don’t want to update every field when doing a `PUT` request. Implementing it is much simpler than the ternary method:

~~~php
// app/controllers/GiftsController.php

public function update($id)
{
  // Grab all the input passed in
  $data = Input::all();

  // Use Eloquent to grab the gift record that we want to update,
  // referenced by the ID passed to the REST endpoint
  $gift = Gift::find($id);

  // Call fill on the gift and pass in the data
  $gift->fill($data);

  $gift->save();
}
~~~

Unlike the first method which uses the ternary operator, the `fill` method will set a database record to an empty string if the user passes one in. This is useful if the user actually wants a certain field to be empty.

## Wrapping Up

As we’ve seen, `PUT` requests override the entire entry with something new, and this can be undesirable when crafting a RESTful API. A ternary operator that defaults to the original value of the record can be useful for data integrity and to make sure that values aren’t overwritten with blanks. Laravel’s `fill` method offers an even easier way to accomplish this and allows for database entries to be set to empty strings if that is desireable.

Of course there are other ways to ensure we don’t get blanks passed back to the database when handling `PUT` requests. For example, we could have the front-end code pass back all of the already-existing values for anything we don’t want to change. However, if we ever extend the API out to take data from somewhere other than a front-end that we are responsible for, we can’t guarantee what will arrive at the endpoint. As such, our backend code is the last stop and needs to handle things accordinly.

How do these methods of handling `PUT` requests on the backend feel? Do you have a preferred method of updating only specific values in a record when working with `PUT` requests?