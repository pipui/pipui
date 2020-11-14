var pipui = {
	v: '1.4.0',
	enable_compatible: true,

	array_unique: function(array){
		var result = [];

		for(var i = 0; i < array.length; i++){
			if(result.indexOf(array[i]) === -1){
				result.push(array[i]);
			}
		}

		return result;
	},

	indexOfCase: function(haystack, needle){
		var index = -1;

		needle = needle.toLowerCase();

		if(typeof haystack == 'object'){
			for(var i = 0; i < haystack.length; i++){
				if(haystack[i].toLowerCase() == needle){
					index = i; break;
				}
			}
		}else{
			index = haystack.toLowerCase().indexOf(needle);
		}

		return index;
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
	},

	dependencies: {},

	required: function(component, needle, version, operator){
		if(typeof operator == 'undefined'){
			operator = '=';
		}

		this.dependencies[component].push({
			'name': needle,
			'version': version,
			'operator': operator
		});
	},

	addModule: function(name, version){
		this.modules[name] = version;
		this.dependencies[name] = [];
	},

	modules: {},

	moduleExists: function(name){
		return typeof this.modules[name] != 'undefined';
	},

	moduleVersion: function(name){
		if(!this.moduleExists(name)){ return null; }

		return this.modules[name];
	},

	// <, >, <=, >=, =, !=, <>
	version_compare: function(v1, v2, operator){

		if(typeof operator == 'undefined'){
			operator = '=';
		}

		if(operator == '=' || operator == '==' || operator == '==='){
			return v1 === v2;
		}

		if(operator == '!=' || operator == '<>' || operator == '!=='){
			return v1 !== v2;
		}

		var i, x;
		var compare = 0;

		var vm = {
			'dev': -6,
			'alpha': -5,
			'a': -5,
			'beta': -4,
			'b': -4,
			'RC': -3,
			'rc': -3,
			'#': -2,
			'p': 1,
			'pl': 1
		};

		var _prepVersion = function(v){
			v = ('' + v).replace(/[_\-+]/g, '.');
			v = v.replace(/([^.\d]+)/g, '.$1.').replace(/\.{2,}/g, '.');
			return (!v.length ? [-8] : v.split('.'))
		};

		var _numVersion = function(v){
			return !v ? 0 : (isNaN(v) ? vm[v] || -7 : parseInt(v, 10))
		};

		v1 = _prepVersion(v1);
		v2 = _prepVersion(v2);
		x = Math.max(v1.length, v2.length);

		for(i = 0; i < x; i++){
			if(v1[i] === v2[i]){ continue }

			v1[i] = _numVersion(v1[i]);
			v2[i] = _numVersion(v2[i]);

			if(v1[i] < v2[i]){
				compare = -1;
				break
			}else if(v1[i] > v2[i]){
				compare = 1;
				break
			}
		}

		if(!operator){ return compare; }

		switch(operator){
			case '>':
			case 'gt': return (compare > 0);
			case '>=':
			case 'ge': return (compare >= 0);
			case '<=':
			case 'le': return (compare <= 0);
			case '<':
			case 'lt': return (compare < 0);
		}

		return null;
	},

	compatible: function(){
		$.each(pipui.dependencies, function(k, v){
			if(!v.length){ return; }

			for(var i = 0; i < v.length; i++){
				if(typeof v[i] == 'undefined'){ continue; }

				if(!pipui.moduleExists(v[i].name)){
					console.warn('[PipUI] '+pipui.l(pipui.i18n.base.requires, [k, v[i].name]));

					return;
				}

				if(!pipui.version_compare(pipui.moduleVersion(v[i].name), v[i].version, v[i].operator)){
					console.warn('[PipUI] '+pipui.l(pipui.i18n.base.requires_version, [k, v[i].name, v[i].operator], v[i].version));
				}
			}

		});
	},

	l: function(str, data, symbol){
		if(typeof symbol == 'undefined'){ symbol = '%'; }

		if(typeof data == 'string'){ return str.replaceAll(symbol, data); }

		var symbol_len = symbol.length;

		var n = 0;

		while(true){
			var search = str.indexOf(symbol);

			if(search === -1 || typeof data[n] == 'undefined'){ break; }

			var replace1 = str.substr(0, search);
			var replace2 = str.substr(search+symbol_len);

			str = replace1+data[n]+replace2;

			n++;
		}

		return str;
	},

	i18n: {
		"base": {
			"requires": 'Component "%" requires component %',
			"requires_version": 'Component % requires component % version % %',
		},
	},
};

var p = pipui;

pipui.addModule('base', pipui.v);

$(function(){

	if(p.enable_compatible){
		p.compatible();
	}

	$('body').on('click', '.preventDefault', function(e){
		e.preventDefault();
	});
});