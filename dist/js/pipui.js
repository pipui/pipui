/* PipUI v1.0.0 © Qexy | Site: https://pipui.ru | License: MIT */


/***** base.js *****/
var pipui = {
	array_unique: function(array){
		var result = [];

		for(var i = 0; i < array.length; i++){
			if(result.indexOf(array[i]) === -1){
				result.push(array[i]);
			}
		}

		return result;
	},

	top_space: function(e){
		return e.offset().top - window.pageYOffset;
	},

	bottom_space: function(e){
		return window.innerHeight - e.offset().top - e.outerHeight() + window.pageYOffset;
	},

	left_space: function(e){
		return e.offset().left - window.pageXOffset;
	},

	right_space: function(e){
		return window.innerWidth - e.offset().left - e.outerWidth() + window.pageXOffset;
	}
};

$(function(){
	$('body').on('click', '.preventDefault', function(e){
		e.preventDefault();
	});
});




/***** navbar.js *****/
$(function(){
	$('html').on('click', 'body', function(e){

		var target = $(e.target);

		var sub = target.closest('.nav-submenu');

		var trigger = target.closest('.nav-sub');

		if(!sub.length && !trigger.length){
			$('.navbar .nav-submenu.active, .navbar .nav-sub.active').removeClass('active left-pos right-pos');
		}else if(trigger.length){
			var current = trigger.closest('.nav-li');

			$('.navbar .nav-li').each(function(){
				var that = $(this);
				if(that.is(current)){ return; }

				that.find('.nav-submenu.active, .nav-sub.active').removeClass('active left-pos right-pos');
			});
		}
	});

	$('body').on('click', '.navbar .nav-sub', function(e){
		e.preventDefault();

		var that = $(this);

		var el = that.attr('data-nav');

		var submenu = $('.nav-submenu'+el);

		var navbar = that.closest('.navbar');

		var left = e.pageX-navbar.offset().left;

		var right = navbar.outerWidth() - left;

		if(!that.hasClass('active')){
			if(left>right){
				submenu.addClass('right-pos');
			}else{
				submenu.addClass('left-pos');
			}
		}else{
			submenu.removeClass('left-pos right-pos');
		}

		submenu.toggleClass('active');
		that.toggleClass('active');
	}).on('click', '.navbar .navbar-wrapper .nav-mobile', function(e){
		e.preventDefault();

		$(this).closest('.navbar').toggleClass('open');
	});
});




/***** modal.js *****/
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




/***** alert.js *****/
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
								'<button class="btn btn-transparent close-trigger">ЗАКРЫТЬ</button>' +
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




/***** confirm.js *****/
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




/***** tabs.js *****/
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
	$('body').on('click', '.tabs > .tab-links .tab-link', function(e){
		e.preventDefault();

		pipui.tabs.active($(this).attr('data-id'));
	});
});




/***** spoiler.js *****/
pipui.spoiler = {
	show: function(e){

		e = (typeof e == 'string') ? $('.spoiler'+e) : e;

		var len = e.length;

		if(!len){ return this; }

		if(!e.length){ return this; }

		e.slideDown('fast', function(){
			$(this).addClass('active');
		});

		return this;
	},

	hide: function(e){

		e = (typeof e == 'string') ? $('.spoiler'+e) : e;

		var len = e.length;

		if(!len){ return this; }

		if(!e.length){ return this; }

		e.slideUp('fast', function(){
			$(this).removeClass('active');
		});

		return this;
	},

	toggle: function(e){

		e = (typeof e == 'string') ? $('.spoiler'+e) : e;

		var len = e.length;

		if(!len){ return this; }

		if(!e.length){ return this; }

		e.slideToggle('fast', function(){
			$(this).toggleClass('active');
		});

		return this;
	},

	showAll: function(){
		$('.spoiler').slideDown('fast', function(){
			$(this).addClass('active');
		});

		return this;
	},

	hideAll: function(){
		$('.spoiler').slideUp('fast', function(){
			$(this).removeClass('active');
		});

		return this;
	}
};

