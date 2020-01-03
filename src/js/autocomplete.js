pipui.autocomplete = {
	min: 3,

	timeout: undefined,

	getID: function(el){
		var id = el.attr('data-autocomplete-id');

		if(typeof id == 'undefined'){
			id = Math.random();
			el.attr('data-autocomplete-id', id);
		}

		return id;
	},

	hideAll: function(){
		$('.pipui-autocomplete').hide();

		$('.pipui-autocomplete > ul > li.active').removeClass('active');
	}
};

$(function(){
	$('body').on('focus', 'input[data-autocomplete], textarea[data-autocomplete]', function(){
		$(this).attr('autocomplete', 'off');
	}).on('input', 'input[data-autocomplete], textarea[data-autocomplete]', function(){

		var that = $(this);

		var id = pipui.autocomplete.getID(that);

		var list = $('.pipui-autocomplete[data-autocomplete-id="'+id+'"] > ul');

		if(!list.length){
			that.after('<div class="pipui-autocomplete" data-autocomplete-id="'+id+'"><ul></ul></div>');

			list = $('.pipui-autocomplete[data-autocomplete-id="'+id+'"] > ul')
		}

		that.attr('data-autocomplete-end', that[0].selectionEnd);

		var separator = that.attr('data-autocomplete-sep');

		var wrapper = list.closest('.pipui-autocomplete');

		var value = $.trim(that.val());

		var min = parseInt(that.attr('data-autocomplete-min'));

		if(isNaN(min) || min<=0){ min = pipui.autocomplete.min; }

		if(separator){
			var prev = value.substr(0, that[0].selectionEnd);

			var split = prev.split(separator);

			var pos = split.length-1;

			value = $.trim(split[pos]);
		}

		var len = value.length;

		var url = $.trim(that.attr('data-autocomplete'));

		if(len < min || url == ''){
			wrapper.hide();
			list.html('');
			return;
		}

		if(typeof pipui.autocomplete.timeout != 'undefined'){
			clearTimeout(pipui.autocomplete.timeout);
		}

		pipui.autocomplete.timeout = setTimeout(function(){
			qx.load_elements(url, {'value': value}, function(data){
				list.html('');

				if(!data.type){
					wrapper.hide();
					return;
				}

				if(!data.list.length){
					wrapper.hide();
				}else{
					$.each(data.list, function(k, v){
						list.append('<li data-id="'+v.id+'" data-value="'+v.value+'">'+v.value+'</li>');
					});

					var pos = that.position();

					wrapper.css({
						'display': 'block',
						'top': (pos.top+that.outerHeight())+'px',
						'left': pos.left+'px'
					});
				}

			}, false, function(data){
				wrapper.hide();
				list.html('');
				console.log(data);
			});
		}, 300);
	}).on('keydown', 'input[data-autocomplete], textarea[data-autocomplete]', function(e){

		if(e.keyCode==40 || e.keyCode==38){
			e.preventDefault();

			var id = pipui.autocomplete.getID($(this));

			var list = $('.pipui-autocomplete[data-autocomplete-id="'+id+'"] > ul > li');

			if(!list.length){ return; }

			var current = $('.pipui-autocomplete[data-autocomplete-id="'+id+'"] > ul > li.active');

			var next = $('.pipui-autocomplete[data-autocomplete-id="'+id+'"] > ul > li:first-child');

			if(!current.length){
				if(e.keyCode==40){
					next = $('.pipui-autocomplete[data-autocomplete-id="'+id+'"] > ul > li:first-child');
				}else{
					next = $('.pipui-autocomplete[data-autocomplete-id="'+id+'"] > ul > li:last-child');
				}
			}else{
				if(e.keyCode==40){
					next = current.next();

					if(!next.length){
						next = $('.pipui-autocomplete[data-autocomplete-id="'+id+'"] > ul > li:first-child');
					}
				}else{
					next = current.prev();

					if(!next.length){
						next = $('.pipui-autocomplete[data-autocomplete-id="'+id+'"] > ul > li:last-child');
					}
				}
			}

			list.removeClass('active');

			next.addClass('active');

			var ac = $('.pipui-autocomplete[data-autocomplete-id="'+id+'"] > ul');

			var scroll = ac.scrollTop();

			var top = next.position().top;

			ac.scrollTop(scroll + top - 4);
		}
	}).on('keypress', 'input[data-autocomplete], textarea[data-autocomplete]', function(e){
		if(e.keyCode == 13){
			e.preventDefault();

			var that = $(this);

			var id = pipui.autocomplete.getID($(this));

			var current = $('.pipui-autocomplete[data-autocomplete-id="'+id+'"] > ul > li.active');

			if(!current.length){ return; }

			var newvalue = current.attr('data-value');

			var separator = that.attr('data-autocomplete-sep');

			if(separator){
				var value = that.val();

				var prev = value.substr(0, that[0].selectionEnd);

				var pos = prev.split(separator).length-1;

				var split = value.split(separator);

				split[pos] = newvalue;

				newvalue = pipui.array_unique(split).join(separator);
			}

			that.val(newvalue);

			pipui.autocomplete.hideAll();

			that[0].focus();
		}
	}).on('click', '.pipui-autocomplete > ul > li', function(e){
		e.preventDefault();

		var that = $(this);

		var id = that.closest('.pipui-autocomplete').attr('data-autocomplete-id');

		var input = $('input[data-autocomplete-id="'+id+'"], input[data-autocomplete-id="'+id+'"]');

		var newvalue = that.attr('data-value');

		var separator = input.attr('data-autocomplete-sep');

		if(separator){
			var value = input.val();

			var prev = value.substr(0, input[0].selectionEnd);

			var pos = prev.split(separator).length-1;

			var split = value.split(separator);

			split[pos] = newvalue;

			newvalue = pipui.array_unique(split).join(separator);
		}

		input.val(newvalue);

		pipui.autocomplete.hideAll();

		input[0].focus();
	}).on('blur', 'input[data-autocomplete], textarea[data-autocomplete]', function(){
		setTimeout(function(){
			pipui.autocomplete.hideAll();
		}, 100);
	});
});