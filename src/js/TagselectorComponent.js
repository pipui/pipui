class TagselectorComponent {
    static VERSION = '2.0.0';

    #id;

    /** @return {HTMLElement} */
    #input;

    /** @return {HTMLElement} */
    #container;

    /** @return {HTMLElement} */
    #list;

    /** @return {HTMLElement} */
    #hidden;

    #options = {
        debug: false,

        min: 1,

        max: 32,

        maxTags: 0,

        pattern: undefined,

        insert: 'start',

        values: [],

        keys: [',', 'Enter'],

        unique: true,

        hidden: 'tags',

        pushCallback: undefined,

        unshiftCallback: undefined,

        clearCallback: undefined,

        setCallback: undefined,

        removeCallback: undefined,

        updateCallback: undefined,

        errorCallback: undefined,

        tagselectorClass: 'tagselector',

        templates: {
            container: '<div class="tagselector"><ul class="tagselector-list"></ul></div>',
            tag: '<div class="tagselector-item"></div>'
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
        this.#input = PipUI.e(input)[0];

        this.setOptions(options);

        if (typeof this.#input == 'undefined') {
            if (PipUI.Logger && this.#options.debug) {
                PipUI.Logger.info(PipUI.i18n().get('tagselector.d_element_not_found'), this.#options);
            }

            return this;
        }

        if (PipUI.Logger && this.#options.debug) {
            PipUI.Logger.info(PipUI.i18n().get('tagselector.d_create_instance'), this.#options);
        }

        this.#id = Math.random().toString();

        this.#input.setAttribute('data-tagselector-id', this.#id);

        this.#container = PipUI.create(this.#options.templates.container);

        this.#container.setAttribute('data-tagselector-id', this.#id);

        this.#hidden = PipUI.create('<input type="hidden" class="tagselector-hidden" name="' + this.#options.hidden + '">');

        PipUI.addClass(this.#container, this.#options.tagselectorClass);

        this.#list = this.#container.querySelector('.tagselector-list');

        this.#input.after(this.#container);

        this.#input.after(this.#hidden);

        PipUI.addClass(this.#input, 'tagselector-input');

        this.#input.addEventListener('keypress', e => {
            if (this.#options.keys.indexOf(e.key) !== -1) {
                this.add(this.#input.value);
            }
        });

        PipUI.Storage.set('tagselector', this, this.#id);
    }


    /**
     * @return {HTMLElement|undefined}
     * */
    #precompile(string) {
        string = string.toString();

        if (!string.trim()) {
            if (PipUI.Logger && this.#options.debug) {
                PipUI.Logger.info(PipUI.i18n().get('tagselector.d_err1'), this.#options);
            }

            if (typeof this.#options.errorCallback == 'function') {
                this.#options.errorCallback(this, 1, PipUI.i18n().get('tagselector.d_err1'));
            }

            return false;
        }

        if (this.#options.unique && this.search(string) !== -1) {
            if (PipUI.Logger && this.#options.debug) {
                PipUI.Logger.info(PipUI.i18n().get('tagselector.d_err2'), this.#options);
            }

            if (typeof this.#options.errorCallback == 'function') {
                this.#options.errorCallback(this, 2, PipUI.i18n().get('tagselector.d_err2'));
            }

            return false;
        }

        if (this.#options.min > 0 && string.length < this.#options.min) {
            if (PipUI.Logger && this.#options.debug) {
                PipUI.Logger.info(PipUI.i18n().get('tagselector.d_err3') + this.#options.min, this.#options);
            }

            if (typeof this.#options.errorCallback == 'function') {
                this.#options.errorCallback(this, 3, PipUI.i18n().get('tagselector.d_err3') + this.#options.min);
            }

            return false;
        }

        if (this.#options.max > 0 && string.length > this.#options.max) {
            if (PipUI.Logger && this.#options.debug) {
                PipUI.Logger.info(PipUI.i18n().get('tagselector.d_err4') + this.#options.max, this.#options);
            }

            if (typeof this.#options.errorCallback == 'function') {
                this.#options.errorCallback(this, 4, PipUI.i18n().get('tagselector.d_err4') + this.#options.max);
            }

            return false;
        }

        if (this.#options.maxTags > 0 && this.#options.values.length >= this.#options.maxTags) {
            if (PipUI.Logger && this.#options.debug) {
                PipUI.Logger.info(PipUI.i18n().get('tagselector.d_err5') + this.#options.maxTags, this.#options);
            }

            if (typeof this.#options.errorCallback == 'function') {
                this.#options.errorCallback(this, 5, PipUI.i18n().get('tagselector.d_err5') + this.#options.maxTags);
            }

            return false;
        }

        if (this.#options.pattern && !this.#options.pattern.test(string)) {
            if (PipUI.Logger && this.#options.debug) {
                PipUI.Logger.info(PipUI.i18n().get('tagselector.d_err6'), this.#options);
            }

            if (typeof this.#options.errorCallback == 'function') {
                this.#options.errorCallback(this, 6, PipUI.i18n().get('tagselector.d_err6'));
            }

            return false;
        }

        let tag = PipUI.create(this.#options.templates.tag);

        tag.setAttribute('data-tagselector-item-id', Math.random().toString());

        tag.innerHTML = string;

        return tag;
    }



    /**
     * @param {string} string
     *
     * @param {function|undefined} callback
     *
     * @return {this}
     * */
    add(string, callback) {
        return this.#options.insert == 'start' ? this.unshift(string, callback) : this.push(string, callback);
    }



    /**
     * @param {string} string
     *
     * @param {function|undefined} callback
     *
     * @return {this}
     * */
    push(string, callback) {
        let tag = this.#precompile(string);

        if (tag === false) {
            return this;
        }

        this.#options.values.push(string);

        this.#list.append(tag);

        this.#input.value = '';

        this.#hidden = this.#options.values.join(',');

        if (PipUI.Logger && this.#options.debug) {
            PipUI.Logger.info(PipUI.i18n().get('tagselector.d_push'), string, this.#options);
        }

        if (typeof callback == 'undefined') {
            callback = this.#options.pushCallback;
        }

        if (typeof callback == 'function') {
            callback(this, string);
        }

        PipUI.trigger(this.#input, 'push-tagselector-pipui', string, this.#id, this.#options, this);

        return this;
    }


    /**
     * @param {string} string
     *
     * @param {function|undefined} callback
     *
     * @return {this}
     * */
    unshift(string, callback) {
        let tag = this.#precompile(string);

        if (tag === false) {
            return this;
        }

        this.#options.values.unshift(string);

        this.#list.prepend(tag);

        this.#input.value = '';

        this.#hidden = this.#options.values.join(',');

        if (PipUI.Logger && this.#options.debug) {
            PipUI.Logger.info(PipUI.i18n().get('tagselector.d_unshift'), string, this.#options);
        }

        if (typeof callback == 'undefined') {
            callback = this.#options.unshiftCallback;
        }

        if (typeof callback == 'function') {
            callback(this, string);
        }

        PipUI.trigger(this.#input, 'unshift-tagselector-pipui', string, this.#id, this.#options, this);

        return this;
    }


    /**
     *
     * @param {string} id
     *
     * @param {string} string
     *
     * @param {function|undefined} callback
     *
     * @return {this}
     * */
    set(id, string, callback) {

        let tag = this.#list.querySelector('.tagselector-item[data-tagselector-item-id="' + id + '"]');

        if (!tag) {
            return this;
        }

        tag.innerHTML = string;

        if (PipUI.Logger && this.#options.debug) {
            PipUI.Logger.info(PipUI.i18n().get('tagselector.d_set'), id, string, this.#options);
        }

        if (typeof callback == 'undefined') {
            callback = this.#options.setCallback;
        }

        if (typeof callback == 'function') {
            callback(this, id, string);
        }

        PipUI.trigger(this.#input, 'set-tagselector-pipui', id, string, this.#id, this.#options, this);

        return this;
    }


    /**
     * @param {string} id
     *
     * @param {function|undefined} callback
     *
     * @return {this}
     * */
    remove(id, callback) {

        let tag = this.#list.querySelector('.tagselector-item[data-tagselector-item-id="' + id + '"]');

        if (!tag) {
            return this;
        }

        tag.remove();

        let index = this.search(tag.innerHTML);

        if (index === -1) {
            return this;
        }

        this.#options.values.splice(index, 1);

        if (PipUI.Logger && this.#options.debug) {
            PipUI.Logger.info(PipUI.i18n().get('tagselector.d_remove'), id, this.#options);
        }

        if (typeof callback == 'undefined') {
            callback = this.#options.removeCallback;
        }

        if (typeof callback == 'function') {
            callback(this, id, index);
        }

        PipUI.trigger(this.#input, 'remove-tagselector-pipui', id, index, this.#id, this.#options, this);

        return this;
    }


    /**
     * @param {function|undefined} callback
     *
     * @return {this}
     * */
    clear(callback) {

        this.#options.values = [];

        this.#list.innerHTML = '';

        if (PipUI.Logger && this.#options.debug) {
            PipUI.Logger.info(PipUI.i18n().get('tagselector.d_clear'), this.#options);
        }

        if (typeof callback == 'undefined') {
            callback = this.#options.clearCallback;
        }

        if (typeof callback == 'function') {
            callback(this);
        }

        PipUI.trigger(this.#input, 'clear-tagselector-pipui', this.#id, this.#options, this);

        return this;
    }


    /**
     * @param {string} string
     *
     * @return {int}
     * */
    search(string) {
        return this.#options.values.indexOf(string);
    }
}

PipUI.ready(document, () => {

    PipUI.body('click', '.tagselector[data-tagselector-id] .tagselector-item', (e, target) => {
        e.preventDefault();

        let id = target.closest('[data-tagselector-id]').getAttribute('data-tagselector-id');

        PipUI.Storage.get('tagselector', id).remove(target.getAttribute('data-tagselector-item-id'));
    });

    PipUI.body('focusin', '[data-tagselector]:not([data-tagselector-id])', (e, target) => {

        let values = target.value.length > 0 ? target.value.split(',') : [];

        let keys = target.getAttribute('data-tagselector-keys');

        let unique = target.getAttribute('data-tagselector-unique');

        let insert = target.getAttribute('data-tagselector-insert');

        let min = target.getAttribute('data-tagselector-min');

        let max = target.getAttribute('data-tagselector-max');

        let maxTags = target.getAttribute('data-tagselector-max-tags');

        let pattern = target.getAttribute('data-tagselector-pattern');

        let options = {
            values: values
        };

        if(keys){
            options.keys = keys.split('+');
        }

        if(unique){
            options.unique = unique == 'true';
        }

        if(insert){
            options.insert = insert;
        }

        if(min){
            options.min = parseInt(min);
        }

        if(max){
            options.max = parseInt(max);
        }

        if(maxTags){
            options.maxTags = parseInt(maxTags);
        }

        if(pattern){
            options.pattern = parseInt(pattern);
        }

        new TagselectorComponent(target, options);
    });

});


if(typeof PipUI != 'undefined'){
    PipUI.addComponent('Tagselector', TagselectorComponent.VERSION);
    PipUI.required('Tagselector', 'Storage', '1.0.0', '>=');
    /** @return {TagselectorComponent} */
    PipUI.Tagselector = TagselectorComponent;


    PipUI.i18n()
        .set('tagselector.d_create_instance', '[Tagselector] Создание объекта')
        .set('tagselector.d_element_not_found', '[Tagselector] Форма ввода не найдена')
        .set('tagselector.d_err1', '[Tagselector] Необходимо заполнить поле формы')
        .set('tagselector.d_err2', '[Tagselector] Тег должен быть уникальным')
        .set('tagselector.d_err3', '[Tagselector] Минимальное кол-во символов в теге: ')
        .set('tagselector.d_err4', '[Tagselector] Максимальное кол-во символов в теге: ')
        .set('tagselector.d_err5', '[Tagselector] Максимальное кол-во тегов: ')
        .set('tagselector.d_err6', '[Tagselector] Тег не соответствует паттерну')
        .set('tagselector.d_push', '[Tagselector] Добавления тега в конец списка')
        .set('tagselector.d_unshift', '[Tagselector] Добавления тега в начало списка')
        .set('tagselector.d_set', '[Tagselector] Обновление тега')
        .set('tagselector.d_remove', '[Tagselector] Удаление тега')
        .set('tagselector.d_clear', '[Tagselector] Очистка всех тегов');
}