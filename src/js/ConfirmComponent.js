class ConfirmComponent {
	static VERSION = '2.0.0';

	#id;

	#target;

	#container;

	#lock = false;

	#locked = false;

	#timeout;

	#options = {
		debug: false,

		title: '',

		text: '',

		placement: 'top-center',

		confirmBtn: undefined,

		cancelBtn: undefined,

		overlay: true,

		autoclose: 0,

		openedClass: 'confirm-active',

		openCallback: undefined,
		closeCallback: undefined,
		openedCallback: undefined,
		closedCallback: undefined,

		confirm: undefined,

		cancel: undefined,

		templates: {
			confirm: '<div class="confirm-id">'+
						'<div class="confirm-wrapper">' +
							'<div class="confirm-title"></div>' +
							'<div class="confirm-text"></div>'+
							'<div class="confirm-footer">' +
								'<button type="button" class="btn confirm-btn" data-confirm-confirm></button>' +
								'<button type="button" class="btn cancel-btn btn-transparent" data-confirm-cancel></button>' +
							'</div>'+
						'</div>'+
					'</div>'
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
	 *
	 * @param {object|undefined} options
	 * */
	constructor(options) {

		this.setOptions(options);

		if(PipUI.Logger && this.#options.debug){
			PipUI.Logger.info(PipUI.i18n().get('confirm.d_create_instance'), this.#options);
		}

		this.#container = document.querySelector('.confirm-container');

		if(!this.#container){
			this.#container = PipUI.create('<div class="confirm-container"></div>');

			document.body.append(this.#container);
		}

		this.#id = Math.random().toString();

		this.update();

		this.#events();

		this.open();

		PipUI.Storage.set('confirm', this, this.#id);

		this.#updateOverlay();
	}



	#events(){

		let self = this;

		this.#target.addEventListener('transitionend', () => {
			self.#lock = false;

			self.#locked = false;

			if(self.isOpen()){
				PipUI.addClass(self.#target, self.#options.openedClass);

				if(typeof self.#options.openedCallback == 'function'){
					self.#options.openedCallback(self);
				}

				if(typeof self.#timeout != 'undefined'){
					clearTimeout(self.#timeout);
					self.#timeout = undefined;
				}

				if(self.#options.autoclose > 0){
					self.#timeout = setTimeout(() => {
						self.close();
					}, self.#options.autoclose);
				}

				PipUI.trigger(self.#target, 'opened-confirm-pipui', self.#id, self.#options);

				if(PipUI.Logger && self.#options.debug){
					PipUI.Logger.info(PipUI.i18n().get('confirm.d_opened'), self.#id, self.#options);
				}
			}else{

				PipUI.removeClass(self.#target, self.#options.openedClass);

				if(typeof self.#options.closedCallback == 'function'){
					self.#options.closedCallback(self);
				}

				PipUI.trigger(self.#target, 'closed-confirm-pipui', self.#id, self.#options);

				if(PipUI.Logger && self.#options.debug){
					PipUI.Logger.info(PipUI.i18n().get('confirm.d_closed'), self.#id, self.#options);
				}

				self.#target.remove();

				PipUI.Storage.delete('confirm', self.#id);

				self.#updateOverlay();
			}
		});

		return this;
	}



	#updateOverlay() {

		let overlay = false;

		let confirms = PipUI.Storage.get('confirm');

		if(typeof confirms != 'undefined'){

			Object.keys(confirms).forEach(key => {
				let confirm = confirms[key];

				if(confirm.getOptions().overlay){
					overlay = true;

					return false;
				}
			});
		}

		if(overlay){
			PipUI.addClass(this.#container, 'confirm-overlay');
		}else{
			PipUI.removeClass(this.#container, 'confirm-overlay');
		}

		return this;
	}



	/**
	 * @return {this}
	 * */
	update() {

		if(PipUI.Logger && this.#options.debug){
			PipUI.Logger.info(PipUI.i18n().get('confirm.d_update'), this.#options);
		}

		let old = this.#container.querySelector('.confirm-id[data-confirm-id="'+this.#id+'"]');

		if(old){ old.remove(); }

		let placement = this.#container.querySelector('.placement[data-confirm-placement="'+this.#options.placement+'"]');

		if(!placement){
			placement = PipUI.create('<div class="placement" data-confirm-placement="'+this.#options.placement+'"></div>');

			this.#container.append(placement);
		}

		this.#target = PipUI.create(this.#options.templates.confirm);

		this.#target.setAttribute('data-confirm-id', this.#id);

		placement.append(this.#target);

		let text = this.#target.querySelector('.confirm-text');

		if(this.#options.text){
			text.innerHTML = this.#options.text;

			PipUI.addClass(this.#target, 'text-include');

			PipUI.style(text, 'display', null);
		}else{
			text.innerHTML = '';

			PipUI.removeClass(this.#target, 'text-include');

			PipUI.style(text, 'display', 'none');
		}

		let title = this.#target.querySelector('.confirm-title');

		if(this.#options.title){
			title.innerHTML = this.#options.title;

			PipUI.addClass(this.#target, 'title-include');

			PipUI.style(title, 'display', null);
		}else{
			title.innerHTML = '';

			PipUI.removeClass(this.#target, 'title-include');

			PipUI.style(title, 'display', 'none');
		}

		if(!this.#options.title && !this.#options.text){
			PipUI.style(this.#target, 'display', 'none');
		}

		let confirmBtn = this.#target.querySelector('.confirm-btn');

		let cancelBtn = this.#target.querySelector('.cancel-btn');

		confirmBtn.innerHTML = this.#options.confirmBtn ? this.#options.confirmBtn : PipUI.i18n().get('confirm.confirm');

		cancelBtn.innerHTML = this.#options.cancelBtn ? this.#options.cancelBtn : PipUI.i18n().get('confirm.cancel');

		return this;
	}



	/**
	 * @return {boolean}
	 * */
	isOpen() {
		return PipUI.hasClass(this.#target, this.#options.openedClass);
	}



	confirm() {
		if(this.#locked){ return this; }

		this.#locked = true;

		if(typeof this.#options.confirm == 'function'){
			this.#options.confirm(this);
		}

		PipUI.trigger(this.#target, 'confirm-confirm-pipui', this.#id, this.#options, this);

		return this.close();
	}



	cancel() {
		if(this.#locked){ return this; }

		this.#locked = true;

		if(typeof this.#options.cancel == 'function'){
			this.#options.cancel(this);
		}

		PipUI.trigger(this.#target, 'cancel-confirm-pipui', this.#id, this.#options, this);

		return this.close();
	}



	/**
	 * @param {function|undefined} callback
	 *
	 * @return {this}
	 * */
	open(callback) {

		if(PipUI.Logger && this.#options.debug){
			PipUI.Logger.info(PipUI.i18n().get('confirm.d_open'), this.#id, this.#options);
		}

		if(this.isOpen() || this.#lock){
			if(PipUI.Logger && this.#options.debug){
				PipUI.Logger.info(PipUI.i18n().get('confirm.d_lock'), this.#id, this.#options);
			}

			return this;
		}

		this.#lock = true;

		if(typeof callback == 'undefined'){
			callback = this.#options.openCallback;
		}

		if(typeof callback == 'function'){
			callback(this);
		}

		PipUI.trigger(this.#target, 'open-confirm-pipui', this.#id, this.#options, this);

		setTimeout(() => PipUI.addClass(this.#target, this.#options.openedClass), 100);

		return this;
	}



	/**
	 * @param {function|undefined} callback
	 *
	 * @return {this}
	 * */
	close(callback) {

		if(PipUI.Logger && this.#options.debug){
			PipUI.Logger.info(PipUI.i18n().get('confirm.d_close'), this.#id, this.#options);
		}

		if(!this.isOpen() || this.#lock){
			if(PipUI.Logger && this.#options.debug){
				PipUI.Logger.info(PipUI.i18n().get('confirm.d_lock'), this.#id, this.#options);
			}

			return this;
		}

		this.#lock = true;

		if(typeof this.#timeout != 'undefined'){
			clearTimeout(this.#timeout);

			this.#timeout = undefined;
		}

		if(typeof callback == 'undefined'){
			callback = this.#options.closeCallback;
		}

		if(typeof callback == 'function'){
			callback(this);
		}

		PipUI.trigger(this.#target, 'close-confirm-pipui', this.#id, this.#options, this);

		PipUI.removeClass(this.#target, this.#options.openedClass);

		return this;
	}
}

PipUI.ready(document, () => {
	PipUI.body('click', '.confirm-container [data-confirm-cancel], .confirm-container [data-confirm-confirm]', (e, target) => {
		e.preventDefault();

		/** @return {ConfirmComponent} */
		let confirm = PipUI.Storage.get('confirm', target.closest('.confirm-id').getAttribute('data-confirm-id'));

		if(target.hasAttribute('data-confirm-confirm')){
			confirm.confirm();
		}else{
			confirm.cancel();
		}
	});

	PipUI.body('click', '[data-confirm]', (e, target) => {
		e.preventDefault();

		let placement = target.getAttribute('data-confirm-placement');

		let autoclose = parseInt(target.getAttribute('data-confirm-autoclose'));

		let confirmCallback = target.getAttribute('data-confirm-confirm');

		let cancelCallback = target.getAttribute('data-confirm-cancel');

		let confirmBtn = target.getAttribute('data-confirm-confirm-btn');

		let cancelBtn = target.getAttribute('data-confirm-cancel-btn');

		let options = {
			title: target.getAttribute('data-confirm-title'),
			text: target.getAttribute('data-confirm-text'),
			overlay: target.getAttribute('data-confirm-overlay') !== 'false',
			confirm: typeof confirmCallback != 'undefined' ? window[confirmCallback] : undefined,
			cancel: typeof cancelCallback != 'undefined' ? window[cancelCallback] : undefined,
		};

		if(confirmBtn){
			options.confirmBtn = confirmBtn;
		}

		if(cancelBtn){
			options.cancelBtn = cancelBtn;
		}

		if(placement){
			options.placement = placement;
		}

		if(!isNaN(autoclose)){
			options.autoclose = autoclose;
		}

		new PipUI.Confirm(options);
	});
});


if(typeof PipUI != 'undefined'){
	PipUI.addComponent('Confirm', ConfirmComponent.VERSION);
	PipUI.required('Confirm', 'Storage', '1.0.0', '>=');
	PipUI.required('Confirm', 'Animation', '1.0.0', '>=');
	/** @return {ConfirmComponent} */
	PipUI.Confirm = ConfirmComponent;

	PipUI.i18n()
		.set('confirm.confirm', 'Подтвердить')
		.set('confirm.cancel', 'Отмена')
		.set('confirm.d_create_instance', '[Confirm] Создание объекта')
		.set('confirm.d_open', '[Confirm] Открытие подтверждения')
		.set('confirm.d_opened', '[Confirm] Завершение открытия подтверждения')
		.set('confirm.d_close', '[Confirm] Закрытие подтверждения')
		.set('confirm.d_closed', '[Confirm] Звершение закрытия подтверждения')
		.set('confirm.d_lock', '[Confirm] Подтверждение заблокировано');
}