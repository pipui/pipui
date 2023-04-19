class AnchorComponent {
	static VERSION = '2.0.0';

	static #options = {
		debug: false,
		defaultDuration: 400,
		defaultCallback: undefined,
	}



	/**
	 * @param {object} options
	 *
	 * @return {this}
	 * */
	static setOptions(options) {
		this.#options = PipUI.assign(this.#options, options);

		return this;
	}



	/** @return {object} */
	static getOptions() {
		return this.#options;
	}



	static scroll(element, options){
		element = PipUI.e(element);

		if(!element.length){ return false; }

		if(typeof options == 'undefined'){
			options = {};
		}

		element = element[0];

		let rect = element.getBoundingClientRect();

		let pageOffsetTop = window.pageYOffset;
		let pageOffsetLeft = window.pageXOffset;

		let diffY = rect.top - pageOffsetTop;
		let diffX = rect.left - pageOffsetLeft;

		options.duration = typeof options.duration == 'undefined' || options.duration === null ? this.#options.defaultDuration : parseInt(options.duration);

		options.callback = typeof options.callback == 'undefined' || options.callback === null ? this.#options.defaultCallback : options.callback;

		options.hash = typeof options.hash == 'undefined' || options.hash === null ? false : options.hash;

		if(options.hash){
			location.hash = options.hash;
		}

		let start;

		window.requestAnimationFrame(function step(t){
			if(!start){
				start = t;
			}

			let time = t - start;

			var percent = Math.min(time / options.duration, 1);

			let left = pageOffsetLeft + diffX * percent;

			let top = pageOffsetTop + diffY * percent;

			window.scrollTo(left, top);

			if(time < options.duration){
				window.requestAnimationFrame(step);
			}else if(typeof options.callback == 'function'){
				options.callback();
			}
		});
	}

}

PipUI.ready(document, () => {

	PipUI.body('click', '[data-anchor]', (e, target) => {
		e.preventDefault();

		AnchorComponent.scroll(target.getAttribute('data-anchor'), {
			duration: target.getAttribute('data-anchor-duration'),
			hash: target.getAttribute('data-anchor-hash')
		});
	});
});

if(typeof PipUI != 'undefined'){
	PipUI.addComponent('Anchor', AnchorComponent.VERSION);
	/** @return {AnchorComponent} */
	PipUI.Anchor = AnchorComponent;

	PipUI.i18n()
		.set('anchor.d_element_not_found', '[Anchor] Элементы не найдены')
		.set('anchor.d_create_instance', '[Anchor] Создание объекта')
		.set('anchor.d_open', '[Anchor] Открытие панели responsive')
		.set('anchor.d_close', '[Anchor] Закрытие панели responsive');
}