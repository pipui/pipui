class NavbarComponent {
    static VERSION = '2.0.0';

    /** @return {HTMLElement} */
    #wrapper;

    #trigger;

    #id;

    #eventCallback;

    #options = {
        debug: false,
        openCallback: undefined,
        closeCallback: undefined
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
        let self = this;

        this.#wrapper = PipUI.e(object)[0];

        this.setOptions(options);

        options = this.getOptions();

        if(typeof this.#wrapper == 'undefined'){
            if(PipUI.Logger && options.debug){
                PipUI.Logger.info(PipUI.i18n().get('navbar.d_element_not_found'), options);
            }

            return this;
        }

        if(PipUI.Logger && options.debug){
            PipUI.Logger.info(PipUI.i18n().get('navbar.d_create_instance'), options);
        }

        this.#id = Math.random().toString();

        this.#wrapper.setAttribute('data-navbar-id', this.#id);

        this.#eventCallback = (e) => {
            e.preventDefault();

            if(self.isOpen()){
                self.hide();
            }else{
                self.show();
            }
        };

        this.#trigger = this.#wrapper.querySelector('.nav-mobile');

        this.#trigger.addEventListener('click', this.#eventCallback);

        PipUI.Storage.set('navbar', this, this.#id);
    }



    /**
     * @return {boolean}
     * */
    isOpen() {
        return PipUI.hasClass(this.#wrapper, 'navbar-active');
    }



    /**
     * @param {function|undefined} callback
     *
     * @return {this}
     * */
    show(callback) {
        if(this.isOpen()){ return this; }

        let options = this.getOptions();

        if(PipUI.Logger && options.debug){
            PipUI.Logger.info(PipUI.i18n().get('navbar.d_open'), this.#id, options);
        }

        PipUI.addClass(this.#wrapper, 'navbar-active');

        if(typeof callback == 'undefined'){
            callback = options.openCallback;
        }

        if(typeof callback == 'function'){
            callback(this);
        }

        PipUI.trigger(this.#wrapper, 'show-navbar-pipui', this.#id, options, this);

        return this;
    }



    /**
     * @param {function|undefined} callback
     *
     * @return {this}
     * */
    hide(callback) {
        if(!this.isOpen()){ return this; }

        let options = this.getOptions();

        if(PipUI.Logger && options.debug){
            PipUI.Logger.info(PipUI.i18n().get('navbar.d_close'), this.#id, options);
        }

        PipUI.removeClass(this.#wrapper, 'navbar-active');

        if(typeof callback == 'undefined'){
            callback = options.closeCallback;
        }

        if(typeof callback == 'function'){
            callback(this);
        }

        PipUI.trigger(this.#wrapper, 'hide-navbar-pipui', this.#id, options, this);

        return this;
    }
}

PipUI.ready(document, () => {
    PipUI.body('click', '.navbar:not([data-navbar-id]) .nav-mobile', (e, target) => {
        e.preventDefault();

        new NavbarComponent(target.closest('.navbar')).show();
    });
});


if(typeof PipUI != 'undefined'){
    PipUI.addComponent('Navbar', NavbarComponent.VERSION);
    PipUI.required('Navbar', 'Storage', '1.0.0', '>=');
    /** @return {NavbarComponent} */
    PipUI.Navbar = NavbarComponent;

    PipUI.i18n()
        .set('navbar.d_element_not_found', '[Navbar] Элементы не найдены')
        .set('navbar.d_create_instance', '[Navbar] Создание объекта')
        .set('navbar.d_open', '[Navbar] Открытие панели responsive')
        .set('navbar.d_close', '[Navbar] Закрытие панели responsive');
}