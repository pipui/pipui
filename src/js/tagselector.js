pipui.addModule('tagselector', '1.0.0');
p.required('tagselector', 'base', '1.4.0', '>=');
p.i18n.tagselector = {
	"pushed": 'Tagselector: tag "%" by key "%" has been pushed',
	"installed": 'Tagselector: installed'
};

pipui.tagselector_helper = {
	defaultSelector: "[data-ts]",

	is_init: function(input){
		var id = input.attr('data-ts-id');

		return typeof id == 'string' && id.length;
	}
};

pipui.tagselector = function(input){

	var _input = input;

	var _id = Math.random().toString();

	var _keys = [',', 'Enter'];

	var _min_length = 1;

	var _max_length = 32;

	var _min_tags = 0;

	var _max_tags = 0;

	var _name = 'tags';

	var _position = 'end';

	var _debug = false;

	var self = this;

	var _disableEvents = false;

	var _block, onpush, onclear;

	var _separator = ',';

	var _templateBlock = '<div class="tagselector" data-ts-id="{ID}"><ul class="tagselector-list"></ul></div>';

	var _templateSelector = '<li class="tagselector-item"><a href="#" title="Удалить" class="tagselector-link" data-title="{TITLE}" data-key="{KEY}" rel="nofollow">{TITLE}</a><input type="hidden" name="{NAME}[{KEY}]" value="{TITLE}" class="tagselector-value"></li>';

	this.setTemplateBlock = function(html){
		_templateBlock = html;

		return self;
	};

	this.setTemplateSelector = function(html){

		_templateSelector = html;

		return self;
	};

	this.setDisableEvents = function(value){

		_disableEvents = value;

		return self;
	};

	this.setMin = function(length){
		_min_length = typeof length != 'number' || length < 1 ? 1 : parseInt(length);

		return self;
	};

	this.setMax = function(length){
		_max_length = typeof length != 'number' || length < 1 ? 1 : parseInt(length);

		return self;
	};

	this.setName = function(name){
		_name = name;

		return self;
	};

	this.setKeys = function(keys){
		_keys = keys;

		return self;
	};

	this.setSeparator = function(separator){
		_separator = separator;

		return self;
	};

	this.setPosition = function(pos){
		_position = pos;

		return self;
	};

	this.setMinTags = function(length){
		_min_tags = typeof length != 'number' || length < 1 ? 1 : parseInt(length);

		return self;
	};

	this.setMaxTags = function(length){
		_max_tags = typeof length != 'number' || length < 1 ? 1 : parseInt(length);

		return self;
	};

	this.push = function(position, title, key){

		if(typeof key == 'undefined'){
			key = title;
		}

		if(self.exists(key)){ return self; }

		var html = _templateSelector.replace(/\{TITLE\}/g, title);

		html = html.replace(/\{NAME\}/g, _name);
		html = html.replace(/\{KEY\}/g, key);

		var list = _block.find('.tagselector-list');

		if(typeof position == 'undefined' || position == 'end'){
			list.append(html);
		}else{
			list.prepend(html);
		}

		if(_debug){ console.info('[PipUI] '+p.l(p.i18n.tagselector.pushed, [title, key])); }

		list.find('.tagselector-link').on('click', function(e){
			e.preventDefault();

			var tags = self.length();

			if(_min_tags <= 0 || tags > _min_tags){
				$(this).fadeOut('fast', function(){
					self.remove($(this).attr('data-key'));
				});
			}

		});

		if(typeof onpush == 'function'){
			onpush(title, key, position);
		}

		return self;
	};

	this.exists = function(key){

		if(typeof key == 'undefined' || !key.toString().length){ return false; }

		return _block.find('.tagselector-link[data-key="'+key+'"]').length > 0;
	};

	this.remove = function(key){

		if(typeof key == 'undefined' || !key.length){ return self; }

		var tags = self.length();

		if(_min_tags > 0 && tags <= _min_tags){
			return self;
		}

		var item = _block.find('.tagselector-link[data-key="'+key+'"]');

		if(item.length){
			item.closest('.tagselector-item').remove();
		}

		return self;
	};

	this.getInput = function(){
		return _input;
	};

	this.prepend = function(value, name){
		return self.push('start', value, name);
	};

	this.append = function(value, name){
		return self.push('end', value, name);
	};

	this.clear = function(){
		_block.find('.tagselector-list').empty();

		return self;
	};

	this.onclear = function(f){
		if(typeof f != 'function'){ return self; }

		onclear = f;

		return self;
	};

	this.onpush = function(f){
		if(typeof f != 'function'){ return self; }

		onpush = f;

		return self;
	};

	this.length = function(){
		return _block.find('.tagselector-link').length;
	};

	var initInput = function(trigger){
		trigger.attr('data-ts-id', _id);

		var value = trigger.val();

		var separator = trigger.attr('data-ts-separator');
		var min = trigger.attr('data-ts-min');
		var max = trigger.attr('data-ts-max');
		var name = trigger.attr('data-ts-name');
		var position = trigger.attr('data-ts-position');
		var mintags = trigger.attr('data-ts-mintags');
		var maxtags = trigger.attr('data-ts-maxtags');

		if(typeof min == 'string' && min.length){
			self.setMin(parseInt(min));
		}

		if(typeof max == 'string' && max.length){
			self.setMax(parseInt(max));
		}

		if(typeof name == 'string' && name.length){
			self.setName(name);
		}

		if(typeof separator == 'string' && separator.length){
			self.setSeparator(separator);
		}

		if(typeof position == 'string' && position.length){
			self.setPosition(position == 'end' ? position : 'start');
		}

		if(typeof mintags == 'string' && mintags.length){
			self.setMinTags(parseInt(mintags));
		}

		if(typeof maxtags == 'string' && maxtags.length){
			self.setMaxTags(parseInt(maxtags));
		}

		_block = $(_templateBlock.replace(/\{ID\}/g, _id));

		if(_max_length > 0){
			trigger.attr('maxlength', _max_length);
		}

		trigger.after(_block);

		if(value.length){
			value = p.array_unique(value.split(_separator));

			for(var i = 0; i < value.length; i++){
				if(typeof value[i] == 'undefined'){ continue; }

				self.push(_position, value[i]);
			}

			trigger.val('');
		}

		trigger.on('keydown', function(e){

			if(!_disableEvents && _keys.indexOf(e.key) !== -1){
				e.preventDefault();

				var val = trigger.val();

				if(!self.exists(val)){
					var len = val.length;

					if(_min_length > 0 && len < _min_length){
						return;
					}

					if(_max_length > 0 && len > _max_length){
						return;
					}

					var tags = self.length();

					if(_max_tags > 0 && tags >= _max_tags){
						return;
					}

					self.push(_position, val);

					trigger.val('');
				}
			}
		});

		if(_debug){ console.info('[PipUI] '+p.i18n.tagselector.installed); }

		return self;
	};

	initInput(_input);
};

$(function(){

	var list = $(pipui.tagselector_helper.defaultSelector);

	if(list.length){
		list.each(function(){
			var that = $(this);

			if(!pipui.tagselector_helper.is_init(that)){
				new pipui.tagselector(that);
			}
		});
	}
});