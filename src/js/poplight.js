pipui.addModule('poplight', '1.0.0');

pipui.poplight = {
	'overlay_close': true,

	'overlay': function(status){
		var overlay = $('.poplight-overlay');

		if(!overlay.length){
			overlay = $('<div class="poplight-overlay"></div>');
			$('body').append(overlay);
		}

		if(this.overlay_close){
			overlay.addClass('canclose');
		}else{
			overlay.removeClass('canclose');
		}

		setTimeout(function(){
			if(status){
				overlay.addClass('active');
			}else{
				overlay.removeClass('active');
			}
		}, 0);

	},

	'active': function(e){
		if(typeof e == 'string'){ e = $(e); }

		if(!e.length){ return false; }

		this.overlay(true);

		var position = e.css('position');

		var prepos = e.attr('data-poplight-prepos');

		if(typeof prepos != 'undefined'){
			e.attr('data-poplight-prepos', position);
		}

		if(position == 'static'){
			e.css('position', 'relative');
		}

		e.addClass('poplight-box');

		var first = e.first();

		var offset = first.offset();

		var win = $(window);

		var window_width = win.width();
		var window_height = win.height();

		var top = offset.top - (window_height / 2) + (first.outerHeight() / 2);

		$('html').animate({
			scrollTop: top
		}, 500);

		e.each(function(i){
			var self = $(this);

			var msgbox = self.attr('data-poplight-message');

			var id = self.attr('data-poplight-id');

			if(typeof id == 'undefined'){
				id = Math.random();
				self.attr('data-poplight-id', id);
			}

			if(msgbox[0] == '#' || msgbox[0] == '[' || msgbox[0] == '.'){
				msgbox = $(msgbox);
				msgbox.attr('data-poplight-id', id);
			}else{
				var block = $('.poplight-message[data-poplight-id="'+id+'"]');

				if(!block.length){
					msgbox = $('<div class="poplight-message" data-poplight-id="'+id+'"><a href="#" class="poplight-message-close">&times;</a>'+msgbox+'</div>');
					$('body').append(msgbox);
				}else{
					block.html('<a href="#" class="poplight-message-close">&times;</a>'+msgbox);
					msgbox = block;
				}
			}

			var heigth = self.outerHeight();
			var width = self.outerWidth();

			var offset = self.offset();

			var top = offset.top;
			var left = offset.left;
			var right = window_width - (left + width);
			var bottom = window_height - (top + heigth);

			msgbox.removeClass('poplight-top poplight-bottom poplight-left poplight-right');

			if(top > bottom){
				msgbox.css({'top': 'auto', 'bottom': (window_height - top + 8)+'px'}).addClass('poplight-top');
			}else{
				msgbox.css({'bottom': 'auto', 'top': (top + heigth + 8)+'px'}).addClass('poplight-bottom');
			}

			if(left > right){
				msgbox.css({'left': 'auto', 'right': (right + 20)+'px'}).addClass('poplight-left');
			}else{
				msgbox.css({'right': 'auto', 'left': (left + 20)+'px'}).addClass('poplight-right');
			}

			setTimeout(function(){
				msgbox.addClass('active');
			}, i);
		});

		return true;
	},

	'deactive': function(e){
		if(typeof e == 'string'){ e = $(e); }

		if(!e.length){ return false; }

		var prepos = e.attr('data-poplight-prepos');

		e.css('position', prepos).removeClass('poplight-box').removeAttr('data-poplight-prepos');
		$('.poplight-message').removeClass('active');

		this.overlay(false);

		return true;
	}
};

$(function(){
	$('body').on('click', '[data-poplight]', function(e){
		e.preventDefault();

		pipui.poplight.active($(this).attr('data-poplight'));
	}).on('click', '.poplight-overlay.active.canclose', function(e){
		e.preventDefault();

		pipui.poplight.deactive('.poplight-box');
	}).on('click', '.poplight-message .poplight-message-close', function(e){
		e.preventDefault();

		var that = $(this);

		that.closest('.poplight-message').removeClass('active');

		if(!$('.poplight-message.active').length){
			pipui.poplight.deactive('.poplight-box');
		}
	});
});