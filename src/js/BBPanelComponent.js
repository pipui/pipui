class BBPanelComponent {
	static VERSION = '2.0.0';

	#id;

	/** @return {HTMLElement} */
	#wrapper;

	/** @return {HTMLElement} */
	#form;

	/** @return {HTMLElement} */
	#panel;

	/** @return {HTMLElement} */
	#popup;

	#pressed = {};

	#popupPositions = {top: 0, left: 0};

	#history = [];

	#historyRedo = [];

	#cb = {};

	#options = {
		debug: false,

		focusClass: 'focus',

		formClass: 'bbpanel-form',

		popup: {
			enable: true,
			format: 'b,i,u,s,|,left,center,right,|,urlAlt',
			template: '<div class="popup-list"></div>',
			activeClass: 'popup-active'
		},

		tooltip: true,

		showCallback: undefined,

		hideCallback: undefined,

		callcodeCallback: undefined,

		undoCallback: undefined,

		redoCallback: undefined,

		changeCallback: undefined,

		format: 'undo,|,redo,|,b,i,u,s,|,left,center,right,|,size,color,|,spoiler,quote,code,|,img,youtube,|,urlAlt,line,|,hide',

		maxHistory: 64,

		codes: {
			undo: {title: PipUI.i18n().get('bbpanel.undo'), text: '<div class="bbcode-trigger"><i class="fa-solid fa-arrow-rotate-left"></i></div>', hotkey: 'control+z', callback: self => self.undo()},
			redo: {title: PipUI.i18n().get('bbpanel.redo'), text: '<div class="bbcode-trigger"><i class="fa-solid fa-arrow-rotate-right"></i></div>', hotkey: 'control+y', callback: self => self.redo()},
			b: {title: PipUI.i18n().get('bbpanel.b'), text: '<div class="bbcode-trigger"><i class="fa-solid fa-bold"></i></div>', left: '[b]', right: '[/b]', hotkey: 'control+b'},
			i: {title: PipUI.i18n().get('bbpanel.i'), text: '<div class="bbcode-trigger"><i class="fa-solid fa-italic"></i></div>', left: '[i]', right: '[/i]', hotkey: 'control+i'},
			u: {title: PipUI.i18n().get('bbpanel.u'), text: '<div class="bbcode-trigger"><i class="fa-solid fa-underline"></i></div>', left: '[u]', right: '[/u]', hotkey: 'control+u'},
			s: {title: PipUI.i18n().get('bbpanel.s'), text: '<div class="bbcode-trigger"><i class="fa-solid fa-strikethrough"></i></div>', left: '[s]', right: '[/s]', hotkey: 'control+s'},
			left: {title: PipUI.i18n().get('bbpanel.left'), text: '<div class="bbcode-trigger"><i class="fa-solid fa-align-left"></i></div>', left: '[left]', right: '[/left]', hotkey: 'control+arrowleft'},
			center: {title: PipUI.i18n().get('bbpanel.center'), text: '<div class="bbcode-trigger"><i class="fa-solid fa-align-center"></i></div>', left: '[center]', right: '[/center]', hotkey: 'control+arrowdown'},
			right: {title: PipUI.i18n().get('bbpanel.right'), text: '<div class="bbcode-trigger"><i class="fa-solid fa-align-right"></i></div>', left: '[right]', right: '[/right]', hotkey: 'control+arrowright'},
			spoiler: {title: PipUI.i18n().get('bbpanel.spoiler'), text: '<div class="bbcode-trigger"><i class="fa-solid fa-eye-slash"></i></div>', left: '[spoiler=""]', right: '[/spoiler]', hotkey: 'control+1'},
			color: {title: PipUI.i18n().get('bbpanel.color'), text: '<div class="bbcode-trigger"><i class="fa-solid fa-paintbrush"></i></div>', left: '[color="#"]', right: '[/color]', hotkey: 'control+2'},
			size: {title: PipUI.i18n().get('bbpanel.size'), text: '<div class="bbcode-trigger"><i class="fa-solid fa-text-height"></i></div>', left: '[size="1"]', right: '[/size]', hotkey: 'control+3'},
			img: {title: PipUI.i18n().get('bbpanel.img'), text: '<div class="bbcode-trigger"><i class="fa-solid fa-image"></i></div>', left: '[img]', right: '[/img]', hotkey: 'control+4'},
			quote: {title: PipUI.i18n().get('bbpanel.quote'), text: '<div class="bbcode-trigger"><i class="fa-solid fa-quote-right"></i></div>', left: '[quote]', right: '[/quote]', hotkey: 'control+q'},
			urlAlt: {title: PipUI.i18n().get('bbpanel.urlAlt'), text: '<div class="bbcode-trigger"><i class="fa-solid fa-link"></i></div>', left: '[url=""]', right: '[/url]', hotkey: 'control+5'},
			code: {title: PipUI.i18n().get('bbpanel.code'), text: '<div class="bbcode-trigger"><i class="fa-solid fa-code"></i></div>', left: '[code]', right: '[/code]', hotkey: 'control+6'},
			line: {title: PipUI.i18n().get('bbpanel.line'), text: '<div class="bbcode-trigger"><i class="fa-solid fa-minus"></i></div>', left: '', right: '[line]', hotkey: 'control+l'},
			youtube: {title: PipUI.i18n().get('bbpanel.youtube'), text: '<div class="bbcode-trigger"><i class="fa-brands fa-youtube"></i></div>', left: '[youtube]', right: '[/youtube]', hotkey: 'control+7'},
			hide: {title: PipUI.i18n().get('bbpanel.hide'), text: '<div class="bbcode-trigger"><i class="fa-solid fa-angle-up"></i></div>', callback: self => {
					self.hide();

					self.#form.blur();
				}}
		},

		templates: {
			wrapper: '<div class="bbpanel"></div>',
			separator: '<div class="bbcode-separator"></div>',
			panel: '<div class="bbcode-list"></div>'
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
			PipUI.Logger.info(PipUI.i18n().get('bbpanel.d_create_instance'), this.#options);
		}

		if(typeof this.#form == 'undefined'){
			if(PipUI.Logger && options.debug){
				PipUI.Logger.info(PipUI.i18n().get('bbpanel.d_form_not_found'), options);
			}

			return this;
		}

		this.#id = Math.random().toString();

		PipUI.addClass(this.#form, this.#options.formClass);

		PipUI.removeClass(this.#form, 'bbpanel');

		this.#form.setAttribute('data-bbpanel-id', this.#id);

		this.#render();

		PipUI.Storage.set('bbpanel', this, this.#id);
	}



	/**
	 * @return {this}
	 * */
	#renderList(list, format){

		let split = format.split(',');

		list.innerHTML = '';

		for(let i = 0; i < split.length; i++){
			let v = split[i];

			if(v == '|'){
				let separator = PipUI.create(this.#options.templates.separator);

				list.append(separator);
			}else{
				let code = this.#options.codes[v];

				if(typeof code == 'undefined'){ return; }

				let html = PipUI.create(code.text);

				html.setAttribute('data-bbpanel-bbcode', v);

				if(typeof code.title != 'undefined'){
					if(this.#options.tooltip){
						html.setAttribute('data-tooltip', code.title);
					}else{
						html.setAttribute('title', code.title);
					}
				}

				list.append(html);
			}
		}

		return this;
	}



	/**
	 * @return {this}
	 * */
	#render(){

		if(PipUI.Logger && this.#options.debug){
			PipUI.Logger.info(PipUI.i18n().get('bbpanel.d_render'), this.#options);
		}

		let self = this;

		this.#wrapper = PipUI.create(this.#options.templates.wrapper);

		this.#form.after(this.#wrapper);

		this.#wrapper.append(this.#form);

		this.#panel = PipUI.create(this.#options.templates.panel);

		this.#wrapper.setAttribute('data-bbpanel-id', this.#id);

		this.#wrapper.append(this.#panel);

		if(PipUI.Logger && this.#options.debug){
			PipUI.Logger.info(PipUI.i18n().get('bbpanel.d_render_panel'), this.#options);
		}

		this.#renderList(this.#panel, this.#options.format);

		if(this.#options.popup.enable){

			if(PipUI.Logger && this.#options.debug){
				PipUI.Logger.info(PipUI.i18n().get('bbpanel.d_render_popup'), this.#options);
			}

			this.#popup = PipUI.create(this.#options.popup.template);

			this.#wrapper.append(this.#popup);

			this.#renderList(this.#popup, this.#options.popup.format);
		}else{
			if(PipUI.Logger && this.#options.debug){
				PipUI.Logger.info(PipUI.i18n().get('bbpanel.d_popup_disabled'), this.#options);
			}
		}



		this.#cb.focusIn = () => {
			self.show();
		}

		this.#form.addEventListener('focusin', this.#cb.focusIn);



		this.#cb.clickTrigger = e => {
			e.preventDefault();

			self.callCode(e.target.closest('.bbcode-trigger').getAttribute('data-bbpanel-bbcode'));
		}

		this.#wrapper.querySelectorAll('.bbcode-trigger').forEach(item => {
			item.addEventListener('click', this.#cb.clickTrigger);
		});



		this.#cb.change = () => self.change();

		this.#form.addEventListener('input', this.#cb.change);



		this.#cb.mousedown = e => {

			let offset = self.#wrapper.getBoundingClientRect();


			self.#popupPositions.top = e.clientY - offset.top;
			self.#popupPositions.left = e.clientX - offset.left;
		}

		this.#form.addEventListener('mousedown', this.#cb.mousedown);




		this.#cb.keydown = e => {
			let key = e.key.toLowerCase();

			if(!self.#pressed[key]){ self.#pressed[key] = true; }

			Object.keys(this.#options.codes).forEach(k => {
				let v = this.#options.codes[k];

				if(typeof v.hotkey == 'undefined'){ return; }

				let press = k;

				v.hotkey.split('+').forEach(vp => {
					if(!self.#pressed[vp]){ press = false; return false; }
				});

				if(press){
					e.preventDefault();

					self.callCode(press);

					return false;
				}
			});
		}

		this.#form.addEventListener('keydown', this.#cb.keydown);


		this.#cb.keyup = e => {
			let key = e.key.toLowerCase();

			if(self.#pressed[key]){ self.#pressed[key] = false; }
		}

		this.#form.addEventListener('keyup', this.#cb.keyup);



		this.#cb.clickForm = e => {
			if(self.#options.popup.enable){

				let start = e.target.selectionStart;

				let end = e.target.selectionEnd;

				if(start != end){

					let height = self.#popup.clientHeight;

					PipUI.style(self.#popup, {top: (self.#popupPositions.top - height)+'px', left: self.#popupPositions.left+'px'});

					PipUI.addClass(self.#popup, 'popup-active');

				}else{
					PipUI.removeClass(self.#popup, 'popup-active');
				}
			}
		}

		this.#form.addEventListener('click', this.#cb.clickForm);



		return this;
	}



	/**
	 * @param {string} key
	 *
	 * @param {function|undefined} callback
	 *
	 * @return {this}
	 * */
	callCode(key, callback){
		if(PipUI.Logger && this.#options.debug){
			PipUI.Logger.info(PipUI.i18n().get('bbpanel.d_bbcall') + key, this.#options);
		}

		let code = this.#options.codes[key];

		if(typeof code == 'undefined'){
			if(PipUI.Logger && this.#options.debug){
				PipUI.Logger.error(PipUI.i18n().get('bbpanel.d_bbnotfound') + key, this.#options);
			}

			return this;
		}

		this.#form.focus();

		if(typeof callback == 'undefined'){
			callback = this.#options.callcodeCallback;
		}

		if(typeof callback == 'function'){
			callback(this);
		}

		PipUI.trigger(this.#form, 'callcode-bbpanel-pipui', key, this.#id, this.#options, this);

		if(typeof code.callback == 'function'){
			if(PipUI.Logger && this.#options.debug){
				PipUI.Logger.info(PipUI.i18n().get('bbpanel.d_bbcallback') + key, this.#options);
			}

			code.callback(this);

			return this;
		}else{
			if(PipUI.Logger && this.#options.debug){
				PipUI.Logger.info(PipUI.i18n().get('bbpanel.d_bbcallback_disabled') + key, this.#options);
			}
		}

		let startCaret = this.#form.selectionStart;
		let endCaret = this.#form.selectionEnd;

		let beforeText = this.#form.value.substring(0, startCaret);
		let afterText = this.#form.value.substr(endCaret);
		let currentText = this.#form.value.substring(startCaret, endCaret);

		this.change();

		this.#form.value = beforeText;

		let rightCaret = endCaret;

		if(typeof code.left != 'undefined'){
			this.#form.value += code.left;

			rightCaret = rightCaret + code.left.length;
		}

		this.#form.value += currentText;

		if(typeof code.right != 'undefined'){
			this.#form.value += code.right;

			rightCaret = rightCaret + code.right.length;
		}

		this.#form.value += afterText;

		this.#form.selectionStart = startCaret;
		this.#form.selectionEnd = rightCaret;

		this.#form.setSelectionRange(startCaret, rightCaret);

		return this.change();
	}


	/**
	 * @param {function|undefined} callback
	 *
	 * @return {this} */
	change(callback){
		this.#historyRedo = [];

		let length = this.#history.length;

		let prev = this.#history[length - 1];

		if(typeof prev != 'undefined' && prev.value == this.#form.value && prev.startCaret == this.#form.selectionStart && prev.endCaret == this.#form.selectionEnd){
			return;
		}

		let data = {
			value: this.#form.value,
			startCaret: this.#form.selectionStart,
			endCaret: this.#form.selectionEnd
		};

		this.#history.push(data);

		if(PipUI.Logger && this.#options.debug){
			PipUI.Logger.info(PipUI.i18n().get('bbpanel.d_change'), this.#options, data);
		}

		length++;

		if(length > this.#options.maxHistory + 1){
			this.#history.splice(0, length - this.#options.maxHistory + 1);
		}

		if(typeof callback == 'undefined'){
			callback = this.#options.changeCallback;
		}

		if(typeof callback == 'function'){
			callback(this);
		}

		PipUI.trigger(this.#form, 'change-bbpanel-pipui', this.#id, this.#options, this);

		return this;
	}



	/**
	 * @param {function|undefined} callback
	 *
	 * @return {this} */
	undo(callback){
		if(this.#history.length <= 0){
			return this;
		}

		let history = this.#history[this.#history.length - 2];

		this.#form.focus();

		if(PipUI.Logger && this.#options.debug){
			PipUI.Logger.info(PipUI.i18n().get('bbpanel.d_undo'), this.#options);
		}

		if(typeof history == 'undefined'){
			this.#form.value = '';

			this.#form.setSelectionRange(0, 0);

			return this;
		}

		this.#form.value = history.value;

		this.#form.setSelectionRange(history.startCaret, history.endCaret);

		let pop = this.#history.pop();

		this.#historyRedo.push(pop);

		if(typeof callback == 'undefined'){
			callback = this.#options.undoCallback;
		}

		if(typeof callback == 'function'){
			callback(this);
		}

		PipUI.trigger(this.#form, 'undo-bbpanel-pipui', this.#id, this.#options, this);

		return this;
	}



	/**
	 * @param {function|undefined} callback
	 *
	 * @return {this} */
	redo(callback){
		let histories = this.#historyRedo;

		if(histories.length <= 0){
			return this;
		}

		if(PipUI.Logger && this.#options.debug){
			PipUI.Logger.info(PipUI.i18n().get('bbpanel.d_redo'), this.#options);
		}

		let history = this.#historyRedo.pop();

		if(typeof history == 'undefined'){
			history = {value: '', startCaret: 0, endCaret: 0};
		}

		this.#form.focus();

		this.#form.value = history.value;

		this.#form.setSelectionRange(history.startCaret, history.endCaret);

		this.#history.push(history);

		if(typeof callback == 'undefined'){
			callback = this.#options.redoCallback;
		}

		if(typeof callback == 'function'){
			callback(this);
		}

		PipUI.trigger(this.#form, 'redo-bbpanel-pipui', this.#id, this.#options, this);

		return this;
	}



	/**
	 * @param {function|undefined} callback
	 *
	 * @return {this} */
	hide(callback) {
		if(PipUI.Logger && this.#options.debug){
			PipUI.Logger.info(PipUI.i18n().get('bbpanel.d_hide'), this.#options);
		}

		PipUI.removeClass(this.#form, this.#options.focusClass);

		PipUI.removeClass(this.#panel, this.#options.focusClass);

		if(this.#options.popup.enable){
			PipUI.removeClass(this.#popup, this.#options.popup.activeClass);
		}

		if(typeof callback == 'undefined'){
			callback = this.#options.hideCallback;
		}

		if(typeof callback == 'function'){
			callback(this);
		}

		PipUI.trigger(this.#form, 'hide-bbpanel-pipui', this.#id, this.#options, this);

		return this;
	}



	/**
	 * @param {function|undefined} callback
	 *
	 * @return {this} */
	show(callback) {
		if(PipUI.Logger && this.#options.debug){
			PipUI.Logger.info(PipUI.i18n().get('bbpanel.d_show'), this.#options);
		}

		PipUI.addClass(this.#form, this.#options.focusClass);

		PipUI.addClass(this.#panel, this.#options.focusClass);

		if(typeof callback == 'undefined'){
			callback = this.#options.showCallback;
		}

		if(typeof callback == 'function'){
			callback(this);
		}

		PipUI.trigger(this.#form, 'show-bbpanel-pipui', this.#id, this.#options, this);

		this.#form.focus();

		return this;
	}



	/**
	 * @return {boolean}
	 * */
	isOpen() {
		return PipUI.hasClass(this.#panel, this.#options.focusClass);
	}
}

PipUI.ready(document, () => {
	PipUI.body('focusin', '.bbpanel:not([data-bbpanel-id])', (event, target) => {
		let panel = new PipUI.BBPanel(target);

		setTimeout(() => { panel.show(); }, 0);
	});

	document.addEventListener('click', e => {

		let panels = PipUI.Storage.get('bbpanel');

		if(panels){
			let c = e.target.closest('[data-bbpanel-id]');

			let id = c ? c.getAttribute('data-bbpanel-id') : undefined;

			Object.keys(panels).forEach(key => {
				if(id !== key){
					panels[key].hide();
				}
			});
		}
	});
});


if(typeof PipUI != 'undefined'){
	PipUI.addComponent('BBPanel', BBPanelComponent.VERSION);
	PipUI.required('BBPanel', 'Storage', '1.0.0', '>=');
	/** @return {BBPanelComponent} */
	PipUI.BBPanel = BBPanelComponent;

	PipUI.i18n()
		.set('bbpanel.b', 'Жирный')
		.set('bbpanel.i', 'Курсив')
		.set('bbpanel.u', 'Подчёркнутый')
		.set('bbpanel.s', 'Зачёркнутый')
		.set('bbpanel.left', 'Выравнивание по левому краю')
		.set('bbpanel.center', 'Выравнивание по центру')
		.set('bbpanel.right', 'Выравнивание по правому краю')
		.set('bbpanel.spoiler', 'Скрытый текст')
		.set('bbpanel.color', 'Цвет текста')
		.set('bbpanel.size', 'Размер текста')
		.set('bbpanel.img', 'Изображение')
		.set('bbpanel.quote', 'Цитата')
		.set('bbpanel.urlAlt', 'Ссылка')
		.set('bbpanel.code', 'Код')
		.set('bbpanel.line', 'Горизонтальная линия')
		.set('bbpanel.youtube', 'Ссылка на YouTube видео')
		.set('bbpanel.hide', 'Скрыть панель')
		.set('bbpanel.undo', 'Отменить')
		.set('bbpanel.redo', 'Вернуть')
		.set('bbpanel.d_create_instance', '[BBPanel] Создание экземпляра класса')
		.set('bbpanel.d_form_not_found', '[BBPanel] Форма не найдена')
		.set('bbpanel.d_render', '[BBPanel] Запуск рендера формы')
		.set('bbpanel.d_show', '[BBPanel] Появление панели')
		.set('bbpanel.d_hide', '[BBPanel] Исчезание панели')
		.set('bbpanel.d_render_panel', '[BBPanel] Запуск рендера списка кодов панели')
		.set('bbpanel.d_render_popup', '[BBPanel] Запуск рендера списка кодов Popup')
		.set('bbpanel.d_popup_disabled', '[BBPanel] Popup\'ы отключены')
		.set('bbpanel.d_change', '[BBPanel] Изменение значения. Событие change')
		.set('bbpanel.d_bbcall', '[BBPanel] Обращение к ББ коду ')
		.set('bbpanel.d_bbnotfound', '[BBPanel] ББ код не найден ')
		.set('bbpanel.d_bbcallback', '[BBPanel] Запуск функции обратного вызова кода ')
		.set('bbpanel.d_bbcallback_disabled', '[BBPanel] Функция обратного вызова кода отключена ')
		.set('bbpanel.d_undo', '[BBPanel] Undo')
		.set('bbpanel.d_redo', '[BBPanel] Redo');
}