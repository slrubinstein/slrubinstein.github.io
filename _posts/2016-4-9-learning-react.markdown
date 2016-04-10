---
layout: post
title:  "Learning React"
date:   2016-4-9 6:16:10
categories: blog
---
Last fall my team at work began to experiment with React and Flux while building two new web apps. Different developers attacked each app and everyone on the team was new to React. So the result was two slightly different styles and a slightly confused understanding of React/Flux best practices.

This past week I started React Study Group at work with the intention of strengthening our knowledge of React and learning some new tricks. The plan is to meet twice a week for five weeks with eight of my colleagues. We are loosely following [React Essentials][react-essentials] by Artemij Fedosejev and building the app described in the book, Snapterest. We are also gathering other helpful blogs, videos, and resources from the web.

As I prepare for each class I am attempting to write up my notes here as well. Hopefully after five weeks I will have a helpful guide to learning React!

So here's Topic #1:

Why Use React?

[Facebook][facebook-why-react] has some answers. I also like this more measured explanation of React from [Andrew Ray][stupid-people]. For a full-throated endorsement of React check out [this video from Pete Hunt][pete-hunt-video].

I'll focus on a few of the points in the above links.

**React is Reactive** - when the data changes, your UI changes. And you don't even have to think about how it will change, because React worries about that for you. (See Virtual DOM in a future post.)

**React is declarative**. I am not going to write a detailed explanation of the difference between declarative and imperative programming because I will get it wrong. My understanding (which is confirmed in at least one Stack Overflow post) is that declarative programming describes what you want to happen as opposed to line by line instructions on how to make it happen. In React you see this in a Component's render method.

Take this completely out of context example from [Facebook's React Tutorial][facebook-react-tutorial].
(Note: the HTML-y Javascript-y syntax is JSX - again, will be covered in a future post.)

{% highlight html %}
render: function() {
  return (
    <div className="commentBox">
      <h1>Comments</h1>
      <CommentList data={this.state.data} />
      <CommentForm onCommentSubmit={this.handleCommentSubmit} />
    </div>
  );
}
{% endhighlight %}

Without knowing anything else about the app or this component, I bet you can come up with a pretty good idea of what it will render: A list of comments with a form to submit a comment on the bottom. Yup, that's right!

It is saying, render these elements onto the DOM and feed them this data. Always knowing where to look for the eventual HTML is very helpful, and I consider it a huge advantage when writing React (and reading another developer's React code). It makes a component very easy to reason about. (Compare this to Backbone where you may have a view that knows about a model and has several partial templates and then a series of jQuery that will change them. That's a lot to keep in your head.)

**React Components are composable**. You can write, say, a dropdown component and use it elsewhere in your React app quite easily. Facebook has a great explanation of [React's composability here][facebook-composability]. Of course you can write a reusable component with jQuery or in Backbone or in Angular. But React naturally separates your UI into a bunch of components so I suggest the process is much easier in React.

So those are a few reasons why it might be worth dipping a toe into the React waters. Next I'll cover some React-specific topics such as JSX and the Virtual DOM.

[react-essentials]:		http://reactessentials.com/
[facebook-why-react]:	https://facebook.github.io/react/docs/why-react.html
[stupid-people]: http://blog.andrewray.me/reactjs-for-stupid-people/
[pete-hunt-video]: https://www.youtube.com/watch?v=-DX3vJiqxm4
[facebook-react-tutorial]: https://facebook.github.io/react/docs/tutorial.html
[facebook-composability]: https://facebook.github.io/react/docs/multiple-components.html