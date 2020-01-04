$(function(){
	$('html').on('click', 'body', function(e){

		var target = $(e.target);

		var trigger = target.closest('.nav-sub');

		var li = trigger.closest('.nav-li');

		if(!trigger.length){
			$('.navbar .nav-submenu.active, .navbar .nav-sub.active').removeClass('active left-pos right-pos');
		}else{
			var navbar = target.closest('.navbar');

			$('.navbar').not(navbar).find('.nav-sub.active, .nav-submenu.active').removeClass('active left-pos right-pos');

			li.siblings('.nav-li').not(li).find('.nav-sub.active, .nav-submenu.active').removeClass('active left-pos right-pos');
		}
	});

	$('body').on('click', '.navbar .nav-sub', function(e){
		e.preventDefault();

		var that = $(this);

		var submenu = that.closest('.nav-li').children('.nav-submenu');

		var navbar = that.closest('.navbar');

		var left = e.pageX-navbar.offset().left;

		var right = navbar.outerWidth() - left;

		if(!that.hasClass('active')){
			if(left>right){
				submenu.addClass('right-pos');
			}else{
				submenu.addClass('left-pos');
			}

			that.addClass('active');
			submenu.addClass('active');
		}else{
			that.removeClass('active');
			submenu.removeClass('active left-pos right-pos');
			submenu.find('.nav-submenu.active, .nav-sub.active').removeClass('active');
		}

	}).on('click', '.navbar .navbar-wrapper .nav-mobile', function(e){
		e.preventDefault();

		$(this).closest('.navbar').toggleClass('open');
	});
});