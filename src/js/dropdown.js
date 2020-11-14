pipui.addModule('dropdown', '1.0.0');
p.required('dropdown', 'base', '1.4.0', '>=');

pipui.dropdown = {
	toggle: function(e){
		if(!e.length){ return false; }

		var dropdown = e.find('.dropdown-target:first');

		if(!dropdown.length){ return false; }

		if(dropdown.is(':visible')){
			pipui.dropdown.hide(e);
		}else{
			pipui.dropdown.show(e);
		}
	},

	show: function(e){
		if(!e.length){ return false; }

		e.addClass('active');

		var trigger = e.find('.dropdown-trigger:first');

		if(e.attr('data-dropdown-placement') == 'auto'){
			if(pipui.top_space(trigger) > pipui.bottom_space(trigger)){
				e.attr('data-dropdown-y', 'top');
			}else{
				e.attr('data-dropdown-y', 'bottom');
			}

			if(pipui.left_space(trigger) > pipui.right_space(trigger)){
				e.attr('data-dropdown-x', 'left');
			}else{
				e.attr('data-dropdown-x', 'right');
			}
		}

		trigger.addClass('active');
	},

	hide: function(e){
		if(!e.length){ return false; }

		e.removeClass('active');

		e.find('.dropdown.active, .dropdown-trigger.active').removeClass('active');
	}
};

$(function(){
	$('body').on('click', '.dropdown > .dropdown-trigger', function(e){
		e.preventDefault();

		pipui.dropdown.toggle($(this).closest('.dropdown'));
	});

	$('html').on('click', 'body', function(e){
		var target = $(e.target).closest('.dropdown:not(.dropdown-submenu)');

		$('.dropdown.active').each(function(){
			var that = $(this);

			var parent = that.closest('.dropdown:not(.dropdown-submenu)');

			if(!parent.is(target)){
				parent.removeClass('active');
				parent.find('.dropdown.active, .dropdown-trigger.active').removeClass('active');
			}
		});
	});
});