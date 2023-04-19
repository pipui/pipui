class PaginationComponent {
	static VERSION = '2.0.0';

	/** @return {HTMLElement} */
	#wrapper;

	#id;

	#options = {
		debug: false,
		url: '/page-{NUM}',
		method: 'redirect', // redirect | location | none
		type: 1,
		records: 0,
		max: 10,
		current: 1,
		changePageCallback: undefined,
		updateCallback: undefined,
		types: {
			1: {
				templates: {
					prev: '<li class="pagination-page"><a data-pagination-page="{PREV}" href="{URL}">'+PipUI.i18n().get('pagination.prev')+'</a></li>',
					next: '<li class="pagination-page"><a data-pagination-page="{NEXT}" href="{URL}">'+PipUI.i18n().get('pagination.next')+'</a></li>'
				},
				render: function(self){
					if(PipUI.Logger && self.#options.debug){
						PipUI.Logger.info(PipUI.i18n().get('pagination.d_render_type')+'1', self.#options);
					}

					var type = self.getType();

					var prev = self.getPrev();

					var prevTemplate = type.templates.prev
						.replace(/\{PREV\}/g, prev)
						.replace(/\{URL\}/g, self.#options.url)
						.replace(/\{NUM\}/g, prev);

					var next = self.getNext();

					var nextTemplate = type.templates.next
						.replace(/\{NEXT\}/g, next)
						.replace(/\{URL\}/g, self.#options.url)
						.replace(/\{NUM\}/g, next);

					return prevTemplate+nextTemplate;
				}
			},
			2: {
				templates: {
					item: '<li class="pagination-page {SUBCLASS}"><a data-pagination-page="{NUM}" href="{URL}">{NUM}</a></li>'
				},
				render: function(self){
					if(PipUI.Logger && self.#options.debug){
						PipUI.Logger.info(PipUI.i18n().get('pagination.d_render_type')+'2', self.#options);
					}

					var pages = self.getPages();

					var result = "";

					if(pages <= 1){ return result; }

					var type = self.getType();

					for(var i = 1; i <= pages; i++){

						var subclass = i == self.#options.current ? 'active' : '';

						var item = type.templates.item
							.replace(/\{URL\}/g, self.#options.url)
							.replace(/\{NUM\}/g, i)
							.replace(/\{SUBCLASS\}/g, subclass);

						result += item;
					}

					return result;
				}
			},
			3: {
				templates: {
					item: '<li class="pagination-page {SUBCLASS}"><a data-pagination-page="{NUM}" href="{URL}">{NAME}</a></li>'
				},
				nums: 2,
				icons: {
					leftArrows: '<i class="fa-solid fa-angles-left"></i>',
					rightArrows: '<i class="fa-solid fa-angles-right"></i>'
				},
				render: function(self){
					if(PipUI.Logger && self.#options.debug){
						PipUI.Logger.info(PipUI.i18n().get('pagination.d_render_type')+'3', self.#options);
					}

					var pages = self.getPages();

					var result = "";

					if(pages <= 1){ return result; }

					var type = self.getType();

					if(self.#options.current > type.nums + 1){

						result += type.templates.item
							.replace(/\{URL\}/g, self.#options.url)
							.replace(/\{NUM\}/g, 1)
							.replace(/\{NAME\}/g, type.icons.leftArrows)
							.replace(/\{SUBCLASS\}/g, '');

					}

					var i;

					for(i = self.#options.current - type.nums < 1 ? 1 : self.#options.current - type.nums; i < self.#options.current; i++){
						result += type.templates.item
							.replace(/\{URL\}/g, self.#options.url)
							.replace(/\{NUM\}/g, i)
							.replace(/\{NAME\}/g, i)
							.replace(/\{SUBCLASS\}/g, '');
					}

					result += type.templates.item
						.replace(/\{URL\}/g, self.#options.url)
						.replace(/\{NUM\}/g, self.#options.current)
						.replace(/\{NAME\}/g, self.#options.current)
						.replace(/\{SUBCLASS\}/g, 'active');

					for(i = self.#options.current + 1; i <= self.#options.current + type.nums && i <= pages; i++){
						result += type.templates.item
							.replace(/\{URL\}/g, self.#options.url)
							.replace(/\{NUM\}/g, i)
							.replace(/\{NAME\}/g, i)
							.replace(/\{SUBCLASS\}/g, '');
					}

					if(pages - self.#options.current > type.nums){

						result += type.templates.item
							.replace(/\{URL\}/g, self.#options.url)
							.replace(/\{NUM\}/g, pages)
							.replace(/\{NAME\}/g, type.icons.rightArrows)
							.replace(/\{SUBCLASS\}/g, '');

					}

					return result;
				}
			},
			4: {
				templates: {
					item: '<li class="pagination-page {SUBCLASS}"><a data-pagination-page="{NUM}" href="{URL}">{NAME}</a></li>'
				},
				nums: 2,
				leftNums: 3,
				rightNums: 3,
				selectors: true,
				icons: {
					leftArrows: '<i class="fa-solid fa-angles-left"></i>',
					rightArrows: '<i class="fa-solid fa-angles-right"></i>',
					selector: '...'
				},
				render: function(self){
					if(PipUI.Logger && self.#options.debug){
						PipUI.Logger.info(PipUI.i18n().get('pagination.d_render_type')+'4', self.#options);
					}

					var pages = self.getPages();

					var result = "";

					if(pages <= 1){ return result; }

					var type = self.getType();

					var i, subclass, url, num, name;

					var start = self.#options.current - type.nums;

					var end = self.#options.current + type.nums;



					for(i = 1; i <= type.leftNums && i < start; i++){
						result += type.templates.item
							.replace(/\{URL\}/g, self.#options.url)
							.replace(/\{NUM\}/g, i)
							.replace(/\{NAME\}/g, i)
							.replace(/\{SUBCLASS\}/g, '');
					}



					var startSelector = start - type.leftNums - 1;

					if(type.selectors && startSelector > 0){

						url = startSelector == 1 ? self.#options.url : '#';

						num = startSelector == 1 ? start - 1 : (type.leftNums + 1)+'.'+(start - 1);

						name = startSelector == 1 ? start - 1 : type.icons.selector;

						subclass = startSelector == 1 ? '' : 'page-selector';

						result += type.templates.item
							.replace(/\{URL\}/g, url)
							.replace(/\{NUM\}/g, num)
							.replace(/\{NAME\}/g, name)
							.replace(/\{SUBCLASS\}/g, subclass);
					}



					for(i = start < 1 ? 1 : start; i <= end && i <= pages; i++){

						subclass = i == self.#options.current ? 'active' : '';

						result += type.templates.item
							.replace(/\{URL\}/g, self.#options.url)
							.replace(/\{NUM\}/g, i)
							.replace(/\{NAME\}/g, i)
							.replace(/\{SUBCLASS\}/g, subclass);
					}



					var endSelector = pages - type.rightNums - end;

					if(type.selectors && endSelector > 0){

						url = endSelector == 1 ? self.#options.url : '#';

						num = endSelector == 1 ? end + 1 : (end + 1)+'.'+(pages - type.rightNums - 1);

						name = endSelector == 1 ? end + 1 : type.icons.selector;

						subclass = endSelector == 1 ? '' : 'page-selector';

						result += type.templates.item
							.replace(/\{URL\}/g, url)
							.replace(/\{NUM\}/g, num)
							.replace(/\{NAME\}/g, name)
							.replace(/\{SUBCLASS\}/g, subclass);
					}



					var startEnd = pages - type.rightNums + 1;

					for(i = end >= startEnd ? end + 1 : startEnd; i <= pages; i++){
						result += type.templates.item
							.replace(/\{URL\}/g, self.#options.url)
							.replace(/\{NUM\}/g, i)
							.replace(/\{NAME\}/g, i)
							.replace(/\{SUBCLASS\}/g, '');
					}

					return result;
				}
			}
		}
	}

	#clickEvent;

	#start = true;



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
		this.#wrapper = PipUI.e(object)[0];

		this.setOptions(options);

		if(typeof this.#wrapper == 'undefined'){
			if(PipUI.Logger && this.#options.debug){
				PipUI.Logger.info(PipUI.i18n().get('pagination.d_element_not_found'), this.#options);
			}

			return this;
		}

		if(PipUI.Logger && this.#options.debug){
			PipUI.Logger.info(PipUI.i18n().get('pagination.d_create_instance'), this.#options);
		}

		this.#id = Math.random().toString();

		this.#wrapper.setAttribute('data-pagination-id', this.#id);

		PipUI.addClass(this.#wrapper, 'pagination');

		this.#start = false;

		this.update();

		PipUI.Storage.set('pagination', this, this.#id);
	}



	/**
	 * @return {this}
	 * */
	update(){

		if(this.#start){ return this; }

		if(PipUI.Logger && this.#options.debug){
			PipUI.Logger.info(PipUI.i18n().get('pagination.d_update'), this.#options);
		}

		let self = this;

		let pages = this.getPages();

		let old = this.#wrapper.querySelectorAll('.pagination-page > a');

		if(old.length > 0 && typeof this.#clickEvent == 'function'){
			old.forEach(item => {
				item.removeEventListener('click', this.#clickEvent);
			});
		}


		this.#wrapper.setAttribute('data-pagination-type', this.#options.type);

		if(pages > 1) {
			this.#wrapper.innerHTML = this.getType().render(this);
			PipUI.style(this.#wrapper, 'display', null);
		}else{
			this.#wrapper.innerHTML = '';
			PipUI.style(this.#wrapper, 'display', 'none');
		}

		this.#clickEvent = (e) => {
			e.preventDefault();

			let target = e.target;

			var item = target.closest('.pagination-page');

			if(!PipUI.hasClass(item, 'disabled') && !PipUI.hasClass(item, 'page-selector')){

				let page = parseInt(target.getAttribute('data-pagination-page'));

				if(this.#options.current != page){
					self.setPage(page);
				}
			}
		};

		let items = this.#wrapper.querySelectorAll('.pagination-page > a');

		if(items.length > 0){
			items.forEach(item => {
				item.addEventListener('click', this.#clickEvent);
			});
		}

		if(typeof this.#options.updateCallback == 'function'){
			this.#options.updateCallback(this, old);
		}

		PipUI.trigger(this.#wrapper, 'update-pagination-pipui', this.#id, this.#options, this);

		return self;
	}



	/**
	 * @return {int}
	 * */
	getPages(){
		return Math.ceil(this.#options.records / this.#options.max);
	}



	/**
	 * @return {int}
	 * */
	getPrev() {
		var prev = this.#options.current - 1;

		return prev <= 0 ? 1 : prev;
	}

	/**
	 * @return {int}
	 * */
	getNext() {
		var next = this.#options.current + 1;

		var pages = this.getPages();

		return next > pages ? pages : next;
	}



	/**
	 * @param {int|undefined} num
	 *
	 * @return {this}
	 * */
	setPage(num) {
		num = parseInt(num);

		let pages = this.getPages();

		if(isNaN(num)){
			num = 1;
		}else if(num < 0){
			num = 0;
		}else if(num > pages){
			num = pages;
		}

		if(PipUI.Logger && this.#options.debug){
			PipUI.Logger.info(PipUI.i18n().get('pagination.d_change_page'), this.#options);
		}

		this.#options.current = num;

		let url = this.#options.url.replace(/\{NUM\}/g, this.#options.current);

		if(this.#options.method == 'redirect'){
			window.location.href = url;
		}else if(this.#options.method == 'location'){
			window.history.pushState("", "", url);
		}

		this.update();

		if(typeof this.#options.changePageCallback == 'function'){
			this.#options.changePageCallback(this);
		}

		PipUI.trigger(this.#wrapper, 'change-pagination-pipui', this.#id, this.#options, this);

		return this;
	}



	/**
	 * @return {object}
	 * */
	getType() {
		return this.#options.types[this.#options.type];
	}
}


if(typeof PipUI != 'undefined'){
	PipUI.addComponent('Pagination', PaginationComponent.VERSION);
	PipUI.required('Pagination', 'Storage', '1.0.0', '>=');
	/** @return {PaginationComponent} */
	PipUI.Pagination = PaginationComponent;

	PipUI.i18n()
		.set('pagination.prev', 'Назад')
		.set('pagination.next', 'Вперёд')
		.set('pagination.d_element_not_found', '[Pagination] Элемент не найден')
		.set('pagination.d_create_instance', '[Pagination] Создание объекта')
		.set('pagination.d_render_type', '[Pagination] Запуск рендера типа: ')
		.set('pagination.d_change_page', '[Pagination] Изменение страницы')
		.set('pagination.d_update', '[Pagination] Обновление содержимого');
}