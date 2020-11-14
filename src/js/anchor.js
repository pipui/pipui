pipui.addModule('anchor', '1.0.0');

pipui.anchor = {
	defaultDuration: 400,
	defaultEasing: '',

	goto: function(selector, duration, easing, complete){
		var to = $(selector);

		if(!to.length){ return false; }

		var offset = to.offset();

		if(!offset){ return false; }

		duration = typeof duration == 'undefined' ? pipui.anchor.defaultDuration : parseInt(duration);

		easing = typeof easing == 'undefined' ? pipui.anchor.defaultEasing : easing;

		if(isNaN(duration)){
			duration = pipui.anchor.defaultDuration;
		}

		var scroll = offset.top;

		if(typeof complete != 'function'){
			complete = function(){};
		}

		$('html').animate({
			scrollTop: scroll
		}, duration, easing, complete);
	}
};

$(function(){
	$('body').on('click', '[data-anchor]', function(e){

		var that = $(this);

		var selector = that.attr('data-anchor');

		var hash = that.attr('data-anchor-hash');

		e.preventDefault();

		pipui.anchor.goto(selector, that.attr('data-anchor-duration'), that.attr('data-anchor-easing'), function(){
			if(hash == 'true'){
				location.hash = selector;
			}
		});
	});
});