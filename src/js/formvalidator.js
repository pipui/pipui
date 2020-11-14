pipui.addModule('formvalidator', '1.0.0');
p.required('formvalidator', 'base', '1.4.0', '>=');
p.i18n.formvalidator = {
	"incorrect": 'Поле заполнено неверно'
};

pipui.formvalidator = {
	form: '[data-formvalidator]',

	timeout: 2000,

	defaultType: 'warning',

	storage: {}
};

$(function(){
	$('body').on('click', pipui.formvalidator.form+' [type="submit"]', function(e){
		var that = $(this);

		var form = that.closest('form');

		var valid = true;

		var fields = form.find('input, textarea, select');

		for(var i = 0; i < fields.length; i++){

			var name = fields[i].getAttribute('name');

			if(name === null){
				continue;
			}

			var el = $(fields[i]);

			if(fields[i].checkValidity()){
				continue;
			}

			valid = false;

			var id = el.attr('data-formvalidator-id');

			if(typeof id === 'undefined'){
				id = Math.random().toString();
				el.attr('data-formvalidator-id', id);
			}

			var text = el.attr('data-formvalidator-text');

			if(typeof text == 'undefined'){
				text = p.i18n.formvalidator.incorrect;
			}

			var alert = $('.formvalidator-alert[data-formvalidator-id="'+id+'"]');

			if(!alert.length){
				var label = el.closest('label');
				if(label.length){
					label.after('<div class="formvalidator-alert" data-formvalidator-id="'+id+'"></div>');
				}else{
					el.after('<div class="formvalidator-alert" data-formvalidator-id="'+id+'"></div>');
				}
				alert = $('.formvalidator-alert[data-formvalidator-id="'+id+'"]');
			}

			var type = el.attr('data-formvalidator-type');

			if(typeof type == 'undefined'){
				type = pipui.formvalidator.defaultType;
			}

			alert.removeClass('warning info danger success').addClass(type);

			var icon = '';

			if(type == 'warning'){
				icon = '<i class="fa fa-exclamation-triangle"></i>';
			}else if (type == 'danger'){
				icon = '<i class="fa fa-exclamation-circle"></i>'
			}else if (type == 'info'){
				icon = '<i class="fa fa-info-circle"></i>'
			}else if (type == 'success'){
				icon = '<i class="fa fa-check-circle"></i>'
			}

			alert.html('<div class="wrapper"><div class="icon-block">'+icon+'</div><div class="text-block">'+text+'</div><div class="close-block"><a href="#" class="close">&times;</a></div></div>').fadeIn('fast');
		}

		if(!valid){
			e.preventDefault();
			e.stopPropagation();
			e.stopImmediatePropagation();

			return false;
		}
	}).on('click', '.formvalidator-alert > .wrapper > .close-block > .close', function(e){
		e.preventDefault();

		$(this).closest('.formvalidator-alert').fadeOut('fast');
	}).on('input change', pipui.formvalidator.form+' input, '+pipui.formvalidator.form+' select, '+pipui.formvalidator.form+' textarea', function(){
		var that = $(this);

		if(that[0].checkValidity()){
			var alert = $('.formvalidator-alert[data-formvalidator-id="'+that.attr('data-formvalidator-id')+'"]');

			if(alert.length){
				alert.fadeOut('fast');
			}
		}
	});
});