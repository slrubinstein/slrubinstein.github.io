

Our application scaffolding came from the <a href="https://www.npmjs.com/package/generator-angular-fullstack">Angular Fullstack Generator</a>, which has its own built-in method for running sockets. It gives you a syncUpdates function on the front-end, which uses hooks on your MongoDB save and delete processes to emit socket events.

{% highlight javascript %}
var Splitcheckroom = require('./splitcheckRoom.model');

exports.register = function(socket) {
  Splitcheckroom.schema.post('save', function (doc) {
    onSave(socket, doc);
  });
}

function onSave(socket, doc, cb) {
  socket.emit('syncUpdates', doc);
}
{% endhighlight %}

So in this example, whenever something is saved to a Splitcheckroom schema, the server emits 'updateRoom'. On the client side, syncUpdates runs and adds the new database document to whatever DOM element you've synced.

Very easy to use and integrate, but the default option is that everyone on your website hears every single database change. So you may want to tinker with it to limit the flow of information. We did this by adding rooms (read about rooms <a href="http://socket.io/docs/rooms-and-namespaces/" target="_blank">here on Socket.IO's site</a>). Also this only updates data when someone has interacted with the database. 

If you are planning on using sockets with this generator I recommend you read <a href="https://github.com/DaftMonk/generator-angular-fullstack/issues/490" target="_blank">this post on github about limiting the number of hooks registered</a>. There seems to be an issue with attaching listeners onto the general socketio object vs. each individual socket client.

We then decided to exert a bit more control over our sockets by removing them from syncUpdates. One feature we wanted to build was a display for showing you who else is in your Snaproom.

Ok this post was meant to be about organizing sockets but I think I put in a little too much time up front explaining sockets. I'm gonna call it here