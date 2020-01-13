pipui.popup = {
	'showSpeed': 'fast',
	'hideSpeed': 'fast',

	'arrowSize': 8,

	'lock': false,

	'create': function(block, header, body, closeover, placement){
		if(typeof block == 'string'){
			block = $(block);
		}

		if(!block.length){
			return false;
		}

		var id = block.attr('data-popup-id');

		var e;

		if(typeof placement == 'undefined'){ placement = 'top'; }

		if(typeof id != 'undefined'){
			var trigger = '.popup[data-popup-id="'+id+'"]';
			e = $(trigger);

			if(e.length){
				if(closeover){ e.attr('data-popup-closeover', 'true'); }

				e.attr('data-popup-placement', placement);

				this.show(e, block);

				return id;
			}
		}

		id = Math.random();

		e = $('<div class="popup" data-popup-id="'+id+'" data-popup-placement="'+placement+'"><div class="popup-header">'+header+'</div><div class="popup-body">'+body+'</div></div>');

		if(closeover){ e.attr('data-popup-closeover', 'true'); }

		$('body').append(e);

		this.show(e, block);

		return '.popup[data-popup-id="'+id+'"]';
	},

	'show': function(e, block){
		if(this.lock){ return false; }

		if(typeof e == 'string'){ e = $(e); }
		if(typeof block == 'string'){ block = $(block); }

		if(!e.length || block.length != 1){ return false; }

		this.lock = true;

		if(typeof e.attr('data-popup-id') == 'undefined'){
			var id = Math.random();
			e.attr('data-popup-id', id);
			block.attr('data-popup-id', id);
		}

		var position = this.calculate_position(e, block);

		e.css({'top': position.top+'px', 'left': position.left+'px'});

		e.fadeIn(this.showSpeed, function(){
			$(this).addClass('active');
			pipui.popup.lock = false;
		});

		return true;
	},

	'hide': function(e){
		if(this.lock){ return false; }

		if(typeof e == 'string'){ e = $(e); }

		if(!e.length){ return false; }

		this.lock = true;

		e.fadeOut(this.hideSpeed, function(){
			$(this).removeClass('active');
			pipui.popup.lock = false;
		});

		return true;
	},

	'toggle': function(e, block){
		if(this.lock){ return false; }
		if(typeof e == 'string'){ e = $(e); }

		if(e.hasClass('active')){
			this.hide(e);
		}else{
			this.show(e, block);
		}

		return true;
	},

	'calculate_placement': function(placement, top, right, bottom, left, e_w, e_h){

		if(placement != 'left' && placement != 'top' && placement != 'right' && placement != 'bottom'){
			placement = 'top';
		}

		if(placement == 'left'){
			if(left >= e_w+this.arrowSize){
				return 'left';
			}else if(right >= e_w+this.arrowSize){
				return 'right';
			}else if(bottom > top && bottom > e_h+this.arrowSize){
				return 'bottom';
			}
		}else if(placement == 'right'){
			if(right >= e_w+this.arrowSize){
				return 'right';
			}else if(left >= e_w+this.arrowSize){
				return 'left';
			}else if(bottom > top && bottom > e_h+this.arrowSize){
				return 'bottom';
			}
		}else if(placement == 'bottom'){
			if(bottom >= e_h+this.arrowSize){
				return 'bottom';
			}else if(top >= e_h+this.arrowSize){
				return 'top';
			}else if(left >= e_w+this.arrowSize){
				return 'left';
			}else if(right > e_w+this.arrowSize){
				return 'right';
			}
		}else if(placement == 'top'){
			if(top >= e_h+this.arrowSize){
				return 'top';
			}else if(bottom >= e_h+this.arrowSize){
				return 'bottom';
			}else if(left >= e_w+this.arrowSize){
				return 'left';
			}else if(right > e_w+this.arrowSize){
				return 'right';
			}
		}

		return 'top';
	},

	'calculate_position': function(e, block){
		var blockpos = block.offset();

		var e_w = e.outerWidth();
		var e_h = e.outerHeight();

		var block_w = block.outerWidth();
		var block_h = block.outerHeight();

		var placement = e.attr('data-popup-placement');

		var win = $(window);

		var win_w = win.width();
		var win_h = win.height();

		var free = {
			'top': blockpos.top-window.pageYOffset,
			'left': blockpos.left,
			'bottom': win_h - (blockpos.top-window.pageYOffset+block_h),
			'right': win_w - (blockpos.left+block_w)
		};

		placement = this.calculate_placement(placement, free.top, free.right, free.bottom, free.left, e_w, e_h);

		e.attr('data-popup-direction', placement);

		if(placement == 'left'){
			return {
				'top': blockpos.top + (block_h / 2) - (e_h / 2),
				'left': blockpos.left - e_w - this.arrowSize
			};
		}else if(placement == 'right'){
			return {
				'top': blockpos.top + (block_h / 2) - (e_h / 2),
				'left': blockpos.left + block_w + this.arrowSize
			};
		}else if(placement == 'bottom'){
			return {
				'top': blockpos.top + block_h + this.arrowSize,
				'left': blockpos.left + (block_w / 2) - (e_w / 2)
			};
		}else if(placement == 'top'){
			return {
				'top': blockpos.top - e_h - this.arrowSize,
				'left': blockpos.left + (block_w / 2) - (e_w / 2)
			};
		}

		return {
			'top': blockpos.top - e_h - this.arrowSize,
			'left': blockpos.left + (block_w / 2) - (e_w / 2)
		};
	},

	'update': function(){
		var list = $('.popup.active');

		if(!list.length){ return false; }

		list.each(function(){
			var e = $(this);
			var id = e.attr('data-popup-id');

			var block = $('[data-popup-id="'+id+'"]:not(.popup)');

			if(!block.length){ return; }

			var position = pipui.popup.calculate_position(e, block);

			e.css({'top': position.top+'px', 'left': position.left+'px'});
		});

		return true;
	}
};

$(function(){
	$('body').on('click', '[data-popup]', function(e){
		e.preventDefault();

		var that = $(this);

		pipui.popup.toggle(that.attr('data-popup'), that);
	});

	$('html').on('click', 'body', function(e){
		var popup = $(e.target).closest('.popup');

		if(!popup.length){
			pipui.popup.hide($('.popup[data-popup-closeover]'));
		}else{
			var id = popup.attr('data-popup-id');

			if(typeof id != 'undefined'){
				pipui.popup.hide($('.popup[data-popup-closeover]:not([data-popup-id="'+id+'"])'));
			}
		}
	});

	$(window).on('resize scroll', function(){
		pipui.popup.update();
	});
});