class AlertblockComponent {
	static VERSION = '2.0.0';

	/** @return {HTMLElement} */
	#element;

	#id;

	#eventCallback;

	#options = {
		debug: false,
		wrapperTemplate: '<div class="alertblock-wrapper"></div>',
		closeTemplate: '<a href="#" class="alertblock-close" rel="nofollow">&times;</a>',
		before: '',
		after: '',
		class: '',
		closeCallback: undefined,
		closedCallback: undefined,
		showCallback: undefined,
		hideCallback: undefined,
		showedCallback: undefined,
		hidedCallback: undefined,
		hiddenClass: 'alertblock-hidden',
		closedClass: 'alertblock-closed',
		noneClass: 'alertblock-none',
		canClose: false,
		message: ''
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
	 * @param {boolean|undefined} update
	 * */
	constructor(object, options, update) {

		this.#element = PipUI.e(object)[0];

		this.setOptions(options);

		options = this.getOptions();

		if(typeof this.#element == 'undefined'){
			if(PipUI.Logger && this.#options.debug){
				PipUI.Logger.info(PipUI.i18n().get('alertblock.d_element_not_found'), this.#options);
			}

			return this;
		}

		if(PipUI.Logger && this.#options.debug){
			PipUI.Logger.info(PipUI.i18n().get('alertblock.d_create_instance'), this.#options);
		}

		this.#id = Math.random().toString();

		this.#element.setAttribute('data-alertblock-id', this.#id);

		PipUI.addClass(this.#element, 'alertblock ' + this.#options.class);

		PipUI.Storage.set('alertblock', this, this.#id);

		if(update){
			if(PipUI.Logger && options.debug){
				PipUI.Logger.info(PipUI.i18n().get('alertblock.d_create_create'), this.#options);
			}

			this.update();
		}else{
			if(PipUI.Logger && options.debug){
				PipUI.Logger.info(PipUI.i18n().get('alertblock.d_create_init'), this.#options);
			}

			this.#init();
		}

		this.#events();
	}


	#events(){

		let self = this;

		this.#eventCallback = (e) => {
			e.preventDefault();

			self.close();
		};

		let close = this.#element.querySelector('.alertblock-close');

		if(close){
			close.addEventListener('click', this.#eventCallback);
		}


		this.#element.addEventListener('transitionend', () => {
			if(PipUI.hasClass(self.#element, self.#options.closedClass)){
				if(typeof self.#options.closedCallback == 'function'){
					self.#options.closedCallback(self.#id, self.#options, self.#element);
				}

				PipUI.trigger(self.#element, 'closed-alertblock-pipui', self.#id, self.#options, self.#element);

				let close = this.#element.querySelector('.alertblock-close');

				if(close){ close.removeEventListener('click', this.#eventCallback); }

				self.#element.remove();
			}else if(PipUI.hasClass(self.#element, self.#options.hiddenClass)){
				if(typeof self.#options.hidedCallback == 'function'){
					self.#options.hided(self.#id, self.#options, self.#element);
				}

				PipUI.trigger(self.#element, 'hided-alertblock-pipui', self.#id, self.#options, self.#element);

				PipUI.addClass(self.#element, self.#options.noneClass);
			}else{
				if(typeof self.#options.showedCallback == 'function'){
					self.#options.showedCallback(self.#id, self.#options, self.#element);
				}

				PipUI.trigger(self.#element, 'showed-alertblock-pipui', self.#id, self.#options, self.#element);
			}
		});

		return this;
	}



	/**
	 * @param {string} message
	 *
	 * @return {this}
	 * */
	setMessage(message) {

		this.#options.message = message;

		PipUI.children(this.#element, '.alertblock-wrapper')[0].innerHTML = this.#options.message;

		return this;
	}



	/** @return {this} */
	update() {
		let close = this.#element.querySelector('.alertblock-close');

		if(close){
			close.removeEventListener('click', this.#eventCallback);
		}

		this.#element.innerHTML = '';

		if(this.#options.before){
			this.#element.innerHTML += '<div class="before">'+this.#options.before+'</div>';
		}

		this.#element.innerHTML += this.#options.wrapperTemplate;

		if(this.#options.after){
			this.#element.innerHTML += '<div class="after">'+this.#options.after+'</div>';
		}

		if(this.#options.canClose){
			this.#element.innerHTML += this.#options.closeTemplate;
		}

		this.setMessage(this.#options.message);

		this.#element.querySelector('.alertblock-close').addEventListener('click', this.#eventCallback);

		PipUI.trigger(this.#element, 'update-alertblock-pipui', this, this.#id, this.#options);

		return this;
	}



	/** @return {this} */
	#init() {

		let wrapper = PipUI.children(this.#element, '.alertblock-wrapper');

		this.#options.message = wrapper.length <= 0 ? '' : wrapper[0].innerHTML;

		this.#options.canClose = PipUI.children(this.#element, '.alertblock-close').length == 1;

		let classlist = [];

		for(let name of this.#element.classList){
			if(name == 'alertblock'){ continue; }

			classlist.push(name);
		}

		this.#options.class = classlist.join(' ');

		let before = PipUI.children(this.#element, '.before');

		let after = PipUI.children(this.#element, '.after');

		if(before.length == 1){
			this.#options.before = before[0].innerHTML;
		}

		if(after.length == 1){
			this.#options.after = after[0].innerHTML;
		}

		return this;
	}



	/**
	 * @param {function} callback
	 *
	 * @return {this}
	 * */
	close(callback) {
		let self = this;

		if(typeof self.#element == 'undefined'){ return this; }

		if(PipUI.Logger && this.#options.debug){
			PipUI.Logger.info(PipUI.i18n().get('alertblock.d_close'), this.#id, this.#options, this.#element);
		}

		PipUI.trigger(this.#element, 'close-alertblock-pipui', this.#id, this.#options, this.#element);

		PipUI.addClass(this.#element, this.#options.closedClass);

		return this;
	}



	/**
	 * @param {function} callback
	 *
	 * @return {this}
	 * */
	hide(callback) {
		if(typeof this.#element == 'undefined'){ return this; }

		if(PipUI.Logger && this.#options.debug){
			PipUI.Logger.info(PipUI.i18n().get('alertblock.d_hide'), this.#id, this.#options, this.#element);
		}

		PipUI.trigger(this.#element, 'hide-alertblock-pipui', this.#id, this.#options, this.#element);

		PipUI.addClass(this.#element, this.#options.hiddenClass);

		return this;
	}



	/**
	 * @param {function} callback
	 *
	 * @return {this}
	 * */
	show(callback) {
		if(typeof this.#element == 'undefined'){ return this; }

		if(PipUI.Logger && this.#options.debug){
			PipUI.Logger.info(PipUI.i18n().get('alertblock.d_show'), this.#id, this.#options, this.#element);
		}

		PipUI.trigger(this.#element, 'show-alertblock-pipui', this.#id, this.#options, this.#element);

		PipUI.removeClass(this.#element, this.#options.noneClass);

		setTimeout(() => PipUI.removeClass(this.#element, this.#options.hiddenClass), 0);

		return this;
	}
}

if(typeof PipUI != 'undefined'){
	PipUI.addComponent('Alertblock', AlertblockComponent.VERSION);
	PipUI.required('Alertblock', 'Storage', '1.0.0', '>=');
	/** @return {AlertblockComponent} */
	PipUI.Alertblock = AlertblockComponent;

	PipUI.i18n()
		.set('alertblock.d_element_not_found', '[Alertblock] Элементы не найдены')
		.set('alertblock.d_create_instance', '[Alertblock] Создание объекта')
		.set('alertblock.d_create_init', '[Alertblock] Создание объекта по стратегии инициализации')
		.set('alertblock.d_create_create', '[Alertblock] Создание объекта по стратегии создания')
		.set('alertblock.d_create_wrapper', '[Alertblock] Враппер не найден, создаём новый')
		.set('alertblock.d_close', '[Alertblock] Закрытие блока с полным удалением')
		.set('alertblock.d_hide', '[Alertblock] Скрытие блока')
		.set('alertblock.d_show', '[Alertblock] Отображение блока');
}