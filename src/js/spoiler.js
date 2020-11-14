pipui.addModule('spoiler', '1.0.0');

pipui.spoiler = {
	show: function(e){

		e = (typeof e == 'string') ? $('.spoiler'+e) : e;

		var len = e.length;

		if(!len){ return this; }

		if(!e.length){ return this; }

		e.slideDown('fast', function(){
			$(this).addClass('active');
		});

		return this;
	},

	hide: function(e){

		e = (typeof e == 'string') ? $('.spoiler'+e) : e;

		var len = e.length;

		if(!len){ return this; }

		if(!e.length){ return this; }

		e.slideUp('fast', function(){
			$(this).removeClass('active');
		});

		return this;
	},

	toggle: function(e){

		e = (typeof e == 'string') ? $('.spoiler'+e) : e;

		var len = e.length;

		if(!len){ return this; }

		if(!e.length){ return this; }

		e.slideToggle('fast', function(){
			$(this).toggleClass('active');
		});

		return this;
	},

	showAll: function(){
		$('.spoiler').slideDown('fast', function(){
			$(this).addClass('active');
		});

		return this;
	},

	hideAll: function(){
		$('.spoiler').slideUp('fast', function(){
			$(this).removeClass('active');
		});

		return this;
	}
};

$(function(){
	$('body').on('click', '[data-spoiler]', function(e){
		e.preventDefault();

		var that = $(this);
		var target = that.attr('data-spoiler');

		if(typeof target == 'undefined' || $.trim(target) == ''){ target = that.attr('href'); }

		if(target){
			pipui.spoiler.toggle(target);
		}
	}).on('click', '[data-spoiler-show], [data-spoiler-hide]', function(e){
		e.preventDefault();

		var that = $(this);

		var show = that.attr('data-spoiler-show');
		var hide = that.attr('data-spoiler-hide');

		var is_show = typeof show != 'undefined';

		var target = that.attr(is_show ? show : hide);

		if(typeof target == 'undefined' || $.trim(target) == ''){ target = that.attr('href'); }

		if(target){
			if(is_show){
				pipui.spoiler.show(target);
			}else{
				pipui.spoiler.hide(target);
			}
		}
	}).on('click', '.accordion > .accordion-id > .accordion-trigger', function(e){
		e.preventDefault();

		var that = $(this);

		var accordion = that.closest('.accordion');

		accordion.children('.accordion-id.active').children('.accordion-target').slideUp('fast', function(){
			$(this).closest('.accordion-id').removeClass('active');
		});

		var item = that.closest('.accordion-id');

		if(item.hasClass('active')){
			item.children('.accordion-target').slideUp('fast', function(){
				item.removeClass('active');
			});
		}else{
			item.children('.accordion-target').slideDown('fast', function(){
				item.addClass('active');
			});
		}
	});
});