pipui.addModule('tabindex', '1.0.0');

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