$(function(){
	$('body').on('click', '[data-spoiler]', function(e){
		e.preventDefault();

		var that = $(this);
		var target = that.attr('data-spoiler');

		if(typeof target == 'undefined' || $.trim(target) == ''){ target = that.attr('href'); }

		if(target){
			pipui.spoiler.toggle(target);
		}
	}).on('click', '[data-spoiler-show], [data-spoiler-hide]', function(e){
		e.preventDefault();

		var that = $(this);

		var show = that.attr('data-spoiler-show');
		var hide = that.attr('data-spoiler-hide');

		var is_show = typeof show != 'undefined';

		var target = that.attr(is_show ? show : hide);

		if(typeof target == 'undefined' || $.trim(target) == ''){ target = that.attr('href'); }

		if(target){
			if(is_show){
				pipui.spoiler.show(target);
			}else{
				pipui.spoiler.hide(target);
			}
		}
	}).on('click', '.accordion > .accordion-id > .accordion-trigger', function(e){
		e.preventDefault();

		var that = $(this);

		var accordion = that.closest('.accordion');

		accordion.children('.accordion-id.active').children('.accordion-target').slideUp('fast', function(){
			$(this).closest('.accordion-id').removeClass('active');
		});

		var item = that.closest('.accordion-id');

		if(item.hasClass('active')){
			item.children('.accordion-target').slideUp('fast', function(){
				item.removeClass('active');
			});
		}else{
			item.children('.accordion-target').slideDown('fast', function(){
				item.addClass('active');
			});
		}
	});
});




/***** textarea.js *****/
pipui.textarea = {
	element: '.textarea',

	render: function(e){
		if(!$(e).length){ return; }

		$(e).each(function(){
			var that = $(this);

			var id = that.attr('data-textarea-id');

			if(typeof id == 'undefined' || id==''){
				id = Math.random();
			}

			var el = '.textarea-numbers[data-textarea-id="'+id+'"] > ul';

			var list = $(el);

			var textarea = that.find('textarea');

			if(!list.length){
				that.append('<div class="textarea-numbers" data-textarea-id="'+id+'"><ul></ul></div>');
				textarea.attr('data-textarea-id', id);
				that.attr('data-textarea-id', id);
				list = $(el);
			}

			var value = textarea[0].value;

			var lines = value.split('\n').length;

			for(var i = 1; i <= lines; i++){
				list.append('<li data-id="'+i+'"><a href="#line-'+id+'-'+i+'">'+i+'</a></li>');
			}

			textarea.val(value.replace(/ {3}/g, '\t'));
		});
	}
};

$(function(){
	pipui.textarea.render(pipui.textarea.element);

	$('html').on('keydown', pipui.textarea.element+' textarea', function(e){

		if(e.keyCode==9){

			var target = $(e.target);

			var textarea = target.closest('textarea');

			if(textarea.length){
				setTimeout(function(){
					textarea.focus();

					var box = textarea[0];
					var start = box.selectionStart;
					var end = box.selectionEnd;

					var value = textarea.val();

					var beforeSelect = value.substring(0, start);
					var currentSelect = value.substring(start, end);
					var afterSelect = value.substring(end, value.length);

					currentSelect = currentSelect.replace(/\n/g, '\n\t');

					var num = currentSelect.split('\n').length;

					var string = beforeSelect+'\t'+currentSelect+afterSelect;

					textarea.val(string);

					box.setSelectionRange(start+1, end+num);
				}, 0);

			}
		}
	}).on('click', pipui.textarea.element+' textarea', function(){
		$(this).attr('data-prev-start', this.selectionStart).attr('data-prev-end', this.selectionEnd);
	}).on('input', pipui.textarea.element+' textarea', function(){
		var that = $(this);

		var beforeStart = parseInt(that.attr('data-prev-start'));
		var beforeEnd = parseInt(that.attr('data-prev-end'));

		var currentStart = this.selectionStart;
		var currentEnd = this.selectionEnd;

		var val = that.val();

		var id = that.attr('data-textarea-id');

		var isWrap = val.match(/ {3}/g, '\t');

		if(isWrap){
			that.val(val.replace(/ {3}/g, '\t'));
		}

		var last = that.closest(pipui.textarea.element).find('ul > li');

		var before = last.length;

		var now = val.split('\n').length;

		if(now!=before){
			if(now>before){

				var ul = last.closest('ul');

				for(var i = before+1; i <= now; i++){
					ul.append('<li data-id="'+i+'"><a href="#line-'+id+'-'+i+'">'+i+'</a></li>');
				}
			}else{
				that.closest(pipui.textarea.element).find('ul > li:nth-child('+now+')').nextAll().remove();
			}
		}

		if(isWrap){
			this.setSelectionRange(beforeStart-1, beforeEnd-1);
		}

		that.attr('data-prev-start', currentStart).attr('data-prev-end', currentEnd);

	}).on('click', pipui.textarea.element+' > .textarea-numbers > ul > li > a', function(e){
		e.preventDefault();

		var that = $(this);

		var href = that.attr('href').split('-');

		var num = parseInt(href[2])-1;

		var box = that.closest(pipui.textarea.element);

		var textarea = box.find('textarea');

		var value = textarea.val();

		var beforeLen = 0;
		var currentLen = 0;

		var currentKey = 0;

		$.each(value.split('\n'), function(k, v){
			var len = v.length;

			if(num==k){
				currentLen = len; currentKey = k; return false;
			}

			beforeLen = beforeLen+len+1;
		});

		textarea.focus();

		textarea[0].setSelectionRange(beforeLen, beforeLen+currentLen);

		setTimeout(function(){
			textarea.scrollTop(that.closest('li')[0].offsetTop+10-((textarea.outerHeight()/2).toFixed()));
		}, 0);
	});

	$('body '+pipui.textarea.element+' textarea').on('scroll', function(e){
		var that = $(e.target);

		var box = that.closest(pipui.textarea.element);

		box.find('.textarea-numbers > ul').css('top', -that.scrollTop()+'px');
	});
});




