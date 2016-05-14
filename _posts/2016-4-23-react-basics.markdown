---
layout: post
title:  "React Basics"
date:   2016-4-23 6:16:10
categories: blog
---
In my last post I wrote about some of reasons you might want to consider using React for a project. This time I'd like to write about a couple basic React concepts: Props and State.

Props and state are these two special properties that come with all of your React components. 

**Props** are properties passed down from parent component to child component as an html property. You can access them in the child via `this.props`:

{% highlight html %}
// Parent component
render: function() {
  return (
    <Child cat="Winter" />
  );
}

// Child component
render: function() {
  return (
    <p>My cat's name is {this.props.cat}</p>
  );
}
{% endhighlight %}
<section class="blog__example">
  My cat's name is Winter
</section>

**State** is data related to the component and will inform how the component looks when rendered. State can be updated with a component's `setState` method. Calling `setState` will trigger the render function automatically. For example:

{% highlight html %}
var Counter = React.createClass({
  getInitialState: function() {
    return {
      count: 1
    };
  },

  increaseCount: function() {
    var count = this.state.count + 1;

    this.setState({
      count: count
    });
  },

  render: function() {
    return (
      <div>
        <p>Count: {this.state.count}</p>
        <button onClick={this.increaseCount}>+</button>
      </div>
    );
  }
});
{% endhighlight %}

<section class="blog__example">
  <div id="react-state-example"></div>
</section>

<script type="text/javascript">
"use strict";

var Counter = React.createClass({
	displayName: "Counter",

	getInitialState: function getInitialState() {
		return {
			count: 0
		};
	},

  increaseCount: function increaseCount() {
		var count = this.state.count + 1;

		this.setState({
			count: count
		});
	},

	render: function render() {
		return React.createElement(
			"div",
			null,
			React.createElement(
				"p",
				null,
				"Count: ",
				this.state.count
			),
			React.createElement(
				"button",
				{ onClick: this.increaseCount },
				"+"
			)
		);
	}
});
ReactDOM.render(React.createElement(Counter, null), document.getElementById("react-state-example"));
</script>

So the count state is related to the Counter component. When you click, it triggers a setState, which in turn triggers a render and displays the new count.

A component's state can also be passed down as a prop to a child component. You will see this pattern in Flux.


{% highlight html %}
// Parent component
var Parent = React.createClass({

  getInitialState: function() {
    return {
      count: 0
    };
  },

  render: function() {
    return (
      <div>
        <p>Count:</p>
        <Child count={this.state.count} />
      </div>
    );
  }
});

// Child component
var Child = React.createClass({

  render: function() {
    return (
      <div>
        <p>{this.props.count}</p>
      </div>
    );
  }
});
{% endhighlight %}

<section class="blog__example">
  <div id="react-state-to-child-example"></div>
</section>

<script type="text/javascript">

var Parent = React.createClass({
	displayName: 'Parent',

	getInitialState: function getInitialState() {
		return {
			count: 0
		};
	},

	render: function render() {
		return React.createElement(
			'div',
			null,
			React.createElement(
				'p',
				null,
				'(Parent) Count:'
			),
			React.createElement(Child, { count: this.state.count })
		);
	}
});

var Child = React.createClass({
	displayName: 'Child',


	render: function render() {
		return React.createElement(
			'div',
			null,
			React.createElement(
				'p',
				null,
				'(Child) ' + this.props.count
			)
		);
	}
});

ReactDOM.render(React.createElement(Parent, null), document.getElementById("react-state-to-child-example"));
</script>

The Parent's state `{count: 0}` is passed down to the Child as a prop. But even more interesting, components can pass callback functions down as props.

In this example, Parent sends down a callback function `increaseCount` to the child component, allowing the child to change its parent's state. Updating state will trigger the parent's render function, which will in turn rerender the child.

{% highlight html %}
// Parent component
var Parent = React.createClass({

  getInitialState: function() {
    return {
      count: 0
    };
  },

  increaseCount: function() {
    var count = this.state.count + 1;

    this.setState({
      count: count
    });
  },

  render: function() {
    return (
      <div>
        <p>(Parent) Count:</p>
        <Child count={this.state.count} increaseCount={this.increaseCount} />
      </div>
    );
  }
});

// Child component
var Child = React.createClass({

  render: function() {
    return (
      <div>
        <p>(Child) {this.props.count}</p>
        <button onClick={this.props.increaseCount}>+</button>
      </div>
    );
  }

});
{% endhighlight %}

<section class="blog__example">
  <div id="react-callback-to-child-example"></div>
</section>

<script type="text/javascript">
var Parent = React.createClass({
  displayName: "Parent",

  getInitialState: function getInitialState() {
    return {
      count: 0
    };
  },

  increaseCount: function increaseCount() {
    var count = this.state.count + 1;

    this.setState({
      count: count
    });
  },

  render: function render() {
    return React.createElement(
      "div",
      null,
      React.createElement(
        "p",
        null,
        "(Parent) Count:"
      ),
      React.createElement(Child, { count: this.state.count, increaseCount: this.increaseCount })
    );
  }
});

var Child = React.createClass({
  displayName: "Child",


  render: function render() {
    return React.createElement(
      "div",
      null,
      React.createElement(
        "p",
        null,
        "(Child) ",
        this.props.count
      ),
      React.createElement(
        "button",
        { onClick: this.props.increaseCount },
        "+"
      )
    );
  }
});
ReactDOM.render(React.createElement(Parent, null), document.getElementById("react-callback-to-child-example"));
</script>

Now when the Child's button is pressed, it calls the `increaseCount` callback passed down from the parent, which updates the Parent's state, triggering a call to render, which in turn rerenders the Child with the new state. Got all that? 

Props and state are essential elements of creating a reactive UI with React!