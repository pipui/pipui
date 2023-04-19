if(typeof PipUI != 'undefined'){
    PipUI.i18n()
        .set('textarea.d_create_instance', '[Textarea] Создание объекта')
        .set('textarea.d_element_not_found', '[Textarea] Форма не найдена')
        .set('textarea.d_copy', '[Textarea] Копирование в буфер обмена')
        .set('textarea.d_update', '[Textarea] Обновление списка строк')
        .set('textarea.d_update_position', '[Textarea] Обновление позиции списка строк')
        .set('textarea.d_events', '[Textarea] Инициализациия событий')
        .set('textarea.copied', 'Скопировано!');
}

class TextareaComponent {
    static VERSION = '2.0.0';

    #id;

    /** @return {HTMLElement} */
    #copy;

    /** @return {HTMLElement} */
    #list;

    /** @return {HTMLElement} */
    #input;

    /** @return {HTMLElement} */
    #container;

    #options = {
        debug: false,

        updateCallback: undefined,

        updatePositionCallback: undefined,

        copyCallback: undefined,

        templates: {
            container: '<div class="textarea"></div>',
            list: '<ul class="textarea-list"></ul>',
            item: '<li class="textarea-list-item"></li>',
            copy: '<div class="textarea-copy">'+PipUI.i18n().get('textarea.copied')+'</div>'
        }
    }

    #copyTimeout;



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
                PipUI.Logger.info(PipUI.i18n().get('textarea.d_element_not_found'), this.#options);
            }

            return this;
        }

        if(PipUI.Logger && this.#options.debug){
            PipUI.Logger.info(PipUI.i18n().get('textarea.d_create_instance'), this.#options);
        }

        this.#id = Math.random().toString();

        this.#input.setAttribute('data-textarea-id', this.#id);

        this.#container = PipUI.create(this.#options.templates.container);

        this.#container.setAttribute('data-textarea-id', this.#id);

        this.#copy = PipUI.create(this.#options.templates.copy);

        this.#container.append(this.#copy);

        this.#input.after(this.#container);

        this.#list = PipUI.create(this.#options.templates.list);

        this.#container.append(this.#list);

        this.#container.append(this.#input);

        this.update().events();

        PipUI.Storage.set('textarea', this, this.#id);
    }

    update(){

        if(PipUI.Logger && this.#options.debug){
            PipUI.Logger.info(PipUI.i18n().get('textarea.d_update'), this.#options);
        }

        this.#list.innerHTML = '';

        let breaks = this.#input.value.split('\n').length;

        for(let i = 1; i <= breaks; i++){
            let item = PipUI.create(this.#options.templates.item);

            item.innerHTML = i;

            item.setAttribute('data-textarea-line', i);

            this.#list.append(item);
        }

        if(typeof this.#options.updateCallback == 'function'){
            this.#options.updateCallback(this);
        }

        return this;
    }

    updatePosition(){

        if(PipUI.Logger && this.#options.debug){
            PipUI.Logger.info(PipUI.i18n().get('textarea.d_update_position'), this.#input.scrollTop, this.#options);
        }

        this.#list.scrollTop = this.#input.scrollTop;

        if(typeof this.#options.updatePositionCallback == 'function'){
            this.#options.updatePositionCallback(this, this.#input.scrollTop);
        }

        return this;
    }

    events(){

        if(PipUI.Logger && this.#options.debug){
            PipUI.Logger.info(PipUI.i18n().get('textarea.d_events'), this.#options);
        }

        this.#input.addEventListener('input', () => this.update());

        this.#input.addEventListener('scroll', () => this.updatePosition());

        return this;
    }

    copy(line){
        if(typeof this.#copyTimeout != 'undefined'){
            clearTimeout(this.#copyTimeout);

            this.#copyTimeout = undefined;
        }

        PipUI.addClass(this.#copy, 'visible');

        line = parseInt(line);

        let lines = this.#input.value.split('\n');

        let text = lines[line-1];

        if(PipUI.Logger && this.#options.debug){
            PipUI.Logger.info(PipUI.i18n().get('textarea.d_copy'), text, this.#options);
        }

        let tmp = document.createElement("input");
        tmp.type = "text";
        tmp.value = text;

        document.body.appendChild(tmp);

        tmp.select();
        document.execCommand("Copy");

        document.body.removeChild(tmp);

        this.#input.focus();

        let end = 0;

        for(let i = 0; i <= line-1; i++){
            end = end + lines[i].length + 1;
        }

        end--;

        let start = end - lines[line-1].length;

        this.#input.setSelectionRange(start, end);

        this.#copyTimeout = setTimeout(() => {
            PipUI.removeClass(this.#copy, 'visible');
        }, 1000);

        if(typeof this.#options.copyCallback == 'function'){
            this.#options.copyCallback(this, text);
        }

        return this;
    }
}

PipUI.ready(document, () => {

    PipUI.body('click', '.textarea > .textarea-list > .textarea-list-item', (e, target) => {
        e.preventDefault();

        let textarea = PipUI.Storage.get('textarea', target.closest('.textarea').getAttribute('data-textarea-id'));

        textarea.copy(target.getAttribute('data-textarea-line'));
    });

});


if(typeof PipUI != 'undefined'){
    PipUI.addComponent('Textarea', TextareaComponent.VERSION);
    PipUI.required('Textarea', 'Storage', '1.0.0', '>=');
    /** @return {TextareaComponent} */
    PipUI.Textarea = TextareaComponent;
}