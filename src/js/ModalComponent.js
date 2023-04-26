class ModalComponent {
	static VERSION = '2.0.0';

	/** @return {HTMLElement} */
	#target;

	#id;

	#lock = false;

	#options = {
		debug: false,
		showCallback: undefined,
		hideCallback: undefined,
		showedCallback: undefined,
		hidedCallback: undefined,
		updateCallback: undefined,
		initCallback: undefined,

		targetActiveClass: 'modal-active',

		header: undefined,
		body: undefined,
		footer: undefined,
		close: false,

		triggers: [],

		templates: {
			modal: '<div class="modal">' +
						'<div class="modal-wrapper">' +
							'<div class="modal-content"></div>' +
						'</div>' +
					'</div>',
			header: '<div class="modal-header"></div>',
			body: '<div class="modal-body"></div>',
			footer: '<div class="modal-footer"></div>',
			close: '<a href="#" rel="nofollow" data-modal-close class="modal-close"></a>'
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
	 * @param {HTMLElement|string} object
	 *
	 * @param {object|undefined} options
	 *
	 * @param {boolean} update
	 * */
	constructor(object, options, update) {
		this.#target = PipUI.e(object)[0];

		this.setOptions(options);

		if(typeof this.#target == 'undefined'){
			if(PipUI.Logger && this.#options.debug){
				PipUI.Logger.info(PipUI.i18n().get('modal.d_element_not_found'), this.#options);
			}

			return this;
		}

		if(PipUI.Logger && this.#options.debug){
			PipUI.Logger.info(PipUI.i18n().get('modal.d_create_instance'), this.#options);
		}

		let id = this.#target.getAttribute('data-modal-id');

		this.#id = id ? id : Math.random().toString();

		this.#target.setAttribute('data-modal-id', this.#id);

		PipUI.addClass(this.#target, 'modal');

		this.#events();

		if(update){
			this.update();
		}else{
			this.init();
		}

		if(this.#options.triggers.length){
			this.#options.triggers.forEach((item, key) => {
				this.#options.triggers[key] = PipUI.e(item)[0];

				this.#options.triggers[key].setAttribute('data-modal-id', this.#id);
			});
		}

		PipUI.Storage.set('modal', this, this.#id);
	}



	#events() {

		let self = this;

		this.#target.addEventListener('transitionend', () => {

			self.#lock = false;

			if(self.isOpen()){
				PipUI.addClass(self.#target, self.#options.targetActiveClass);

				if(typeof self.#options.showedCallback == 'function'){
					self.#options.showedCallback(self);
				}

				PipUI.trigger(self.#target, 'showed-modal-pipui', self.#id, self.#options);

				if(PipUI.Logger && self.#options.debug){
					PipUI.Logger.info(PipUI.i18n().get('modal.d_show_complete'), self.#id, self.#options);
				}
			}else{
				PipUI.removeClass(self.#target, self.#options.targetActiveClass);

				if(typeof self.#options.hidedCallback == 'function'){
					self.#options.hidedCallback(self);
				}

				PipUI.trigger(self.#target, 'hided-modal-pipui', self.#id, self.#options);

				if(PipUI.Logger && self.#options.debug){
					PipUI.Logger.info(PipUI.i18n().get('modal.d_hide_complete'), self.#id, self.#options);
				}
			}
		});

		return this;
	}



	/**
	 * @return {this}
	 * */
	update() {

		if(PipUI.Logger && this.#options.debug){
			PipUI.Logger.info(PipUI.i18n().get('modal.d_update'), this.#options);
		}

		this.#target.innerHTML = this.#options.templates.modal;

		let content = this.#target.querySelector('.modal-content');

		if(this.#options.close){
			content.innerHTML += this.#options.templates.close;
		}

		if(this.#options.header){
			content.innerHTML += this.#options.templates.header;

			content.querySelector('.modal-header').innerHTML = this.#options.header;
		}

		if(this.#options.body){
			content.innerHTML += this.#options.templates.body;

			content.querySelector('.modal-body').innerHTML = this.#options.body;
		}

		if(this.#options.footer){
			content.innerHTML += this.#options.templates.footer;

			content.querySelector('.modal-footer').innerHTML = this.#options.footer;
		}

		PipUI.trigger(this.#target, 'update-modal-pipui', this.#id, this.#options);

		return this;
	}



	/**
	 * @return {this}
	 * */
	init() {

		if(PipUI.Logger && this.#options.debug){
			PipUI.Logger.info(PipUI.i18n().get('modal.d_init'), this.#options);
		}

		let close = this.#target.querySelector('.modal-close');

		if(close){
			this.#options.close = true;
		}

		let header = this.#target.querySelector('.modal-header');

		if(header){
			this.#options.header = header.innerHTML;
		}

		let body = this.#target.querySelector('.modal-body');

		if(body){
			this.#options.body = body.innerHTML;
		}

		let footer = this.#target.querySelector('.modal-footer');

		if(footer){
			this.#options.footer = footer.innerHTML;
		}

		PipUI.trigger(this.#target, 'init-modal-pipui', this.#id, this.#options);

		return this;
	}



	/**
	 * @return {boolean}
	 * */
	isOpen() {
		return PipUI.hasClass(this.#target, this.#options.targetActiveClass);
	}



	/**
	 * @param {function|undefined} callback
	 *
	 * @return {this}
	 * */
	show(callback) {

		if(PipUI.Logger && this.#options.debug){
			PipUI.Logger.info(PipUI.i18n().get('modal.d_show'), this.#id, this.#options);
		}

		if(this.isOpen() || this.#lock){
			if(PipUI.Logger && this.#options.debug){
				PipUI.Logger.info(PipUI.i18n().get('modal.d_lock'), this.#id, this.#options);
			}

			return this;
		}

		this.#lock = true;

		let opened = PipUI.Storage.get('modal');

		if(typeof opened != 'undefined'){
			Object.entries(opened).forEach(modal => {

				if(modal[1].isOpen()){ modal[1].hide(); }
			});
		}

		if(typeof callback == 'undefined'){
			callback = this.#options.showCallback;
		}

		if(typeof callback == 'function'){
			callback(this);
		}

		PipUI.trigger(this.#target, 'show-modal-pipui', this.#id, this.#options, this);

		PipUI.addClass(this.#target, this.#options.targetActiveClass);

		return this;
	}



	/**
	 * @param {function|undefined} callback
	 *
	 * @return {this}
	 * */
	hide(callback) {

		if(PipUI.Logger && this.#options.debug){
			PipUI.Logger.info(PipUI.i18n().get('modal.d_hide'), this.#id, this.#options);
		}

		if(!this.isOpen() || this.#lock){
			if(PipUI.Logger && this.#options.debug){
				PipUI.Logger.info(PipUI.i18n().get('modal.d_lock'), this.#id, this.#options);
			}

			return this;
		}

		this.#lock = true;

		let options = this.getOptions();

		if(typeof callback == 'undefined'){
			callback = options.hideCallback;
		}

		if(typeof callback == 'function'){
			callback(this);
		}

		PipUI.trigger(this.#target, 'hide-modal-pipui', this.#id, options, this);

		PipUI.removeClass(this.#target, this.#options.targetActiveClass);

		return this;
	}
}

PipUI.ready(document, () => {
	PipUI.body('click', '[data-modal]', (e, target) => {
		e.preventDefault();

		let id = target.getAttribute('data-modal-id');

		let modal = id ? PipUI.Storage.get('modal', id) : new ModalComponent(target.getAttribute('data-modal'), {triggers: [target]});

		modal.show();
	});

	PipUI.body('click', '.modal', (e, target) => {

		if(PipUI.hasClass(e.target, 'modal')){
			e.preventDefault();

			let id = target.getAttribute('data-modal-id');

			let modal = id ? PipUI.Storage.get('modal', id) : new ModalComponent(target.getAttribute('data-modal'), {triggers: [target]});

			modal.hide();
		}
	});

	PipUI.body('click', '.modal > .modal-wrapper [data-modal-close]', (e, target) => {
		e.preventDefault();


		let modal = target.closest('.modal');

		let id = modal.getAttribute('data-modal-id');

		if(id){ PipUI.Storage.get('modal', id).hide(); }
	});
});


if(typeof PipUI != 'undefined'){
	PipUI.addComponent('Modal', ModalComponent.VERSION);
	PipUI.required('Modal', 'Storage', '1.0.0', '>=');
	/** @return {ModalComponent} */
	PipUI.Modal = ModalComponent;

	PipUI.i18n()
		.set('modal.d_element_not_found', '[Modal] Модальное окно не найдено')
		.set('modal.d_create_instance', '[Modal] Создание объекта')
		.set('modal.d_update', '[Modal] Обновление DOM модального окна')
		.set('modal.d_init', '[Modal] Инициализация модального окна')
		.set('modal.d_lock', '[Modal] Модальное окно заблокировано')
		.set('modal.d_show', '[Modal] Попытка открытия модального окна')
		.set('modal.d_show_complete', '[Modal] Завершение открытия модального окна')
		.set('modal.d_hide_lock', '[Modal] Попытка закрытия. Закрытие уже производится')
		.set('modal.d_hide', '[Modal] Закрытие модального окна')
		.set('modal.d_hide_complete', '[Modal] Завершение закрытия модального окна');
}