/***** bbpanel.js *****/
pipui.bbpanel = {
	element: '.bbpanel',
	targetClass: 'bbpanel-target',
	codes: {
		'b': {'title': 'Жирный', 'text': '<i class="fa fa-bold"></i>', 'left': '[b]', 'right': '[/b]'},
		'i': {'title': 'Курсив', 'text': '<i class="fa fa-italic"></i>', 'left': '[i]', 'right': '[/i]'},
		'u': {'title': 'Подчеркнутый', 'text': '<i class="fa fa-underline"></i>', 'left': '[u]', 'right': '[/u]'},
		's': {'title': 'Зачеркнутый', 'text': '<i class="fa fa-strikethrough"></i>', 'left': '[s]', 'right': '[/s]'},
		'left': {'title': 'Выравнивание по левому краю', 'text': '<i class="fa fa-align-left"></i>', 'left': '[left]', 'right': '[/left]'},
		'center': {'title': 'Выравнивание по центру', 'text': '<i class="fa fa-align-center"></i>', 'left': '[center]', 'right': '[/center]'},
		'right': {'title': 'Выравнивание по правому краю', 'text': '<i class="fa fa-align-right"></i>', 'left': '[right]', 'right': '[/right]'},
		'spoiler': {'title': 'Скрытый текст', 'text': '<i class="fa fa-eye-slash"></i>', 'left': '[spoiler=""]', 'right': '[/spoiler]'},
		'color': {'title': 'Цвет текста', 'text': '<i class="fa fa-paint-brush"></i>', 'left': '[color="#"]', 'right': '[/color]'},
		'size': {'title': 'Размер текста', 'text': '<i class="fa fa-text-height"></i>', 'left': '[size="1"]', 'right': '[/size]'},
		'img': {'title': 'Изображени', 'text': '<i class="fa fa-picture-o"></i>', 'left': '[img]', 'right': '[/img]'},
		'quote': {'title': 'Цитата', 'text': '<i class="fa fa-quote-right"></i>', 'left': '[quote]', 'right': '[/quote]'},
		'urlAlt': {'title': 'Ссылка', 'text': '<i class="fa fa-link"></i>', 'left': '[url=""]', 'right': '[/url]'},
		'code': {'title': 'Код', 'text': '<i class="fa fa-code"></i>', 'left': '[code]', 'right': '[/code]'},
		'line': {'title': 'Горизонтальная линия', 'text': '<i class="fa fa-minus"></i>', 'left': '', 'right': '[line]'},
		'youtube': {'title': 'Ссылка на YouTube видео', 'text': '<i class="fa fa-youtube-play"></i>', 'left': '[youtube]', 'right': '[/youtube]'},
		'hide': {'title': 'Скрыть панель', 'text': '<i class="fa fa-angle-up"></i>', 'method': function(e){
				e.closest('.bbpanel-target').slideUp('fast');
			}}
	},
	items: null,
	renderItems: function(){
		if(pipui.bbpanel.items !== null){
			return false;
		}

		pipui.bbpanel.items = '';

		$.each(pipui.bbpanel.codes, function(k, v){

			if(typeof v.method != 'undefined'){
				pipui.bbpanel.items += '<li><a href="#bb-'+k+'" class="bbpanel-tag" data-method="'+k+'" title="'+v.title+'">'+v.text+'</a></li>';
			}else{
				v.left = v.left.replace(/"/g, '&quote;');
				v.right = v.right.replace(/"/g, '&quote;');
				pipui.bbpanel.items += '<li><a href="#bb-'+k+'" class="bbpanel-tag" data-left="'+v.left+'" data-right="'+v.right+'" title="'+v.title+'">'+v.text+'</a></li>';
			}

		});

		return true;
	},
	render: function(el){
		if(typeof el == 'string'){
			el = $(el);
		}

		el.each(function(){
			var that = $(this);

			var id = that.attr('data-panel-id');

			if(typeof id == 'undefined'){
				id = Math.random();
			}else{
				return;
			}

			if(pipui.bbpanel.items === null){
				pipui.bbpanel.renderItems();
			}

			that.attr('data-panel-id', id);
			var after = $('<div class="'+pipui.bbpanel.targetClass+'" data-panel-id="'+id+'"><ul data-panel-id="'+id+'">'+pipui.bbpanel.items+'</ul></div>');

			that.after(after);
		});
	}
};

$(function(){
	$('body').on('focus', pipui.bbpanel.element, function(e){
		e.preventDefault();

		var that = $(this);

		pipui.bbpanel.render(that);

		setTimeout(function(){
			$('.'+pipui.bbpanel.targetClass+'[data-panel-id="'+that.attr('data-panel-id')+'"]').slideDown('fast');
		}, 0);
	}).on('click', '.'+pipui.bbpanel.targetClass+' .bbpanel-tag', function(e){
		e.preventDefault();

		var that = $(this);

		var method = that.attr('data-method');

		if(typeof method != 'undefined'){

			pipui.bbpanel.codes[method].method(that);

			return;
		}

		var leftTag = that.attr('data-left').replace(/&quote;/g, '"');
		var rightTag = that.attr('data-right').replace(/&quote;/g, '"');

		var id = that.closest('.'+pipui.bbpanel.targetClass).attr('data-panel-id');

		var input = $(pipui.bbpanel.element+'[data-panel-id="'+id+'"]')[0];

		input.focus();

		var value = input.value;

		var startCaret = input.selectionStart;
		var endCaret = input.selectionEnd;

		var beforeText = value.substring(0, startCaret);
		var afterText = value.substr(endCaret);
		var currentText = value.substring(startCaret, endCaret);

		input.value = beforeText+leftTag+currentText+rightTag+afterText;

		input.setSelectionRange(startCaret, leftTag.length+rightTag.length+endCaret);
	});
});




/***** bbcodes.js *****/
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




/***** formvalidator.js *****/
pipui.formvalidator = {
	form: '[data-formvalidator]',

	timeout: 2000,

	defaultType: 'warning',

	storage: {}
};

$(function(){
	$('body').on('click', pipui.formvalidator.form+' [type="submit"]', function(e){
		var that = $(this);

		var form = that.closest('form');

		var valid = true;

		var fields = form.find('input, textarea, select');

		for(var i = 0; i < fields.length; i++){

			var name = fields[i].getAttribute('name');

			if(name === null){
				continue;
			}

			var el = $(fields[i]);

			if(fields[i].checkValidity()){
				continue;
			}

			valid = false;

			var id = el.attr('data-formvalidator-id');

			if(typeof id === 'undefined'){
				id = Math.random().toString();
				el.attr('data-formvalidator-id', id);
			}

			var text = el.attr('data-formvalidator-text');

			if(typeof text == 'undefined'){
				text = 'Поле заполнено неверно';
			}

			var alert = $('.formvalidator-alert[data-formvalidator-id="'+id+'"]');

			if(!alert.length){
				var label = el.closest('label');
				if(label.length){
					label.after('<div class="formvalidator-alert" data-formvalidator-id="'+id+'"></div>');
				}else{
					el.after('<div class="formvalidator-alert" data-formvalidator-id="'+id+'"></div>');
				}
				alert = $('.formvalidator-alert[data-formvalidator-id="'+id+'"]');
			}

			var type = el.attr('data-formvalidator-type');

			if(typeof type == 'undefined'){
				type = pipui.formvalidator.defaultType;
			}

			alert.removeClass('warning info danger success').addClass(type);

			var icon = '';

			if(type == 'warning'){
				icon = '<i class="fa fa-exclamation-triangle"></i>';
			}else if (type == 'danger'){
				icon = '<i class="fa fa-exclamation-circle"></i>'
			}else if (type == 'info'){
				icon = '<i class="fa fa-info-circle"></i>'
			}else if (type == 'success'){
				icon = '<i class="fa fa-check-circle"></i>'
			}

			alert.html('<div class="wrapper"><div class="icon-block">'+icon+'</div><div class="text-block">'+text+'</div><div class="close-block"><a href="#" class="close">&times;</a></div></div>').fadeIn('fast');
		}

		if(!valid){
			e.preventDefault();
			e.stopPropagation();
			e.stopImmediatePropagation();

			return false;
		}
	}).on('click', '.formvalidator-alert > .wrapper > .close-block > .close', function(e){
		e.preventDefault();

		$(this).closest('.formvalidator-alert').fadeOut('fast');
	}).on('input change', pipui.formvalidator.form+' input, '+pipui.formvalidator.form+' select, '+pipui.formvalidator.form+' textarea', function(){
		var that = $(this);

		if(that[0].checkValidity()){
			var alert = $('.formvalidator-alert[data-formvalidator-id="'+that.attr('data-formvalidator-id')+'"]');

			if(alert.length){
				alert.fadeOut('fast');
			}
		}
	});
});




/***** dropdown.js *****/
pipui.dropdown = {
	toggle: function(e){
		if(!e.length){ return false; }

		var dropdown = e.find('.dropdown-target:first');

		if(!dropdown.length){ return false; }

		if(dropdown.is(':visible')){
			pipui.dropdown.hide(e);
		}else{
			pipui.dropdown.show(e);
		}
	},

	show: function(e){
		if(!e.length){ return false; }

		e.addClass('active');

		var trigger = e.find('.dropdown-trigger:first');

		if(e.attr('data-dropdown-placement') == 'auto'){
			if(pipui.top_space(trigger) > pipui.bottom_space(trigger)){
				e.attr('data-dropdown-y', 'top');
			}else{
				e.attr('data-dropdown-y', 'bottom');
			}

			if(pipui.left_space(trigger) > pipui.right_space(trigger)){
				e.attr('data-dropdown-x', 'left');
			}else{
				e.attr('data-dropdown-x', 'right');
			}
		}

		trigger.addClass('active');
	},

	hide: function(e){
		if(!e.length){ return false; }

		e.removeClass('active');

		e.find('.dropdown.active, .dropdown-trigger.active').removeClass('active');
	}
};

$(function(){
	$('body').on('click', '.dropdown > .dropdown-trigger', function(e){
		e.preventDefault();

		pipui.dropdown.toggle($(this).closest('.dropdown'));
	});

	$('html').on('click', 'body', function(e){
		var target = $(e.target).closest('.dropdown:not(.dropdown-submenu)');

		$('.dropdown.active').each(function(){
			var that = $(this);

			var parent = that.closest('.dropdown:not(.dropdown-submenu)');

			if(!parent.is(target)){
				parent.removeClass('active');
				parent.find('.dropdown.active, .dropdown-trigger.active').removeClass('active');
			}
		});
	});
});




/***** toggle.js *****/
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
			console.log(1);
			item.fadeToggle('fast', function(){
				if(classToggle){ $(this).toggleClass(classToggle); }
			});
		}else if(fade == 'slide'){
			console.log(2);
			item.slideToggle('fast', function(){
				if(classToggle){ $(this).toggleClass(classToggle); }
			});
		}else{
			console.log(3);
			item.toggle(function(){
				if(classToggle){ $(this).toggleClass(classToggle); }
			});
		}
	});
});




