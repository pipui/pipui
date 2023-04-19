class AlertComponent {
	static VERSION = '2.0.0';

	#id;

	#target;

	#container;

	#lock = false;

	#timeout;

	#options = {
		debug: false,

		title: '',

		text: '',

		icon: '',

		placement: 'bottom-right',

		overlay: false,

		autoclose: 3000,

		closeButton: true,

		closeClick: false,

		openedClass: 'alert-active',

		openCallback: undefined,
		closeCallback: undefined,
		openedCallback: undefined,
		closedCallback: undefined,

		animation: {
			open: {
				type: 'fadeIn',
				duration: 200
			},

			close: {
				type: 'fadeOut',
				duration: 100
			}
		},

		templates: {
			alert: '<div class="alert-id">'+
						'<div class="alert-icon"></div>' +
						'<div class="alert-wrapper">' +
							'<div class="alert-text"></div>'+
							'<div class="alert-footer">' +
								'<div class="alert-title"></div>' +
								'<div class="alert-footer-close"></div>' +
							'</div>'+
						'</div>'+
					'</div>',
			close: '<button type="button" class="btn btn-transparent" data-alert-close></button>'
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
			PipUI.Logger.info(PipUI.i18n().get('alert.d_create_instance'), this.#options);
		}

		this.#container = document.querySelector('.alert-container');

		if(!this.#container){
			this.#container = PipUI.create('<div class="alert-container"></div>');

			document.body.append(this.#container);
		}

		this.#id = Math.random().toString();

		this.update();

		this.#events();

		this.open();

		PipUI.Storage.set('alert', this, this.#id);

		this.#updateOverlay();
	}



	#events(){
		let self = this;

		this.#target.addEventListener('transitionend', () => {
			self.#lock = false;

			if(self.isOpen()){
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

				PipUI.trigger(self.#target, 'opened-alert-pipui', self.#id, this.#options);

				if(PipUI.Logger && self.#options.debug){
					PipUI.Logger.info(PipUI.i18n().get('alert.d_opened'), self.#id, self.#options);
				}
			}else{
				if(typeof self.#options.closedCallback == 'function'){
					self.#options.closedCallback(this);
				}

				PipUI.trigger(self.#target, 'closed-alert-pipui', this.#id, this.#options);

				if(PipUI.Logger && self.#options.debug){
					PipUI.Logger.info(PipUI.i18n().get('alert.d_closed'), self.#id, self.#options);
				}

				self.#target.remove();

				PipUI.Storage.delete('alert', this.#id);

				self.#updateOverlay();
			}
		});

		return this;
	}



	#updateOverlay() {

		let overlay = false;

		let alerts = PipUI.Storage.get('alert');

		if(typeof alerts != 'undefined'){

			Object.keys(alerts).forEach(key => {
				let alert = alerts[key];

				if(alert.getOptions().overlay){
					overlay = true;

					return false;
				}
			});
		}

		if(overlay){
			PipUI.addClass(this.#container, 'alert-overlay');
		}else{
			PipUI.removeClass(this.#container, 'alert-overlay');
		}

		return this;
	}



	/**
	 * @return {this}
	 * */
	update() {

		if(PipUI.Logger && this.#options.debug){
			PipUI.Logger.info(PipUI.i18n().get('alert.d_update'), this.#options);
		}

		let old = this.#container.querySelector('.alert-id[data-alert-id="'+this.#id+'"]');

		if(old){ old.remove(); }

		let placement = this.#container.querySelector('.placement[data-alert-placement="'+this.#options.placement+'"]');

		if(!placement){
			placement = PipUI.create('<div class="placement" data-alert-placement="'+this.#options.placement+'"></div>');

			this.#container.append(placement);
		}

		this.#target = PipUI.create(this.#options.templates.alert);

		this.#target.setAttribute('data-alert-id', this.#id);

		if(this.#options.closeClick){
			this.#target.setAttribute('data-alert-close', 'true');
		}else{
			this.#target.removeAttribute('data-alert-close');
		}

		placement.append(this.#target);

		let text = this.#target.querySelector('.alert-text');

		if(this.#options.text){
			text.innerHTML = this.#options.text;

			PipUI.addClass(this.#target, 'text-include');

			PipUI.style(text, 'display', null);
		}else{
			text.innerHTML = '';

			PipUI.removeClass(this.#target, 'text-include');

			PipUI.style(text, 'display', 'none');
		}

		let title = this.#target.querySelector('.alert-title');

		if(this.#options.title){
			title.innerHTML = this.#options.title;

			PipUI.addClass(this.#target, 'title-include');

			PipUI.style(title, 'display', null);
		}else{
			title.innerHTML = '';

			PipUI.removeClass(this.#target, 'title-include');

			PipUI.style(title, 'display', 'none');
		}

		let icon = this.#target.querySelector('.alert-icon');

		if(this.#options.icon){
			icon.innerHTML = this.#options.icon;

			PipUI.addClass(this.#target, 'icon-include');

			PipUI.style(icon, 'display', null);
		}else{
			icon.innerHTML = '';

			PipUI.removeClass(this.#target, 'icon-include');

			PipUI.style(icon, 'display', 'none');
		}

		if(this.#options.closeButton){
			let close = this.#target.querySelector('.alert-footer-close');

			let button = PipUI.create(this.#options.templates.close);

			button.innerHTML = PipUI.i18n().get('alert.close');

			close.append(button);
		}

		let footer = this.#target.querySelector(".alert-footer");

		if(!this.#options.closeButton && !this.#options.title){
			PipUI.style(footer, 'display', 'none');
		}else{
			PipUI.style(footer, 'display', null);
		}

		if(!this.#options.title && !this.#options.text && !this.#options.icon){
			PipUI.style(this.#target, 'display', 'none');
		}

		return this;
	}



	/**
	 * @return {boolean}
	 * */
	isOpen() {
		return PipUI.hasClass(this.#target, this.#options.openedClass);
	}



	/**
	 * @param {function|undefined} callback
	 *
	 * @return {this}
	 * */
	open(callback) {

		if(PipUI.Logger && this.#options.debug){
			PipUI.Logger.info(PipUI.i18n().get('alert.d_open'), this.#id, this.#options);
		}

		if(this.isOpen() || this.#lock){
			if(PipUI.Logger && this.#options.debug){
				PipUI.Logger.info(PipUI.i18n().get('alert.d_lock'), this.#id, this.#options);
			}

			return this;
		}

		this.#lock = true;

		let self = this;

		if(typeof callback == 'undefined'){
			callback = self.#options.openCallback;
		}

		if(typeof callback == 'function'){
			callback(this);
		}

		PipUI.trigger(this.#target, 'open-alert-pipui', this.#id, self.#options, this);

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
			PipUI.Logger.info(PipUI.i18n().get('alert.d_close'), this.#id, this.#options);
		}

		if(!this.isOpen() || this.#lock){
			if(PipUI.Logger && this.#options.debug){
				PipUI.Logger.info(PipUI.i18n().get('alert.d_lock'), this.#id, this.#options);
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

		PipUI.trigger(this.#target, 'close-alert-pipui', this.#id, this.#options, this);

		PipUI.removeClass(this.#target, this.#options.openedClass);

		return this;
	}
}

PipUI.ready(document, () => {
	PipUI.body('click', '.alert-container [data-alert-close]', (e, target) => {
		e.preventDefault();

		PipUI.Storage.get('alert', target.closest('.alert-id').getAttribute('data-alert-id')).close();
	});

	PipUI.body('click', '[data-alert]', (e, target) => {
		e.preventDefault();

		let placement = target.getAttribute('data-alert-placement');

		let autoclose = parseInt(target.getAttribute('data-alert-autoclose'));

		let options = {
			title: target.getAttribute('data-alert-title'),
			text: target.getAttribute('data-alert-text'),
			overlay: target.getAttribute('data-alert-overlay') === 'true'
		};

		if(placement){
			options.placement = placement;
		}

		if(!isNaN(autoclose)){
			options.autoclose = autoclose;
		}

		new PipUI.Alert(options);
	});
});


if(typeof PipUI != 'undefined'){
	PipUI.addComponent('Alert', AlertComponent.VERSION);
	PipUI.required('Alert', 'Storage', '1.0.0', '>=');
	/** @return {AlertComponent} */
	PipUI.Alert = AlertComponent;

	PipUI.i18n()
		.set('alert.close', 'ЗАКРЫТЬ')
		.set('alert.d_create_instance', '[Alert] Создание объекта')
		.set('alert.d_open', '[Alert] Открытие оповещения')
		.set('alert.d_opened', '[Alert] Завершение открытия оповещения')
		.set('alert.d_close', '[Alert] Закрытие оповещения')
		.set('alert.d_closed', '[Alert] Звершение закрытия оповещения')
		.set('alert.d_lock', '[Alert] Оповещение заблокировано');
}