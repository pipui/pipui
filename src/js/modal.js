pipui.addModule('modal', '1.0.0');

pipui.modal = {
	open: function(e){
		if(e==''){ return false; }

		e = $('.modal[data-id="'+e+'"]');
		if(!e.length){ return false; }

		e.fadeIn('fast', function(){
			$(this).addClass('active');
		});

		return true;
	},

	close: function(e){
		if(e==''){ return false; }

		e = $('.modal[data-id="'+e+'"]');
		if(!e.length){ return false; }

		e.fadeOut('fast', function(){
			$(this).removeClass('active');
		});

		return true;
	},

	toggle: function(e){
		if(e==''){ return false; }

		e = $('.modal[data-id="'+e+'"]');
		if(!e.length){ return false; }

		e.fadeToggle('fast', function(){
			$(this).toggleClass('active');
		});

		return true;
	}
};

$(function(){
	$('body').on('click', '[data-modal]', function(e){
		if(e.target.tagName != 'INPUT'){
			e.preventDefault();
		}

		var that = $(this);

		var modal = that.attr('data-modal');

		$('.modal').fadeOut('fast');

		if(!modal){ modal = that.attr('href'); }

		if(modal){ pipui.modal.open(modal); }
	}).on('click', '.modal [data-modal-close]', function(e){
		e.preventDefault();

		pipui.modal.close($(this).closest('.modal').attr('data-id'));
	}).on('click', '.modal', function(e){
		var target = $(e.target);
		if(!target.closest('.modal-content').length){
			pipui.modal.close(target.closest('.modal').attr('data-id'));
		}
	});
});