/***** tabindex.js *****/
pipui.tabindex = {
	search_next: function(current, block){
		var indexes = block.find('[tabindex]');

		var length = indexes.length;

		if(!length){ return null; }

		if(current === null || length == 1){
			return indexes[0].getAttribute('tabindex');
		}

		var array_indexes = [];

		for(var i = 0; i < length; i++){
			array_indexes.push(parseInt(indexes[i].getAttribute('tabindex')));
		}

		array_indexes = array_indexes.sort(function(a, b){
			return a - b;
		});

		var index = 0;

		$.each(array_indexes, function(k, v){
			if(v == current){
				index = k;

				return false;
			}
		});

		var next = array_indexes[index+1];

		if(typeof next == 'undefined'){
			next = array_indexes[0];
		}

		return next;
	}
};

$(function(){
	$('body').on('keydown', function(e){
		if(e.which == 9){
			e.preventDefault();

			var that = $(e.target);

			var block = that.closest('[data-tabindex]');

			if(!block.length){
				block = $('body');
			}

			var tabindex = pipui.tabindex.search_next(e.target.getAttribute('tabindex'), block);

			$('[tabindex="'+tabindex+'"]').focus();
		}
	});
});




/***** pagination.js *****/
pipui.pagination = {
	get_data: function(e){
		var type = parseInt(e.attr('data-pagination'));

		if(isNaN(type)){
			type = 0;
		}

		var current = parseInt(e.attr('data-pagination-current'));

		if(isNaN(current)){
			current = 1;
		}

		var pages = parseInt(e.attr('data-pagination-pages'));

		if(isNaN(pages)){
			pages = 1;
		}

		var url = e.attr('data-pagination-url');

		if(typeof url == 'undefined'){
			url = '/page-{NUM}';
		}

		return {'type': type, 'current': current, 'pages': pages, 'url': url};
	},

	init: function(){

		var pagin = $('.pagination[data-pagination]');

		pagin.each(function(){
			var that = $(this);

			var data = pipui.pagination.get_data(that);

			var filter = pipui.pagination.types[data.type];

			if(typeof filter == 'undefined'){
				return;
			}

			filter.update(that, data.current, data.pages, data.url)
		});

		pagin.fadeIn();
	},

	types: {
		0: {
			update: function(element, current, pages, url){
				var string = "";

				for(var i = 1; i <= pages; i++){
					string += '<li data-page="'+i+'" '+(i == current ? 'class="active"' : '')+'>';
					string += '<a title="'+i+'" href="'+url.replace('{NUM}', i)+'">'+i+'</a>';
					string += '</li>';
				}

				element.html(string);
			}
		},

		1: {
			pages: 2,
			update: function(element, current, pages, url){
				var string = "";

				var pagenum = this.pages;

				if(pages < (pagenum * 2 + 1)){
					pagenum = Math.floor(pages / 2) - 1
				}

				if(current > 1){
					string += '<li class="scroller"><a href="'+url.replace('{NUM}', current-1)+'">‹</a></li>';
				}

				for(var a = pagenum; a < current; a++){
					if(a<1){ continue; }
					string += '<li data-page="'+a+'" '+(a == current ? 'class="active"' : '')+'>';
					string += '<a title="'+a+'" href="'+url.replace('{NUM}', a)+'">'+a+'</a>';
					string += '</li>';
				}

				string += '<li class="active" data-page="'+current+'">';
				string += '<a title="'+current+'" href="'+url.replace('{NUM}', current)+'">'+current+'</a>';
				string += '</li>';

				for(var i = current+1; i <= pagenum; i++){
					if(i > pages){ continue; }
					string += '<li  data-page="'+i+'" '+(i == current ? 'class="active"' : '')+'>';
					string += '<a title="'+i+'" href="'+url.replace('{NUM}', i)+'">'+i+'</a>';
					string += '</li>';
				}

				if(current < pages){
					string += '<li class="scroller"><a href="'+url.replace('{NUM}', current+1)+'">›</a></li>';
				}

				element.html(string);
			}
		},

		2: {
			pages: 2,
			update: function(element, current, pages, url){
				var string = "";

				var pagenum = this.pages;

				if(pages < (pagenum * 2 + 1)){
					pagenum = Math.floor(pages / 2) - 1
				}

				if(current-1 > 1){
					string += '<li class="scroller"><a href="'+url.replace('{NUM}', 1)+'">«</a></li>';
				}

				if(current > 1){
					string += '<li class="scroller"><a href="'+url.replace('{NUM}', current-1)+'">‹</a></li>';
				}

				for(var a = pagenum; a < current; a++){
					if(a < 1){ continue; }
					string += '<li data-page="'+a+'" '+(a == current ? 'class="active"' : '')+'>';
					string += '<a title="'+a+'" href="'+url.replace('{NUM}', a)+'">'+a+'</a>';
					string += '</li>';
				}

				string += '<li data-page="'+current+'" class="active">';
				string += '<a title="'+current+'" href="'+url.replace('{NUM}', current)+'">'+current+'</a>';
				string += '</li>';

				for(var i = current+1; i <= pagenum; i++){
					if(i > pages){ continue; }
					string += '<li data-page="'+i+'" '+(i == current ? 'class="active"' : '')+'>';
					string += '<a title="'+i+'" href="'+url.replace('{NUM}', i)+'">'+i+'</a>';
					string += '</li>';
				}

				if(current < pages){
					string += '<li class="scroller"><a href="'+url.replace('{NUM}', current+1)+'">›</a></li>';
				}

				if(current < pages-1){
					string += '<li class="scroller"><a href="'+url.replace('{NUM}', pages)+'">»</a></li>';
				}

				element.html(string);
			}
		},

		3: {
			pages: 2,
			scroll: function(position, element){
				var data = pipui.pagination.get_data(element);

				var selected = parseInt(element.find('li.selected').attr('data-page'));

				if(position == 'prev'){
					if(selected-1 < 1){ selected = 2; }
					this.update(element, data.current, data.pages, data.url, selected-1);
				}else if(position == 'next'){
					if(selected+1 > data.pages){ selected = data.pages-1; }
					this.update(element, data.current, data.pages, data.url, selected+1);
				}else if(position == 'first'){
					this.update(element, data.current, data.pages, data.url, 1);
				}else if(position == 'last'){
					this.update(element, data.current, data.pages, data.url, data.pages);
				}
			},
			update: function(element, current, pages, url, selected){
				var string = "";

				var pagenum = pipui.pagination.types[3].pages;

				if(pages < (pagenum * 2 + 1)){
					pagenum = Math.floor(pages / 2) - 1
				}

				if(typeof selected == 'undefined'){
					selected = current;
				}

				var start = selected - pagenum;

				if(start < 1){
					start = 1;
				}

				var end = start + (pagenum * 2);

				if(end > pages) {
					end = pages;
					start = end - (pagenum * 2);
				}

				if(pagenum <= 1){
					start = 1;
					end = pages;
				}

				string += '<li class="scroller"><a data-pagination-scroll="first" href="#">«</a></li>';
				string += '<li class="scroller"><a data-pagination-scroll="prev" href="#">‹</a></li>';

				/*if(selected > 2){
					string += '<li class="scroller"><a data-pagination-scroll="first" href="#">«</a></li>';
				}

				if(selected > 1){
					string += '<li class="scroller"><a data-pagination-scroll="prev" href="#">‹</a></li>';
				}*/

				var is_current = '';
				var is_selected = '';

				for(var i = start; i <= end; i++){

					is_current = (i == current) ? 'active' : '';
					is_selected = (i == selected) ? 'selected' : '';

					string += '<li class="'+is_current+' '+is_selected+'" data-page="'+i+'">';
					string += '<a title="'+i+'" href="'+url.replace('{NUM}', i)+'">'+i+'</a>';
					string += '</li>';
				}

				string += '<li class="scroller"><a data-pagination-scroll="next" href="#">›</a></li>';
				string += '<li class="scroller"><a data-pagination-scroll="last" href="#">»</a></li>';

				/*if(selected < pages){
					string += '<li class="scroller"><a data-pagination-scroll="next" href="#">›</a></li>';
				}

				if(selected < pages-1){
					string += '<li class="scroller"><a data-pagination-scroll="last" href="#">»</a></li>';
				}*/

				element.html(string);
			}
		}
	}
};

$(function(){

	$('.pagination[data-pagination]').hide();
	pipui.pagination.init();

	$('body').on('click', '.pagination[data-pagination] [data-pagination-scroll]', function(e){
		e.preventDefault();

		var that = $(this);

		var pagination = that.closest('.pagination');

		var data = pipui.pagination.get_data(pagination);

		var position = that.attr('data-pagination-scroll');

		pipui.pagination.types[data.type].scroll(position, pagination);
	});
});




/***** navmenu.js *****/
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