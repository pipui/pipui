pipui.addModule('bbpanel', '1.0.0');
p.required('bbpanel', 'base', '1.4.0', '>=');
p.i18n.bbpanel = {
	"b": 'Жирный',
	"i": 'Курсив',
	"u": 'Подчеркнутый',
	"s": 'Зачеркнутый',
	"left": 'Выравнивание по левому краю',
	"center": 'Выравнивание по центру',
	"right": 'Выравнивание по правому краю',
	"spoiler": 'Скрытый текст',
	"color": 'Цвет текста',
	"size": 'Размер текста',
	"img": 'Изображени',
	"quote": 'Цитата',
	"urlAlt": 'Ссылка',
	"code": 'Код',
	"line": 'Горизонтальная линия',
	"youtube": 'Ссылка на YouTube видео',
	"hide": 'Скрыть панель'
};

pipui.bbpanel = {
	element: '.bbpanel',
	targetClass: 'bbpanel-target',
	codes: {
		'b': {'title': p.i18n.bbpanel.b, 'text': '<i class="fa fa-bold"></i>', 'left': '[b]', 'right': '[/b]'},
		'i': {'title': p.i18n.bbpanel.i, 'text': '<i class="fa fa-italic"></i>', 'left': '[i]', 'right': '[/i]'},
		'u': {'title': p.i18n.bbpanel.u, 'text': '<i class="fa fa-underline"></i>', 'left': '[u]', 'right': '[/u]'},
		's': {'title': p.i18n.bbpanel.s, 'text': '<i class="fa fa-strikethrough"></i>', 'left': '[s]', 'right': '[/s]'},
		'left': {'title': p.i18n.bbpanel.left, 'text': '<i class="fa fa-align-left"></i>', 'left': '[left]', 'right': '[/left]'},
		'center': {'title': p.i18n.bbpanel.center, 'text': '<i class="fa fa-align-center"></i>', 'left': '[center]', 'right': '[/center]'},
		'right': {'title': p.i18n.bbpanel.right, 'text': '<i class="fa fa-align-right"></i>', 'left': '[right]', 'right': '[/right]'},
		'spoiler': {'title': p.i18n.bbpanel.spoiler, 'text': '<i class="fa fa-eye-slash"></i>', 'left': '[spoiler=""]', 'right': '[/spoiler]'},
		'color': {'title': p.i18n.bbpanel.color, 'text': '<i class="fa fa-paint-brush"></i>', 'left': '[color="#"]', 'right': '[/color]'},
		'size': {'title': p.i18n.bbpanel.size, 'text': '<i class="fa fa-text-height"></i>', 'left': '[size="1"]', 'right': '[/size]'},
		'img': {'title': p.i18n.bbpanel.img, 'text': '<i class="fa fa-picture-o"></i>', 'left': '[img]', 'right': '[/img]'},
		'quote': {'title': p.i18n.bbpanel.quote, 'text': '<i class="fa fa-quote-right"></i>', 'left': '[quote]', 'right': '[/quote]'},
		'urlAlt': {'title': p.i18n.bbpanel.urlAlt, 'text': '<i class="fa fa-link"></i>', 'left': '[url=""]', 'right': '[/url]'},
		'code': {'title': p.i18n.bbpanel.code, 'text': '<i class="fa fa-code"></i>', 'left': '[code]', 'right': '[/code]'},
		'line': {'title': p.i18n.bbpanel.line, 'text': '<i class="fa fa-minus"></i>', 'left': '', 'right': '[line]'},
		'youtube': {'title': p.i18n.bbpanel.youtube, 'text': '<i class="fa fa-youtube-play"></i>', 'left': '[youtube]', 'right': '[/youtube]'},
		'hide': {'title': p.i18n.bbpanel.hide, 'text': '<i class="fa fa-angle-up"></i>', 'method': function(e){
				e.closest('.bbpanel-target').slideUp('fast');
			}}
	},
	items: null,
	renderItems: function(){
		if(pipui.bbpanel.items !== null){
			return false;
		}

		pipui.bbpanel.items = '';

		$.each(pipui.bbpanel.codes, function(k, v){

			if(typeof v.method != 'undefined'){
				pipui.bbpanel.items += '<li><a href="#bb-'+k+'" class="bbpanel-tag" data-method="'+k+'" title="'+v.title+'">'+v.text+'</a></li>';
			}else{
				v.left = v.left.replace(/"/g, '&quote;');
				v.right = v.right.replace(/"/g, '&quote;');
				pipui.bbpanel.items += '<li><a href="#bb-'+k+'" class="bbpanel-tag" data-left="'+v.left+'" data-right="'+v.right+'" title="'+v.title+'">'+v.text+'</a></li>';
			}

		});

		return true;
	},
	render: function(el){
		if(typeof el == 'string'){
			el = $(el);
		}

		el.each(function(){
			var that = $(this);

			var id = that.attr('data-panel-id');

			if(typeof id == 'undefined'){
				id = Math.random();
			}else{
				return;
			}

			if(pipui.bbpanel.items === null){
				pipui.bbpanel.renderItems();
			}

			that.attr('data-panel-id', id);
			var after = $('<div class="'+pipui.bbpanel.targetClass+'" data-panel-id="'+id+'"><ul data-panel-id="'+id+'">'+pipui.bbpanel.items+'</ul></div>');

			that.after(after);
		});
	}
};

$(function(){
	$('body').on('focus', pipui.bbpanel.element, function(e){
		e.preventDefault();

		var that = $(this);

		pipui.bbpanel.render(that);

		setTimeout(function(){
			$('.'+pipui.bbpanel.targetClass+'[data-panel-id="'+that.attr('data-panel-id')+'"]').slideDown('fast');
		}, 0);
	}).on('click', '.'+pipui.bbpanel.targetClass+' .bbpanel-tag', function(e){
		e.preventDefault();

		var that = $(this);

		var method = that.attr('data-method');

		if(typeof method != 'undefined'){

			pipui.bbpanel.codes[method].method(that);

			return;
		}

		var leftTag = that.attr('data-left').replace(/&quote;/g, '"');
		var rightTag = that.attr('data-right').replace(/&quote;/g, '"');

		var id = that.closest('.'+pipui.bbpanel.targetClass).attr('data-panel-id');

		var input = $(pipui.bbpanel.element+'[data-panel-id="'+id+'"]')[0];

		input.focus();

		var value = input.value;

		var startCaret = input.selectionStart;
		var endCaret = input.selectionEnd;

		var beforeText = value.substring(0, startCaret);
		var afterText = value.substr(endCaret);
		var currentText = value.substring(startCaret, endCaret);

		input.value = beforeText+leftTag+currentText+rightTag+afterText;

		input.setSelectionRange(startCaret, leftTag.length+rightTag.length+endCaret);
	});
});