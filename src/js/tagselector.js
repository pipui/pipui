pipui.tagselector = function(e){
	var _input = undefined;

	var _id = Math.random().toString();

	var _block;

	var _min = 1;

	var _maxTags = 0;

	var _debug = true;

	var self = this;

	var _position = 'append';

	var _disableEvents = false;

	var _templateBlock = '<div class="tagselector" data-ts-id="{ID}"><ul class="tagselector-list"></ul></div>';

	var _templateSelector = '<li class="tagselector-item"><a href="#" title="Удалить" class="tagselector-link" data-value="{VALUE}" rel="nofollow">{NAME}</a><input type="hidden" name="tags[{NAME}]" value="{VALUE}" class="tagselector-value"></li>';

	this.setTemplateBlock = function(html){
		_templateBlock = html;

		return self;
	};

	this.setDisableEvents = function(value){

		_disableEvents = value;

		return self;
	};

	this.setTemplateSelector = function(html){

		_templateSelector = html;

		return self;
	};

	this.getResult = function(){
		return _input ? _input.value : '';
	};

	this.getInput = function(){
		return _input;
	};

	this.setMin = function(min){
		_min = typeof min != 'number' || min < 1 ? 1 : parseInt(min);

		return self;
	};

	this.setName = function(name){

		var inputs = self.getBlock().querySelectorAll('.tagselector-value');

		for(var i = 0; i < inputs.length; i++){
			var item = inputs[i];

			var subname = item.getAttribute('name');

			item.setAttribute('name', name+item.substring(subname.indexOf('[')));
		}

		return self;
	};

	this.setPosition = function(position){
		_position = typeof position != 'string' ? 'append' : position;

		return self;
	};

	this.setMaxTags = function(value){
		_maxTags = typeof value != 'number' || value < 0 ? 0 : parseInt(value);

		return self;
	};

	this.setInput = function(input){
		if(typeof input == 'object'){
			_input = input;
		}else if(typeof input == 'string'){
			_input = document.querySelector(input);
		}else{
			if(_debug){ console.warn('[PipUI] Tag selector: invalid input object'); }

			return self;
		}

		var position = input.getAttribute('data-ts-position');
		if(position){ self.setPosition(position); }

		var name = input.getAttribute('data-ts-name');
		if(name){ self.setName(name); }

		var min = input.getAttribute('data-ts-min');
		if(min){
			min = parseInt(min);

			if(!isNaN(min) && min > 0){
				self.setMin(min);
			}
		}

		var max_tags = input.getAttribute('data-ts-max-tags');
		if(max_tags){
			max_tags = parseInt(max_tags);

			if(!isNaN(max_tags)){
				self.setMaxTags(max_tags);
			}
		}

		return self;
	};

	this.setInput(e);

	this.getBlock = function(){
		_block = typeof _block != 'undefined' ? _block : document.body.querySelector('.tagselector[data-ts-id="'+_id+'"]');

		if(!_block){
			p.after(_input, p.replaceAll(_templateBlock, '{ID}', _id));

			_block = document.body.querySelector('.tagselector[data-ts-id="'+_id+'"]');
		}

		return _block;
	};

	this.pend = function(position, value, name){
		var block = self.getBlock();

		var html = p.replaceAll(_templateSelector, '{VALUE}', value);

		if(typeof name == 'undefined'){
			name = value;
		}

		html = p.replaceAll(html, '{NAME}', name);

		var list = block.querySelector('.tagselector-list');

		if(typeof position == 'undefined' || position == 'append'){
			p.append(list, html)
		}else{
			p.prepend(list, html);
		}

		self.updateClickEvents();

		return self;
	};

	this.prepend = function(value, name){
		return self.pend('prepend', value, name);
	};

	this.append = function(value, name){
		return self.pend('append', value, name);
	};

	this.error = function(e, xhr){
		if(_debug){ console.warn('[PipUI] Tag selector: [CODE: '+xhr.status+'] - '+e); }

		return self;
	};

	this.clickEvent = function(link){

		var li = link.closest('.tagselector-item');

		if(li){ li.remove(); }

		return self;
	};

	this.updateClickEvents = function(){
		var items = document.querySelectorAll('.tagselector[data-ts-id="'+_id+'"] .tagselector-link');

		if(!items || !items.length){
			return self;
		}

		for(var i = 0; i < items.length; i++){
			if(typeof items[i].onclick != 'function'){
				(function(e){
					e.onclick = function(f){
						f.preventDefault();

						self.clickEvent(f.target);
					}
				})(items[i]);
			}
		}

		return self;
	};

	var initEvents = function(){

		_input.addEventListener('keydown', function(e){

			if(!_disableEvents){
				var value = _input.value.trim();

				if(value.length >= _min && (e.keyCode == 188 || e.keyCode == 13)){

					if(_debug){ console.warn('[PipUI] Tag selector: press key '+e.keyCode); }

					var values = self.getBlock().querySelectorAll('.tagselector-value');

					var index = self.getBlock().querySelectorAll('.tagselector-value[value="'+value+'"]').length;

					if((_maxTags <= 0 || values.length < _maxTags) && !index){
						self.pend(_position, value);

						_input.value = '';
					}

				}
			}
		}, false);

		var value = _input.value;

		if(value.length){
			var items = value.split(',');

			for(var i = 0; i < items.length; i++){
				self.pend(undefined, items[i]);
			}

			_input.value = '';
		}

		self.updateClickEvents();

		_input.setAttribute('data-ts-id', _id);
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

	var elements = this.querySelectorAll('[data-ts]');

	for(var i = 0; i < elements.length; i++){
		(function(e){
			new p.tagselector(elements[e]);
		})(i);
	}
});