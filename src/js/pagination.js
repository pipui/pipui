pipui.pagination = {
	get_data: function(e){
		var type = parseInt(e.attr('data-pagination'));

		if(isNaN(type)){
			type = 0;
		}

		var current = parseInt(e.attr('data-pagination-current'));

		if(isNaN(current)){
			current = 1;
		}

		var pages = parseInt(e.attr('data-pagination-pages'));

		if(isNaN(pages)){
			pages = 1;
		}

		var url = e.attr('data-pagination-url');

		if(typeof url == 'undefined'){
			url = '/page-{NUM}';
		}

		return {'type': type, 'current': current, 'pages': pages, 'url': url};
	},

	init: function(){

		var pagin = $('.pagination[data-pagination]');

		pagin.each(function(){
			var that = $(this);

			var data = pipui.pagination.get_data(that);

			var filter = pipui.pagination.types[data.type];

			if(typeof filter == 'undefined'){
				return;
			}

			filter.update(that, data.current, data.pages, data.url)
		});

		pagin.fadeIn();
	},

	types: {
		0: {
			update: function(element, current, pages, url){
				var string = "";

				for(var i = 1; i <= pages; i++){
					string += '<li data-page="'+i+'" '+(i == current ? 'class="active"' : '')+'>';
					string += '<a title="'+i+'" href="'+url.replace('{NUM}', i)+'">'+i+'</a>';
					string += '</li>';
				}

				element.html(string);
			}
		},

		1: {
			pages: 2,
			update: function(element, current, pages, url){
				var string = "";

				var pagenum = this.pages;

				if(pages < (pagenum * 2 + 1)){
					pagenum = Math.floor(pages / 2) - 1
				}

				if(current > 1){
					string += '<li class="scroller"><a href="'+url.replace('{NUM}', current-1)+'">‹</a></li>';
				}

				for(var a = pagenum; a < current; a++){
					if(a<1){ continue; }
					string += '<li data-page="'+a+'" '+(a == current ? 'class="active"' : '')+'>';
					string += '<a title="'+a+'" href="'+url.replace('{NUM}', a)+'">'+a+'</a>';
					string += '</li>';
				}

				string += '<li class="active" data-page="'+current+'">';
				string += '<a title="'+current+'" href="'+url.replace('{NUM}', current)+'">'+current+'</a>';
				string += '</li>';

				for(var i = current+1; i <= pagenum; i++){
					if(i > pages){ continue; }
					string += '<li  data-page="'+i+'" '+(i == current ? 'class="active"' : '')+'>';
					string += '<a title="'+i+'" href="'+url.replace('{NUM}', i)+'">'+i+'</a>';
					string += '</li>';
				}

				if(current < pages){
					string += '<li class="scroller"><a href="'+url.replace('{NUM}', current+1)+'">›</a></li>';
				}

				element.html(string);
			}
		},

		2: {
			pages: 2,
			update: function(element, current, pages, url){
				var string = "";

				var pagenum = this.pages;

				if(pages < (pagenum * 2 + 1)){
					pagenum = Math.floor(pages / 2) - 1
				}

				if(current-1 > 1){
					string += '<li class="scroller"><a href="'+url.replace('{NUM}', 1)+'">«</a></li>';
				}

				if(current > 1){
					string += '<li class="scroller"><a href="'+url.replace('{NUM}', current-1)+'">‹</a></li>';
				}

				for(var a = pagenum; a < current; a++){
					if(a < 1){ continue; }
					string += '<li data-page="'+a+'" '+(a == current ? 'class="active"' : '')+'>';
					string += '<a title="'+a+'" href="'+url.replace('{NUM}', a)+'">'+a+'</a>';
					string += '</li>';
				}

				string += '<li data-page="'+current+'" class="active">';
				string += '<a title="'+current+'" href="'+url.replace('{NUM}', current)+'">'+current+'</a>';
				string += '</li>';

				for(var i = current+1; i <= pagenum; i++){
					if(i > pages){ continue; }
					string += '<li data-page="'+i+'" '+(i == current ? 'class="active"' : '')+'>';
					string += '<a title="'+i+'" href="'+url.replace('{NUM}', i)+'">'+i+'</a>';
					string += '</li>';
				}

				if(current < pages){
					string += '<li class="scroller"><a href="'+url.replace('{NUM}', current+1)+'">›</a></li>';
				}

				if(current < pages-1){
					string += '<li class="scroller"><a href="'+url.replace('{NUM}', pages)+'">»</a></li>';
				}

				element.html(string);
			}
		},

		3: {
			pages: 2,
			scroll: function(position, element){
				var data = pipui.pagination.get_data(element);

				var selected = parseInt(element.find('li.selected').attr('data-page'));

				if(position == 'prev'){
					if(selected-1 < 1){ selected = 2; }
					this.update(element, data.current, data.pages, data.url, selected-1);
				}else if(position == 'next'){
					if(selected+1 > data.pages){ selected = data.pages-1; }
					this.update(element, data.current, data.pages, data.url, selected+1);
				}else if(position == 'first'){
					this.update(element, data.current, data.pages, data.url, 1);
				}else if(position == 'last'){
					this.update(element, data.current, data.pages, data.url, data.pages);
				}
			},
			update: function(element, current, pages, url, selected){
				var string = "";

				var pagenum = pipui.pagination.types[3].pages;

				if(pages < (pagenum * 2 + 1)){
					pagenum = Math.floor(pages / 2) - 1
				}

				if(typeof selected == 'undefined'){
					selected = current;
				}

				var start = selected - pagenum;

				if(start < 1){
					start = 1;
				}

				var end = start + (pagenum * 2);

				if(end > pages) {
					end = pages;
					start = end - (pagenum * 2);
				}

				if(pagenum <= 1){
					start = 1;
					end = pages;
				}

				string += '<li class="scroller"><a data-pagination-scroll="first" href="#">«</a></li>';
				string += '<li class="scroller"><a data-pagination-scroll="prev" href="#">‹</a></li>';

				/*if(selected > 2){
					string += '<li class="scroller"><a data-pagination-scroll="first" href="#">«</a></li>';
				}

				if(selected > 1){
					string += '<li class="scroller"><a data-pagination-scroll="prev" href="#">‹</a></li>';
				}*/

				var is_current = '';
				var is_selected = '';

				for(var i = start; i <= end; i++){

					is_current = (i == current) ? 'active' : '';
					is_selected = (i == selected) ? 'selected' : '';

					string += '<li class="'+is_current+' '+is_selected+'" data-page="'+i+'">';
					string += '<a title="'+i+'" href="'+url.replace('{NUM}', i)+'">'+i+'</a>';
					string += '</li>';
				}

				string += '<li class="scroller"><a data-pagination-scroll="next" href="#">›</a></li>';
				string += '<li class="scroller"><a data-pagination-scroll="last" href="#">»</a></li>';

				/*if(selected < pages){
					string += '<li class="scroller"><a data-pagination-scroll="next" href="#">›</a></li>';
				}

				if(selected < pages-1){
					string += '<li class="scroller"><a data-pagination-scroll="last" href="#">»</a></li>';
				}*/

				element.html(string);
			}
		}
	}
};

$(function(){

	$('.pagination[data-pagination]').hide();
	pipui.pagination.init();

	$('body').on('click', '.pagination[data-pagination] [data-pagination-scroll]', function(e){
		e.preventDefault();

		var that = $(this);

		var pagination = that.closest('.pagination');

		var data = pipui.pagination.get_data(pagination);

		var position = that.attr('data-pagination-scroll');

		pipui.pagination.types[data.type].scroll(position, pagination);
	});
});