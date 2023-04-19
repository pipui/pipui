class ValidatorComponent {
    static VERSION = '2.0.0';

    #id;

    /** @return {HTMLElement} */
    #input;

    /** @return {HTMLElement} */
    #container;

    /** @return {HTMLElement} */
    #box;

    #options = {
        debug: false,

        text: '',

        type: 'default',

        invalidCallback: undefined,

        templates: {
            box: '<div class="validator"></div>'
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

        if(typeof this.#input == 'undefined'){
            if(PipUI.Logger && this.#options.debug){
                PipUI.Logger.info(PipUI.i18n().get('validator.d_element_not_found'), this.#options);
            }

            return this;
        }

        this.#container = this.#input.closest('.input-block');

        if(!this.#container){
            if(PipUI.Logger && this.#options.debug){
                PipUI.Logger.info(PipUI.i18n().get('validator.d_container_not_found'), this.#options);
            }

            return this;
        }

        if(PipUI.Logger && this.#options.debug){
            PipUI.Logger.info(PipUI.i18n().get('validator.d_create_instance'), this.#options);
        }

        this.#id = Math.random().toString();

        this.#input.setAttribute('data-validator-id', this.#id);

        this.#container.setAttribute('data-validator-id', this.#id);

        this.#box = PipUI.create(this.#options.templates.box);

        this.#box.setAttribute('data-validator-id', this.#id);

        this.#container.append(this.#box);

        let form = this.#input.closest('form');

        if(form){ form.setAttribute('novalidate', ''); }

        let self = this;

        this.#input.addEventListener('input', () => self.isValid() ? PipUI.removeClass(self.#box, 'visible') : '');

        PipUI.Storage.set('validator', this, this.#id);
    }



    /**
     * @return {boolean}
     * */
    isValid(){
        return !this.#input.validationMessage;
    }



    /**
     * @param {function|undefined} callback
     *
     * @return {this}
     * */
    validate(callback) {

        let valid = this.isValid();

        if(PipUI.Logger && this.#options.debug){
            PipUI.Logger.info(PipUI.i18n().get('validator.d_validate'), valid, this.#options);
        }

        PipUI.trigger(this.#input, 'invalid-validate-pipui', this, this.#id, this.#options);

        if(valid){ PipUI.removeClass(this.#box, 'visible'); return true; }

        this.#box.innerHTML = this.#options.text ? this.#options.text : this.#input.validationMessage;

        this.#input.setAttribute('data-validator-type', this.#options.type);

        PipUI.addClass(this.#box, 'visible');

        if(typeof callback == 'undefined'){
            callback = this.#options.invalidCallback;
        }

        if(typeof callback == 'function'){
            callback(this, this.#input.validationMessage);
        }

        PipUI.trigger(this.#input, 'validate-validator-pipui', this.#id, this.#options, this, this.#input.validationMessage);

        return false;
    }
}

PipUI.ready(document, () => {

    PipUI.body('focusin', '[data-validator]:not([data-validator-id])', (e, target) => {
        let options = {};

        let text = target.getAttribute('data-validator-text');

        if(text){ options.text = text; }

        let type = target.getAttribute('data-validator-type');

        if(type){ options.type = type; }

        new ValidatorComponent(target, options);
    });

    PipUI.body('submit', 'form', (e, target) => {

        let inputs = target.querySelectorAll('[data-validator]');

        let stop = false;

        inputs.forEach(input => {

            let id = input.getAttribute('data-validator-id');

            let validator;

            if(id){
                validator = PipUI.Storage.get('validator', id);
            }else{
                let options = {};

                let text = target.getAttribute('data-validator-text');

                if(text){ options.text = text; }

                let type = target.getAttribute('data-validator-type');

                if(type){ options.type = type; }

                validator = new ValidatorComponent(input, options);
            }

            if(!validator.validate()){
                stop = true;
            }
        });

        if(stop){ e.preventDefault(); e.stopPropagation(); }
    });

});


if(typeof PipUI != 'undefined'){
    PipUI.addComponent('Validator', ValidatorComponent.VERSION);
    PipUI.required('Validator', 'Storage', '1.0.0', '>=');
    /** @return {ValidatorComponent} */
    PipUI.Validator = ValidatorComponent;


    PipUI.i18n()
        .set('validator.d_create_instance', '[Validator] Создание объекта')
        .set('validator.d_element_not_found', '[Validator] Форма ввода не найдена')
        .set('validator.d_container_not_found', '[Validator] Контейнер не найден')
        .set('validator.d_validate', '[Validator] Проверка формы');
}