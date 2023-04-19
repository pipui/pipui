class ProgressComponent {
	static VERSION = '2.0.0';

	/** @return {HTMLElement} */
	#element;

	#id;

	/** @return {HTMLElement} */
	#bar;

	/** @return {HTMLElement} */
	#canvas;

	/** @return {HTMLElement} */
	#context;

	/** @return {HTMLElement} */
	#text;

	/** @return {HTMLElement} */
	#label;

	#options = {
		debug: false,

		text: '',

		label: '',

		progress: 0,

		changeCallback: undefined,

		changeTextCallback: undefined,

		changeLabelCallback: undefined,

		updateCallback: undefined,

		styles: {
			width: '100%',
			height: '28px',
			padding: 4,
			barColor: '#fff',
			progressColor: '#212121'
		},

		type: 'linear',

		templates: {
			text: '<div class="progress-text"></div>',
			label: '<div class="progress-label"></div>'
		},

		types: {
			radial: {
				template: '<canvas class="progress-bar"></canvas>',
				create: function(self){

					PipUI.style(self.#element, {
						width: self.#options.styles.width,
						height: self.#options.styles.width
					});

					PipUI.style(self.#bar, {width: '100%', height: '100%'});

					self.#canvas = self.#bar;

					self.#canvas.width = self.#canvas.height = parseInt(self.#element.offsetWidth);

					self.#context = self.#canvas.getContext('2d');

					self.setProgress(self.#options.progress);

					return self;
				},

				progress: function(size, self){

					self.#options.progress = size;

					self.#bar.setAttribute('data-progress-size', size);

					let width = self.#element.offsetWidth;

					let height = parseInt(self.#options.styles.height);

					let margin = width / 2;

					let radius = margin - (height / 2);

					self.#context.clearRect(0, 0, width, height);

					self.#context.beginPath();
					self.#context.strokeStyle = self.#options.styles.progressColor;
					self.#context.lineWidth = height;

					self.#context.arc(margin, margin, radius, 0, Math.PI * 2);
					self.#context.stroke();


					var start = Math.PI * 1.5;
					var end = start + (3.6 * self.#options.progress * (Math.PI / 180));


					self.#context.beginPath();
					self.#context.shadowColor = self.#options.styles.barColor;
					self.#context.shadowBlur = self.#options.styles.padding;
					self.#context.strokeStyle = self.#options.styles.barColor;
					self.#context.lineWidth = height - (self.#options.styles.padding * 2);

					self.#context.arc(margin, margin, radius, start, end);
					self.#context.stroke();

					return self;
				}
			},
			linear: {
				template: '<div class="progress-bar" style="width:0;"></div>',
				create: function(self){
					PipUI.style(self.#element, {
						width: self.#options.styles.width,
						height: self.#options.styles.height,
						padding: self.#options.styles.padding+'px',
						'background-color': self.#options.styles.progressColor
					});

					PipUI.style(self.#bar, 'background-color', self.#options.styles.barColor);

					self.setProgress(self.#options.progress);

					return self;
				},

				progress: function(size, self){

					self.#options.progress = size;

					self.#bar.setAttribute('data-progress-size', size);

					PipUI.style(self.#bar, 'width', size+'%');

					return self;
				}
			}
		},
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
			if(PipUI.Logger && options.debug){
				PipUI.Logger.info(PipUI.i18n().get('progress.d_element_not_found'), options);
			}

			return this;
		}

		if(PipUI.Logger && options.debug){
			PipUI.Logger.info(PipUI.i18n().get('progress.d_create_instance'), options);
		}

		this.#id = Math.random().toString();

		this.#element.setAttribute('data-progress-id', this.#id);

		if(update){
			this.update();
		}else{
			this.#init();
		}

		PipUI.Storage.set('progress', this, this.#id);
	}



	/**
	 * @param {float} size
	 *
	 * @return {this}
	 * */
	setProgress(size){
		if(PipUI.Logger && this.#options.debug){
			PipUI.Logger.info(PipUI.i18n().get('progress.d_change_progress'), this.#options);
		}

		let type = this.#options.types[this.#options.type];

		if(typeof type == 'undefined'){
			if(PipUI.Logger && this.#options.debug){
				PipUI.Logger.info(PipUI.i18n().get('progress.d_undefined_type'), this.#options, this.#options.type);
			}

			return this;
		}

		type.progress(size, this);

		if(typeof this.#options.changeCallback == 'function'){
			this.#options.changeCallback(this, size);
		}

		PipUI.trigger(this.#element, 'change-progress-pipui', this, size, this.#options, this.#id);

		return this;
	}



	/**
	 * @param {string} text
	 *
	 * @return {this}
	 * */
	setText(text){
		if(PipUI.Logger && this.#options.debug){
			PipUI.Logger.info(PipUI.i18n().get('progress.d_change_text'), this.#options);
		}

		this.#options.text = text;

		if(text){
			this.#text.innerHTML = text;
			PipUI.style(this.#text, 'display', null);
		}else{
			this.#text.innerHTML = '';
			PipUI.style(this.#text, 'display', 'none');
		}

		if(typeof this.#options.changeTextCallback == 'function'){
			this.#options.changeTextCallback(this, text);
		}

		PipUI.trigger(this.#element, 'change-text-progress-pipui', this, text, this.#options, this.#id);

		return this;
	}



	/**
	 * @param {string} text
	 *
	 * @return {this}
	 * */
	setLabel(text){
		if(PipUI.Logger && this.#options.debug){
			PipUI.Logger.info(PipUI.i18n().get('progress.d_change_label'), this.#options);
		}

		this.#options.subtlabelext = text;

		if(text){
			this.#label.innerHTML = text;
			PipUI.style(this.#label, 'display', null);
		}else{
			this.#label.innerHTML = '';
			PipUI.style(this.#label, 'display', 'none');
		}

		if(typeof this.#options.changeLabelCallback == 'function'){
			this.#options.changeLabelCallback(this, text);
		}

		PipUI.trigger(this.#element, 'change-label-progress-pipui', this, text, this.#options, this.#id);

		return this;
	}



	/**
	 * @return {this}
	 * */
	update(){
		if(PipUI.Logger && this.#options.debug){
			PipUI.Logger.info(PipUI.i18n().get('progress.d_update'), this.#options);
		}

		let type = this.#options.types[this.#options.type];

		if(typeof type == 'undefined'){
			if(PipUI.Logger && this.#options.debug){
				PipUI.Logger.info(PipUI.i18n().get('progress.d_undefined_type'), this.#options, this.#options.type);
			}

			return this;
		}

		this.#element.innerHTML = '';

		let bar = PipUI.create(type.template);

		let text = PipUI.create(this.#options.templates.text);

		let label = PipUI.create(this.#options.templates.label);

		PipUI.addClass(this.#element, 'progress');

		this.#element.setAttribute('data-progress-type', this.#options.type);

		this.#element.innerHTML += bar.outerHTML + text.outerHTML + label.outerHTML;

		PipUI.style(this.#element, {
			width: this.#options.styles.width,
			height: this.#options.styles.height
		});

		this.#bar = PipUI.children(this.#element, '.progress-bar')[0];

		this.#text = PipUI.children(this.#element, '.progress-text')[0];

		this.#label = PipUI.children(this.#element, '.progress-label')[0];

		if(typeof this.#options.updateCallback == 'function'){
			this.#options.updateCallback(this);
		}

		PipUI.trigger(this.#element, 'update-progress-pipui', this, this.#options, this.#id);

		this.setText(this.#options.text)
			.setLabel(this.#options.label);

		return type.create(this);
	}



	/**
	 * @return {this}
	 * */
	#init(){
		if(PipUI.Logger && this.#options.debug){
			PipUI.Logger.info(PipUI.i18n().get('progress.d_init'), this.#options);
		}

		let typeName = this.#element.getAttribute('data-progress-type');

		if(!typeName){
			typeName = this.#options.type;
		}else{
			this.#options.type = typeName;
		}

		let type = this.#options.types[typeName];

		if(typeof type == 'undefined'){
			if(PipUI.Logger && this.#options.debug){
				PipUI.Logger.info(PipUI.i18n().get('progress.d_undefined_type'), this.#options, this.#options.type);
			}

			return this;
		}

		let bar = PipUI.children(this.#element, '.progress-bar')[0];

		let text = PipUI.children(this.#element, '.progress-text')[0];

		let label = PipUI.children(this.#element, '.progress-label')[0];

		if(bar){
			this.#bar = bar;
		}else{
			this.#bar = PipUI.create(type.template);

			this.#element.innerHTML = this.#bar.outerHTML + this.#element.innerHTML;
		}

		if(text){
			this.#text = text;
		}else{
			this.#text = PipUI.create(this.#options.templates.text);

			this.#element.innerHTML += this.#text.outerHTML;
		}

		this.#label = label ? label : PipUI.create(this.#options.templates.label);

		var textHtml = text.innerHTML;

		var labelHtml = label.innerHTML;

		if(textHtml){
			this.#options.text = textHtml;
		}

		if(labelHtml){
			this.#options.label = labelHtml;
		}

		this.setText(this.#options.text);

		this.setLabel(this.#options.label);

		var size = this.#bar.getAttribute('data-progress-size');

		if(size){
			this.#options.progress = size;
		}

		type.create(this);

		return this;
	}
}

if(typeof PipUI != 'undefined'){
	PipUI.addComponent('Progress', ProgressComponent.VERSION);
	PipUI.required('Progress', 'Storage', '1.0.0', '>=');
	/** @return {ProgressComponent} */
	PipUI.Progress = ProgressComponent;

	PipUI.i18n()
		.set('progress.d_create_instance', '[Progress] Создание объекта')
		.set('progress.d_undefined_type', '[Progress] Неверный тип прогресс бара')
		.set('progress.d_change_progress', '[Progress] Изменение размера прогресса')
		.set('progress.d_change_text', '[Progress] Изменение текста')
		.set('progress.d_change_label', '[Progress] Изменение маркировки')
		.set('progress.d_update', '[Progress] Запуск процесса инициализации через обновление')
		.set('progress.d_init', '[Progress] Запуск процесса инициализации через существующий элемент');
}