pipui.addModule('autocomplete', '1.0.0');
p.required('autocomplete', 'base', '1.4.0', '>=');
p.i18n.autocomplete = {
	"completed": 'Autocomplete: Search completed',
	"found": 'Autocomplete: Results found',
	"notfound": 'Autocomplete: Results not found',
	"installed": 'Autocomplete: installed',
	"typing": 'Autocomplete: Typing... % | Delay: %',
	"error": 'Autocomplete: Error "%"'
};

pipui.autocomplete_helper = {
	defaultSelector: "[data-ac]",

	is_init: function(input){
		var id = input.attr('data-ac-id');

		return typeof id == 'string' && id.length;
	},

	position: function(block, target){
		var offset = target.offset();

		var height = target.outerHeight();

		block.css({
			'top': (offset.top + height)+'px',
			'left': offset.left+'px'
		});
	}
};

pipui.autocomplete = function(input){
	var _input = input;

	var _type = 'text';

	var _data = '';

	var _id = Math.random().toString();

	var _url, _key, _timeout_typing, _block, _xhr;

	var _params = {};

	var _method = 'GET';

	var _timer = 400;

	var _min = 3;

	var _results = 10;

	var _debug = false;

	var self = this;

	var _value = '';

	var _result = [];

	var _templateBlock = '<div class="autocomplete" data-ac-id="{ID}"><ul class="autocomplete-list"></ul></div>';

	var _templateSelector = '<li class="autocomplete-item"><a href="#" class="autocomplete-link" data-key="{KEY}" data-index="{INDEX}" rel="nofollow">{VALUE}</a></li>';

	var draw = function(results){
		if(!results || !results.length){ _block.removeClass('visible'); return; }

		var list = _block.find('.autocomplete-list');

		list.empty();

		var item;

		$.each(results, function(key, obj){
			item = _templateSelector.replace(/\{KEY\}/g, obj.key);
			item = item.replace(/\{INDEX\}/g, obj.index);
			list.append(item.replace(/\{VALUE\}/g, obj.value));
		});

		_block.addClass('visible');

		_block.find('.autocomplete-link').on('click', function(e){
			e.preventDefault();

			var that = $(this);

			if(_block.hasClass('visible')){
				var id = that.attr('data-index');

				_input.val(results[id].value);

				_block.removeClass('visible');

				if(typeof choice == 'function'){
					choice(results[id], that);
				}
			}
		});
	};

	var search = function(list, str){
		_result = [];

		if(str.length < _min){
			return _result;
		}

		var founded = 0;

		if(_type == 'text'){
			list = list.split(',');
		}

		$.each(list, function(key, value){

			if(typeof _key == 'string'){
				value = value[_key];
			}

			if(typeof value == 'undefined'){
				return;
			}

			if(value.toLowerCase().indexOf(str.toLowerCase()) !== -1){
				_result.push({"value": value, "key": key, "index": founded});
				founded++;

				if(founded >= _results){
					return false;
				}
			}
		});

		if(_debug){ console.info('[PipUI] '+p.i18n.autocomplete.completed); }

		if(founded){
			if(_debug){ console.info('[PipUI] '+p.i18n.autocomplete.found); }

			if(typeof found == 'function'){
				found(_result);
			}

			pipui.autocomplete_helper.position(_block, _input);
		}else{
			if(_debug){ console.info('[PipUI] '+p.i18n.autocomplete.notfound); }

			if(typeof notfound == 'function'){
				notfound();
			}
		}

		return _result;
	};

	var initInput = function(trigger){
		trigger.attr('data-ac-id', _id);

		var data = trigger.attr('data-ac-data');
		var type = trigger.attr('data-ac-type');
		var key = trigger.attr('data-ac-key');
		var min = trigger.attr('data-ac-min');
		var url = trigger.attr('data-ac-url');
		var method = trigger.attr('data-ac-method');
		var timer = trigger.attr('data-ac-timer');
		var results = trigger.attr('data-ac-results');

		if(typeof type == 'string' && ['text', 'object', 'array', 'json'].indexOf(type.toLowerCase()) !== -1){
			self.setType(type.toLowerCase());
		}

		if(typeof data == 'string' && data.length){
			if(typeof type == 'undefined'){
				self.setType('text');
			}

			self.setData(data);
		}

		if(typeof key == 'string' && key.length){
			self.setKey(key);
		}

		if(typeof min == 'string' && min.length){
			self.setMin(parseInt(min));
		}

		if(typeof url == 'string' && url.length){
			self.setURL(url);
		}

		if(typeof method == 'string' && method.length){
			self.setMethod(method);
		}

		if(typeof timer == 'string' && timer.length){
			self.setTimer(parseInt(timer));
		}

		if(typeof results == 'string' && results.length){
			self.setResults(parseInt(results));
		}

		_block = $(_templateBlock.replace(/\{ID\}/g, _id));

		$('body').append(_block);

		if(_debug){ console.info('[PipUI] '+p.i18n.autocomplete.installed); }

		return self;
	};

	this.setParams = function(formdata){
		_params = formdata;

		return self;
	};

	this.setTemplateBlock = function(html){
		_templateBlock = html;

		return self;
	};

	this.setTemplateSelector = function(html){

		_templateSelector = html;

		return self;
	};

	this.getResult = function(){
		return _result;
	};

	this.getInput = function(){
		return _input;
	};

	this.setType = function(type){
		_type = typeof type != 'string' ? 'text' : type;

		return self;
	};

	this.setURL = function(url){
		_url = typeof url != 'string' ? '' : url;

		return self;
	};

	this.setData = function(data){
		_data = data;

		return self;
	};

	this.setMin = function(min){
		_min = typeof min != 'number' || min < 1 ? 1 : parseInt(min);

		return self;
	};

	this.setMethod = function(method){
		_method = typeof method != 'string' ? '' : method;

		return self;
	};

	this.setTimer = function(timeout){
		_timer = typeof timeout != 'number' || timeout < 0 ? 0 : parseInt(timeout);

		return self;
	};

	this.setResults = function(amount){
		_results = typeof amount != 'number' || amount < 1 ? 1 : parseInt(amount);

		return self;
	};

	this.setKey = function(key){
		_key = typeof key != 'string' ? undefined : key;

		return self;
	};

	var typing, found, notfound, error, choice, success;

	this.typing = function(f){
		if(typeof f != 'function'){ return self; }

		typing = f;

		return self;
	};

	this.choice = function(f){
		if(typeof f != 'function'){ return self; }

		choice = f;

		return self;
	};

	this.found = function(f){
		if(typeof f != 'function'){ return self; }

		found = f;

		return self;
	};

	this.notfound = function(f){
		if(typeof f != 'function'){ return self; }

		notfound = f;

		return self;
	};

	this.error = function(f){
		if(typeof f != 'function'){ return self; }

		error = f;

		return self;
	};

	this.success = function(f){
		if(typeof f != 'function'){ return self; }

		success = f;

		return self;
	};

	initInput(input);

	_input.on('input', function(){
		var that = $(this);

		_value = that.val();

		if(_debug){ console.info('[PipUI] '+p.l(p.i18n.autocomplete.typing, [_value, _timer])); }

		if(typeof typing == 'function'){
			typing(_value);
		}

		var s = {};

		if(!_url){
			if(typeof _timeout_typing != 'undefined'){ clearTimeout(_timeout_typing); }

			_timeout_typing = setTimeout(function(){
				s = search(_data, _value);

				draw(s);

				if(typeof success == 'function'){
					success(s, '');
				}
			}, _timer);
		}else{
			var formData = (_params.toString() === '[object FormData]') ? _params : new FormData();

			formData.append('value', _value);

			if(_params.toString() !== '[object FormData]'){
				if(typeof _params != 'undefined'){
					$.each(_params, function(key, value){
						formData.append(key.toString(), value.toString());
					});
				}
			}

			if(typeof _timeout_typing != 'undefined'){ clearTimeout(_timeout_typing); }

			_timeout_typing = setTimeout(function(){
				var ajax = {
					url: _url,
					type: _method,
					async: true,
					cache: false,
					contentType: false,
					processData: false,
					data: formData,

					error: function(data, textStatus, xhr){
						_xhr = xhr;

						if(_debug){ console.info('[PipUI] '+p.l(p.i18n.autocomplete.error, [textStatus])); console.error(data); }

						if(typeof error == 'function'){
							error(data);
						}
					},

					success: function(data, textStatus, xhr){
						_xhr = xhr;

						_data = data;

						s = search(_data, _value);

						draw(s);

						if(typeof success == 'function'){
							success(data, textStatus, xhr);
						}
					}
				};

				if(_type == 'json' || typeof _type == 'undefined'){
					ajax.dataType = 'json';
				}else if(_type == 'text'){
					ajax.dataType = 'text';
				}

				return $.ajax(ajax);
			}, _timer);
		}
	}).on('keydown', function(e){
		if(e.keyCode == 40 || e.keyCode == 38 || e.keyCode == 13){
			e.preventDefault();

			if(e.keyCode == 40 || e.keyCode == 38){

				var items = _block.find('.autocomplete-link');

				var length = items.length;

				var current = -1;

				var next = e.keyCode == 40 ? 0 : length-1;

				items.each(function(i){
					var that = $(this);

					if(that.hasClass('hover')){
						that.removeClass('hover');
						current = i;
					}
				});

				if(e.keyCode == 40){
					next = current == length-1 ? 0 : current + 1;
				}else{
					next = current == 0 ? length-1 : current - 1;
				}

				$(items[next]).addClass('hover');
			}else{
				var hovered = _block.find('.autocomplete-link.hover');

				if(hovered.length){
					hovered.trigger('click');
				}
			}
		}
	});
};

$(function(){
	window.onresize = function(){
		var element = $('.autocomplete.visible');

		if(element.length){
			var input = $('input[data-ac-id="'+element.attr('data-ac-id')+'"]');

			if(input.length){
				pipui.autocomplete_helper.position(element, input);
			}
		}
	};

	$('body').on('focus', pipui.autocomplete_helper.defaultSelector, function(){
		var that = $(this);

		if(!pipui.autocomplete_helper.is_init(that)){
			new pipui.autocomplete(that);
		}
	});
});