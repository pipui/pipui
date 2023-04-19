class ImageComponent {
    static VERSION = '1.0.0';

    /** @return {HTMLElement} */
    static #lightbox;

    /** @return {HTMLElement} */
    static #target;

    /** @return {HTMLElement} */
    static #loader;

    /** @return {HTMLElement} */
    static #prev;

    /** @return {HTMLElement} */
    static #next;

    /** @return {HTMLElement} */
    static #current;

    static #list = [];

    static #options = {
        debug: false,
        openCallback: undefined,
        closeCallback: undefined,
        nextCallback: undefined,
        prevCallback: undefined,
        templates: {
            modal: '<div class="image-lightbox">' +
                        '<div class="image-lightbox-wrapper">' +
                            '<img class="image-lightbox-target" src="" alt="Image not found" />' +
                            '<div class="image-lightbox-loader"><i class="fa-solid fa-spinner fa-spin-pulse"></i></div>' +
                            '<div class="image-lightbox-prev"></div>' +
                            '<div class="image-lightbox-next"></div>' +
                        '</div>' +
                    '</div>'
        }
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


    static #loadCallback = () => {
        PipUI.removeClass(this.#lightbox, 'image-lightbox-loading');
    };


    static #init(){
        if(typeof this.#lightbox != 'undefined'){ return false; }

        let self = this;

        this.#lightbox = PipUI.create(this.#options.templates.modal);

        this.#target = this.#lightbox.querySelector('.image-lightbox-target');

        this.#loader = this.#lightbox.querySelector('.image-lightbox-loader');

        this.#prev = this.#lightbox.querySelector('.image-lightbox-prev');

        this.#next = this.#lightbox.querySelector('.image-lightbox-next');

        this.#prev.setAttribute('title', PipUI.i18n().get('image.prev'));

        this.#next.setAttribute('title', PipUI.i18n().get('image.next'));

        document.body.append(this.#lightbox);

        this.#target.addEventListener('load', this.#loadCallback);

        this.#prev.addEventListener('click', () => self.prev());

        this.#next.addEventListener('click', () => self.next());

        return true;
    }


    static #cb = (self) => {
        PipUI.addClass(self.#lightbox, 'image-lightbox-active');

        if(typeof self.#options.openCallback == 'function'){
            self.#options.openCallback(self, self.#current);
        }
    }



    /**
     * @param {string} url
     *
     * @param {options|undefined} options
     * */
    static open(url, options){

        /*if(typeof this.#options == 'undefined'){
            options = this.#optionsPreset;
        }*/

        this.setOptions(options);

        let self = this;

        let init = this.#init();

        this.#current = url;

        this.#target.setAttribute('src', '');

        this.#target.setAttribute('src', url);

        PipUI.addClass(this.#lightbox, 'image-lightbox-loading');

        let selector = this.#options.group ? '[data-image][data-image-group="'+this.#options.group+'"]' : '[data-image]:not([data-image-group])';

        this.#list = [];

        document.querySelectorAll(selector).forEach(item => {
            self.#list.push(item.getAttribute('data-image'));
        });

        if(!PipUI.hasClass(this.#lightbox)){

            if(PipUI.Logger && this.#options.debug){
                PipUI.Logger.info(PipUI.i18n().get('image.d_open'), this.#options, this.#current);
            }

            if(init){
                setTimeout(() => this.#cb(this), 0);
            }else{
                this.#cb(this)
            }
        }
    }

    static close(){

        if(PipUI.Logger && this.#options.debug){
            PipUI.Logger.info(PipUI.i18n().get('image.d_close'), this.#options);
        }

        PipUI.removeClass(this.#lightbox, 'image-lightbox-active');

        if(typeof this.#options.closeCallback == 'function'){
            this.#options.closeCallback(this, this.#current);
        }
    }

    static prev(){

        if(PipUI.Logger && this.#options.debug){
            PipUI.Logger.info(PipUI.i18n().get('image.d_close'), this.#options);
        }

        let index = this.#list.indexOf(this.#current);

        if(index === -1){ return this.close(); }

        index--;

        if(typeof this.#options.prevCallback == 'function'){
            this.#options.prevCallback(this, index);
        }

        typeof this.#list[index] == 'undefined' ? this.close() : this.open(this.#list[index]);
    }

    static next(){

        if(PipUI.Logger && this.#options.debug){
            PipUI.Logger.info(PipUI.i18n().get('image.d_next'), this.#options);
        }

        let index = this.#list.indexOf(this.#current);

        if(index === -1){ return this.close(); }

        index++;

        if(typeof this.#options.nextCallback == 'function'){
            this.#options.nextCallback(this, index);
        }

        typeof this.#list[index] == 'undefined' ? this.close() : this.open(this.#list[index]);
    }

}

PipUI.ready(document, () => {

    PipUI.body('click', '[data-image]', (e, target) => {
        e.preventDefault();

        ImageComponent.open(target.getAttribute('data-image'), {
            group: target.getAttribute('data-image-group')
        });
    });

    PipUI.body('click', '.image-lightbox', e => {
        if(PipUI.hasClass(e.target, 'image-lightbox')){
            e.preventDefault();

            ImageComponent.close();
        }
    });
});

if(typeof PipUI != 'undefined'){
    PipUI.addComponent('Image', ImageComponent.VERSION);
    /** @return {ImageComponent} */
    PipUI.Image = ImageComponent;

    PipUI.i18n()
        .set('image.d_open', '[Image] Открытие окна изображения')
        .set('image.d_close', '[Image] Закрытие окна изображения')
        .set('image.d_next', '[Image] Переключение на следующее изображение')
        .set('image.d_prev', '[Image] Переключение на предыдущее изображение')
        .set('image.next', 'Следующее изрображение')
        .set('image.prev', 'Предыдущее изображение');
}