var pipui = {
	a: 10,

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

	append: function(e, content){
		if(typeof content == 'object'){
			e.append(content);
		}else{
			e.insertAdjacentHTML('beforeend', content);
		}
	},

	prepend: function(e, content){
		if(typeof content == 'object'){
			e.prepend(content);
		}else{
			e.insertAdjacentHTML('afterbegin', content);
		}
	},

	after: function(e, content){
		if(typeof content == 'object'){
			e.parentNode.insertBefore(content, e.nextSibling);
		}else{
			e.insertAdjacentHTML('afterend', content);
		}
	},

	before: function(e, content){
		if(typeof content == 'object'){
			e.parentNode.insertBefore(content, e);
		}else{
			e.insertAdjacentHTML('beforebegin', content);
		}
	},

	replaceAll: function(str, match, replacement){
		return str.split(match).join(replacement);
	}
};

var p = pipui;

$(function(){
	$('body').on('click', '.preventDefault', function(e){
		e.preventDefault();
	});
});