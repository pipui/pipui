pipui.autocomplete = function(e){
	var _input = undefined;

	var _type = 'plain';

	var _data = [];

	var _id = Math.random();

	var _url, _key, _timeout_typing, _block, _xhr, _params;

	var _method = 'GET';

	var _timer = 400;

	var _min = 3;

	var _results = 10;

	var _debug = false;

	var self = this;

	var _value = '';

	var _result = [];

	var _templateBlock = '<div class="autocomplete" data-ac-id="{ID}"><ul class="autocomplete-list">{ITEMS}</ul></div>';

	var _templateSelector = '<li class="autocomplete-item"><a href="#" class="autocomplete-link" data-index="{KEY}" rel="nofollow">{VALUE}</a></li>';

	var _rendered = '';

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

	this.setType = function(type){
		_type = typeof type != 'string' ? 'plain' : type;

		return self;
	};

	this.setURL = function(url){
		_url = typeof url != 'string' ? '' : url;

		return self;
	};

	this.setData = function(object){
		_data = typeof object != 'object' ? [] : object;

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

	this.setInput = function(input){
		if(typeof input == 'object'){
			_input = input;
		}else if(typeof input == 'string'){
			_input = document.querySelector(input);
		}else{
			if(_debug){ console.warn('[PipUI] Autocomplete: invalid input object'); }

			return self;
		}

		var url = input.getAttribute('data-ac-url');
		if(url){ self.setURL(url); }

		var method = input.getAttribute('data-ac-method');
		if(method){ self.setMethod(method); }

		var type = input.getAttribute('data-ac-type');
		if(type){ self.setType(type); }

		var key = input.getAttribute('data-ac-key');
		if(key){ self.setKey(key); }

		var data = input.getAttribute('data-ac-data');
		if(data){ self.setData(data.split(',')).setType('array'); }

		var min = input.getAttribute('data-ac-min');
		if(min){
			min = parseInt(min);

			if(!isNaN(min) && min > 0){
				self.setMin(min);
			}
		}

		var timer = input.getAttribute('data-ac-timer');
		if(timer){
			timer = parseInt(timer);

			if(!isNaN(timer)){
				self.setTimer(timer);
			}
		}

		var results = input.getAttribute('data-ac-results');
		if(results){
			results = parseInt(results);

			if(!isNaN(results) && results > 0){
				self.setResults(results);
			}
		}

		return self;
	};

	this.setInput(e);

	this.getBlock = function(){
		_block = typeof _block != 'undefined' ? _block : document.querySelector('.autocomplete[data-ac-id="'+_id+'"]');

		if(!_block){
			p.append(document.body, _rendered);

			_block = document.querySelector('.autocomplete[data-ac-id="'+_id+'"]');
		}

		return _block;
	};

	this.hide = function(){
		var e = self.getBlock();

		if(e){
			e.classList.remove('visible');
		}

		return self;
	};

	this.show = function(){
		var e = self.getBlock();

		if(e){
			e.classList.add('visible');
		}

		return self;
	};

	this.prepend = function(e){
		_result.unshift(e);

		return self;
	};

	this.append = function(e){
		_result.push(e);

		return self;
	};

	this.choice = undefined;

	this.complete = function(e, xhr){
		if(xhr.status == 200){
			if(_type == 'json' || _type == 'array'){
				self.setData(JSON.parse(e));
			}else{
				self.setData(e.split(','));
			}
		}else{
			self.setData([]);
		}

		self.search(_value, _data);

		if(self.getResult().length){
			self.updateDOM().updatePosition().show();
		}else{
			self.hide();
		}

		return self;
	};

	this.error = function(e, xhr){
		if(_debug){ console.warn('[PipUI] Autocomplete: [CODE: '+xhr.status+'] - '+e); }

		return self;
	};

	this.request = function(){
		_xhr = new XMLHttpRequest();

		_xhr.open(_method, _url, true);

		var params = typeof _params == 'object' ? _params : new FormData();

		if(!params.has('value')){
			params.append('value', _value);
		}

		_xhr.send(params);

		_xhr.onload = function(){
			if(_xhr.status != 200){
				if(typeof self.error == 'function'){
					self.error(_xhr.responseText, _xhr);
				}else{
					if(_debug){ console.warn('[PipUI] Autocomplete: '+_xhr.responseText); }
				}
			}

			self.complete(_xhr.response, _xhr);
		};

		_xhr.onerror = function(){
			if(typeof self.error == 'function'){
				self.error('error', _xhr);
			}else{
				if(_debug){ console.warn('[PipUI] Autocomplete: request error '); }
			}
		};

		return self;
	};

	this.updatePosition = function(){
		var e = self.getBlock();

		if(e && _input){
			var pos = _input.getBoundingClientRect();
			e.style.top = (pos.top+pos.height+window.pageYOffset)+'px';
			e.style.left = (pos.left+window.pageXOffset)+'px';
		}

		return self;
	};

	this.clickEvent = function(target){

		var value = target.getAttribute('data-value');

		_input.value = value ? value : target.innerHTML;

		self.hide();

		target.classList.remove('hover');

		if(typeof self.choice == 'function'){
			self.choice(target);
		}

		return self;
	};

	this.updateClickEvents = function(){
		var links = document.querySelectorAll('.autocomplete[data-ac-id="'+_id+'"] .autocomplete-link');

		if(!links || !links.length){
			return self;
		}

		for(var i = 0; i < links.length; i++){
			if(typeof links[i].onclick != 'function'){
				(function(e){
					e.onclick = function(f){
						f.preventDefault();

						self.clickEvent(f.target);
					}
				})(links[i]);
			}
		}

		return self;
	};

	this.updateDOM = function(){
		var results = self.getResult();

		var length = results.length;

		if(!length){ self.hide(); return self; }

		var list = '';

		for(var i = 0; i < length; i++){

			var item = undefined;

			if(_type == 'plain' || _type == 'array'){
				item = p.replaceAll(_templateSelector, '{VALUE}', results[i]);
				item = p.replaceAll(item, '{KEY}', i.toString());
			}else{
				for(var key in results[i]){
					if(!results[i].hasOwnProperty(key)){ continue; }

					if(typeof item == 'undefined'){
						item = p.replaceAll(_templateSelector, '{'+key+'}', results[i][key]);
					}else{
						item = p.replaceAll(item, '{'+key+'}', results[i][key]);
					}
				}
			}

			list += item;
		}

		var block = self.getBlock();

		if(block){
			block.remove();
		}

		_block = undefined;

		_rendered = p.replaceAll(_templateBlock, '{ID}', _id);
		_rendered = p.replaceAll(_rendered, '{ITEMS}', list);

		self.getBlock();
		self.updateClickEvents();

		return self;
	};

	this.search = function(str, data){

		_result = [];

		if(_type == 'plain' && data.length){
			data = data.split(',');
		}

		var keys = data;

		if(!Array.isArray(data)){ keys = Object.keys(data); }

		if(!keys.length){ return _result; }

		var value;

		var num = 0;

		for(var key in data){
			if(!data.hasOwnProperty(key)){ continue; }

			value = typeof _key != 'undefined' ? data[key][_key] : data[key];

			if(p.indexOfCase(value, str) === -1){ continue; }

			num++;

			self.append(data[key]);

			if(num >= _results){ break; }
		}

		return _result;
	};

	this.typing = function(value){
		if(_debug){ console.info('[PipUI] Autocomplete: Typing... '+value+' | Delay: '+_timer); }

		_value = value;

		if(_value.length < _min){
			_result = [];

			self.hide();

			return self;
		}

		if(typeof _timeout_typing != 'undefined'){
			clearTimeout(_timeout_typing);
		}

		_timeout_typing = setTimeout(function(){
			if(_debug){ console.info('[PipUI] Autocomplete: Typing complete'); }

			if(typeof _url != 'undefined'){
				self.request();
			}else{
				self.search(value, _data);
				if(self.getResult().length){
					self.updateDOM().updatePosition().show();
				}else{
					self.hide();
				}
			}
		}, _timer);

		return self;
	};

	var initEvents = function(){
		_input.oninput = function(){
			self.typing(this.value);
		};

		_input.onfocus = function(){
			if(this.value.length >= _min){
				self.typing(this.value);
			}
		};

		_input.addEventListener('keydown', function(e){
			if(_value.length >= _min && e.keyCode == 40 || e.keyCode == 38 || e.keyCode == 13){
				e.preventDefault();

				if(e.keyCode == 40 || e.keyCode == 38){
					var items = document.querySelectorAll('.autocomplete[data-ac-id="'+_id+'"] .autocomplete-link');

					var length = items ? items.length : 0;

					var current = -1;

					var next = e.keyCode == 40 ? 0 : length-1;

					for(var i = 0; i < length; i++){
						if(items[i].classList.contains('hover')){
							items[i].classList.remove('hover');
							current = i; break;
						}
					}

					if(e.keyCode == 40){
						next = current == length-1 ? 0 : current + 1;
					}else{
						next = current == 0 ? length-1 : current - 1;
					}

					items[next].classList.add('hover');
				}else{
					var hovered = document.querySelector('.autocomplete[data-ac-id="'+_id+'"] .autocomplete-link.hover');

					if(hovered){
						self.clickEvent(hovered);
					}
				}
			}
		}, false);

		_input.onblur = function(e){
			//e.relatedTarget
			if(!e.relatedTarget || !e.relatedTarget.classList.contains('autocomplete-link')){
				self.hide();
			}
		};

		_input.setAttribute('data-ac-id', _id);
	};

	if(typeof _input == 'object' && _input){
		var input_length = _input.length;

		if(typeof input_length == 'number'){
			if(input_length > 0){
				_input = _input[0];
				initEvents();
			}
		}else{
			initEvents();
		}
	}

	return this;
};

document.addEventListener("DOMContentLoaded", function() {

	var elements = this.querySelectorAll('[data-ac]');

	for(var i = 0; i < elements.length; i++){
		(function(e){
			new p.autocomplete(elements[e]);
		})(i);
	}

	window.onresize = function(){
		var element = document.querySelector('.autocomplete.visible');

		if(element){
			var id = element.getAttribute('data-ac-id');

			var input = document.querySelector('input[data-ac-id="'+id+'"]');

			var pos = input.getBoundingClientRect();
			element.style.top = (pos.top+pos.height+window.pageYOffset)+'px';
			element.style.left = (pos.left+window.pageXOffset)+'px';
		}
	};
});