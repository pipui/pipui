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
						if(options.data.length){
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
			var len = data.length;

			var val = input.val().toLowerCase();

			var num = 0;

			var html = '';

			for(var i = 0; i < len; i++){
				if(data[i].toLowerCase().indexOf(val) != -1){
					var hover = !num ? 'hover' : '';

					html += '<li class="autocomplete-item"><a class="autocomplete-link '+hover+'" href="#">'+data[i]+'</a></li>';
					num++;
				}

				if(num >= options.results){
					break;
				}else{

				}
			}

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

				var id = that.attr('data-ac-id');

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