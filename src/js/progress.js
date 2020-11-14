pipui.addModule('progress', '1.0.0');

pipui.progress = {
	defaultBorderSize: 12,
	defaultBorderPadding: 3,
	defaultBackgroundColor: '#000',
	defaultBorderColor: '#fff',

	init: function(selector){
		var elements = document.querySelectorAll(selector);

		if(!elements){ return false; }

		var length = elements.length;

		for(let i = 0; i < length; i++){
			if(typeof elements[i] == 'undefined'){ continue; }
			pipui.progress.draw(elements[i]);
		}

		return true;
	},

	draw: function(e){
		var context = e.getContext('2d');

		context.clearRect(0, 0, e.width, e.height);

		var borderSize = parseInt(e.getAttribute('data-border-size'));
		var borderColor = e.getAttribute('data-border-color');
		var borderPadding = parseInt(e.getAttribute('data-border-padding'));
		var backgroundColor = e.getAttribute('data-background-color');
		var radius = parseFloat(e.getAttribute('data-radius'));

		if(isNaN(borderSize)){ borderSize = pipui.progress.defaultBorderSize; }
		if(isNaN(borderPadding)){ borderPadding = pipui.progress.defaultBorderPadding; }
		if(isNaN(radius)){ radius = 0; }

		borderPadding *= 2;

		var half = (e.width - borderSize) / 2;

		var margin = half + (borderSize / 2);

		var start = Math.PI * 1.5;

		backgroundColor = typeof backgroundColor != 'string' ? pipui.progress.defaultBackgroundColor : backgroundColor;
		borderColor = typeof borderColor != 'string' ? pipui.progress.defaultBorderColor : borderColor;

		context.beginPath();
		context.strokeStyle = backgroundColor;
		context.lineWidth = borderSize;
		context.arc(margin, margin, half, 0, Math.PI * 2, false);
		context.stroke();

		var end = start + (3.6 * radius * (Math.PI / 180));

		context.beginPath();
		context.shadowColor = borderColor;
		context.shadowBlur = borderPadding/2 - 1;
		context.strokeStyle = borderColor;
		context.lineWidth = borderSize - borderPadding;
		context.arc(margin, margin, half, start, end, false);
		context.stroke();

		var timer = parseInt(e.getAttribute('data-timer'));

		if(!isNaN(timer)){
			setTimeout(function(){ pipui.progress.draw(e); }, timer);
		}

		return context;
	}
};

$(function(){
	pipui.progress.init('.progress-radial > .bar');
});