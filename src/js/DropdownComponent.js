class DropdownComponent {
	static VERSION = '2.0.0';

	/** @return {HTMLElement} */
	#wrapper;

	/** @return {HTMLElement} */
	#trigger;

	/** @return {HTMLElement} */
	#element;

	/** @return {string} */
	#id;

	#triggerClickEvent;

	#triggerMouseEnterEvent;

	#triggerSubmenuMouseEnterEvent;

	#triggerSubmenuClickEvent;

	#triggerEventCallback;

	#options = {
		debug: false,
		templates: {
			wrapper: '<div class="dropdown"></div>',
			trigger: '<button type="button" class="btn dropdown-trigger"></button>',
			list: '<ul class="dropdown-list"></ul>',
			item: '<li class="dropdown-item"></li>'
		},
		name: '',
		url: '',
		list: [],
		direction_x: 'right',
		direction_y: 'down',
		openEvent: 'click',
		submenuOpenEvent: 'hover',
		showCallback: undefined,
		hideCallback: undefined
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
		this.#element = PipUI.e(object)[0];

		this.setOptions(options);

		options = this.getOptions();

		if(typeof this.#element == 'undefined'){
			if(PipUI.Logger && options.debug){
				PipUI.Logger.info(PipUI.i18n().get('dropdown.d_element_not_found'), options);
			}

			return this;
		}

		if(PipUI.Logger && options.debug){
			PipUI.Logger.info(PipUI.i18n().get('dropdown.d_create_instance'), options);
		}

		this.#id = Math.random().toString();

		if(update){
			this.update();
		}else{
			this.#init();
		}

		this.#events();

		PipUI.Storage.set('dropdown', this, this.#id);

		return this;
	}



	#removeEvents(){
		if(typeof this.#trigger != 'undefined'){
			console.log(this.#trigger);
			this.#trigger.removeEventListener('click', this.#triggerEventCallback);
			this.#trigger.removeEventListener('mouseenter', this.#triggerMouseEnterEvent);
		}

		if(typeof this.#wrapper != 'undefined'){
			this.#wrapper.querySelectorAll('.dropdown-submenu-trigger').forEach(item => {
				item.addEventListener('click', this.triggerClickEvent);
				item.addEventListener('mouseenter', this.#triggerSubmenuMouseEnterEvent);
				item.addEventListener('click', this.#triggerSubmenuClickEvent);
			});
		}

		return this;
	}



	#events(){

		let self = this;

		let options = this.getOptions();

		if(PipUI.Logger && options.debug){
			PipUI.Logger.info(PipUI.i18n().get('dropdown.d_events'), this.#id, options);
		}

		this.#triggerEventCallback = e => {

			e.preventDefault();

			if(self.isOpen()){
				self.hide();
			}else{
				self.show();
			}
		}

		this.#trigger.addEventListener('click', this.#triggerEventCallback);

		if(options.openEvent == 'hover'){

			this.#triggerMouseEnterEvent = () => {

				self.show();
			}

			this.#trigger.addEventListener('mouseenter', this.#triggerMouseEnterEvent);
		}

		if(options.submenuOpenEvent == 'click'){
			let submenu = this.#wrapper.querySelectorAll('.dropdown-submenu-trigger');

			this.#triggerClickEvent = e => {
				e.preventDefault();

				let that = e.target;

				let menu = that.closest('.dropdown-submenu');

				if(PipUI.hasClass(menu, 'active')){
					PipUI.removeClass(menu, 'active');

					menu.querySelectorAll('.active').forEach(item => {
						PipUI.removeClass(item, 'active');
					});
				}else{
					PipUI.addClass(menu, 'active');
				}
			}

			submenu.forEach(item => {
				item.addEventListener('click', this.triggerClickEvent);
			});
		}else if(options.submenuOpenEvent == 'hover'){

			this.#triggerSubmenuMouseEnterEvent = e => {
				let that = e.target;

				let childs = PipUI.children(that, '.dropdown-submenu-trigger');

				PipUI.removeClass(PipUI.siblings(that, 'dropdown-item'), 'active');

				if(childs.length > 0 && !PipUI.hasClass(that, 'active')){
					that.querySelectorAll('.active').forEach(item => {
						PipUI.removeClass(item, 'active');
					});

					PipUI.addClass(that, 'active');
				}
			}

			self.#wrapper.querySelectorAll('.dropdown-item').forEach(item => {
				item.addEventListener('mouseenter', this.#triggerSubmenuMouseEnterEvent);
			});

			this.#triggerSubmenuClickEvent = e => {
				e.preventDefault();

				let target = e.target;

				let sub = target.closest('.dropdown-submenu');

				PipUI.toggleClass(sub, 'active');

				PipUI.removeClass(sub.querySelectorAll('.active'), 'active');
			}

			self.#wrapper.querySelectorAll('.dropdown-submenu-trigger').forEach(item => {
				item.addEventListener('click', this.#triggerSubmenuClickEvent);
			});
		}

		return self;
	}



	/**
	 * @return {this}
	 * */
	#init(){

		this.#removeEvents();

		let options = this.getOptions();

		if(PipUI.Logger && options.debug){
			PipUI.Logger.info(PipUI.i18n().get('dropdown.d_render'), this.#id, options);
		}

		this.#wrapper = this.#element;

		this.#wrapper.setAttribute('data-dropdown-id', this.#id);

		var direction_x = this.#wrapper.getAttribute('data-dropdown-direction-x');

		var direction_y = this.#wrapper.getAttribute('data-dropdown-direction-y');

		if(direction_x){
			options.direction_x = direction_x;
		}

		if(direction_y){
			options.direction_y = direction_y;
		}

		this.#wrapper.setAttribute('data-dropdown-direction-x', options.direction_x);

		this.#wrapper.setAttribute('data-dropdown-direction-y', options.direction_y);

		this.#trigger = PipUI.children(this.#wrapper, '.dropdown-trigger')[0];

		if(!this.#trigger){
			this.#trigger = PipUI.create(options.templates.trigger);

			this.#wrapper.innerHTML = this.#trigger.outerHTML + this.#wrapper.innerHTML;
		}

		var name = this.#trigger.innerHTML.trim();

		if(!options.name && name != ''){
			options.name = name;
		}

		this.#trigger.innerHTML = options.name;

		var url = this.#trigger.getAttribute('href');

		if(!options.url && url){
			options.url = url;

			this.#trigger.setAttribute('href', options.url);
		}


		var listWrapper = PipUI.children(this.#wrapper, '.dropdown-list')[0];

		if(!listWrapper){
			listWrapper = PipUI.create(options.templates.list);

			this.#wrapper.innerHTML += listWrapper.outerHTML;
		}

		if(listWrapper.innerHTML.trim() == ''){
			if(options.list){
				this.#renderList(options.list, this.#wrapper);
			}
		}else{
			options.list = this.#initList(listWrapper);
		}

		return this;
	}



	/**
	 * @param {HTMLElement} wrapper
	 *
	 * @param {array} l
	 *
	 * @return {array}
	 * */
	#initList(wrapper, l) {
		if(typeof l == 'undefined'){ l = []; }

		if(!wrapper.length){ return l; }

		PipUI.children(wrapper, '.dropdown-item').forEach(that => {

			var target = PipUI.children(that, '.dropdown-link');

			if(!target.length){
				target = PipUI.children(that, '.dropdown-element');
			}

			if(!target.length){ return; }

			var item = {
				active: PipUI.hasClass(that, 'active'),
				name: target.innerHTML,
			};

			var url = target.getAttribute('href');

			if(typeof url != 'undefined'){
				item.url = url;
			}

			var _target = target.getAttribute('target');

			if(typeof _target != 'undefined'){
				item.target = _target;
			}

			if(PipUI.hasClass(that, 'dropdown-submenu')){
				item.submenu = this.#initList(PipUI.children(that, '.dropdown-list'), item.submenu);
			}

			l.push(item);
		});

		return l;
	}



	/** @return {this} */
	update() {

		this.#removeEvents();

		let options = this.getOptions();

		if(PipUI.Logger && options.debug){
			PipUI.Logger.info(PipUI.i18n().get('dropdown.d_render'), this.#id, options);
		}

		this.#wrapper = PipUI.create(options.templates.wrapper);

		this.#wrapper.setAttribute('data-dropdown-id', this.#id);

		this.#wrapper.setAttribute('data-dropdown-direction-x', options.direction_x);

		this.#wrapper.setAttribute('data-dropdown-direction-Y', options.direction_y);


		this.#trigger = PipUI.create(options.templates.trigger);

		this.#trigger.innerHTML = options.name ?? '';

		this.#wrapper.innerHTML = this.#trigger.outerHTML + this.#wrapper.innerHTML;

		if(options.url){ this.#trigger.setAttribute('href', options.url); }

		if(options.target){ this.#trigger.setAttribute('target', options.target); }

		if(Array.isArray(options.list)){
			this.#renderList(options.list, this.#wrapper);
		}

		this.#element.outerHTML = this.#wrapper.outerHTML;

		this.#wrapper = document.querySelector('.dropdown[data-dropdown-id="'+this.#id+'"]');

		this.#trigger = PipUI.children(this.#wrapper, '.dropdown-trigger')[0];

		return this;
	}



	/**
	 * @param {array} arr
	 *
	 * @param {HTMLElement} wrapper
	 *
	 * @return {this}
	 * */
	#renderList(arr, wrapper) {
		let options = this.getOptions();

		var items = PipUI.create(options.templates.list);

		for(var i = 0; i < arr.length; i++){
			var data = arr[i];

			if(typeof data == 'undefined'){ continue; }

			var item = PipUI.create(options.templates.item);

			var element;

			if(data.url){
				element = PipUI.create('<a class="dropdown-link" href="'+data.url+'" rel="nofollow"></a>');

				if(data.target){
					element.setAttribute('target', data.target);
				}

			}else{
				element = PipUI.create('<div class="dropdown-element"></div>');
			}

			element.innerHTML = data.name;

			if(data.active){
				PipUI.addClass(item, 'active');
			}

			if(Array.isArray(data.submenu)){
				PipUI.addClass(item, 'dropdown-submenu');

				PipUI.addClass(element, 'dropdown-submenu-trigger');

				this.#renderList(data.submenu, item);
			}

			item.innerHTML += element.outerHTML;

			items.innerHTML += item.outerHTML;
		}

		wrapper.innerHTML += items.outerHTML;

		return this;
	}



	/**
	 * @return {boolean}
	 * */
	isOpen() {
		return PipUI.hasClass(this.#wrapper, 'active');
	}



	/**
	 * @param {function} callback
	 *
	 * @return {this}
	 * */
	hide(callback) {

		if(!this.isOpen()){ return this; }

		if(typeof this.#wrapper == 'undefined'){ return this; }

		let options = this.getOptions();

		if(PipUI.Logger && options.debug){
			PipUI.Logger.info(PipUI.i18n().get('dropdown.d_hide'), this.#id);
		}

		PipUI.removeClass(this.#wrapper, 'active');

		PipUI.removeClass(this.#wrapper.querySelectorAll('.active'), 'active');

		if(typeof callback != 'function'){
			callback = options.hideCallback;
		}

		if(typeof callback == 'function'){
			callback(this);
		}

		PipUI.trigger(this.#wrapper, 'hide-dropdown-pipui', this.#wrapper, options, this);

		return this;
	}



	/**
	 * @param {function} callback
	 *
	 * @return {this}
	 * */
	show(callback) {

		if(this.isOpen()){ return this; }

		if(typeof this.#wrapper == 'undefined'){ return this; }

		let options = this.getOptions();

		if(PipUI.Logger && options.debug){
			PipUI.Logger.info(PipUI.i18n().get('dropdown.d_show'), this.#id);
		}

		let opened = PipUI.Storage.get('dropdown');

		if(typeof opened == 'object'){
			Object.keys(opened).forEach(key => {
				opened[key].hide();
			});
		}

		PipUI.addClass(this.#wrapper, 'active');

		PipUI.removeClass(this.#wrapper.querySelectorAll('.active'), 'active');

		if(typeof callback != 'function'){
			callback = options.showCallback;
		}

		if(typeof callback == 'function'){
			callback(this);
		}

		PipUI.trigger(this.#wrapper, 'show-dropdown-pipui', this.#wrapper, options, this);

		return this;
	}
}

PipUI.ready(document, () => {
	document.body.addEventListener('click', (e) => {
		let target = e.target;

		let parent = target.closest('.dropdown:not([data-dropdown-id]) > .dropdown-trigger');

		let showed;

		if(parent){
			e.preventDefault();

			showed = new DropdownComponent(parent.closest('.dropdown')).show();
		}

		if(!target.closest('.dropdown')){
			let opened = PipUI.Storage.get('dropdown');

			if(typeof opened == 'object'){
				Object.keys(opened).forEach(key => {
					if(typeof showed != 'undefined' && showed.getID() == opened[key].getID()){
						return;
					}

					opened[key].hide();
				});
			}
		}
	});
});

if(typeof PipUI != 'undefined'){
	PipUI.addComponent('Dropdown', DropdownComponent.VERSION);
	PipUI.required('Dropdown', 'Storage', '1.0.0', '>=');
	/** @return {Dropdown} */
	PipUI.Dropdown = DropdownComponent;

	PipUI.i18n()
		.set('dropdown.d_create_instance', '[Dropdown] Создание объекта')
		.set('dropdown.d_show', '[Dropdown] Отображение элемента')
		.set('dropdown.d_hide', '[Dropdown] Скрытие эелемента')
		.set('dropdown.d_render', '[Dropdown] Рендер элемента')
		.set('dropdown.d_init', '[Dropdown] Инициализация элемента')
		.set('dropdown.d_events', '[Dropdown] Обработка событий');
}