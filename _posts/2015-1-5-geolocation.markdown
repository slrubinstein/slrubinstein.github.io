---
layout: post
title:  "Snaproom, Geolocation, and the Game of Life"
date:   2015-1-5 7:18:00
categories: blog
---

My co-programmer <a href="http://navidk-programming.appspot.com/" targe="_blank">Navid</a> and I had a lot of fun and interesting challenges when building <a href="https://snaproom.me" target="_blank">Snaproom</a>. What is a Snaproom? Well it's a temporary, geolocated virtual collaboration space. Maybe we should break that down a bit. 

Temporary - the rooms self-destruct after a specified amount of time. 

Geolocated - you only see and join rooms that are in your immediate area.

Collaboration - we use real-time communication with websockets to allow anyone in the room to communicate and update the room's state. Kind of like a simplified google doc.

Why all these limitations? Why not a Permroom, where you can communicate with people all over the world for limitless amounts of time? Well we felt like those technologies exist and are doing just fine. A Snaproom is meant to be ephemeral. It is not meant for saving things in a database longterm. Its best use cases are voting on where to go to lunch or playing a simple game. Because you are not submitting anything personal or private, it's also really easy to use. You don't need to login or come up with a unique username or even give us your email address. You can just log on and get down to business.

I want to write a little about the geolocation, because it allowed us to play with some new technology and surprised us with some interesting obstacles. Modern web browsers (unmodern web browsers, you know who you are) support HTML5's geolocation API. If you ever see a little pop-up on your computer or phone's browser, saying something like "'http://snaproom.herokuapp.com' would like to use your current location", that site is probably using the geolocation API. Because of privacy concerns, the user generally must give permission before their position is calculated.

I won't go into too much detail on how it works under the hood, but <a href="http://diveintohtml5.info/geolocation.html" target="_blank">here is an article from diveintohtml5 I found useful</a>. For Snaproom, as soon as you open up the page (and grant your permission of course), the geolocation API is called. 

The geolocation API returns an object with a bunch of data related to the user's location. Play along at home! Copy and paste this into your console (cmd-opt-i if you are on a Mac and on Chrome, and click 'console').

{% highlight javascript %}

navigator.geolocation.getCurrentPosition(function(data) {console.log(data)})
{% endhighlight %}

First, your browser should ask your permission. And if you grant it, a few seconds later it should print an object called Geoposition, which includes your latitude and longitude. Here is the function in our Angular Service that makes the call (and uses $q to return a promise to our controller):

{% highlight javascript %}

function getLocation() {
  var deferred = $q.defer();
  var geoData = {}
  // call the geolocation API
  navigator.geolocation.getCurrentPosition(function(position) {
    // callback to save the data we want
    geoData.geoLocated = true;
    geoData.lat = position.coords.latitude;
    geoData.lon = position.coords.longitude;
    // when the promise resolves, return our geoData object with lat and long
    deferred.resolve(geoData);
  }, 
    function(error) {
    deferred.reject("error")  
  });
  // return the promise to the controller
  return deferred.promise;
}
{% endhighlight %}

Simple enough, right? So our first plan was simply take the latitude and longitude, shave it down to a reasonable number of decimals (in our case, 2), and that's your 'geoRoom' - the room where you are able to see, create, and join Snaprooms. Patting ourselves on the back, we merrily went on our way-

-until I was noodling around with Snaproom in the hallway and noticed I couldn't see a room Navid had just created. It turns out this was a little more complicated than we thought. Depending on if you are using your computer or your phone, the geolocation API will use different methods to find your location. Phones can take advantage of their GPS (which is generally quicker). If you are on your computer, then <a href="https://www.mozilla.org/en-US/firefox/geolocation/" target="_blank">according to this article on Mozilla</a>, your location is found by using Google Location Services, which looks at your computer's IP address, nearby wireless access points, and some google magic.

I am no expert on this- but here's what it meant practically for our app. Due to the variance in accuracy between the computer and the phone, it would be very possible for me to be on the other side of the geoRoom line from my computer - while sitting at my computer! 

<img class="blog-pic-small" src="/images/georoom-sad.png" alt="Sadness reigns as we are in different geoRooms">

Because a user is only in one geoRoom at a time, I would be unable to join the same room on my computer and phone in this situation.

Our solution came to us when reflecting on a past project, <a href="http://en.wikipedia.org/wiki/Conway%27s_Game_of_Life" target="_blank">Conway's Game of Life</a>. Briefly, the Game of Life is a game of evolution, where squares live or die based on their neighbor squares. We decided to treat geoRooms like Game of Life squares and create neighbors. So instead of placing our users in a geoRoom, we placed them in a geoArray of 9 geoRooms. Now all their activity is broadcast to every geoRoom in the geoArray, and to enter a room you only need to be in one geoRoom of the room's geoArray.

<img class="blog-pic-small" src="/images/georoom-happy.png" alt="Happy to be in a geoRoom with you">

This is how we create the geoArray.

{% highlight javascript %}
	// geoData is an object that holds the latitude and longitude

function makeGeoRoomArr(geoData) {
  var latToHundrethPlace = geoData.lat.toFixed(2); 
  var lonToHundrethPlace = geoData.lon.toFixed(2);

  var latLonArr = [];

  var northernLat = (Number(latToHundrethPlace) + .01).toFixed(2);
  var southernLat = (Number(latToHundrethPlace) - .01).toFixed(2);
  var easternLon = (Number(lonToHundrethPlace) + .01).toFixed(2);
  var westernLon = (Number(lonToHundrethPlace) - .01).toFixed(2);
  // push the surrounding geoRooms into a geoArray
  latLonArr.push(latToHundrethPlace + lonToHundrethPlace);
  latLonArr.push(northernLat + westernLon);
  latLonArr.push(northernLat + lonToHundrethPlace);
  latLonArr.push(northernLat + easternLon);
  latLonArr.push(latToHundrethPlace + westernLon);
  latLonArr.push(latToHundrethPlace + easternLon);
  latLonArr.push(southernLat + westernLon);
  latLonArr.push(southernLat + lonToHundrethPlace);
  latLonArr.push(southernLat + easternLon);

  return latLonArr;
}
{% endhighlight %}

So this does make our database call a little heavier. Instead of checking one property whenever a room is created or destroyed, our query must sift through a 9-item array. It still seems pretty damn fast though, and until we hit those million users we may not even notice a different.