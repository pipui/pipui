class TooltipComponent {
	static VERSION = '2.0.0';

	#id;

	#target;

	#trigger;

	#container;

	#options = {
		debug: false,

		direction: 'up',

		content: '',

		template: '<div class="tooltip"></div>',

		showedClass: 'tooltip-active',

		showCallback: undefined,

		hideCallback: undefined,

		showedCallback: undefined,

		hidedCallback: undefined,

		updateCallback: undefined,

		directions: {
			up: {
				offset: function(self){
					let rect = self.#trigger.getBoundingClientRect();

					return {
						top: rect.top - self.#target.offsetHeight,
						left: rect.left - (self.#target.offsetWidth / 2) + self.#trigger.offsetWidth / 2
					};
				}
			},
			down: {
				offset: function(self){
					let rect = self.#trigger.getBoundingClientRect();

					return {
						top: rect.top + self.#trigger.offsetHeight,
						left: rect.left - (self.#target.offsetWidth / 2) + self.#trigger.offsetWidth / 2
					};
				}
			},
			left: {
				offset: function(self){
					let rect = self.#trigger.getBoundingClientRect();

					return {
						top: rect.top - (self.#target.offsetHeight / 2) + (self.#trigger.offsetHeight / 2),
						left: rect.left - self.#target.offsetWidth
					};
				}
			},
			right: {
				offset: function(self){
					let rect = self.#trigger.getBoundingClientRect();

					return {
						top: rect.top - (self.#target.offsetHeight / 2) + (self.#trigger.offsetHeight / 2),
						left: rect.left + self.#trigger.offsetWidth
					};
				}
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
	 * @param {HTMLElement|string} trigger
	 *
	 * @param {object|undefined} options
	 * */
	constructor(trigger, options) {
		this.#trigger = PipUI.e(trigger)[0];

		this.setOptions(options);

		if(PipUI.Logger && this.#options.debug){
			PipUI.Logger.info(PipUI.i18n().get('tooltip.d_create_instance'), this.#options);
		}

		this.#container = document.querySelector('.tooltip-container');

		if(!this.#container){
			this.#container = PipUI.create('<div class="tooltip-container"></div>');

			document.body.append(this.#container);
		}

		this.#id = Math.random().toString();

		this.#trigger.setAttribute('data-tooltip-id', this.#id);

		this.update();

		this.#events();

		PipUI.Storage.set('tooltip', this, this.#id);
	}



	#events(){

		let self = this;

		this.#target.addEventListener('transitionend', () => {
			if(self.isOpen()){
				PipUI.trigger(this.#target, 'showed-tooltip-pipui', self.#id, self.#options, self);

				if(typeof self.#options.showedCallback == 'function'){
					self.#options.showedCallback(self, self.#id, self.#options);
				}
			}else{
				PipUI.trigger(this.#target, 'hided-tooltip-pipui', self.#id, self.#options, self);

				if(typeof self.#options.hided == 'function'){
					self.#options.hided(self, self.#id, self.#options);
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
			PipUI.Logger.info(PipUI.i18n().get('tooltip.d_update'), this.#options);
		}

		let active = false;

		let old = this.#container.querySelector('.tooltip[data-tooltip-id="'+this.#id+'"]');

		if(old){ active = PipUI.hasClass(old, this.#options.showedClass); old.remove(); }

		if(!this.#target){
			this.#target = PipUI.create(this.#options.template);
		}

		this.#target.setAttribute('data-tooltip-id', this.#id);

		if(active){
			PipUI.addClass(this.#target, this.#options.showedClass);
		}

		this.#target.innerHTML = this.#options.content;

		this.#target.setAttribute('data-tooltip-direction', this.#options.direction);

		this.#target.setAttribute('data-tooltip-'+this.#options.direction, this.#options.content);

		this.#container.append(this.#target);

		let direction = this.#options.directions[this.#options.direction];

		if(typeof direction != 'undefined'){
			let offset = direction.offset(this);

			this.#target.setAttribute('data-tooltip-direction', this.#options.direction);

			PipUI.style(this.#target, {
				top: offset.top+'px',
				left: offset.left+'px'
			});
		}

		if(typeof this.#options.updateCallback == 'function'){
			this.#options.updateCallback(this, offset);
		}

		PipUI.trigger(this.#target, 'update-tooltip-pipui', this.#id, this.#options, this);

		return this;
	}



	/**
	 * @return {boolean}
	 * */
	isOpen() {
		return PipUI.hasClass(this.#target, this.#options.showedClass);
	}



	/**
	 * @param {function|undefined} callback
	 *
	 * @return {this}
	 * */
	show(callback) {

		if(PipUI.Logger && this.#options.debug){
			PipUI.Logger.info(PipUI.i18n().get('tooltip.d_show'), this.#id, this.#options);
		}

		if(this.isOpen()){
			if(PipUI.Logger && this.#options.debug){
				PipUI.Logger.info(PipUI.i18n().get('tooltip.d_lock'), this.#id, this.#options);
			}

			return this;
		}

		let self = this;

		if(typeof callback == 'undefined'){
			callback = this.#options.showCallback;
		}

		if(typeof callback == 'function'){
			callback(this);
		}

		PipUI.addClass(this.#target, self.#options.showedClass);

		PipUI.trigger(this.#target, 'show-tooltip-pipui', this.#id, this.#options, this);

		return this;
	}



	/**
	 * @param {function|undefined} callback
	 *
	 * @return {this}
	 * */
	hide(callback) {

		if(PipUI.Logger && this.#options.debug){
			PipUI.Logger.info(PipUI.i18n().get('tooltip.d_close'), this.#id, this.#options);
		}

		if(!this.isOpen()){
			if(PipUI.Logger && this.#options.debug){
				PipUI.Logger.info(PipUI.i18n().get('tooltip.d_lock'), this.#id, this.#options);
			}

			return this;
		}

		if(typeof callback == 'undefined'){
			callback = this.#options.hideCallback;
		}

		if(typeof callback == 'function'){
			callback(this);
		}

		PipUI.removeClass(this.#target, this.#options.showedClass);

		PipUI.trigger(this.#target, 'hide-tooltip-pipui', this.#id, this.#options, this);

		return this;
	}
}

PipUI.ready(document, () => {

	PipUI.body('mouseover', '[data-tooltip], [data-tooltip-left], [data-tooltip-right], [data-tooltip-up], [data-tooltip-down]', (e, target) => {

		if(e.relatedTarget && PipUI.closest(target, e.relatedTarget.parentNode)){ return; }

		let targetLink = target.getAttribute('data-tooltip-target');

		let trigger = targetLink && document.querySelector(targetLink) ? document.querySelector(targetLink) : target;

		let id = trigger.getAttribute('data-tooltip-id');

		let content = target.getAttribute('data-tooltip');

		let direction;

		if(target.hasAttribute('data-tooltip-down')){
			content = target.getAttribute('data-tooltip-down');

			direction = 'down';
		}else if(target.hasAttribute('data-tooltip-left')){
			content = target.getAttribute('data-tooltip-left');

			direction = 'left';
		}else if(target.hasAttribute('data-tooltip-right')){
			content = target.getAttribute('data-tooltip-right');

			direction = 'right';
		}else if(target.hasAttribute('data-tooltip-up')){
			content = target.getAttribute('data-tooltip-up');

			direction = 'up';
		}

		let options = {content: content}

		if(target.hasAttribute('data-tooltip-direction')){
			direction = target.getAttribute('data-tooltip-direction');
		}

		if(direction){
			options.direction = direction;
		}

		/** @return {TooltipComponent} */
		let tooltip = id ? PipUI.Storage.get('tooltip', id).setOptions(options).update() : new TooltipComponent(trigger, options);

		tooltip.show();
	});

	PipUI.body('mouseout', '[data-tooltip], [data-tooltip-left], [data-tooltip-right], [data-tooltip-up], [data-tooltip-down]', (e, target) => {

		if(PipUI.closest(target, e.relatedTarget)){ return; }

		let targetLink = target.getAttribute('data-tooltip-target');

		let trigger = targetLink && document.querySelector(targetLink) ? document.querySelector(targetLink) : target;

		let id = trigger.getAttribute('data-tooltip-id');

		if(id){
			let tooltip = PipUI.Storage.get('tooltip', id);

			if(tooltip){
				tooltip.hide();
			}
		}
	});
});


if(typeof PipUI != 'undefined'){
	PipUI.addComponent('Tooltip', TooltipComponent.VERSION);
	PipUI.required('Tooltip', 'Storage', '1.0.0', '>=');
	/** @return {TooltipComponent} */
	PipUI.Tooltip = TooltipComponent;


	PipUI.i18n()
		.set('tooltip.d_create_instance', '[Tooltip] Создание объекта')
		.set('tooltip.d_lock', '[Tooltip] Тултип заблокирован')
		.set('tooltip.d_show', '[Tooltip] Появление тултипа')
		.set('tooltip.d_hide', '[Tooltip] Скрытие тултипа')
		.set('tooltip.d_update', '[Tooltip] Обновление позиции');
}