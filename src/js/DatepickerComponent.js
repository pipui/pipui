class DatepickerComponent {
	static VERSION = '2.0.0';

	/** @return {Date} */
	#current = new Date();

	/** @return {Date} */
	#now = new Date();

	/** @return {Date|undefined} */
	#selected;

	/** @return {Date} */
	#tmp = new Date();

	/** @return {HTMLElement} */
	#form;

	/** @return {HTMLElement} */
	#container;

	/** @return {HTMLElement} */
	#wrapper;

	/** @return {HTMLElement} */
	#tabs;

	/** @return {HTMLElement} */
	#dateBlock;

	/** @return {HTMLElement} */
	#timeBlock;

	/** @return {HTMLElement} */
	#yearBlock;

	/** @return {HTMLElement} */
	#monthBlock;

	/** @return {HTMLElement} */
	#weekBlock;

	/** @return {HTMLElement} */
	#dayBlock;

	/** @return {HTMLElement} */
	#year;

	/** @return {HTMLElement} */
	#month;

	/** @return {HTMLElement} */
	#hours;

	/** @return {HTMLElement} */
	#minutes;

	/** @return {HTMLElement} */
	#seconds;

	#inputs = {
		/** @return {HTMLElement} */
		hours: undefined,

		/** @return {HTMLElement} */
		minutes: undefined,

		/** @return {HTMLElement} */
		seconds: undefined
	};

	/** @return {HTMLElement} */
	#footer;

	#id;

	#options = {
		debug: false,

		showedClass: 'datepicker-active',

		date: true,

		time: true,

		year: true,

		month: true,

		day: true,

		hours: true,

		minutes: true,

		seconds: true,

		changeCallback: undefined,

		updateCallback: undefined,

		showCallback: undefined,

		hideCallback: undefined,

		format: 'd.m.Y H:i:s',

		formating: (date, self) => PipUI.Date.format(date, self.#options.format),

		parse: (str, self) => {

			if(!str){ return undefined; }

			if(!self.#options.date && !self.#options.time){ return undefined; }

			let year = 0, month = 0, day = 0, hours = 0, minutes = 0, seconds = 0;

			let split = str.split(' ');

			if(self.#options.date){
				let part = split[0].split('.');

				year = part[2];

				month = parseInt(part[1]) - 1;

				day = parseInt(part[0]);
			}

			if(self.#options.time){
				let part = typeof split[1] == 'undefined' ? split[0].split(':') : split[1].split(':');

				hours = parseInt(part[0]);

				minutes = parseInt(part[1]);

				seconds = parseInt(part[2]);
			}

			return new Date(year, month, day, hours, minutes, seconds);
		},

		templates: {
			container: '<div class="datepicker"></div>',
			wrapper: '<div class="datepicker-wrapper"></div>',
			tabs: '<div class="datepicker-tabs"></div>',
			date: {
				wrapper: '<div class="date-block"></div>',

				year: '<div class="year-block">' +
							'<span class="year-prev"><i class="fa-solid fa-angle-left"></i></span>' +
							'<input type="number" class="input year-input">' +
							'<span class="year-next"><i class="fa-solid fa-angle-right"></i></span>' +
						'</div>',

				month: '<div class="month-block">' +
							'<span class="month-prev"><i class="fa-solid fa-angle-left"></i></span>' +
							'<select class="input month-input"></select>' +
							'<span class="month-next"><i class="fa-solid fa-angle-right"></i></span>' +
						'</div>',

				week: '<div class="week-block"></div>',

				day: '<div class="day-block"></div>'
			},
			time: {
				wrapper: '<div class="time-block">' +
							'<div class="time-visual"></div>' +
							'<div class="time-inputs"></div>' +
						'</div>',
				visual: {
					hours: '<div class="visual-block hours-visual">-</div>',
					minutes: '<div class="visual-block minutes-visual">-</div>',
					seconds: '<div class="visual-block seconds-visual">-</div>',
				},
				inputs: {
					hours: '<div class="block-input-time"><label>'+PipUI.i18n().get('date.hours')+'</label><input type="range" min="0" max="23" class="input hours-input"></div>',
					minutes: '<div class="block-input-time"><label>'+PipUI.i18n().get('date.minutes')+'</label><input type="range" min="0" max="59" class="input minutes-input"></div>',
					seconds: '<div class="block-input-time"><label>'+PipUI.i18n().get('date.seconds')+'</label><input type="range" min="0" max="59" class="input seconds-input"></div>',
				},
				separator: '<div class="time-separator"></div>'
			},
			footer: {
				wrapper: '<div class="datepicker-footer"></div>',
				cancel: '<button type="button" class="btn datepicker-cancel">'+PipUI.i18n().get('datepicker.cancel')+'</button>',
				next: '<button type="button" class="btn datepicker-next datepicker-change-tab" data-datepicker-tab="time">'+PipUI.i18n().get('datepicker.next')+'</button>',
				prev: '<button type="button" class="btn datepicker-prev datepicker-change-tab" data-datepicker-tab="date">'+PipUI.i18n().get('datepicker.prev')+'</button>',
				done: '<button type="button" class="btn datepicker-done">'+PipUI.i18n().get('datepicker.done')+'</button>'
			}

		}
	}



	/**
	 * @param {object} options
	 *
	 * @return {this}
	 * */
	setOptions(options) {
		this.#options = PipUI.assign(this.#options, options);

		return this;
	}



	/** @return {object} */
	getOptions() {
		return this.#options;
	}



	/** @return {string|undefined} */
	getID() {
		return this.#id;
	}



	/**
	 * @param {HTMLElement|string} form
	 *
	 * @param {object|undefined} options
	 * */
	constructor(form, options) {
		this.#form = PipUI.e(form)[0];

		this.setOptions(options);

		if(PipUI.Logger && this.#options.debug){
			PipUI.Logger.info(PipUI.i18n().get('datepicker.d_create_instance'), this.#options);
		}

		if(typeof this.#form == 'undefined'){
			if(PipUI.Logger && this.#options.debug){
				PipUI.Logger.info(PipUI.i18n().get('datepicker.d_element_not_found'), this.#options);
			}

			return this;
		}

		this.#id = Math.random().toString();

		this.#form.setAttribute('data-datepicker-id', this.#id);

		this.#form.setAttribute('data-datepicker', 'true');

		this.#container = PipUI.create(this.#options.templates.container);

		this.#container.setAttribute('data-datepicker-id', this.#id);

		this.#wrapper = PipUI.create(this.#options.templates.wrapper);

		this.#tabs = PipUI.create(this.#options.templates.tabs);

		if(this.#options.date){
			this.#dateBlock = PipUI.create(this.#options.templates.date.wrapper);

			if(this.#options.year){
				this.#yearBlock = PipUI.create(this.#options.templates.date.year);

				this.#year = this.#yearBlock.querySelector('.year-input');

				this.#dateBlock.append(this.#yearBlock);
			}

			if(this.#options.month){
				this.#monthBlock = PipUI.create(this.#options.templates.date.month);

				this.#month = this.#monthBlock.querySelector('.month-input');

				PipUI.Date.months.forEach((name, key) => {
					this.#month.append(PipUI.create('<option value="'+key+'">'+name+'</option>'));
				});

				this.#dateBlock.append(this.#monthBlock);
			}

			if(this.#options.day){
				this.#weekBlock = PipUI.create(this.#options.templates.date.week);

				for(let i = 0; i < 7; i++){
					let week = PipUI.create('<div class="week-id" data-datepicker-week-num="'+(i+1)+'">'+PipUI.Date._week[i]+'</div>');

					this.#weekBlock.append(week);
				}

				this.#dateBlock.append(this.#weekBlock);
			}

			this.#tabs.append(this.#dateBlock);

			PipUI.addClass(this.#container, 'date-picker');
		}

		if(this.#options.time){
			this.#timeBlock = PipUI.create(this.#options.templates.time.wrapper);

			let visual = this.#timeBlock.querySelector('.time-visual');

			let inputs = this.#timeBlock.querySelector('.time-inputs');

			if(this.#options.hours){
				this.#hours = PipUI.create(this.#options.templates.time.visual.hours);

				let hours = PipUI.create(this.#options.templates.time.inputs.hours);

				this.#inputs.hours = hours.querySelector('.hours-input');

				this.#inputs.hours.value = this.#now.getHours();

				visual.append(this.#hours);

				inputs.append(hours);
			}

			if(this.#options.minutes){
				this.#minutes = PipUI.create(this.#options.templates.time.visual.minutes);

				if(this.#options.hours){
					visual.append(PipUI.create(this.#options.templates.time.separator));
				}

				let minutes = PipUI.create(this.#options.templates.time.inputs.minutes);

				this.#inputs.minutes = minutes.querySelector('.minutes-input');

				this.#inputs.minutes.value = this.#now.getMinutes();

				visual.append(this.#minutes);

				inputs.append(minutes);
			}

			if(this.#options.seconds){
				this.#seconds = PipUI.create(this.#options.templates.time.visual.seconds);

				if(this.#options.hours || this.#options.minutes){
					visual.append(PipUI.create(this.#options.templates.time.separator));
				}

				visual.append(this.#seconds);
			}

			let seconds = PipUI.create(this.#options.templates.time.inputs.seconds);

			this.#inputs.seconds = seconds.querySelector('.seconds-input');

			this.#inputs.seconds.value = this.#now.getSeconds();

			this.#tabs.append(this.#timeBlock);

			inputs.append(seconds);

			PipUI.addClass(this.#container, 'time-picker');
		}


		this.#footer = PipUI.create(this.#options.templates.footer.wrapper);


		this.#wrapper.append(this.#tabs, this.#footer);


		this.#container.append(this.#wrapper);

		document.body.append(this.#container);

		this.update();

		if(this.#options.date){
			this.setActiveDate();
		}else if(this.#options.time){
			this.setActiveTime();
		}

		PipUI.Storage.set('datepicker', this, this.#id);
	}



	/**
	 * @return {this}
	 * */
	setActiveDate(){

		if(PipUI.Logger && this.#options.debug){
			PipUI.Logger.info(PipUI.i18n().get('datepicker.d_set_tab_date'), this.#options);
		}

		if(!this.#options.date){ return this; }

		if(this.#options.time){
			PipUI.removeClass(this.#timeBlock, 'active-tab');
		}

		PipUI.addClass(this.#dateBlock, 'active-tab');

		this.#footer.innerHTML = '';

		this.#footer.append(PipUI.create(this.#options.templates.footer.cancel));

		if(this.#options.time){
			this.#footer.append(PipUI.create(this.#options.templates.footer.next));
		}else{
			this.#footer.append(PipUI.create(this.#options.templates.footer.done));
		}


		return this;
	}



	/**
	 * @return {this}
	 * */
	setActiveTime(){

		if(PipUI.Logger && this.#options.debug){
			PipUI.Logger.info(PipUI.i18n().get('datepicker.d_set_tab_time'), this.#options);
		}

		if(!this.#options.time){ return this; }

		if(this.#options.date){
			PipUI.removeClass(this.#dateBlock, 'active-tab');
		}

		PipUI.addClass(this.#timeBlock, 'active-tab');


		this.#footer.innerHTML = '';

		if(this.#options.date){
			this.#footer.append(PipUI.create(this.#options.templates.footer.prev));
		}else{
			this.#footer.append(PipUI.create(this.#options.templates.footer.cancel));
		}

		this.#footer.append(PipUI.create(this.#options.templates.footer.done));


		return this;
	}



	/**
	 * @param {function|undefined} callback
	 *
	 * @return {this}
	 * */
	show(callback){

		if(PipUI.Logger && this.#options.debug){
			PipUI.Logger.info(PipUI.i18n().get('datepicker.d_show'), this.#options);
		}

		let parse = this.#options.parse(this.#form.value, this);

		if(parse){
			this.#now = parse;

			this.#current.setTime(this.#now.getTime());
		}



		if(this.#options.date){
			this.setActiveDate();
		}else if(this.#options.time){
			this.setActiveTime();
		}

		PipUI.addClass(this.#container, this.#options.showedClass);

		if(typeof callback == 'undefined'){
			callback = this.#options.showCallback;
		}

		if(typeof callback == 'function'){
			callback(this);
		}

		PipUI.trigger(this.#form, 'show-datepicker-pipui', this.#id, this.#options, this);

		return this;
	}



	/**
	 * @param {function|undefined} callback
	 *
	 * @return {this}
	 * */
	hide(callback){

		if(PipUI.Logger && this.#options.debug){
			PipUI.Logger.info(PipUI.i18n().get('datepicker.d_hide'), this.#options);
		}

		PipUI.removeClass(this.#container, this.#options.showedClass);

		if(typeof callback == 'undefined'){
			callback = this.#options.hideCallback;
		}

		if(typeof callback == 'function'){
			callback(this);
		}

		PipUI.trigger(this.#form, 'hide-datepicker-pipui', this.#id, this.#options, this);

		return this;
	}



	/**
	 * @param {function|undefined} callback
	 *
	 * @return {this} */
	updateValue(callback){

		if(typeof this.#selected == 'undefined'){
			this.#selected = new Date();
		}

		this.#selected.setTime(this.#now.getTime());

		this.#form.value = this.#options.formating(this.#now, this);

		if(PipUI.Logger && this.#options.debug){
			PipUI.Logger.info(PipUI.i18n().get('datepicker.d_update_value'), this.#options, this.#form.value);
		}

		if(typeof callback != 'function'){
			callback = this.#options.changeCallback(this);
		}

		if(typeof callback == 'function'){
			callback(this);
		}

		PipUI.trigger(this.#form, 'change-datepicker-pipui', this.#id, this.#options, this);

		return this;
	}



	/**
	 * @param {number} day
	 *
	 * @return {this}
	 * */
	setDay(day){

		this.#now.setTime(this.#current.getTime());

		this.#now.setDate(day);

		this.#current.setDate(day);

		return this;
	}



	/**
	 * @param {number} year
	 *
	 * @return {this}
	 * */
	setYear(year){
		this.#current.setFullYear(year);

		return this;
	}



	/** @return {this} */
	nextYear(){
		return this.setYear(this.#current.getFullYear() + 1);
	}



	/** @return {this} */
	prevYear(){
		return this.setYear(this.#current.getFullYear() - 1);
	}



	/**
	 * @param {number} month
	 *
	 * @return {this}
	 * */
	setMonth(month){
		this.#current.setMonth(month);

		return this;
	}



	/** @return {this} */
	nextMonth(){
		return this.setMonth(this.#current.getMonth() + 1);
	}



	/** @return {this} */
	prevMonth(){
		return this.setMonth(this.#current.getMonth() - 1);
	}



	/** @return {this} */
	setHours(num){
		this.#current.setHours(num);

		return this;
	}



	/** @return {this} */
	setMinutes(num){
		this.#current.setMinutes(num);

		return this;
	}



	/** @return {this} */
	setSeconds(num){
		this.#current.setSeconds(num);

		return this;
	}



	/** @return {Date} */
	getValue(){
		return this.#current;
	}



	/**
	 * @param {function|undefined} callback
	 *
	 * @return {this}
	 * */
	update(callback) {

		if(this.#options.date){
			if(this.#options.year){
				this.#year.value = this.#current.getFullYear();
			}

			if(this.#options.month){
				this.#month.value = this.#current.getMonth();
			}

			if(this.#options.day){
				if(typeof this.#dayBlock == 'undefined'){
					this.#dayBlock = PipUI.create(this.#options.templates.date.day);

					this.#dateBlock.append(this.#dayBlock);
				}

				this.#dayBlock.innerHTML = '';

				let daysInPrev = PipUI.Date.daysInMonth(this.#current.getFullYear(), this.#current.getMonth()-1);

				let daysInCurrent = PipUI.Date.daysInMonth(this.#current.getFullYear(), this.#current.getMonth());

				this.#tmp.setFullYear(this.#current.getFullYear())
				this.#tmp.setMonth(this.#current.getMonth());
				this.#tmp.setDate(1);

				let startDay = this.#tmp.getDay();

				if(startDay == 0){ startDay = 7; }

				startDay = 7 - (7 - startDay) - 1;

				let selected = -1;

				if(typeof this.#now != 'undefined' && this.#now.getMonth() == this.#current.getMonth() && this.#now.getFullYear() == this.#current.getFullYear()){
					selected = this.#now.getDate();
				}

				let i, day;

				let num = 0;

				for(i = daysInPrev - startDay + 1; i <= daysInPrev; i++){
					day = PipUI.create('<div class="day-id day-prev" data-datepicker-day-num="'+i+'">'+i+'</div>');

					this.#dayBlock.append(day);

					num++;
				}

				for(i = 1; i <= daysInCurrent; i++){
					day = PipUI.create('<div class="day-id" data-datepicker-day-num="'+i+'">'+i+'</div>');

					if(selected == i){
						PipUI.addClass(day, 'day-active')
					}

					this.#dayBlock.append(day);

					num++;
				}

				for(i = 1; i <= 42 - num; i++){
					day = PipUI.create('<div class="day-id day-next" data-datepicker-day-num="'+i+'">'+i+'</div>');

					this.#dayBlock.append(day);
				}
			}
		}

		if(this.#options.time){
			if(this.#options.hours){
				this.#hours.innerHTML = PipUI.Date.leadingZero(this.#current.getHours());

				this.#inputs.hours.value = this.#current.getHours();
			}

			if(this.#options.minutes){
				this.#minutes.innerHTML = PipUI.Date.leadingZero(this.#current.getMinutes());

				this.#inputs.minutes.value = this.#current.getMinutes();
			}

			if(this.#options.seconds){
				this.#seconds.innerHTML = PipUI.Date.leadingZero(this.#current.getSeconds());

				this.#inputs.seconds.value = this.#current.getSeconds();
			}
		}

		if(typeof callback == 'undefined'){
			callback = this.#options.updateCallback;
		}

		if(typeof callback == 'function'){
			callback(this);
		}

		PipUI.trigger(this.#form, 'update-datepicker-pipui', this.#id, this.#options, this);

		if(PipUI.Logger && this.#options.debug){
			PipUI.Logger.info(PipUI.i18n().get('datepicker.d_update'), this.#options, this.#now);
		}

		return this;
	}
}

PipUI.ready(document, () => {

	PipUI.body('click', '.datepicker .year-block .year-next, .datepicker .year-block .year-prev', (e, target) => {
		e.preventDefault();

		let picker = PipUI.Storage.get('datepicker', target.closest('.datepicker').getAttribute('data-datepicker-id'));

		if(PipUI.hasClass(target, 'year-prev')){
			picker.prevYear().update();
		}else{
			picker.nextYear().update();
		}
	});

	PipUI.body('input', '.datepicker .year-block .year-input', (e, target) => {
		let picker = PipUI.Storage.get('datepicker', target.closest('.datepicker').getAttribute('data-datepicker-id'));

		picker.setYear(target.value).update();
	});

	PipUI.body('click', '.datepicker .month-block .month-next, .datepicker .month-block .month-prev', (e, target) => {
		e.preventDefault();

		let picker = PipUI.Storage.get('datepicker', target.closest('.datepicker').getAttribute('data-datepicker-id'));

		if(PipUI.hasClass(target, 'month-prev')){
			picker.prevMonth().update();
		}else{
			picker.nextMonth().update();
		}
	});

	PipUI.body('input', '.datepicker .month-block .month-input', (e, target) => {
		let picker = PipUI.Storage.get('datepicker', target.closest('.datepicker').getAttribute('data-datepicker-id'));

		picker.setMonth(target.value).update();
	});

	PipUI.body('focusin', '[data-datepicker]', (e, target) => {
		e.preventDefault();

		target.blur();

		let id = target.getAttribute('data-datepicker-id');

		let options = {};

		let format = target.getAttribute('data-datepicker-format');

		let type = target.getAttribute('data-datepicker');

		if(format){
			options.format = format;
		}

		if(type == 'time'){
			options.date = false;
		}else if(type == 'date'){
			options.time = false;
		}

		let picker = id ? PipUI.Storage.get('datepicker', id) : new DatepickerComponent(target, options);

		if(id){
			picker.show().update();
		}else{
			setTimeout(() => picker.show().update(), 150);
		}
	});

	PipUI.body('click', '.datepicker', (e, target) => {
		if(e.target == target){
			e.preventDefault();

			PipUI.Storage.get('datepicker', target.getAttribute('data-datepicker-id')).hide();
		}
	});

	PipUI.body('click', '.datepicker .datepicker-cancel', (e, target) => {
		e.preventDefault();

		PipUI.Storage.get('datepicker', target.closest('.datepicker').getAttribute('data-datepicker-id')).hide();
	});

	PipUI.body('click', '.datepicker .datepicker-done', (e, target) => {
		e.preventDefault();

		let picker = PipUI.Storage.get('datepicker', target.closest('.datepicker').getAttribute('data-datepicker-id'));

		picker.updateValue().hide();
	});

	PipUI.body('click', '.datepicker .datepicker-change-tab', (e, target) => {
		e.preventDefault();

		let tab = target.getAttribute('data-datepicker-tab');

		let picker = PipUI.Storage.get('datepicker', target.closest('.datepicker').getAttribute('data-datepicker-id'));

		if(tab == 'time'){
			picker.setActiveTime();
		}else{
			picker.setActiveDate();
		}
	});

	PipUI.body('click', '.datepicker .date-block > .day-block > .day-id', (e, target) => {
		e.preventDefault();

		let picker = PipUI.Storage.get('datepicker', target.closest('.datepicker').getAttribute('data-datepicker-id'));

		let day = target.getAttribute('data-datepicker-day-num');

		if(PipUI.hasClass(target, 'day-prev')){
			picker.prevMonth();
		}else if(PipUI.hasClass(target, 'day-next')){
			picker.nextMonth();
		}

		picker.setDay(day).update();
	});

	PipUI.body('input', '.datepicker .hours-input', (e, target) => {
		let picker = PipUI.Storage.get('datepicker', target.closest('.datepicker').getAttribute('data-datepicker-id'));

		picker.setHours(target.value).update();
	});

	PipUI.body('input', '.datepicker .minutes-input', (e, target) => {
		let picker = PipUI.Storage.get('datepicker', target.closest('.datepicker').getAttribute('data-datepicker-id'));

		picker.setMinutes(target.value).update();
	});

	PipUI.body('input', '.datepicker .seconds-input', (e, target) => {
		let picker = PipUI.Storage.get('datepicker', target.closest('.datepicker').getAttribute('data-datepicker-id'));

		picker.setSeconds(target.value).update();
	});
});

if(typeof PipUI != 'undefined'){
	PipUI.addComponent('Datepicker', DatepickerComponent.VERSION);
	PipUI.required('Datepicker', 'Date', '1.0.0', '>=');
	PipUI.required('Datepicker', 'Storage', '1.0.0', '>=');
	/** @return {DatepickerComponent} */
	PipUI.Datepicker = DatepickerComponent;

	PipUI.i18n()

		.set('datepicker.next', 'Далее')
		.set('datepicker.prev', 'Назад')
		.set('datepicker.done', 'Готово')
		.set('datepicker.cancel', 'Отмена')
		.set('datepicker.d_create_instance', '[Datepicker] Создание объекта')
		.set('datepicker.d_element_not_found', '[Datepicker] Инициатор не найден')
		.set('datepicker.d_set_tab_time', '[Datepicker] Измениение вкладки на вкладку времени')
		.set('datepicker.d_set_tab_date', '[Datepicker] Изменение вкладки на вкладку даты')
		.set('datepicker.d_show', '[Datepicker] Открытие окна выбора даты/времени')
		.set('datepicker.d_hide', '[Datepicker] Закрытие окна выбора даты/времени')
		.set('datepicker.d_update_value', '[Datepicker] Изменение значения формы')
		.set('datepicker.d_update', '[Datepicker] Обновление всех значений');
}