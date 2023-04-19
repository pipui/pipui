class i18n {
	#language = 'ru';

	#storage = {};

	constructor(language) {
		this.#language = language;

		this.#storage[language] = {};
	}

	/** @return this */
	set(key, value) {
		this.#storage[this.#language][key] = value;

		return this;
	}

	/** @return any */
	get(key, ...data) {

		let str = this.#storage[this.#language][key];

		if(typeof str == 'undefined'){ return ''; }

		let param = '%';

		for(let i = 0; i < data.length; i++){
			let value = data[i];

			let search = str.indexOf(param);

			if(search === -1 || typeof value == 'undefined'){ break; }

			let replace1 = str.substr(0, search);
			let replace2 = str.substr(search+1);

			str = replace1+value+replace2;
		}

		return str;
	}

	/** @return this */
	delete(key) {

		if(!this.has(key)){ return this; }

		delete this.#storage[this.#language][key];

		return this;
	}

	/** @return boolean */
	has(key) {
		return typeof this.#storage[this.#language][key] != 'undefined';
	}
}

class PipUI {
	static VERSION = '2.0.0';

	static enable_compatible = true;

	static #dependencies = {}

	static #components = {}

	static #i18 = {};

	static language = 'ru';



	static required(component, needle, version, operator) {
		if(typeof operator == 'undefined'){
			operator = '=';
		}

		this.#dependencies[component].push({
			name: needle,
			version: version,
			operator: operator
		});
	}



	static addComponent(name, version) {
		this.#components[name] = version;
		this.#dependencies[name] = [];
	}



	/** @return {boolean} */
	static componentExists(name) {
		return typeof this.#components[name] != 'undefined';
	}



	static componentVersion(name) {
		if(!this.componentExists(name)){ return null; }

		return this.#components[name];
	}



	// <, >, <=, >=, =, !=, <>
	static version_compare(v1, v2, operator) {

		if(typeof operator == 'undefined'){
			operator = '=';
		}

		if(operator == '=' || operator == '==' || operator == '==='){
			return v1 === v2;
		}

		if(operator == '!=' || operator == '<>' || operator == '!=='){
			return v1 !== v2;
		}

		let i, x;
		let compare = 0;

		let vm = {
			'dev': -6,
			'alpha': -5,
			'a': -5,
			'beta': -4,
			'b': -4,
			'RC': -3,
			'rc': -3,
			'#': -2,
			'p': 1,
			'pl': 1
		};

		let _prepVersion = (v) => {
			v = ('' + v).replace(/[_\-+]/g, '.');
			v = v.replace(/([^.\d]+)/g, '.$1.').replace(/\.{2,}/g, '.');
			return (!v.length ? [-8] : v.split('.'))
		};

		let _numVersion = (v) => {
			return !v ? 0 : (isNaN(v) ? vm[v] || -7 : parseInt(v, 10))
		};

		v1 = _prepVersion(v1);
		v2 = _prepVersion(v2);
		x = Math.max(v1.length, v2.length);

		for(i = 0; i < x; i++){
			if(v1[i] === v2[i]){ continue }

			v1[i] = _numVersion(v1[i]);
			v2[i] = _numVersion(v2[i]);

			if(v1[i] < v2[i]){
				compare = -1;
				break
			}else if(v1[i] > v2[i]){
				compare = 1;
				break
			}
		}

		if(!operator){ return compare; }

		switch(operator){
			case '>':
			case 'gt': return (compare > 0);
			case '>=':
			case 'ge': return (compare >= 0);
			case '<=':
			case 'le': return (compare <= 0);
			case '<':
			case 'lt': return (compare < 0);
		}

		return null;
	}



	static compatible() {
		Object.keys(this.#dependencies).forEach(k => {
			if(!this.#dependencies[k].length){ return; }

			this.#dependencies[k].forEach(require => {
				if(!this.componentExists(require.name)){
					console.warn('[PipUI] '+ this.i18n().get('base.requires', k, require.name));

					return;
				}

				if(!this.version_compare(this.componentVersion(require.name), require.version, require.operator)){
					console.warn('[PipUI] '+this.i18n().get('base.requires_version', k, require.name, require.operator, require.version));
				}
			});
		});
	}



	/** @return {i18n} */
	static i18n(language) {
		if(typeof language == 'undefined'){ language = this.language; }

		if(typeof this.#i18[language] != 'undefined'){ return this.#i18[language]; }

		this.#i18[language] = new i18n(language);

		return this.#i18[language];
	}



	/** @return {HTMLCollection|NodeList|array.<HTMLElement>} */
	static e(element) {
		if(typeof element == 'object'){
			return Array.isArray(element) ? element : [element];
		}

		return document.querySelectorAll(element);
	}



	/** @return {boolean} */
	static isObject(object) {
		return object !== null && typeof object == 'object' && !Array.isArray(object);
	}



	/**
	 * @return {object}
	 * */
	static #assignCallback(result, object) {

		for(const [k, v] of Object.entries(object)){

			if(!this.isObject(v) || HTMLElement.prototype.isPrototypeOf(v)){
				result[k] = v;

				continue;
			}

			if(!this.isObject(result[k])){
				result[k] = {};
			}

			result[k] = this.#assignCallback(result[k], v);
		}

		return result;
	}



	/**
	 * @param {object} source
	 *
	 * @param [args]
	 *
	 * @return {object}
	 * */
	static assign(source, ...args) {

		if(args.length <= 0){ return source; }

		if(typeof source != 'object'){ source = {}; }

		let result = source;

		for(let arg of args){
			if(typeof arg != 'object'){ continue; }

			result = this.#assignCallback(result, arg);
		}

		return result;
	}



	/**
	 * @param {array} array
	 *
	 * @return {array}
	 * */
	static arrayUnique(array){
		var result = [];

		for(var i = 0; i < array.length; i++){
			if(result.indexOf(array[i]) === -1){
				result.push(array[i]);
			}
		}

		return result;
	}



	/**
	 * @param {array} haystack
	 *
	 * @param {any} needle
	 *
	 * @return {int}
	 * */
	static indexOfCase(haystack, needle) {
		var index = -1;

		needle = needle.toLowerCase();

		if(typeof haystack == 'object'){
			for(var i = 0; i < haystack.length; i++){
				if(haystack[i].toLowerCase() == needle){
					index = i; break;
				}
			}
		}else{
			index = haystack.toLowerCase().indexOf(needle);
		}

		return index;
	}



	/**
	 * @param {HTMLElement} element
	 *
	 * @param {string} query
	 *
	 * @return {array.<HTMLElement>}
	 *
	 * */
	static children(element, query) {
		if(typeof element != 'object' || element === null){ return []; }

		return element.querySelectorAll(':scope > '+query);
	}



	/**
	 * @param {HTMLElement|NodeList|HTMLCollection|Array} elements
	 *
	 * @param {string} classname
	 *
	 * @return {HTMLElement|NodeList|HTMLCollection|Array}
	 * */
	static addClass(elements, classname) {
		if(typeof elements != 'object' || elements === null){ return elements; }

		classname = classname.replaceAll(/\s+/g, ' ').trim();

		if(typeof classname == 'string'){
			classname = classname.split(' ');
		}

		if(HTMLElement.prototype.isPrototypeOf(elements)){
			elements.classList.add(...classname);

			return elements;
		}

		elements.forEach(item => {
			item.classList.add(...classname);
		});

		return elements;
	}



	/**
	 * @param {HTMLElement|NodeList|HTMLCollection|Array} elements
	 *
	 * @param {string} classname
	 *
	 * @return {HTMLElement|NodeList|HTMLCollection|Array}
	 * */
	static removeClass(elements, classname) {
		if(typeof elements != 'object' || elements === null){ return elements; }

		classname = classname.replaceAll(/\s+/g, ' ').trim();

		if(typeof classname == 'string'){
			classname = classname.split(' ');
		}

		if(HTMLElement.prototype.isPrototypeOf(elements)){
			elements.classList.remove(...classname);

			return elements;
		}

		elements.forEach(item => {
			item.classList.remove(...classname);
		});

		return elements;
	}



	/**
	 * @param {string} html
	 *
	 * @return {HTMLElement}
	 * */
	static create(html) {
		let div = document.createElement('div');

		div.innerHTML = html.trim();

		return div.firstChild;
	}



	/**
	 * @param {HTMLElement} element
	 *
	 * @param {string|object} key
	 *
	 * @param {any} value
	 *
	 * @return {HTMLElement|string|array.<string>}
	 * */
	static style(element, key, value) {
		if(typeof element != 'object' || element === null){ return element; }

		if(typeof value != 'undefined'){
			element.style[key] = value;

			return element;
		}else if(typeof key == 'object'){
			if(!Array.isArray(key)){

				Object.assign(element.style, key);

				return element
			}

			let computed = window.getComputedStyle(element);

			let styles = {};

			for(let i = 0; i < key.length; i++){
				let style = key[i];

				styles[style] = computed.getPropertyValue(style);
			}

			return styles;
		}

		return window.getComputedStyle(element).getPropertyValue(key);
	}



	/**
	 * @param {HTMLElement} element
	 *
	 * @param {string} eventName
	 *
	 * @param {function|undefined} callback
	 *
	 * @param {boolean} remove
	 * */
	static listenEvent(element, eventName, callback, remove) {
		if(typeof element != 'object' || element === null){ return; }

		if(remove){
			element.removeEventListener(eventName, callback);

			return;
		}

		let cb = (e) => {

			var details = e.detail;

			if(typeof callback == 'function'){
				if(typeof e.detail != 'object' || typeof e.detail[Symbol.iterator] !== 'function') {

					details = [e.detail];
				}

				callback(e, ...details);
			}
		}

		element.addEventListener(eventName, cb);
	}



	/**
	 * @param {HTMLElement} element
	 *
	 * @param {string} eventName
	 *
	 * @param {any} details
	 * */
	static trigger(element, eventName, ...details) {
		if(typeof element != 'object' || element === null){ return; }

		let params = {
			bubbles: true,
			cancelable: true,
			detail: details
		};

		element.dispatchEvent(new CustomEvent(eventName, params));
	}



	/**
	 * @param {HTMLElement} element
	 *
	 * @return {boolean}
	 * */
	static isVisible(element) {
		if(typeof element != 'object' || element === null){ return false; }

		let styles = this.style(element, ['display', 'visibility', 'opacity', 'width', 'height']);

		return !(styles.display == 'none' ||
			styles.visibility == 'hidden' ||
			styles.opacity == '0' ||
			styles.opacity == '0%');
	}



	/**
	 * @param {HTMLElement} element
	 *
	 * @param {string} classname
	 *
	 * @return {boolean}
	 * */
	static hasClass(element, classname) {
		if(typeof element != 'object' || element === null){ return false; }

		return element.classList.contains(classname);
	}



	/**
	 * @param {HTMLElement} element
	 *
	 * @param {string} classname
	 *
	 * @return {HTMLElement}
	 * */
	static toggleClass(element, classname) {

		if(this.hasClass(element, classname)){
			this.removeClass(element, classname);
		}else{
			this.addClass(element, classname);
		}

		return element;
	}



	/**
	 * @param {HTMLElement} element
	 *
	 * @param {string|undefined} classname
	 *
	 * @return {array}
	 * */
	static siblings(element, classname) {

		let nextSibling = element.nextElementSibling;

		let list = [];

		while(nextSibling){
			if(classname){
				if(this.hasClass(nextSibling, classname)){
					list.push(nextSibling);
				}
			}else{
				list.push(nextSibling);
			}

			nextSibling = nextSibling.nextElementSibling;
		}

		let prevSibling = element.previousElementSibling;

		while(prevSibling){
			if(classname){
				if(this.hasClass(prevSibling, classname)){
					list.unshift(prevSibling);
				}
			}else{
				list.unshift(prevSibling);
			}

			prevSibling = prevSibling.previousElementSibling;
		}

		return list;
	}



	/**
	 * @param {HTMLElement} element
	 *
	 * @param {function|undefined} callback
	 * */
	static ready(element, callback) {
		if(typeof element != 'object' || element === null){ return; }

		this.listenEvent(element, 'DOMContentLoaded', (event) => {
			if(typeof callback == 'function'){
				callback(event);
			}
		});
	}



	/**
	 * @param {HTMLElement} element
	 *
	 * @param {string|null|HTMLElement} selector
	 *
	 * */
	static closest(element, selector) {
		if(typeof selector == 'string'){
			return element.closest(selector);
		}

		let node = selector;

		while(node !== null){

			if(element == node){
				return node;
			}

			node = node.parentNode;
		}

		return null;
	}



	/**
	 * @param {object} event
	 *
	 * @param {HTMLElement|string} element
	 *
	 * @param {function} callback
	 * */
	static body(event, element, callback) {

		if(typeof callback != 'function'){ return; }

		document.body.addEventListener(event, (e) => {

			let target = e.target;

			let find = target.closest(element);

			if(find){
				callback(e, find);
			}
		});
	}


}

PipUI.i18n()
	.set('base.requires', '[Base] Компонент "%" требует наличия компонента %')
	.set('base.requires_version', '[Base] Компонент % требует наличия компонента % версии % %');

/** @return {PipUI} */
const pipui = p = PipUI;

PipUI.addComponent('Base', PipUI.VERSION);

PipUI.ready(document, () => {
	if(PipUI.enable_compatible){
		PipUI.compatible();
	}

	PipUI.body('click', '.preventDefault', e => { e.preventDefault(); });
});