pipui.alertblock = {
	show: function(element){
		if(typeof element == 'string'){ element = $(element); }

		element.fadeIn('fast');
	},

	hide: function(element){
		if(typeof element == 'string'){ element = $(element); }

		element.fadeOut('fast');
	}
};

$(function(){
	$('body').on('click', '.alertblock .alertblock-close', function(e){
		e.preventDefault();

		pipui.alertblock.hide($(this).closest('.alertblock'));
	});
});