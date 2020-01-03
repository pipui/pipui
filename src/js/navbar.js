$(function(){
	$('html').on('click', 'body', function(e){

		var target = $(e.target);

		var sub = target.closest('.nav-submenu');

		var trigger = target.closest('.nav-sub');

		if(!sub.length && !trigger.length){
			$('.navbar .nav-submenu.active, .navbar .nav-sub.active').removeClass('active left-pos right-pos');
		}else if(trigger.length){
			var current = trigger.closest('.nav-li');

			$('.navbar .nav-li').each(function(){
				var that = $(this);
				if(that.is(current)){ return; }

				that.find('.nav-submenu.active, .nav-sub.active').removeClass('active left-pos right-pos');
			});
		}
	});

	$('body').on('click', '.navbar .nav-sub', function(e){
		e.preventDefault();

		var that = $(this);

		var el = that.attr('data-nav');

		var submenu = $('.nav-submenu'+el);

		var navbar = that.closest('.navbar');

		var left = e.pageX-navbar.offset().left;

		var right = navbar.outerWidth() - left;

		if(!that.hasClass('active')){
			if(left>right){
				submenu.addClass('right-pos');
			}else{
				submenu.addClass('left-pos');
			}
		}else{
			submenu.removeClass('left-pos right-pos');
		}

		submenu.toggleClass('active');
		that.toggleClass('active');
	}).on('click', '.navbar .navbar-wrapper .nav-mobile', function(e){
		e.preventDefault();

		$(this).closest('.navbar').toggleClass('open');
	});
});