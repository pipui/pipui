pipui.addModule('datepicker', '1.0.0');
p.required('datepicker', 'base', '1.4.0', '>=');
p.i18n.datepicker = {
	"jan": 'Января',
	"feb": 'Февраля',
	"mar": 'Марта',
	"apr": 'Апреля',
	"may": 'Мая',
	"jun": 'Июня',
	"jul": 'Июля',
	"aug": 'Августа',
	"sep": 'Сентября',
	"oct": 'Октября',
	"nov": 'Ноября',
	"dec": 'Декабря',
	"year": 'Год'
};

pipui.datepicker = {
	months: [
		p.i18n.datepicker.jan, p.i18n.datepicker.feb, p.i18n.datepicker.mar,
		p.i18n.datepicker.apr, p.i18n.datepicker.may, p.i18n.datepicker.jun,
		p.i18n.datepicker.jul, p.i18n.datepicker.aug, p.i18n.datepicker.sep,
		p.i18n.datepicker.oct, p.i18n.datepicker.nov, p.i18n.datepicker.dec
	],

	template_month: '<option class="month-id" value="{MONTH_NUM}" {MONTH_SELECTED} data-value="{MONTH_NUM}">{MONTH_NAME}</option>',

	template_hour: '<option class="hour-id" value="{HOUR_NUM}" {HOUR_SELECTED} data-value="{HOUR_NUM}">{HOUR_NUM}</option>',

	template_minute: '<option class="minute-id" value="{MINUTE_NUM}" {MINUTE_SELECTED} data-value="{MINUTE_NUM}">{MINUTE_NUM}</option>',

	template_second: '<option class="second-id" value="{SECOND_NUM}" {SECOND_SELECTED} data-value="{SECOND_NUM}">{SECOND_NUM}</option>',

	template_day: '<div class="day-id {DAY_SELECTED}" data-value="{DAY_NUM}">{DAY_NUM}</div>',

	template_date: '<div class="datepicker" style="display:none;" data-datepicker-id="{ID}">' +
						'<div class="datepicker-wrapper">' +
							'<div class="datepicker-block window" data-datepicker-type="date">' +
								'<div class="block-date">' +
									'<div class="top">' +
										'<div class="block-left"><input type="number" class="datepicker-year" placeholder="'+p.i18n.datepicker.year+'" value="{CURRENT_YEAR}"></div>' +
										'<div class="block-right"><select class="datepicker-month">{MONTHLIST}</select></div>' +
									'</div>' +

									'<div class="middle">' +
										'<div class="daylist">{DAYLIST}</div>' +
									'</div>' +
								'</div>' +
							'</div>' +
						'</div>' +
					'</div>',

	template_datetime: '<div class="datepicker" style="display:none;" data-datepicker-id="{ID}">' +
							'<div class="datepicker-wrapper">' +
								'<div class="datepicker-block window" data-datepicker-type="datetime">' +
									'<div class="block-date">' +
										'<div class="top">' +
											'<div class="block-left"><input type="number" class="datepicker-year" placeholder="'+p.i18n.datepicker.year+'" value="{CURRENT_YEAR}"></div>' +
											'<div class="block-right"><select class="datepicker-month">{MONTHLIST}</select></div>' +
										'</div>' +

										'<div class="middle">' +
											'<div class="daylist">{DAYLIST}</div>' +
										'</div>' +

										'<div class="footer">' +
											'<select class="datepicker-hour">{HOURLIST}</select>' +
											'<select class="datepicker-minute">{MINUTELIST}</select>' +
											'<select class="datepicker-second">{SECONDLIST}</select>' +
										'</div>' +
									'</div>' +
								'</div>' +
							'</div>' +
						'</div>',

	monthlist: function(selected){
		var tpl = "";

		var monthlist = "";

		for(var m = 1; m <= 12; m++){
			var monthname = pipui.datepicker.months[m-1];

			tpl = pipui.datepicker.template_month.replace(/\{MONTH_NAME\}/ig, monthname);

			tpl = tpl.replace(/\{MONTH_NUM\}/ig, m.toString());

			tpl = tpl.replace(/\{MONTH_SELECTED\}/ig, selected == m ? 'selected' : '');

			monthlist += tpl;
		}

		return monthlist;
	},

	daylist: function(days, selected){
		var tpl = "";

		var daylist = "";

		for(var d = 1; d <= days; d++){
			tpl = pipui.datepicker.template_day.replace(/\{DAY_NUM\}/ig, d);

			tpl = tpl.replace(/\{DAY_SELECTED\}/ig, selected == d ? 'selected' : '');

			daylist += tpl;
		}

		return daylist;
	},

	hourlist: function(selected){
		var tpl = "";

		var hourlist = "";

		for(var h = 0; h <= 23; h++){
			h = h < 10 ? '0'+h : h;
			tpl = pipui.datepicker.template_hour.replace(/\{HOUR_NUM\}/ig, h);

			tpl = tpl.replace(/\{HOUR_SELECTED\}/ig, selected == h ? 'selected' : '');

			hourlist += tpl;
		}

		return hourlist;
	},

	minutelist: function(selected){
		var tpl = "";

		var minutelist = "";

		for(var m = 0; m <= 59; m++){
			m = m < 10 ? '0'+m : m;
			tpl = pipui.datepicker.template_minute.replace(/\{MINUTE_NUM\}/ig, m);

			tpl = tpl.replace(/\{MINUTE_SELECTED\}/ig, selected == m ? 'selected' : '');

			minutelist += tpl;
		}

		return minutelist;
	},

	secondlist: function(selected){
		var tpl = "";

		var secondlist = "";

		for(var s = 0; s <= 59; s++){
			s = s < 10 ? '0'+s : s;
			tpl = pipui.datepicker.template_second.replace(/\{SECOND_NUM\}/ig, s);

			tpl = tpl.replace(/\{SECOND_SELECTED\}/ig, selected == s ? 'selected' : '');

			secondlist += tpl;
		}

		return secondlist;
	},

	daysInMonth: function(month, year){
		return new Date(year, month, 0).getDate();
	},

	drawdays: function(picker, days, selected){
		var daylist = picker.find('.daylist');

		daylist.html(pipui.datepicker.daylist(days, selected));
	},

	update: function(picker, m, y){
		var id = picker.attr('data-datepicker-id');

		var trigger = $('[data-datepicker-trigger="'+id+'"]');

		var date = new Date();

		var year = parseInt(picker.find('.datepicker-year').val());

		var month = parseInt(picker.find('.datepicker-month').val());

		var day = parseInt(picker.find('.day-id.selected').attr('data-value'));

		if(isNaN(year) || year < 0){
			year = date.getFullYear();
		}

		if(isNaN(month) || month < 0 || month > 12){
			month = date.getMonth()+1;
		}

		if(isNaN(day) || day < 1 || day > 31){
			day = date.getDate();
		}

		var days = pipui.datepicker.daysInMonth(month, year);

		if(day > days){ day = days; }

		var type = typeof trigger.attr('data-datepicker') != 'undefined' ? 'datepicker' : 'datetimepicker';

		var str = (day<10?'0'+day:day)+'.'+(month<10?'0'+month:month)+'.'+year;

		if(type == 'datetimepicker'){
			var hour = parseInt(picker.find('.datepicker-hour').val());

			var minute = parseInt(picker.find('.datepicker-minute').val());

			var second = parseInt(picker.find('.datepicker-second').val());

			if(isNaN(hour) || hour < 0 || hour > 23){
				hour = date.getHours();
			}

			if(isNaN(minute) || minute < 0 || minute > 59){
				minute = date.getMinutes();
			}

			if(isNaN(second) || second < 1 || second > 59){
				second = date.getSeconds();
			}

			str += ' '+(hour<10?'0'+hour:hour)+':'+(minute<10?'0'+minute:minute)+':'+(second<10?'0'+second:second);
		}

		if(trigger[0].tagName == 'INPUT' || trigger[0].tagName == 'TEXTAREA'){
			trigger.val(str);
			trigger.attr('data-'+type, str);
		}

		if(m || y){
			pipui.datepicker.drawdays(picker, days, day);
		}
	},

	drawdate: function(trigger, id){
		if(typeof id == 'undefined'){
			id = trigger.attr('data-datepicker-trigger');
		}

		var current = trigger.attr('data-datepicker');

		var date = new Date();

		var value = trigger.val();

		var year = date.getFullYear();
		var month = date.getMonth()+1;
		var day = date.getDate();

		var ms = date.getTime();

		if(current != '' || value != ''){
			var splitter = current != '' ? current : value;

			var split_cur = splitter.split('.');

			var p_year_cur = parseInt(split_cur[2]);
			var p_month_cur = parseInt(split_cur[1]);
			var p_day_cur = parseInt(split_cur[0]);

			if(isNaN(p_day_cur) || p_day_cur < 1 || p_day_cur > 31){ p_day_cur = day; }

			if(isNaN(p_month_cur) || p_month_cur < 1 || p_month_cur > 12){ p_month_cur = month; }

			if(isNaN(p_year_cur)){ p_year_cur = year; }

			ms = Date.parse(p_year_cur+'-'+p_month_cur+'-'+p_day_cur);

			date = new Date(ms);

			year = date.getFullYear();
			month = date.getMonth()+1;
			day = date.getDate();
		}

		var template = pipui.datepicker.template_date.replace(/\{ID\}/ig, id);

		template = template.replace(/\{CURRENT_YEAR\}/ig, year);

		template = template.replace(/\{MONTHLIST\}/ig, pipui.datepicker.monthlist(month));

		template = template.replace(/\{DAYLIST\}/ig, pipui.datepicker.daylist(pipui.datepicker.daysInMonth(month, year), day));

		template = $(template);

		return template;
	},

	drawdatetime: function(trigger, id){
		if(typeof id == 'undefined'){
			id = trigger.attr('data-datepicker-trigger');
		}

		var current = trigger.attr('data-datetimepicker');

		var date = new Date();

		var value = trigger.val();

		var year = date.getFullYear();
		var month = date.getMonth()+1;
		var day = date.getDate();

		var hour = date.getHours();
		var minute = date.getMinutes();
		var second = date.getSeconds();

		var ms = date.getTime();

		if(current != '' || value != ''){
			var splitter = current != '' ? current : value;

			splitter = splitter.split(' ');

			if(typeof splitter[1] == 'undefined'){
				splitter[1] = '00:00:00';
			}

			var split_date_cur = splitter[0].split('.');
			var split_time_cur = splitter[1].split(':');

			var p_year_cur = parseInt(split_date_cur[2]);
			var p_month_cur = parseInt(split_date_cur[1]);
			var p_day_cur = parseInt(split_date_cur[0]);

			var p_second_cur = parseInt(split_time_cur[2]);
			var p_minute_cur = parseInt(split_time_cur[1]);
			var p_hour_cur = parseInt(split_time_cur[0]);

			if(isNaN(p_day_cur) || p_day_cur < 1 || p_day_cur > 31){ p_day_cur = day; }

			if(isNaN(p_month_cur) || p_month_cur < 1 || p_month_cur > 12){ p_month_cur = month; }

			if(isNaN(p_year_cur)){ p_year_cur = year; }

			if(isNaN(p_second_cur) || p_second_cur < 0 || p_second_cur > 59){ p_second_cur = second; }

			if(isNaN(p_minute_cur) || p_minute_cur < 0 || p_minute_cur > 59){ p_minute_cur = minute; }

			if(isNaN(p_hour_cur) || p_hour_cur < 0 || p_hour_cur > 23){ p_hour_cur = hour; }

			ms = Date.parse(p_year_cur+'-'+p_month_cur+'-'+p_day_cur+' '+p_hour_cur+':'+p_minute_cur+':'+p_second_cur);

			date = new Date(ms);

			year = date.getFullYear();
			month = date.getMonth()+1;
			day = date.getDate();

			hour = date.getHours();
			minute = date.getMinutes();
			second = date.getSeconds();
		}

		var template = pipui.datepicker.template_datetime.replace(/\{ID\}/ig, id);

		template = template.replace(/\{CURRENT_YEAR\}/ig, year);

		template = template.replace(/\{MONTHLIST\}/ig, pipui.datepicker.monthlist(month));

		template = template.replace(/\{DAYLIST\}/ig, pipui.datepicker.daylist(pipui.datepicker.daysInMonth(month, year), day));

		template = template.replace(/\{HOURLIST\}/ig, pipui.datepicker.hourlist(hour));

		template = template.replace(/\{MINUTELIST\}/ig, pipui.datepicker.minutelist(minute));

		template = template.replace(/\{SECONDLIST\}/ig, pipui.datepicker.secondlist(second));

		template = $(template);

		return template;
	},

	init_date: function(input){
		var id = input.attr('data-datepicker-trigger');

		if(typeof id == 'undefined'){
			id = Math.random().toString();

			input.attr('data-datepicker-trigger', id);
		}

		var picker = $('.datepicker[data-datepicker-id="'+id+'"]');

		if(picker.length){
			return picker;
		}

		var draw = pipui.datepicker.drawdate(input, id);

		$('body').append(draw);

		return draw;
	},

	init_datetime: function(input){
		var id = input.attr('data-datepicker-trigger');

		if(typeof id == 'undefined'){
			id = Math.random().toString();

			input.attr('data-datepicker-trigger', id);
		}

		var picker = $('.datepicker[data-datepicker-id="'+id+'"]');

		if(picker.length){
			return picker;
		}

		var draw = pipui.datepicker.drawdatetime(input, id);

		$('body').append(draw);

		return draw;
	}
};

