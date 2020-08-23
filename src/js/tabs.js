pipui.tabs = {
	active: function(id){
		if(typeof id != 'string'){
			return false;
		}

		var link = $('.tabs > .tab-links .tab-link[data-id="'+id+'"]');

		var tab = $('.tabs > .tab-list > .tab-id'+id);

		if(link.hasClass('active') && tab.hasClass('active')){
			return false;
		}

		var tabs = link.closest('.tabs');

		tabs.children('.tab-links').find('.tab-link.active').removeClass('active');

		tabs.children('.tab-list').children('.tab-id.active').removeClass('active');

		link.addClass('active');
		tab.addClass('active');

		return true;
	}
};

$(function(){
	$('body').on('click', '.tabs > .tab-links .tab-link:not([data-link])', function(e){
		e.preventDefault();

		pipui.tabs.active($(this).attr('data-id'));
	});
});