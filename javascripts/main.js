(function() {
	var drag = document.getElementById('draggable');
	var body = document.getElementsByTagName('body')
	var dragging = null;

	drag.onmousedown = function(ev) {
		var el = ev.target,
				x = ev.x,
				y = ev.y;
		// dragging = setInterval(function() {
			el.style.left = x + 'px';
			el.style.top = y + 'px';
			console.log('drag')
		// }, 100);
	};

	body.onmouseup = function(ev) {
		clearInterval(dragging);
		dragging = null;
		console.log('stop')
	}

})();