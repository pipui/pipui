class CollapseComponent {
	static VERSION = '2.0.0';

	/** @return {array <HTMLElement>} */
	#triggers = [];

	/** @return {HTMLElement} */
	#target;

	#id;

	#lock = false;

	/** @return {function|undefined} */
	#eventCallback = function(e){
		e.preventDefault();

		let id = this.getAttribute('data-collapse-id');

		let self = PipUI.Storage.get('collapse', id);

		if(self.isOpen()){
			self.hide();
		}else{
			self.show();
		}
	}

	#options = {
		debug: false,

		/** @return {array <HTMLElement>} */
		triggers: [],

		animation: {
			show: {
				type: 'slideDown',
				duration: 200
			},
			hide: {
				type: 'slideUp',
				duration: 200
			}
		},

		accordion: false,

		defaultVisible: false,

		toggleTargetClass: 'collapse-active',

		toggleTriggerClass: 'active',

		/** @return {function|undefined} */
		showStartCallback: undefined,

		/** @return {function|undefined} */
		hideStartCallback: undefined,

		/** @return {function|undefined} */
		showEndCallback: undefined,

		/** @return {function|undefined} */
		hideEndCallback: undefined
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
	 * */
	constructor(object, options) {
		this.#target = PipUI.e(object)[0];

		this.setOptions(options);

		options = this.getOptions();

		if(typeof this.#target == 'undefined'){
			if(PipUI.Logger && options.debug){
				PipUI.Logger.info(PipUI.i18n().get('collapse.d_element_not_found'), options);
			}

			return this;
		}

		if(PipUI.Logger && options.debug){
			PipUI.Logger.info(PipUI.i18n().get('collapse.d_create_instance'), options);
		}

		let id = this.#target.getAttribute('data-collapse-id');

		this.#id = id ? id : Math.random().toString();

		this.#target.setAttribute('data-collapse-id', this.#id);

		PipUI.addClass(this.#target, 'collapse');

		this.update();

		PipUI.Storage.set('collapse', this, this.#id);


		if(this.#options.accordion){
			let accordion = this.#target.closest('.accordion');

			let triggers = accordion.querySelectorAll('[data-accordion]:not([data-collapse-id])');

			if(triggers.length){
				triggers.forEach(trigger => {
					let collapse = new CollapseComponent(trigger.getAttribute('data-accordion'), {
						triggers: [trigger]
					});

					collapse.setOptions({accordion: true});
				});
			}
		}

		if(this.#options.defaultVisible){
			this.show();
		}
	}



	/** @return {this} */
	update(){
		if(this.#triggers.length){
			this.#triggers.forEach(trigger => {
				trigger.removeEventListener('click', this.#eventCallback);

				PipUI.removeClass(trigger, 'collapse-trigger');

				trigger.removeAttribute('data-collapse-id');
			});
		}

		this.#triggers = [];

		if(!this.#options.triggers.length){ return this; }

		let self = this;

		this.#options.triggers.forEach(trigger => {
			trigger = PipUI.e(trigger)[0];

			PipUI.addClass(trigger, 'collapse-trigger');

			trigger.setAttribute('data-collapse-id', self.#id);

			trigger.addEventListener('click', this.#eventCallback);

			this.#triggers.push(trigger);
		});

		return this;
	}



	/**
	 * @return {boolean}
	 * */
	isOpen() {
		return PipUI.hasClass(this.#target, this.#options.toggleTargetClass);
	}


	/**
	 * @param {function|undefined} callback
	 *
	 * @return {this}
	 * */
	toggle(callback) {
		return this.isOpen() ? this.hide(callback) : this.show(callback);
	}



	/**
	 * @param {function|undefined} callback
	 *
	 * @return {this}
	 * */
	show(callback) {
		if(this.#lock || this.isOpen()){ return this; }

		this.#lock = true;

		if(PipUI.Logger && this.#options.debug){
			PipUI.Logger.info(PipUI.i18n().get('collapse.d_show'), this.#id, this.#options);
		}

		let self = this;

		PipUI.addClass(this.#triggers, 'collapse-lock');

		let animation = PipUI.Animations[this.#options.animation.show.type];

		if(typeof animation == 'undefined'){
			animation = PipUI.Animations['show'];
		}

		animation(this.#target, {
			duration: self.#options.animation.show.duration
		}, () => {

			this.#lock = false;

			PipUI.addClass(self.#target, self.#options.toggleTargetClass);

			if(typeof this.#options.showEndCallback == 'function'){
				this.#options.showEndCallback(self);
			}

			PipUI.trigger(this.#target, 'show-end-collapse-pipui', this.#id, this.#options);

			if(PipUI.Logger && self.#options.debug){
				PipUI.Logger.info(PipUI.i18n().get('collapse.d_show_complete'), self.#id, self.#options);
			}

			PipUI.addClass(this.#triggers, self.#options.toggleTriggerClass);

			PipUI.removeClass(this.#triggers, 'collapse-lock');
		});

		if(typeof callback == 'undefined'){
			callback = this.#options.showStartCallback;
		}

		if(typeof callback == 'function'){
			callback(this);
		}

		PipUI.trigger(this.#target, 'show-start-collapse-pipui', this.#id, this.#options);

		if(this.#options.accordion){
			let accordion = this.#target.closest('.accordion');

			accordion.querySelectorAll('[data-collapse-id]:not([data-collapse-id="'+this.#id+'"])').forEach(item => {
				let collapse = PipUI.Storage.get('collapse', item.getAttribute('data-collapse-id'));

				collapse.hide();
			});
		}

		return this;
	}



	/**
	 * @param {function|undefined} callback
	 *
	 * @return {this}
	 * */
	hide(callback) {
		if(this.#lock || !this.isOpen()){ return this; }

		this.#lock = true;

		let options = this.getOptions();

		if(PipUI.Logger && options.debug){
			PipUI.Logger.info(PipUI.i18n().get('collapse.d_hide'), this.#id, options);
		}

		let self = this;

		PipUI.addClass(this.#triggers, 'collapse-lock');

		let animation = PipUI.Animations[this.#options.animation.hide.type];

		if(typeof animation == 'undefined'){
			animation = PipUI.Animations['hide'];
		}

		animation(this.#target, {
			duration: self.#options.animation.hide.duration
		}, () => {

			this.#lock = false;

			PipUI.removeClass(self.#target, self.#options.toggleTargetClass);

			if(typeof this.#options.hideEndCallback == 'function'){
				this.#options.hideEndCallback(self);
			}

			PipUI.trigger(this.#target, 'hide-end-collapse-pipui', this.#id, this.#options);

			if(PipUI.Logger && self.#options.debug){
				PipUI.Logger.info(PipUI.i18n().get('collapse.d_hide_complete'), self.#id, self.#options);
			}

			PipUI.removeClass(this.#triggers, 'collapse-lock '+self.#options.toggleTriggerClass);
		});

		if(typeof callback == 'undefined'){
			callback = this.#options.hideStartCallback;
		}

		if(typeof callback == 'function'){
			callback(this);
		}

		PipUI.trigger(this.#target, 'hide-start-collapse-pipui', this.#id, this.#options);

		return this;
	}
}

PipUI.ready(document, () => {
	PipUI.body('click', '[data-collapse]:not([data-collapse-id])', (e, target) => {
		e.preventDefault();

		new CollapseComponent(target.getAttribute('data-collapse'), {
			triggers: [target]
		}).toggle();
	});

	PipUI.body('click', '.accordion [data-accordion]:not([data-collapse-id])', (e, target) => {
		e.preventDefault();

		new CollapseComponent(target.getAttribute('data-accordion'), {
			triggers: [target],
			accordion: true
		}).toggle();
	});
});

if(typeof PipUI != 'undefined'){
	PipUI.addComponent('Collapse', CollapseComponent.VERSION);
	PipUI.required('Collapse', 'Storage', '1.0.0', '>=');
	PipUI.required('Collapse', 'Animations', '1.0.0', '>=');
	/** @return {CollapseComponent} */
	PipUI.Collapse = CollapseComponent;

	PipUI.i18n()
		.set('collapse.d_element_not_found', '[Collapse] Элементы не найдены')
		.set('collapse.d_create_instance', '[Collapse] Создание объекта')
		.set('collapse.d_show', '[Collapse] Появление объекта')
		.set('collapse.d_hide', '[Collapse] Скрытие объекта')
		.set('collapse.d_hide_complete', '[Collapse] Завершение скрытия объекта')
		.set('collapse.d_show_complete', '[Collapse] Завершение появления объекта');
}