$(function(){
	$('body').on('mousedown', '[data-datepicker]', function(e){
		e.preventDefault();

		var that = $(this);

		setTimeout(function(){ that.trigger('blur'); }, 10);

		var picker = pipui.datepicker.init_date(that);

		picker.replaceWith(picker);

		picker.fadeIn('fast');
	}).on('click', '[data-datetimepicker]', function(e){
		e.preventDefault();

		var that = $(this);

		setTimeout(function(){ that.trigger('blur'); }, 10);

		var picker = pipui.datepicker.init_datetime(that);

		picker.replaceWith(picker);

		picker.fadeIn('fast');
	}).on('input', '.datepicker input', function(){
		var picker = $(this).closest('.datepicker');

		pipui.datepicker.update(picker);
	}).on('change', '.datepicker select', function(){
		var picker = $(this).closest('.datepicker');

		pipui.datepicker.update(picker, undefined, true);
	}).on('click', '.datepicker .day-id', function(){
		var that = $(this);

		var picker = that.closest('.datepicker');

		var id = picker.attr('data-datepicker-id');

		var trigger = $('[data-datepicker-trigger="'+id+'"]');

		picker.find('.day-id.selected').removeClass('selected');

		that.addClass('selected');

		pipui.datepicker.update(picker, true);

		if(trigger.attr('data-datepicker-autoclose') == 'true'){
			picker.fadeOut('fast');
		}
	});

	$('html').on('click', 'body', function(e){

		var target = $(e.target);

		if(!target.closest('.datepicker-block').length){
			target.closest('.datepicker').fadeOut('fast');
		}
	});
});