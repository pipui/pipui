class GalleryComponent {
    static VERSION = '1.0.0';

    /** @return {HTMLElement} */
    #container;

    /** @return {HTMLElement} */
    #wrapper;

    /** @return {HTMLElement} */
    #list;

    /** @return {HTMLElement} */
    #img;

    /** @return {HTMLElement} */
    #info;

    /** @return {HTMLElement} */
    #title;

    /** @return {HTMLElement} */
    #text;

    /** @return {HTMLElement} */
    #previewWrapper;

    #id;

    #options = {
        debug: false,
        images: [],

        scroll: true,

        changeCallback: undefined,

        changedCallback: undefined,

        updateCallback: undefined,

        pushCallback: undefined,

        unshiftCallback: undefined,

        useImage: false,

        active: 0,

        templates: {
            wrapper: '<div class="gallery-wrapper">' +
                        '<div class="gallery-preview">' +
                            '<a href="#" rel="nofollow" target="_blank" class="gallery-preview-wrapper">' +
                                '<img src="" alt="PREVIEW" />' +
                            '</a>' +

                            '<div class="gallery-info">' +
                                '<div class="gallery-info-title"></div>' +
                                '<div class="gallery-info-text"></div>' +
                            '</div>' +
                        '</div>' +

                        '<div class="gallery-list"></div>' +
                    '</div>',

            image: '<div class="gallery-item">' +
                        '<div class="gallery-item-image"></div>' +
                        '<div class="gallery-item-title"></div>' +
                    '</div>'
        }
    }


    #loadCallback;



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
     * @param {boolean} update
     * */
    constructor(object, options, update) {
        this.#container = PipUI.e(object)[0];

        this.setOptions(options);

        options = this.getOptions();

        if(typeof this.#container == 'undefined'){
            if(PipUI.Logger && options.debug){
                PipUI.Logger.info(PipUI.i18n().get('gallery.d_element_not_found'), options);
            }

            return this;
        }

        if(PipUI.Logger && options.debug){
            PipUI.Logger.info(PipUI.i18n().get('gallery.d_create_instance'), options);
        }

        this.#id = Math.random().toString();

        this.#container.setAttribute('data-gallery-id', this.#id);

        this.update();

        let self = this;

        new ResizeObserver(function(){
            self.updateScoll();
        }).observe(self.#container);

        PipUI.Storage.set('gallery', this, this.#id);
    }



    /**
     * @return {this}
     * */
    update() {

        if(PipUI.Logger && this.#options.debug){
            PipUI.Logger.info(PipUI.i18n().get('gallery.d_update'), this.#options);
        }

        let self = this;

        this.#container.innerHTML = '';

        this.#wrapper = PipUI.create(this.#options.templates.wrapper);

        this.#list = this.#wrapper.querySelector('.gallery-list');

        this.#previewWrapper = this.#wrapper.querySelector('.gallery-preview-wrapper');

        if(typeof this.#img != 'undefined' && typeof this.#loadCallback != 'undefined'){
            this.#img.removeEventListener('load', this.#loadCallback);
        }

        this.#img = this.#wrapper.querySelector('.gallery-preview-wrapper > img');

        this.#loadCallback = () => {
            PipUI.removeClass(self.#container, 'gallery-loading');

            if(typeof this.#options.changedCallback == 'function'){
                this.#options.changedCallback(self);
            }

            PipUI.trigger(this.#container, 'changed-gallery-pipui', this.#options);
        };

        this.#img.addEventListener('load', this.#loadCallback);

        this.#info = this.#wrapper.querySelector('.gallery-info');

        this.#title = this.#wrapper.querySelector('.gallery-info-title');

        this.#text = this.#wrapper.querySelector('.gallery-info-text');

        this.#container.append(this.#wrapper);

        PipUI.addClass(this.#container, 'gallery');

        this.updateImages();

        this.active(this.#options.active);

        if(typeof this.#options.updateCallback == 'function'){
            this.#options.updateCallback(this);
        }

        PipUI.trigger(this.#container, 'update-gallery-pipui', this.#options);

        return this;
    }



    /**
     * @param {this} self
     *
     * @param {object} image
     *
     * @param {int} index
     *
     * @return {HTMLElement}
     * */
    #createNewImage(self, image, index) {

        let item = PipUI.create(self.#options.templates.image);

        let thumb = item.querySelector('.gallery-item-image');

        let title = item.querySelector('.gallery-item-title');

        let pic = image.thumb;

        if(typeof pic == 'undefined'){
            pic = image.large;
        }

        if(typeof pic == 'undefined'){
            pic = image.original;
        }

        PipUI.style(thumb, 'background-image', 'url('+pic+')');

        title.innerHTML = image.title;

        item.setAttribute('data-gallery-index', index);

        item.append(thumb);

        item.append(title);

        if(this.#options.useImage){
            item.append(PipUI.create('<div data-image="'+image.original+'" data-image-group="gallery-'+this.#id+'"></div>'));
        }

        return item;
    }



    /**
     * @return {this}
     * */
    updateImages() {

        let self = this;

        this.#list.innerHTML = '';

        this.#options.images.forEach((image, index) => {

            self.#list.append(self.#createNewImage(self, image, index));

        });

        PipUI.trigger(this.#container, 'update-images-gallery-pipui', this.#options);

        return this;
    }



    /**
     * @param {object} object
     *
     * @return {this}
     * */
    push(object) {
        if(PipUI.Logger && this.#options.debug){
            PipUI.Logger.info(PipUI.i18n().get('gallery.d_push'), this.#options);
        }

        this.#options.images.push(object);

        this.#list.append(this.#createNewImage(this, object, this.#options.images.length));

        if(typeof this.#options.pushCallback == 'function'){
            this.#options.pushCallback(this);
        }

        PipUI.trigger(this.#container, 'push-gallery-pipui', object, this.#options);

        return this;
    }



    /**
     * @param {object} object
     *
     * @return {this}
     * */
    unshift(object) {
        if(PipUI.Logger && this.#options.debug){
            PipUI.Logger.info(PipUI.i18n().get('gallery.d_unshift'), this.#options);
        }

        this.#options.images.unshift(object);

        this.#list.prepend(this.#createNewImage(this, object, 0));

        this.#list.forEach((item, index) => {
            item.setAttribute('data-gallery-index', index);
        });

        this.#options.active = this.#options.active + 1;

        if(typeof this.#options.unshiftCallback == 'function'){
            this.#options.unshiftCallback(this);
        }

        PipUI.trigger(this.#container, 'unshint-gallery-pipui', object, this.#options);

        return this;
    }



    updateScoll(){
        if(PipUI.Logger && this.#options.debug){
            PipUI.Logger.info(PipUI.i18n().get('gallery.d_update_scroll'), this.#options);
        }

        let actual = this.#list.querySelector('.gallery-item.active');

        let galleryWidth = this.#container.offsetWidth;

        let itemWidth = actual ? actual.offsetWidth / 2 : 0;

        let left = actual ? actual.offsetLeft - (galleryWidth / 2) + itemWidth : 0;

        let max = this.#list.scrollWidth - galleryWidth;

        if(left < 0){ left = 0; }

        if(left > max){ left = max; }

        PipUI.style(this.#list, {'left': -left+'px', width: this.#list.scrollWidth+'px'});

        PipUI.trigger(this.#container, 'update-scroll-gallery-pipui', this.#options);

        return this;
    }



    active(index){
        var image = this.#options.images[index];

        let self = this;

        if(typeof image == 'undefined'){ return self; }

        if(PipUI.Logger && this.#options.debug){
            PipUI.Logger.info(PipUI.i18n().get('gallery.d_change_active'), this.#options);
        }

        PipUI.addClass(this.#container, 'gallery-loading');

        this.#options.active = index;

        if(image.text){
            this.#text.innerHTML = image.text;

            PipUI.style(this.#text, 'display', null);
        }else{
            this.#text.innerHTML = '';

            PipUI.style(this.#text, 'display', 'none');
        }

        if(image.title){
            this.#title.innerHTML = image.title;

            PipUI.style(this.#title, 'display', null);
        }else{
            this.#title.innerHTML = '';

            PipUI.style(this.#title, 'display', 'none');
        }


        PipUI.style(this.#info, 'display', image.text || info.name ? null : 'none');


        this.#img.setAttribute('src', image.large);

        this.#img.setAttribute('alt', image.title);

        this.#previewWrapper.setAttribute('href', image.original);

        PipUI.removeClass(this.#list.querySelector('.gallery-item.active'), 'active');

        PipUI.addClass(this.#list.querySelector('.gallery-item[data-gallery-index="'+index+'"]'), 'active');

        this.updateScoll();

        if(typeof this.#options.changeCallback == 'function'){
            this.#options.changeCallback(this);
        }

        PipUI.trigger(this.#container, 'change-gallery-pipui', index, this.#options);

        return this;
    }
}

PipUI.ready(document, () => {

    let touch = false;

    PipUI.body('click', '.gallery .gallery-preview-wrapper', (e, target) => {

        let id = target.closest('.gallery').getAttribute('data-gallery-id');

        if(id){
            let gallery = PipUI.Storage.get('gallery', id);

            let options = gallery.getOptions();

            if(options.useImage){
                e.preventDefault();

                PipUI.Image.open(target.getAttribute('href'), {
                    group: 'gallery-'+id,
                    nextCallback: (obj, index) => gallery.active(index),
                    prevCallback: (obj, index) => gallery.active(index),
                    closeCallback: obj => obj.setOptions({nextCallback: undefined, prevCallback: undefined, closeCallback: undefined})
                });
            }
        }
    });

    PipUI.body('click', '.gallery .gallery-item[data-gallery-index]', (e, target) => {
        e.preventDefault();

        let id = target.closest('.gallery').getAttribute('data-gallery-id');

        if(id){
            PipUI.Storage.get('gallery', id).active(target.getAttribute('data-gallery-index'));
        }
    });

    PipUI.body('mousedown', '.gallery .gallery-list', (e, list) => {
        e.preventDefault();

        let id = list.closest('.gallery').getAttribute('data-gallery-id');

        if(id){
            let gallery = PipUI.Storage.get('gallery', id);

            if(gallery.getOptions().scroll){
                touch = {
                    transition: PipUI.style(list, 'transition'),
                    left: parseInt(PipUI.style(list, 'left')),
                    clientX: e.clientX,
                    list: list
                };

                PipUI.style(list, 'transition', 'none');
            }
        }
    });

    window.addEventListener('mousemove', e => {
        if(touch !== false){

            var left = touch.left + (e.clientX - touch.clientX);

            left *= -1;

            if(left < 0){ left = 0; }

            var max = touch.list.scrollWidth - touch.list.closest('.gallery').offsetWidth;

            if(left > max){ left = max; }

            PipUI.style(touch.list, 'left', -left+'px');
        }
    });

    window.addEventListener('mouseup', e => {

        if(touch !== false){
            e.preventDefault();

            PipUI.style(touch.list, 'transition', touch.transition);

            touch = false;
        }
    });
});


if(typeof PipUI != 'undefined'){
    PipUI.addComponent('Gallery', GalleryComponent.VERSION);
    PipUI.required('Gallery', 'Storage', '1.0.0', '>=');
    /** @return {GalleryComponent} */
    PipUI.Gallery = GalleryComponent;

    PipUI.i18n()
        .set('gallery.d_element_not_found', '[Gallery] Модальное окно не найдено')
        .set('gallery.d_create_instance', '[Gallery] Создание объекта')
        .set('gallery.d_update', '[Gallery] Полное обновление объекта')
        .set('gallery.d_change_active', '[Gallery] Изменение активного элемента')
        .set('gallery.d_push', '[Gallery] Добавление изображения в конец')
        .set('gallery.d_unshift', '[Gallery] Добавление изображения в начало')
        .set('gallery.d_update_scroll', '[Gallery] Обновление позиции скролла');
}