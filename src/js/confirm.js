pipui.confirm = {
	openTimeout: 3000,

	storage: {},

	open: function(params, title, success, fail, autoclose, complete, yes, no){
		var text = typeof params == 'string' || typeof params == 'number' ? params : '';

		if(typeof params == 'object'){

			if(typeof params.title != 'undefined'){
				title = params.title;
			}

			if(typeof params.text != 'undefined'){
				text = params.text;
			}

			if(typeof params.success == 'function'){
				success = params.success;
			}

			if(typeof params.fail == 'function'){
				fail = params.fail;
			}

			if(typeof params.autoclose != 'undefined'){
				autoclose = params.autoclose;
			}

			if(typeof params.complete == 'function'){
				complete = params.complete;
			}

			if(typeof params.yes == 'string' || typeof params.yes == 'number'){
				yes = params.yes;
			}

			if(typeof params.no == 'string' || typeof params.no == 'number'){
				no = params.no;
			}
		}

		if(typeof yes == 'undefined'){
			yes = 'ОК';
		}

		if(typeof no == 'undefined'){
			no = 'Отмена';
		}

		var block = $('.confirm');

		if(!block.length){
			block = $('<div class="confirm"></div>');

			$('body').append(block);
		}

		if(typeof title == 'undefined'){
			title = 'Подтвердите действие на странице';
		}

		var id = Math.random().toString();

		var e = $('<div class="confirm-id" style="display: none;" data-id="'+id+'">' +
					'<div class="confirm-title">'+title+'</div>' +
					'<div class="confirm-text">'+text+'</div>' +

					'<div class="confirm-footer">' +
						'<button class="btn btn-transparent yes-trigger">'+yes+'</button>' +
						'<button class="btn btn-transparent no-trigger">'+no+'</button>' +
					'</div>' +
				'</div>');

		block.append(e);

		e.fadeIn('fast', function(){
			if(typeof complete == 'function'){
				complete();
			}
		});

		if(typeof autoclose == 'number' && autoclose > 0){
			setTimeout(function(){
				pipui.confirm.close(e);
			}, autoclose);
		}

		this.storage[id] = {
			'id': id,
			'success': success,
			'fail': fail,
			'yes': yes,
			'no': no,
			'autoclose': autoclose
		};
	},

	close: function(e, complete){

		e = (typeof e == 'string') ? $(e) : e;

		var len = e.length;

		if(!len){ return false; }

		$('.confirm').stop();

		var n = 0;

		e.each(function(i){
			var self = $(this);

			setTimeout(function(){
				self.fadeOut('fast', function(){
					$(this).remove();
				});
			}, i*300);

			n = i;
		});

		if(typeof complete == 'function'){
			setTimeout(function(){
				complete();
			}, n * 300);
		}
	},

	complete: function(e, type, complete){

		e = (typeof e == 'string') ? $(e) : e;

		type = type == 'yes' ? type : 'no';

		var len = e.length;

		if(!len){ return false; }

		$('.confirm').stop();

		var n = 0;

		e.each(function(i){
			var self = $(this);

			var item = pipui.confirm.storage[self.attr('data-id')];

			if(item != 'undefined'){
				if(type == 'yes'){
					if(typeof item.success == 'function'){
						item.success();
					}
				}else{
					if(typeof item.fail == 'function'){
						item.fail();
					}
				}

				delete pipui.confirm.storage[self.attr('data-id')];

				setTimeout(function(){
					self.fadeOut('fast', function(){
						$(this).remove();
					});
				}, i*300);
			}

			n = i;
		});

		if(typeof complete == 'function'){
			setTimeout(function(){
				complete();
			}, n * 300);
		}
	}
};

$(function(){
	$('body').on('click', '.confirm > .confirm-id .no-trigger, .confirm > .confirm-id .yes-trigger', function(e){
		e.preventDefault();

		var that = $(this);

		that.prop('disabled', true);

		pipui.confirm.complete(that.closest('.confirm-id'), that.hasClass('yes-trigger') ? 'yes' : 'no');

	});

	setTimeout(function(){
		pipui.confirm.close($('.confirm > .confirm-id[data-autoclose="true"]'));
	}, pipui.confirm.openTimeout);
});