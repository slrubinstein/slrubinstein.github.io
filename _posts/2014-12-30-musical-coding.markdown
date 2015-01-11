---
layout: post
title:  "Musical Coding"
date:   2014-12-30
categories: music jazz-chord-substitutor
---
I studied music thoery and composition in college and found many similarities in thinking about coding and composing. To me, both require laying out structure and rules over an otherwise seemingly chaotic system. Analyzing a four-part Bach chorale can be a dautning task.

(This is where things may get a little technical - also it's been a few years since college so bear with me.) 

![][bach-chorale]

At first glance, you are looking at an endless series of notes moving in random directions at random intervals. But you can simplify the song by segmenting it into phrases. Then you can analyze the movement of the bass notes to get an idea of the underlying chord structures. Those chords can be grouped by their functionality in relation to the phrase - a tonic, which moves to a subdominant, which moves to a dominant, which moves back to a tonic - maybe with some secondary dominants thrown in. Suddenly the harmonies reveal themselves as belonging to chords that move in a predictable manner, and any notes that don't fall in that pattern can be seen as ornamentation. And now you can analyze the chorale.

I feel as though I go through a similar analytical process when coding. Looking at patterns and contextualizing individual lines within the greater program. So I thought it might be fun to combine my interests and write a web app about music.

My advisors at the time recommended designing an app that solves a problem. I remembered the struggle I went through trying to comprehend jazz chords, their endless options of 7ths, 9ths, 13ths, and flipping through a chord book to compare the relationships between all the different substitutions. I wanted to make an app that would bear some of the data load and automatically populate the page with common substitutions, freeing up the player to analyze the relationships and make music.

The app is online at [www.chord-substitutor.herokuapp.com][chord-substitutor], and I would be delighted if you would play around with it. Overall I am pleased with how it turned out, though I knew from the start it would be impossible to encapsulate every possible chord change. Music is just too vast, and there are an infinite number of ways to re-interperet a jazz tune. So I decided to provide the user with the basic substitutions and as clean and simple an interface as I could create. 

Angular allowed me to keep the bulk of the work on the front-end and only rely on the server for saving and loading a user's songs (and some pre-loaded jazz standards). I incorporated [jQuery-UI][jqueryui] for drag-n-drop functionality, which integrated very nicely with Angular by placing all that functionality into custom directives.

{% highlight javascript %}
	// draggable directive
	angular.module('jazzChordApp')
	  .directive('draggable', draggable);

	function draggable() {
	  return {
	    restrict: 'A',
	    link: function(scope, element) {
	    	element.draggable({
	        revert: 'invalid',
	        cursor: 'grabbing',
	        helper: 'clone',
	        zIndex: 10,
	        scope: 'chords',
	        revertDuration: 200
	      });
	    }
	  };
	}
{% endhighlight %}

I also used [Audiolet][audiolet] to work with the web audio API. I think Audiolet may have been a bit heavier than my needs, but it made some things easier. It has a good structure set up to create your tone, group frequencies together into chords, and then play them out on a predictable schedule (your tempo). I noticed if I play chords too often, such as every time a user clicks a new chord (which is what I initially wanted), the browser would slow down and occasionally crash. That may be a result of Audiolet, it may be my laptop is getting old, or maybe the web audio API is just not ready to rock that hard. By letting the user decide how often they want to play back chords, I can hopefully alleviate that issue. And maybe sometime down the line I'll try to write my own, slimmer playback function to see if that improves performance.

Speaking of improving performance, at a later date I'd like to write a little about my struggles to keep the app running at a reasonable speed. Others have noticed, and I agree, that Angular takes a real performance hit when using a large data set. The song in my app is an array made up of measures. Each measure is itself an array made up of beats. Each beat is an object with a few properties that give it a chord name, notes, and frequencies for playback.

{% highlight javascript %}
  // for example...
  var song, measure, beat;
  beat = {
	  type = 'maj7',
	  root = 'C',
	  notes = ['C', 'E', 'G', 'B'],
	  frequencies = [523.25, 659.25, 783.99, 987.77]
  }
  measure = [beat, beat, beat, beat];
  song = [measure, measure, measure];
{% endhighlight %}

So that's a lot of data for Angular to ng-repeat through. In a future post, maybe I'll go into a little more detail about how I dealt with this.

You can view the code [here][github] and again you can play music [here][chord-substitutor]. Happy playing!



[chord-substitutor]:      http://chord-substitutor.herokuapp.com/
[audiolet]:               https://github.com/oampo/Audiolet/
[github]:                 https://github.com/slrubinstein/jazz-chord
[jqueryui]:               http://jqueryui.com/
[bach-chorale]:           http://upload.wikimedia.org/wikipedia/commons/f/f5/BWV739.png