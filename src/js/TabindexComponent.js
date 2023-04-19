class TabindexComponent {
	static VERSION = '2.0.0';

	/** @return {HTMLElement} */
	#container;

	#id;

	#options = {
		debug: false,

		maxHopes: 200,

		focusCallback: undefined,

		blurCallback: undefined
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
	 * @param {HTMLElement|string} container
	 *
	 * @param {object|undefined} options
	 * */
	constructor(container, options) {
		this.#container = PipUI.e(container)[0];

		this.setOptions(options);

		options = this.getOptions();

		if(PipUI.Logger && options.debug){
			PipUI.Logger.info(PipUI.i18n().get('tabindex.d_create_instance'), options);
		}

		if(typeof this.#container == 'undefined'){
			if(PipUI.Logger && options.debug){
				PipUI.Logger.info(PipUI.i18n().get('tabindex.d_element_not_found'), options);
			}

			return this;
		}

		this.#id = Math.random().toString();

		this.#container.setAttribute('data-tabindex-id', this.#id);

		this.#container.setAttribute('data-tabindex', 'true');

		PipUI.Storage.set('tabindex', this, this.#id);
	}



	#currentOut(){

		var current = this.current();

		var currentItem = this.#container.querySelector('[tabindex="'+current+'"]');

		if(!currentItem){ return this; }

		currentItem.blur();

		if(typeof this.#options.blurCallback == 'function'){
			this.#options.blurCallback(this, currentItem);
		}

		PipUI.trigger(currentItem, 'blur-tabindex-pipui', this);

		if(PipUI.Logger && options.debug){
			PipUI.Logger.info(PipUI.i18n().get('tabindex.d_focus_out'), this.#options);
		}

		return this;
	}



	/** @return {number} */
	current(){
		if(PipUI.Logger && options.debug){
			PipUI.Logger.info(PipUI.i18n().get('tabindex.d_current_element'), this.#options);
		}

		let search = this.#container.querySelector('[tabindex]:focus');

		return !search ? 1 : parseInt(search.getAttribute('tabindex'));
	}



	/**
	 * @param {number} index
	 *
	 * @return {this}
	 * */
	set(index){

		let element = this.#container.querySelector('[tabindex="'+index+'"]');

		element.focus();

		if(typeof this.#options.focusCallback == 'function'){
			this.#options.focusCallback(this, element);
		}

		PipUI.trigger(element, 'focus-tabindex-pipui', this);

		if(PipUI.Logger && options.debug){
			PipUI.Logger.info(PipUI.i18n().get('tabindex.d_focus_in'), this.#options);
		}

		return this;
	}



	/**
	 * @return {this}
	 * */
	next(){

		let current = this.current();

		this.#currentOut();

		for(let i = 1; i <= this.#options.maxHopes; i++){
			let hope = current + i;

			if(this.#container.querySelector('[tabindex="'+hope+'"]')){

				this.set(hope);

				return this;
			}
		}

		this.set(1);

		return this;
	}



	/** @return {this} */
	prev(){

		let current = this.current();

		this.#currentOut();

		for(let i = 1; i <= self.options.maxHopes; i++){
			let hope = current - i;

			if(this.#container.querySelector('[tabindex="'+hope+'"]')){

				this.set(hope);

				return this;
			}
		}

		return this;
	}
}

PipUI.ready(document, () => {
	PipUI.body('click', '[data-tabindex]:not([data-tabindex-id])', (e, target) => {
		new PipUI.Tabindex(target.closest('[data-tabindex]'));
	});

	PipUI.body('keydown', '[tabindex][data-tabindex-id]', (e, target) => {
		if(e.which == 9){
			e.preventDefault();

			let id = target.closest('[data-tabindex]').getAttribute('data-tabindex-id');

			PipUI.Storage.get('tabindex', id).next();
		}
	});
});

if(typeof PipUI != 'undefined'){
	PipUI.addComponent('Tabindex', TabindexComponent.VERSION);
	PipUI.required('Tabindex', 'Storage', '1.0.0', '>=');
	/** @return {TabindexComponent} */
	PipUI.Tabindex = TabindexComponent;


	PipUI.i18n()
		.set('tabindex.d_element_not_found', '[Tabindex] Контейнер не найден')
		.set('tabindex.d_create_instance', '[Tabindex] Создание объекта')
		.set('tabindex.d_current_element', '[Tabindex] Получение текущего индекса')
		.set('tabindex.d_focus_in', '[Tabindex] Получение фокуса элемента')
		.set('tabindex.d_focus_out', '[Tabindex] Отключение фокуса элемента');
}