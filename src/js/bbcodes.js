$(function(){
	$('body').on('click', '.bb-spoiler-wrapper > .bb-spoiler > .bb-spoiler-trigger', function(e){
		e.preventDefault();

		var that = $(this);

		if(that.attr('data-bb-disabled')=='true'){ return; }

		that.attr('data-bb-disabled', 'true');

		var spoiler = that.closest('.bb-spoiler');

		spoiler.children('.bb-spoiler-text').slideToggle('fast', function(){
			that.attr('data-bb-disabled', 'false');

			spoiler.toggleClass('open');
		});
	});
});