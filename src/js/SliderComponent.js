class SliderComponent {
	static VERSION = '2.0.0';

	#id;

	/** @return {HTMLElement} */
	#list;

	/** @return {HTMLElement} */
	#container;

	/** @return {HTMLElement} */
	#labels;

	#pause = false;

	#lock = false;

	#pauseTimer;

	#pauseStart;

	#pauseStop = 0;

	#mouseEnterEvent;

	#mouseOutEvent;

	#active = 0;

	#options = {
		debug: false,

		slides: [],

		updateCallback: undefined,

		changeCallback: undefined,

		pauseCallback: undefined,

		resumeCallback: undefined,

		playCallback: undefined,

		duration: 3000,

		animation: 'slide',

		arrows: true,

		labels: true,

		swipe: true,

		pause: true,

		templates: {
			list: '<div class="slider-list"></div>',
			slide: '<div class="slider-slide"></div>',
			arrowLeft: '<div class="slider-arrow" data-slider-arrow="prev"><i class="fa-solid fa-angle-left"></i></div>',
			arrowRight: '<div class="slider-arrow" data-slider-arrow="next"><i class="fa-solid fa-angle-right"></i></div>',
			label: '<div class="slider-label"></div>'
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
	 * @param {HTMLElement|string} container
	 *
	 * @param {object|undefined} options
	 * */
	constructor(container, options) {
		this.#container = PipUI.e(container)[0];

		this.setOptions(options);

		if(typeof this.#container == 'undefined'){
			if(PipUI.Logger && this.#options.debug){
				PipUI.Logger.info(PipUI.i18n().get('slider.d_element_not_found'), this.#options);
			}

			return this;
		}

		if(PipUI.Logger && this.#options.debug){
			PipUI.Logger.info(PipUI.i18n().get('slider.d_create_instance'), this.#options);
		}

		this.#id = Math.random().toString();

		this.#container.setAttribute('data-slider-id', this.#id);

		this.update();

		PipUI.Storage.set('slider', this, this.#id);
	}



	/**
	 * @param {object} object
	 *
	 * @return {HTMLElement}
	 * */
	#createSlide(object){

		let slide = PipUI.create(this.#options.templates.slide);

		if(object.img){
			PipUI.style(slide, 'background-image', 'url('+object.img+')');
		}

		if(object.content){
			slide.innerHTML = object.content;
		}

		slide.setAttribute('data-slider-slide-id', Math.random().toString());

		return slide;
	}



	/**
	 * @return {this}
	 *
	 * @param {function} callback
	 *
	 * */
	update(callback){

		let self = this;

		if(typeof this.#mouseEnterEvent != 'undefined'){
			this.#container.removeEventListener('mouseenter', this.#mouseEnterEvent);

			this.#container.removeEventListener('mouseout', this.#mouseOutEvent);
		}

		this.#container.setAttribute('data-slider-animation', this.#options.animation);

		this.#container.innerHTML = '';

		if(this.#options.arrows){
			this.#container.append(PipUI.create(this.#options.templates.arrowLeft), PipUI.create(this.#options.templates.arrowRight));
		}

		if(this.#options.labels){
			this.#labels = PipUI.create('<div class="slider-labels"></div>');

			for(let i = 0; i < this.#options.slides.length; i++){
				let label = PipUI.create(this.#options.templates.label);

				if(this.#active == i){ PipUI.addClass(label, 'active'); }

				label.setAttribute('data-slider-label-index', i);

				this.#labels.append(label);
			}

			this.#container.append(this.#labels);
		}

		PipUI.addClass(this.#container, 'slider');

		this.#list = PipUI.create(this.#options.templates.list);

		this.#options.slides.forEach((obj, index) => {
			let slide = this.#createSlide(obj);

			if(index === this.#active){
				PipUI.addClass(slide, 'active');
			}

			this.#list.append(slide);
		});

		this.#container.append(this.#list);

		if(this.#options.duration > 0){
			this.#mouseEnterEvent = () => {
				self.pause();
			}

			this.#mouseOutEvent = (e) => {
				if(!e.explicitOriginalTarget.parentElement.closest('.slider[data-slider-id="'+self.#id+'"]')){
					self.resume();
				}
			}

			this.#container.addEventListener('mouseenter', this.#mouseEnterEvent);

			this.#container.addEventListener('mouseout', this.#mouseOutEvent);

			this.play(this.#options.duration, true);
		}

		if(typeof callback != 'function'){
			callback = this.#options.updateCallback;
		}

		if(typeof callback == 'function'){
			callback(this);
		}

		PipUI.trigger(this.#container, 'update-slider-pipui', this.#id, this.#options, this);

		return this;
	}



	/**
	 * @param {int} index
	 *
	 * @param {function} callback
	 *
	 * @return {this}
	 * */
	setSlide(index, callback){

		index = parseInt(index);

		if(index == this.#active || this.#lock){ return this; }

		if(typeof this.#options.slides[index] == 'undefined'){
			if(PipUI.Logger && this.#options.debug){
				PipUI.Logger.info(PipUI.i18n().get('slider.d_slide_not_found'), index, this.#options);
			}

			return this;
		}

		let self = this;

		this.#lock = true;

		let slides = this.#list.querySelectorAll('.slider-slide');

		let activeClass = index > this.#active ? 'slide-animation-left' : 'slide-animation-right';

		if(index == 0 && this.#active == this.#options.slides.length-1){
			activeClass = 'slide-animation-left';
		}

		if(this.#active == 0 && index == this.#options.slides.length-1){
			activeClass = 'slide-animation-right';
		}

		if(this.#options.labels){
			let labels = this.#labels.querySelectorAll('.slider-label');

			PipUI.removeClass(labels, 'active');

			PipUI.addClass(labels[index], 'active');
		}

		PipUI.addClass([slides[this.#active], slides[index]], activeClass);

		setTimeout(() => {
			PipUI.addClass(this.#container, 'slide-animation');

			let cb = () => {

				PipUI.removeClass(self.#container, 'slide-animation');

				PipUI.removeClass(slides, 'active slide-animation-left slide-animation-right');

				PipUI.addClass(slides[index], 'active');

				slides[self.#active].removeEventListener('transitionend', cb);

				self.#active = index;

				self.#lock = false;

				if(typeof callback != 'function'){
					callback = this.#options.changeCallback;
				}

				if(typeof callback == 'function'){
					callback(self);
				}

				PipUI.trigger(this.#container, 'change-slider-pipui', index, self.#id, self.#options, self);

				if(self.#options.duration > 0){
					self.play(self.#options.duration, true);
				}
			}

			slides[this.#active].addEventListener('transitionend', cb);
		}, 0);

		return this;
	}



	/**
	 * @param {function} callback
	 *
	 * @return {this}
	 * */
	next(callback){
		let next = this.#active + 1 >= this.#options.slides.length ? 0 : this.#active + 1;

		return this.setSlide(next, callback);
	}



	/**
	 * @param {function} callback
	 *
	 * @return {this}
	 * */
	prev(callback){
		let next = this.#active - 1 < 0 ? this.#options.slides.length-1 : this.#active - 1;

		return this.setSlide(next, callback);
	}



	/**
	 *
	 * @param {function} callback
	 *
	 * @return {this}
	 * */
	pause(callback){
		if(PipUI.Logger && this.#options.debug){
			PipUI.Logger.info(PipUI.i18n().get('slider.d_pause_timer'), this.#options);
		}

		this.#pause = true;

		this.#pauseStop = Date.now() - this.#pauseStart + this.#pauseStop;

		if(typeof this.#pauseTimer != 'undefined'){
			clearTimeout(this.#pauseTimer);

			this.#pauseTimer = undefined;
		}

		this.#container.setAttribute('data-slider-pause', 'true');

		if(typeof callback != 'function'){
			callback = this.#options.pauseCallback;
		}

		if(typeof callback == 'function'){
			callback(this);
		}

		PipUI.trigger(this.#container, 'pause-slider-pipui', this.#id, this.#options, this);

		return this;
	}



	/**
	 *
	 * @param {function} callback
	 *
	 * @return {this}
	 * */
	resume(callback){
		this.#pause = false;

		this.#container.setAttribute('data-slider-pause', 'false');

		if(PipUI.Logger && this.#options.debug){
			PipUI.Logger.info(PipUI.i18n().get('slider.d_resume_timer'), this.#options);
		}

		if(typeof callback != 'function'){
			callback = this.#options.resumeCallback;
		}

		if(typeof callback == 'function'){
			callback(this);
		}

		PipUI.trigger(this.#container, 'resume-slider-pipui', this.#id, this.#options, this);

		return this.play(this.#options.duration);
	}



	/**
	 * @param {int} delay
	 *
	 * @param {boolean} clear
	 *
	 * @param {function} callback
	 *
	 * @return {this}
	 * */
	play(delay, clear, callback){

		if(!this.#options.duration){ return this; }

		let self = this;

		if(clear){
			this.#pauseStop = 0;

			if(typeof this.#pauseTimer != 'undefined'){

				if(PipUI.Logger && this.#options.debug){
					PipUI.Logger.info(PipUI.i18n().get('slider.d_clear_timer'), this.#options);
				}

				clearTimeout(this.#pauseTimer);
				this.#pauseTimer = undefined;
			}
		}

		if(this.#pause){ return this; }

		if(PipUI.Logger && this.#options.debug){
			PipUI.Logger.info(PipUI.i18n().get('slider.d_create_timer'), this.#options);
		}

		this.#pauseStart = Date.now();

		this.#pauseTimer = setTimeout(function(){
			self.next();
		}, delay - this.#pauseStop);

		if(typeof callback != 'function'){
			callback = this.#options.playCallback;
		}

		if(typeof callback == 'function'){
			callback(this);
		}

		PipUI.trigger(this.#container, 'play-slider-pipui', delay, clear, this.#id, this.#options, this);

		return this;
	}
}

PipUI.ready(document, () => {

	PipUI.body('click', '.slider > .slider-arrow', (e, target) => {
		e.preventDefault();

		let id = target.closest('[data-slider-id]').getAttribute('data-slider-id');

		let slider = PipUI.Storage.get('slider', id);

		if(target.getAttribute('data-slider-arrow') == 'prev'){
			slider.prev();
		}else{
			slider.next();
		}
	});

	PipUI.body('click', '.slider > .slider-labels > .slider-label', (e, target) => {
		e.preventDefault();

		let id = target.closest('[data-slider-id]').getAttribute('data-slider-id');

		let slider = PipUI.Storage.get('slider', id);

		slider.setSlide(target.getAttribute('data-slider-label-index'));
	});

});


if(typeof PipUI != 'undefined'){
	PipUI.addComponent('Slider', SliderComponent.VERSION);
	PipUI.required('Slider', 'Storage', '1.0.0', '>=');
	/** @return {SliderComponent} */
	PipUI.Slider = SliderComponent;


	PipUI.i18n()
		.set('slider.d_create_instance', '[Slider] Создание объекта')
		.set('slider.d_element_not_found', '[Slider] Слайд не найден')
		.set('slider.d_pause_timer', '[Slider] Пауза слайдера')
		.set('slider.d_resume_timer', '[Slider] Продолжение работы слайдера')
		.set('slider.d_clear_timer', '[Slider] Очистка таймера слайдера')
		.set('slider.d_create_timer', '[Slider] Запуск таймера');
}