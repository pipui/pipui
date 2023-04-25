class AutocompleteComponent {
	static VERSION = '2.0.0';

	#id;

	/** @return {HTMLElement} */
	#list;

	/** @return {HTMLElement} */
	input;

	/** @return {HTMLElement} */
	#container;

	#options = {
		debug: false,

		source: {
			url: '',
			method: 'GET',
			key: 'value',
			extra: undefined
		},

		list: [],

		min: 2,

		maxItems: 10,

		updateCallback: undefined,

		nextCallback: undefined,

		prevCallback: undefined,

		updatePosition: undefined,

		requestCallback: undefined,

		choiseCallback: undefined,

		templates: {
			list: '<ul class="autocomplete-list"></ul>',
			item: '<div class="autocomplete-item"></div>',
			container: '<div class="autocomplete"></div>'
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
	 * @param {HTMLElement|string} input
	 *
	 * @param {object|undefined} options
	 * */
	constructor(input, options) {
		this.input = PipUI.e(input)[0];

		this.setOptions(options);

		if(typeof this.input == 'undefined'){
			if(PipUI.Logger && this.#options.debug){
				PipUI.Logger.info(PipUI.i18n().get('autocomplete.d_element_not_found'), this.#options);
			}

			return this;
		}

		if(PipUI.Logger && this.#options.debug){
			PipUI.Logger.info(PipUI.i18n().get('autocomplete.d_create_instance'), this.#options);
		}

		this.#id = Math.random().toString();

		this.#container = PipUI.create(this.#options.templates.container);

		let url = this.input.getAttribute('data-autocomplete-url');

		let method = this.input.getAttribute('data-autocomplete-method');

		let key = this.input.getAttribute('data-autocomplete-key');

		let min = this.input.getAttribute('data-autocomplete-min');

		let maxItems = this.input.getAttribute('data-autocomplete-max-items');

		let list = this.input.getAttribute('data-autocomplete-list');

		if(url){ this.#options.source.url = url; }

		if(method){ this.#options.source.method = method; }

		if(key){ this.#options.source.key = key; }

		if(min){ this.#options.min = min; }

		if(maxItems){ this.#options.maxItems = maxItems; }

		if(list){ this.#options.list = list.split(';'); }

		PipUI.addClass(this.input, 'autocomplete-input');

		this.input.setAttribute('data-autocomplete-id', this.#id);

		this.input.setAttribute('autocomplete', 'off');

		this.#container.setAttribute('data-autocomplete-id', this.#id);

		this.input.after(this.#container);

		this.#list = PipUI.create(this.#options.templates.list);

		this.#container.append(this.#list);

		this.#updateEvents().request(this.input.value);

		PipUI.Storage.set('autocomplete', this, this.#id);
	}



	#next() {
		if(!this.isOpenedContainer()){ return this; }

		if(PipUI.Logger && this.#options.debug){
			PipUI.Logger.info(PipUI.i18n().get('autocomplete.d_next'), this.#options);
		}

		let current = this.#list.querySelector('.autocomplete-item.hover');

		PipUI.removeClass(current, 'hover');

		let item;

		if(current && current.nextElementSibling){
			item = current.nextElementSibling;
		}else{
			item = this.#list.querySelector('.autocomplete-item:first-child');
		}


		PipUI.addClass(item, 'hover');

		item.scrollIntoView();

		if(typeof this.#options.nextCallback == 'function'){
			this.#options.nextCallback(this, item, current);
		}

		PipUI.trigger(this.input, 'next-autocomplete-pipui', item, current, this.#id, this.#options, this);

		return this;
	}



	#prev() {
		if(!this.isOpenedContainer()){ return this; }

		if(PipUI.Logger && this.#options.debug){
			PipUI.Logger.info(PipUI.i18n().get('autocomplete.d_prev'), this.#options);
		}

		let current = this.#list.querySelector('.autocomplete-item.hover');

		PipUI.removeClass(current, 'hover');

		let item;

		if(current && current.previousElementSibling){
			item = current.previousElementSibling;
		}else{
			item = this.#list.querySelector('.autocomplete-item:last-child');
		}

		PipUI.addClass(item, 'hover');

		item.scrollIntoView();

		if(typeof this.#options.prevCallback == 'function'){
			this.#options.prevCallback(this, item, current);
		}

		PipUI.trigger(this.input, 'prev-autocomplete-pipui', item, current, this.#id, this.#options, this);

		return this;
	}



	/**
	 * @param {string} value
	 *
	 * @param {function|undefined} callback
	 *
	 * @return {this}
	 * */
	request(value, callback){

		this.#list.innerHTML = '';

		PipUI.removeClass(this.#container, 'autocomplete-active');

		if(value.length < this.#options.min){

			if(PipUI.Logger && this.#options.debug){
				PipUI.Logger.info(PipUI.i18n().get('autocomplete.d_request'), this.#options);
			}

			return this;
		}

		if(PipUI.Logger && this.#options.debug){
			PipUI.Logger.info(PipUI.i18n().get('autocomplete.d_http_request'), this.#options.source.url, this.#options);
		}

		if(!this.#options.source.url){ return this.update(value); }

		let formData = new FormData();

		formData.append(this.#options.source.key, value);

		if(this.#options.source.extra){
			Object.keys(this.#options.source.extra).forEach(key => {

				formData.append(key, this.#options.source.extra[key]);
			});
		}

		let self = this;

		fetch(this.#options.source.url, {
			method: this.#options.source.method,
			body: formData,
			credentials: "same-origin"
		})
			.then(response => {

				if(PipUI.Logger && self.#options.debug){
					PipUI.Logger.info(PipUI.i18n().get('autocomplete.d_response_handler'), response, self.#options);
				}

				if(typeof callback == 'undefined'){
					callback = self.#options.requestCallback;
				}

				if(typeof callback == 'function'){
					callback(self, response, value);
				}

				PipUI.trigger(self.input, 'request-autocomplete-pipui', response, value, self.#id, self.#options, self);

				return response.json();
			})
			.then(result => {

				if(PipUI.Logger && self.#options.debug){
					PipUI.Logger.info(PipUI.i18n().get('autocomplete.d_response_result'), result.list, self.#options);
				}

				self.#options.list = result.list;

				self.update(value);
			})
			.catch(error => {
				if(PipUI.Logger && self.#options.debug){
					PipUI.Logger.error(PipUI.i18n().get('autocomplete.d_request_error'), self.#options, error);
				}

				self.update(value);
			});
	}



	/**
	 * @param {string} value
	 *
	 * @param {function|undefined} callback
	 *
	 * @return {this}
	 * */
	update(value, callback){

		if(PipUI.Logger && this.#options.debug){
			PipUI.Logger.info(PipUI.i18n().get('autocomplete.d_update_list'), value, this.#options);
		}

		let found = 0;

		for(let i = 0; i < this.#options.list.length; i++){

			let val = this.#options.list[i];

			if(val.toLowerCase().indexOf(value.toLowerCase()) === -1){ continue; }

			found++;

			let item = PipUI.create(this.#options.templates.item);

			item.setAttribute('data-autocomplete-item-index', i);

			item.innerHTML = val;

			this.#list.append(item);

			if(found >= this.#options.maxItems){ break; }
		}

		if(found > 0){
			PipUI.addClass(this.#container, 'autocomplete-active');
		}

		if(typeof callback != 'function'){
			callback = this.#options.updateCallback;
		}

		if(typeof callback == 'function'){
			callback(this, value);
		}

		PipUI.trigger(this.input, 'update-autocomplete-pipui', value, this.#id, this.#options, this);

		return this.updatePosition();
	}



	/**
	 * @param {function|undefined} callback
	 *
	 * @return {this}
	 * */
	updatePosition(callback){

		let left = this.input.offsetLeft;

		let top = this.input.offsetTop + this.input.offsetHeight;

		if(PipUI.Logger && this.#options.debug){
			PipUI.Logger.info(PipUI.i18n().get('autocomplete.d_update_position'), left, top, this.#options);
		}

		PipUI.style(this.#container, {
			left: left+'px',
			top: top+'px'
		});

		if(typeof callback != 'function'){
			callback = this.#options.updatePosition;
		}

		if(typeof callback == 'function'){
			callback(this, top, left);
		}

		PipUI.trigger(this.input, 'update-position-autocomplete-pipui', top, left, this.#id, this.#options, this);

		return this;
	}



	/**
	 * @return {boolean}
	 * */
	isOpenedContainer(){
		return PipUI.hasClass(this.#container, 'autocomplete-active');
	}



	/**
	 * @param {int} index
	 *
	 * @param {function|undefined} callback
	 *
	 * @return {this}
	 * */
	choise(index, callback){
		if(!this.isOpenedContainer()){ return this; }

		if(PipUI.Logger && this.#options.debug){
			PipUI.Logger.info(PipUI.i18n().get('autocomplete.d_choise'), this.#options);
		}

		let item = this.#list.querySelector('.autocomplete-item[data-autocomplete-item-index="'+index+'"]');

		if(!item){ return this; }

		this.input.value = item.innerText;

		PipUI.removeClass(this.#container, 'autocomplete-active');

		if(typeof callback != 'function'){
			callback = this.#options.choiseCallback;
		}

		if(typeof callback == 'function'){
			callback(this, item);
		}

		PipUI.trigger(this.input, 'choise-autocomplete-pipui', item, this.#id, this.#options, this);

		return this;
	}



	#updateEvents(){
		let self = this;

		this.input.addEventListener('keydown', e => {
			if(e.key == 'ArrowDown'){
				e.preventDefault();

				self.#next();
			}else if(e.key == 'ArrowUp'){
				e.preventDefault();

				self.#prev();
			}else if(e.key == 'Enter'){
				e.preventDefault();

				let item = self.#list.querySelector('.autocomplete-item.hover');

				if(item){
					self.choise(item.getAttribute('data-autocomplete-item-index'));
				}
			}
		});

		this.input.addEventListener('input', e => {
			self.request(e.target.value);
		});

		this.input.addEventListener('focusout', e => {
			if(!e.explicitOriginalTarget.parentElement.closest('.autocomplete[data-autocomplete-id="'+self.#id+'"]')){
				PipUI.removeClass(self.#container, 'autocomplete-active');
			}
		});

		window.addEventListener('resize', () => {
			if(self.isOpenedContainer()){ self.updatePosition(); }
		});

		return this;
	}
}

PipUI.ready(document, () => {

	PipUI.body('click', '.autocomplete > .autocomplete-list > .autocomplete-item', (e, target) => {
		e.preventDefault();

		let id = target.closest('.autocomplete').getAttribute('data-autocomplete-id');

		PipUI.Storage.get('autocomplete', id).choise(target.getAttribute('data-autocomplete-item-index'));
	});

	PipUI.body('mouseover', '.autocomplete > .autocomplete-list > .autocomplete-item', (e, target) => {
		PipUI.removeClass(target.closest('.autocomplete-list').querySelectorAll('.autocomplete-item'), 'hover');

		PipUI.addClass(target, 'hover');
	});

	PipUI.body('focusin', '[data-autocomplete]:not([data-autocomplete-id])', (e, target) => {
		new AutocompleteComponent(target);
	});

});


if(typeof PipUI != 'undefined'){
	PipUI.addComponent('Autocomplete', AutocompleteComponent.VERSION);
	PipUI.required('Autocomplete', 'Storage', '1.0.0', '>=');
	/** @return {AutocompleteComponent} */
	PipUI.Autocomplete = AutocompleteComponent;


	PipUI.i18n()
		.set('autocomplete.d_create_instance', '[Autocomplete] Создание объекта')
		.set('autocomplete.d_element_not_found', '[Autocomplete] Форма ввода не найдена')
		.set('autocomplete.d_request_error', '[Autocomplete] Произошла ошибка запроса')
		.set('autocomplete.d_next', '[Autocomplete] Переключение на следующий пункт')
		.set('autocomplete.d_prev', '[Autocomplete] Переключение на предыдущий пункт')
		.set('autocomplete.d_request', '[Autocomplete] Запрос на изменение списка')
		.set('autocomplete.d_http_request', '[Autocomplete] HTTP запрос к серверу')
		.set('autocomplete.d_response_handler', '[Autocomplete] Запуск обработчика ответа')
		.set('autocomplete.d_response_result', '[Autocomplete] Изменение списка')
		.set('autocomplete.d_update_list', '[Autocomplete] Обновление DOM списка')
		.set('autocomplete.d_update_position', '[Autocomplete] Обновление позиции')
		.set('autocomplete.d_choise', '[Autocomplete] Выбор элемента списка');
}