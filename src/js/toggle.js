pipui.addModule('toggle', '1.0.0');

$(function(){
	$('body').on('click', '[data-toggle]', function(e){

		if(e.target.tagName != 'INPUT'){
			e.preventDefault();
		}

		var that = $(this);

		var toggle = that.attr('data-toggle');

		var item = $(toggle);

		if(!item.length){ return; }

		var classToggle = that.attr('data-toggle-class');

		var fade = that.attr('data-toggle-fade');

		if(fade == 'fade'){
			item.fadeToggle('fast', function(){
				if(classToggle){ $(this).toggleClass(classToggle); }
			});
		}else if(fade == 'slide'){
			item.slideToggle('fast', function(){
				if(classToggle){ $(this).toggleClass(classToggle); }
			});
		}else{
			item.toggle(function(){
				if(classToggle){ $(this).toggleClass(classToggle); }
			});
		}
	});
});