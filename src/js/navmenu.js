pipui.addModule('navmenu', '1.0.0');

pipui.navmenu = {
	toggle: function(that){

		var item = that.closest('.nav-menu-item');

		var sub = item.children('.nav-sub-menu');

		if(!sub.length){ return false; }

		if(sub.is(':visible')){
			that.removeClass('active');
		}else{
			that.addClass('active');
		}

		sub.slideToggle('fast', function(){
			var self = $(this);

			if(self.is(':hidden')){
				item.removeClass('active');
			}else{
				item.addClass('active');
			}
		});
	}
};

$(function(){
	$('body').on('click', '.nav-menu .nav-menu-link.nav-menu-toggle', function(e){
		e.preventDefault();

		pipui.navmenu.toggle($(this));
	});
});