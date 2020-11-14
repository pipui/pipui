pipui.addModule('textarea', '1.0.0');

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