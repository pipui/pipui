/* PipUI v1.3.2 © Qexy | Site: https://pipui.ru | License: MIT */


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

		var trigger = target.closest('.nav-sub');

		var li = trigger.closest('.nav-li');

		if(!trigger.length && !target.closest('.nav-submenu').length){
			$('.navbar .nav-submenu.active, .navbar .nav-sub.active').removeClass('active left-pos right-pos');
		}else{
			var navbar = target.closest('.navbar');

			$('.navbar').not(navbar).find('.nav-sub.active, .nav-submenu.active').removeClass('active left-pos right-pos');

			li.siblings('.nav-li').not(li).find('.nav-sub.active, .nav-submenu.active').removeClass('active left-pos right-pos');
		}
	});

	$('body').on('click', '.navbar .nav-sub', function(e){
		e.preventDefault();

		var that = $(this);

		var submenu = that.closest('.nav-li').children('.nav-submenu');

		var navbar = that.closest('.navbar');

		var left = e.pageX-navbar.offset().left;

		var right = navbar.outerWidth() - left;

		if(!that.hasClass('active') || !submenu.hasClass('active')){
			if(left>right){
				submenu.addClass('right-pos');
			}else{
				submenu.addClass('left-pos');
			}

			that.addClass('active');
			submenu.addClass('active');
		}else{
			that.removeClass('active');
			submenu.removeClass('active left-pos right-pos');
			submenu.find('.nav-submenu.active, .nav-sub.active').removeClass('active');
		}

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
	$('body').on('click', '.tabs > .tab-links .tab-link:not([data-link])', function(e){
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

		if(isNaN(current) || current <= 0){
			current = 1;
		}

		var pages = parseInt(e.attr('data-pagination-pages'));

		if(isNaN(pages) || pages <= 0){
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




/***** autocomplete.js *****/
(function($){

	var ac_methods = {
		'typing': function(input){

			var fields = new FormData();

			input.each(function(){
				var that = $(this);

				var val = that.val();

				var id = that.attr('data-ac-id');

				var options = ac_options[id];

				if(typeof options.debug == 'boolean' && options.debug){
					console.log('[PipUI] autocomplete > Typing (Element ID: '+id+')');
				}

				if(typeof options.step == 'function'){
					options.step(that, val, options);
				}

				if(val.length < options.min){

					ac_methods.complete(that, [], options);

					return;
				}

				if(typeof options.timeout != 'undefined'){
					clearTimeout(ac_options[id].timeout);

					if(typeof options.debug == 'boolean' && options.debug){
						console.log('[PipUI] autocomplete > Clear timeout (Element ID: '+id+')');
					}
				}

				if(val.length < options.min){

					if(typeof options.debug == 'boolean' && options.debug){
						console.log('[PipUI] autocomplete > Bad min length (Element ID: '+id+')');
					}

					return;
				}

				fields.append('value', val);

				if(typeof options.params == 'object'){
					$.each(options.params, function(k, v){
						fields.append(k, v);
					});
				}

				ac_options[id].timeout = setTimeout(function(){

					if(typeof options.debug == 'boolean' && options.debug){
						console.log('[PipUI] autocomplete > Request to server (Element ID: '+id+')');
					}

					if(options.url.length){
						$.ajax({
							url: options.url,
							dataType: options.type,
							type: options.method,
							async: true,
							cache: false,
							contentType: false,
							processData: false,
							data: fields,

							error: function(data){
								if(typeof options.error == 'function'){
									options.error(data);
								}

								ac_methods.error(that, data, options);

								if(typeof options.debug == 'boolean' && options.debug){
									console.log('[PipUI] autocomplete > Bad response (Element ID: '+id+')');
								}
							},

							success: function(data){
								if(typeof options.complete == 'function'){
									options.complete(data);
								}

								ac_options[id].data = data;

								ac_methods.complete(that, data, options);

								if(typeof options.debug == 'boolean' && options.debug){
									console.log('[PipUI] autocomplete > Success response (Element ID: '+id+')');
								}
							},

							complete: function(){
								if(typeof options.debug == 'boolean' && options.debug){
									console.log('[PipUI] autocomplete > Full complete (Element ID: '+id+')');
								}
							}
						});
					}else{
						if(options.data){
							if(typeof options.complete == 'function'){
								options.complete(options.data);
							}

							ac_methods.complete(that, options.data, options);
						}
					}


				}, options.timer);
			});
		},

		'complete': function(input, data, options){
			var val = input.val().toLowerCase();

			var num = 0;

			var html = '';

			$.each(data, function(k, v){
				if(options.by.length){
					v = v[options.by];
				}

				if(v.toLowerCase().indexOf(val) != -1){
					var hover = !num ? 'hover' : '';

					html += '<li class="autocomplete-item"><a class="autocomplete-link '+hover+'" href="#">'+v+'</a></li>';
					num++;
				}

				if(num >= options.results){
					return false;
				}
			});

			var pos = input.offset();

			var h = input.outerHeight();

			var top = pos.top+h;
			var left = pos.left;

			var menu = $('.autocomplete[data-ac-id="'+options.id+'"]');

			menu.css({'left': left, 'top': top}).html(html);

			if(!num){
				menu.removeClass('visible');
			}else{
				menu.addClass('visible');
			}
		},

		'error': function(){
			console.log('[PipUI] autocomplete > WRONG DATA FORMAT');
		}
	};

	var ac_options = {};

	$.fn.autocomplete = function(url, options){

		if(typeof url == 'object'){
			options = url;
		}else if(typeof url == 'string'){
			options.url = url;
		}

		if(typeof options == 'undefined'){
			options = {};
		}

		var ac = this;

		var id = Math.random();

		if(typeof options.debug == 'boolean' && options.debug){
			console.log('[PipUI] autocomplete > Run');
		}

		ac.update = function(){
			this.addClass('autocomplete-trigger').each(function(){
				var that = $(this);

				id = that.attr('data-ac-id');

				if(typeof id == 'undefined'){
					id = Math.random();

					that.attr('data-ac-id', id);

					ac_options[id] = $.extend({}, {
						'id': id,
						'type': 'json',
						'method': 'GET',
						'data': [],
						'url': '',
						'timer': 300,
						'min': 2,
						'results': 10,
						'step': undefined,
						'complete': undefined,
						'error': undefined,
						'debug': false,
						'by': '',
						'params': {}
					}, options);

					if(typeof options.debug == 'boolean' && options.debug){
						console.log('[PipUI] autocomplete > Set options (Element ID: '+id+')');
					}
				}

				var url = that.attr('data-ac');

				if(typeof url == 'string' && url.length){
					ac_options[id].url = url;
				}

				var method = that.attr('data-ac-method');

				if(typeof method == 'string' && method.length){
					ac_options[id].method = method;
				}

				var type = that.attr('data-ac-type');

				if(typeof type == 'string' && type.length){
					ac_options[id].type = type;
				}

				var menu = $('.autocomplete[data-ac-id="'+id+'"]');

				if(!menu.length){
					$('body').append('<ul class="autocomplete scroll-styled" data-ac-id="'+id+'"></ul>');

					if(typeof options.debug == 'boolean' && options.debug){
						console.log('[PipUI] autocomplete > Init menu (Element ID: '+id+')');
					}
				}
			});

			ac_methods.typing($('input[data-ac-id]:focus, textarea[data-ac-id]:focus'));

			return this;
		};

		return ac.update();
	};

	$(function(){
		$('body').on('focus', 'input[data-ac], textarea[data-ac]', function(){
			var that = $(this);

			if(!that.hasClass('autocomplete-trigger')){
				that.autocomplete();
			}


			var id = that.attr('data-ac-id');

			var ac = $('.autocomplete[data-ac-id="'+id+'"]');

			if(ac.html().length){
				ac.addClass('visible');
			}

		}).on('input', 'input[data-ac-id], textarea[data-ac-id]', function(){
			ac_methods.typing($(this));
		}).on('mouseenter', '.autocomplete > .autocomplete-item > .autocomplete-link', function(){

			$('.autocomplete > .autocomplete-item > .autocomplete-link').removeClass('hover');

			$(this).addClass('hover');
		}).on('click', '.autocomplete > .autocomplete-item > .autocomplete-link', function(e){
			e.preventDefault();

			var that = $(this);

			var ac = that.closest('.autocomplete');

			var id = ac.attr('data-ac-id');

			$('.autocomplete-trigger[data-ac-id="'+id+'"]').val(that.text());

			ac.removeClass('visible');
		}).on('click', function(e){
			var that = $(e.target);

			var ac = that.closest('.autocomplete');
			var input = that.closest('.autocomplete-trigger');

			if(!ac.length && !input.length){
				$('.autocomplete').removeClass('visible');
			}
		}).on('keydown', '.autocomplete-trigger', function(e){

			var that = $(this);
			var id, ac, current;

			if(e.keyCode == 40 || e.keyCode == 38){
				e.preventDefault();

				id = that.closest('.autocomplete-trigger').attr('data-ac-id');

				ac = $('.autocomplete[data-ac-id="'+id+'"]');

				current = ac.find('.autocomplete-item > .autocomplete-link.hover');

				if(!current.length){
					if(e.keyCode == 38){
						ac.find('.autocomplete-item:last-child > .autocomplete-link').addClass('hover');
					}else{
						ac.find('.autocomplete-item:first-child > .autocomplete-link').addClass('hover');
					}
				}else{
					ac.addClass('visible');

					var next = current.closest('.autocomplete-item').next().children('.autocomplete-link');
					var prev = current.closest('.autocomplete-item').prev().children('.autocomplete-link');

					current.removeClass('hover');

					if(e.keyCode == 40){
						if(!next.length){
							ac.find('.autocomplete-item:first-child > .autocomplete-link').addClass('hover');
						}else{
							next.addClass('hover');
						}
					}else{
						if(!prev.length){
							ac.find('.autocomplete-item:last-child > .autocomplete-link').addClass('hover');
						}else{
							prev.addClass('hover');
						}
					}
				}
			}else if(e.keyCode == 13){
				e.preventDefault();

				var trigger = that.closest('.autocomplete-trigger');

				id = trigger.attr('data-ac-id');

				ac = $('.autocomplete[data-ac-id="'+id+'"]');

				current = ac.find('.autocomplete-item > .autocomplete-link.hover');

				if(current.length){
					trigger.val(current.text());
					ac.removeClass('visible');
				}

			}
		});

		$(window).on('resize scroll', function(){
			var ac = $('.autocomplete.visible');

			if(ac.length){
				var trigger = $('.autocomplete-trigger[data-ac-id="'+ac.attr('data-ac-id')+'"]');

				var pos = trigger.offset();

				ac.css({'top': (pos.top+trigger.outerHeight())+'px', 'left': pos.left});
			}
		});
	});
}(jQuery));




/***** poplight.js *****/
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




/***** popup.js *****/
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




/***** slider.js *****/
(function($){

	var slider_methods = {
		'setControl': function(num, slider){

			slider.find('.slider-control .slider-control-label.active').removeClass('active');

			slider.find('.slider-control .slider-control-label:nth-child('+(num+1)+')').addClass('active');

			return slider;
		},

		'prev': function(slider){

			if(typeof slider == 'undefined' || !slider.length){ return slider; }

			var id = slider.attr('data-slider-id');

			var options = slider_options[id];

			var prev = options.current <= 0 ? options.slides.length-1 : options.current-1;

			return this.setSlide(prev, slider);
		},

		'next': function(slider){

			if(typeof slider == 'undefined' || !slider.length){ return slider; }

			var id = slider.attr('data-slider-id');

			var options = slider_options[id];

			var next = options.current+1 >= options.slides.length ? 0 : options.current+1;

			return this.setSlide(next, slider);
		},

		'auto': function(slider, id){
			var self = this;

			var options = slider_options[id];

			if(typeof options.timeout != 'undefined'){
				clearTimeout(slider_options[id].timeout);
			}

			if(!slider.hasClass('paused') && options.auto && options.autoSpeed){
				slider_options[id].timeout = setTimeout(function(){
					self.next(slider);
				}, options.autoSpeed);
			}
		},

		'setSlide': function(num, slider){
			var self = this;

			if(typeof slider == 'undefined' || !slider.length){ return slider; }

			var id = slider.attr('data-slider-id');

			var options = slider_options[id];

			if(options.locked){ return slider; }

			slider.trigger('slider.change');

			slider_options[id].locked = true;

			var current = slider.find('.slider-wrapper > .slider-slide.active');

			current.removeClass('active');

			var next = slider.find('.slider-wrapper > .slider-slide:nth-child('+(num+1)+')');

			if(!next.length){ return; }

			if(options.current < num){
				next.css({'right': 'auto', 'left': '100%', 'z-index': '2'});
				current.css({'left': 'auto', 'right': '0', 'z-index': '1'});

				next.animate({
					'left': '0'
				}, {
					duration: options.speed,
					easing: options.easing,
					queue: false,
					complete: function(){
						$(this).addClass('active').trigger('slider.change.complete');
						self.auto(slider, id);
					}
				});

				current.animate({
					'right': '100%'
				}, {
					duration: options.speed,
					easing: options.easing,
					queue: false,
					complete: function(){
						$(this).removeClass('active').trigger('slider.change.complete');
						slider_options[id].locked = false;
						self.auto(slider, id);
					}
				});
			}else if(options.current > num){
				next.css({'left': 'auto', 'right': '100%', 'z-index': '2'});
				current.css({'right': 'auto', 'left': '0', 'z-index': '1'});

				next.animate({
					'right': '0'
				}, {
					duration: options.speed,
					easing: options.easing,
					queue: false,
					complete: function(){
						$(this).addClass('active').trigger('slider.change.complete');
						self.auto(slider, id);
					}
				});

				current.animate({
					'left': '100%'
				}, {
					duration: options.speed,
					easing: options.easing,
					queue: false,
					complete: function(){
						$(this).removeClass('active').trigger('slider.change.complete');
						slider_options[id].locked = false;
						self.auto(slider, id);
					}
				});
			}else{
				slider_options[id].locked = false;
				slider.trigger('slider.change.complete');
			}

			slider_options[id].current = num;

			return this.setControl(num, slider);
		}
	};

	var slider_options = {};

	$.fn.slider = function(options){

		var slider = this;

		var id = Math.random();

		slider_options[id] = $.extend({}, {
			'id': id,
			'height': '280px',
			'width': '100%',
			'slides': [],
			'control': 'default',
			'auto': true,
			'autoSpeed': 5000,
			'pauseOnHover': true,
			'timeout': undefined,
			'current': 0,
			'speed': 800,
			'easing': 'easeInOutQuint',
			'locked': false
		}, options);

		slider.setHeight = function(value){
			slider_options[id].height = value;
			return this;
		};

		slider.setWidth = function(value){
			slider_options[id].width = value;
			return this;
		};

		slider.setSlides = function(list){
			slider_options[id].slides = list;
			return this;
		};

		slider.setControl = function(type){
			slider_options[id].control = type;
			return this;
		};

		slider.setAuto = function(type){
			slider_options[id].auto = type;
			return this;
		};

		slider.setAutoSpeed = function(speed){
			slider_options[id].autoSpeed = speed;
			return this;
		};

		slider.setPauseOnHover = function(type){
			slider_options[id].pauseOnHover = type;
			return this;
		};

		slider.setSpeed = function(duration){
			slider_options[id].speed = duration;
			return this;
		};

		slider.setEasing = function(easing){
			slider_options[id].easing = easing;
			return this;
		};

		slider.setSlide = function(num){
			slider_methods.setSlide(num, this);
			return this;
		};

		slider.next = function(){
			slider_methods.next(this);
			return this;
		};

		slider.prev = function(){
			slider_methods.prev(this);
			return this;
		};

		slider.restoreControl = function(){
			var self = this;

			self.find('.slider-control').remove();

			self.append('<div class="slider-control"></div>');

			var control = self.children('.slider-control');

			var label = '';

			for(var i = 0; i < slider_options[id].slides.length; i++){
				label = $('<a href="#" class="slider-control-label"></a>');

				if(slider_options[id].current == i){ label.addClass('active'); }
				control.append(label);
			}

			return self;
		};

		slider.update = function(){
			var self = this;

			self.html('');

			self.addClass('slider active').attr('data-slider-id', slider_options[id].id).html('<div class="slider-wrapper" style="width: '+slider_options[id].width+'; height: '+slider_options[id].height+';"></div>');

			if(typeof slider_options[id].slides != 'object'){ return self; }

			var len = slider_options[id].slides.length;

			if(!len){ return self; }

			var slide = '';

			var wrapper = self.children('.slider-wrapper');

			for(var i = 0; i < len; i++){
				slide = slider_options[id].slides[i];

				if(typeof slide != 'string' || !slide.length){ continue; }

				slide = $(slide);

				if(i == slider_options[id].current){
					slide.addClass('active');
				}

				wrapper.append(slide);
			}

			if(typeof slider_options[id].timeout != 'undefined'){
				clearTimeout(slider_options[id].timeout);
			}

			if(slider_options[id].auto && slider_options[id].autoSpeed){
				slider_options[id].timeout = setTimeout(function(){
					self.next();
				}, slider_options[id].autoSpeed);
			}

			return self.restoreControl();
		};

		return slider.update();
	};

	$(function(){
		$('body').on('click', '.slider > .slider-control > .slider-control-label', function(e){
			e.preventDefault();

			var that = $(this);

			var id = that.closest('.slider').attr('data-slider-id');

			var slider = $('.slider[data-slider-id="'+id+'"]');

			if(typeof slider_options[id] == 'undefined'){ return; }

			var index = that.closest('.slider-control').find('.slider-control-label').index(that);

			slider_methods.setSlide(index, slider, slider_options[id]);
		}).on('mouseenter', '.slider', function(){

			var that = $(this);

			var slider = that.closest('.slider');

			var id = slider.attr('data-slider-id');

			var options = slider_options[id];

			if(options.pauseOnHover && typeof options.timeout != 'undefined'){
				if(options.auto && options.autoSpeed) {
					slider.addClass('paused');
				}

				clearTimeout(slider_options[id].timeout);
			}
		}).on('mouseleave', '.slider', function(){
			var that = $(this);

			var id = that.attr('data-slider-id');

			if(slider_options[id].pauseOnHover){
				that.removeClass('paused');
				slider_methods.auto(that, id);
			}
		});
	});
}(jQuery));




/***** tooltip.js *****/
pipui.tooltip = {
	'margin': 2,

	'trigger': 'data-tooltip',

	'fadeInSpeed': 'fast',

	'fadeOutSpeed': 'fast',

	'getPosition': function(that){
		if(typeof that.attr(pipui.tooltip.trigger) != 'undefined'){
			return '';
		}

		if(typeof that.attr(pipui.tooltip.trigger+'-left') != 'undefined'){
			return '-left';
		}

		if(typeof that.attr(pipui.tooltip.trigger+'-right') != 'undefined'){
			return '-right';
		}

		if(typeof that.attr(pipui.tooltip.trigger+'-top') != 'undefined'){
			return '-top';
		}

		return '-bottom';
	},

	'setPosition': function(e, tooltip, position){

		var top = -9999;
		var left = -9999;

		tooltip.css({'top': top+'px', 'left': left+'px'});

		var pos = e.offset();

		var width = e.outerWidth();
		var height = e.outerHeight();

		var t_width = tooltip.outerWidth();
		var t_height = tooltip.outerHeight();

		if(position == '-left'){
			top = pos.top + (height / 2) - (t_height / 2);
			left = pos.left - t_width - 4 - pipui.tooltip.margin;
		}else if(position == '-right'){
			top = pos.top + (height / 2) - (t_height / 2);
			left = pos.left + width + 4 + pipui.tooltip.margin;
		}else if(position == '-bottom'){
			top = pos.top + height + 4 + pipui.tooltip.margin;
			left = pos.left + (width / 2) - (t_width / 2);
		}else{
			top = pos.top - t_height - 4 - pipui.tooltip.margin;
			left = pos.left + (width / 2) - (t_width / 2);
		}

		tooltip.css({'top': top+'px', 'left': left+'px'});
	}
};

$(function(){
	$('body').on('mouseenter', '['+pipui.tooltip.trigger+'], ['+pipui.tooltip.trigger+'-left], ['+pipui.tooltip.trigger+'-right],['+pipui.tooltip.trigger+'-top], ['+pipui.tooltip.trigger+'-bottom]', function(){
		var that = $(this);

		var id = that.attr('data-tooltip-id');

		var position = pipui.tooltip.getPosition(that);

		var trigger = pipui.tooltip.trigger+position;

		var text = that.attr(trigger);

		if(typeof id == 'undefined'){
			id = Math.random();
			that.attr('data-tooltip-id', id);
			var append = $('<div class="tooltip" data-tooltip-id="'+id+'">'+text+'</div>');

			$('body').append(append);
		}

		var tooltip = $('.tooltip[data-tooltip-id="'+id+'"]');

		tooltip.removeClass('tooltip-pos tooltip-pos-left tooltip-pos-right tooltip-pos-bottom tooltip-pos-top').addClass('tooltip-pos'+position);

		pipui.tooltip.setPosition(that, tooltip, position);

		tooltip.addClass('show');
	}).on('mouseleave', '['+pipui.tooltip.trigger+'], ['+pipui.tooltip.trigger+'-left], ['+pipui.tooltip.trigger+'-right],['+pipui.tooltip.trigger+'-top], ['+pipui.tooltip.trigger+'-bottom]', function(){
		var tooltip = $('.tooltip.show');

		if(tooltip.length){
			tooltip.removeClass('show');
		}

	});
});




/***** alertblock.js *****/
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