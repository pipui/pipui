pipui.addModule('alert', '1.0.0');
pipui.required('alert', 'base', '1.4.0', '>=');
pipui.i18n.alert = {
	"close": 'ЗАКРЫТЬ',
};

pipui.alert = {
	openTimeout: 3000,

	open: function(text, title, placement, autoclose, complete){

		title = title === undefined ? '' : title;

		if(typeof placement != 'string'){
			placement = 'bottom-center';
		}

		var split = placement.split('-');

		if(split[0] != 'top' && split[0] != 'bottom' && split[0] != 'center'){
			split[0] = 'bottom';
		}

		if(split[1] != 'left' && split[1] != 'right' && split[1] != 'center'){
			split[1] = 'center';
		}

		placement = split[0] + '-' + split[1];

		var block = $('.alert[data-placement="'+placement+'"]');

		if(!block.length){
			block = $('<div class="alert" data-placement="'+placement+'"></div>');

			if(split[0] == 'top'){
				$('body').prepend(block);
			}else{
				$('body').append(block);
			}
		}

		var id = Math.random();

		var e = $('<div class="alert-id" style="display: none;" data-id="'+id+'">' +
					'<div class="alert-content">'+text+'</div>' +

					'<div class="alert-footer">' +
						'<div class="block-left"><div class="title">'+title+'</div></div>' +

						'<div class="block-right">' +
							'<button class="btn btn-transparent close-trigger">'+p.i18n.alert.close+'</button>' +
						'</div>' +
					'</div>' +
				'</div>');

		block.append(e);

		e.fadeIn('fast', function(){
			if(typeof complete != 'undefined'){
				complete();
			}
		});

		if(typeof autoclose == 'undefined'){
			autoclose = this.openTimeout;
		}

		if(typeof autoclose == 'number'){
			setTimeout(function(){
				pipui.alert.close('.alert .alert-id[data-id="'+id+'"]');
			}, autoclose);
		}

		return true;
	},

	close: function(e, complete){

		e = (typeof e == 'string') ? $(e) : e;

		var len = e.length;

		if(!len){ return false; }

		$('.alert').stop();

		e.each(function(i){
			var self = $(this);

			setTimeout(function(){
				self.fadeOut('fast', function(){
					$(this).remove();
				});
			}, i*300);
		});

		if(typeof complete != 'undefined'){
			complete();
		}
	},

	hide: function(e, complete){

		e = (typeof e == 'string') ? $(e) : e;

		var len = e.length;

		if(!len){ return false; }

		$('.alert').stop();

		e.each(function(i){
			var self = $(this);

			setTimeout(function(){
				self.fadeOut('fast');
			}, i*300);
		});

		if(typeof complete != 'undefined'){
			complete();
		}
	},

	show: function(e, complete){

		e = (typeof e == 'string') ? $(e) : e;

		var len = e.length;

		if(!len){ return false; }

		$('.alert').stop();

		e.each(function(i){
			var self = $(this);

			setTimeout(function(){
				self.fadeIn('fast');
			}, i*300);
		});

		if(typeof complete != 'undefined'){
			complete();
		}
	}
};

$(function(){
	$('body').on('click', '.alert > .alert-id .close-trigger', function(e){
		e.preventDefault();

		pipui.alert.close($(this).closest('.alert-id'));

	});

	setTimeout(function(){
		pipui.alert.close($('.alert > .alert-id[data-autoclose="true"]'));
	}, pipui.alert.openTimeout);
});