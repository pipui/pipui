class PopupComponent {
    static VERSION = '2.0.0';

    #id;

    #target;

    #triggers = [];

    #box;

    #overlay;

    #autocloseTimeout = undefined;

    #triggerCallback;

    /** @return {HTMLElement} */
    #title;

    /** @return {HTMLElement} */
    #content;

    #oldPosition;

    #options = {
        debug: false,

        target: undefined,

        triggers: [],

        title: '',

        content: '',

        direction: 'up',

        overlay: false,

        autoclose: 0,

        overclose: true,

        openedClass: 'popup-active',

        openedOverlayClass: 'overlay-active',

        openedTriggerClass: 'active',

        targetClass: 'popup-target',

        targetActiveClass: 'popup-target-active',

        openCallback: undefined,

        closeCallback: undefined,

        updateCallback: undefined,

        repositionCallback: undefined,

        templates: {
            box: '<div class="popup">' +
                        '<div class="popup-title"></div>' +
                        '<div class="popup-content"></div>' +
                    '</div>',
            overlay: '<div class="popup-overlay"></div>'
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
     * @param {HTMLElement|string} box
     *
     * @param {object|undefined} options
     * */
    constructor(box, options) {
        this.setOptions(options);

        if(PipUI.Logger && this.#options.debug){
            PipUI.Logger.info(PipUI.i18n().get('popup.d_create_instance'), this.#options);
        }

        this.#id = Math.random().toString();

        if(box){
            this.#box = PipUI.e(box)[0];
        }else{
            this.#box = PipUI.create(this.#options.templates.box);

            document.body.append(this.#box);
        }

        this.#box.setAttribute('data-popup-id', this.#id);

        let self = this;

        this.#target = PipUI.e(this.#options.target)[0];

        if(!this.#target){
            if(PipUI.Logger && this.#options.debug){
                PipUI.Logger.info(PipUI.i18n().get('popup.d_target_not_found'), this.#options);
            }

            return;
        }


        this.#target.setAttribute('data-popup-id', this.#id);

        this.#title = this.#box.querySelector('.popup-title');

        this.#content = this.#box.querySelector('.popup-content');

        window.addEventListener('resize', () => {
            if(self.isOpen()){ self.updatePosition(); }
        });

        document.addEventListener('scroll', () => {
            if(self.isOpen()){ self.updatePosition(); }
        });

        this.update();

        PipUI.Storage.set('popup', this, this.#id);
    }



    /**
     * @param {string} name
     *
     * @return {object} */
    getPosition(name){
        let top = 0, left = 0;

        switch(name){
            case 'left':
                top = this.#target.offsetTop - (this.#box.offsetHeight / 2) + (this.#target.offsetHeight / 2);
                left = this.#target.offsetLeft - this.#box.offsetWidth;
                break;

            case 'right':
                top = this.#target.offsetTop - (this.#box.offsetHeight / 2) + (this.#target.offsetHeight / 2);
                left = this.#target.offsetLeft + this.#target.offsetWidth;
                break;

            case 'up':
                top = this.#target.offsetTop - this.#box.offsetHeight;
                left = this.#target.offsetLeft + (this.#target.offsetWidth / 2) - (this.#box.offsetWidth / 2);
                break;

            case 'down':
                top = this.#target.offsetTop + this.#target.offsetHeight;
                left = this.#target.offsetLeft + (this.#target.offsetWidth / 2) - (this.#box.offsetWidth / 2);
                break;
        }

        return {
            top: top,
            left: left
        };
    }



    updatePosition(){

        let offset = {
            top: this.#target.offsetTop - window.scrollY,
            bottom: 0,
            left: this.#target.offsetLeft - window.scrollX,
            right: 0
        };

        offset.bottom = window.innerHeight - (this.#target.offsetTop - window.scrollY + this.#target.offsetHeight);

        offset.right = window.innerWidth - (this.#target.offsetLeft - window.scrollX + this.#target.offsetWidth);

        let pos;

        if(this.#options.direction == 'left'){
            if(offset.left >= this.#box.offsetWidth){
                pos = 'left';
            }else if(offset.right >= this.#box.offsetWidth){
                pos = 'right';
            }else if(offset.top >= this.#box.offsetHeight){
                pos = 'up';
            }else if(offset.bottom >= this.#box.offsetHeight){
                pos = 'down';
            }else{
                pos = 'left';
            }
        }else if(this.#options.direction == 'right'){
            if(offset.right >= this.#box.offsetWidth){
                pos = 'right';
            }else if(offset.left >= this.#box.offsetWidth){
                pos = 'left';
            }else if(offset.top >= this.#box.offsetHeight){
                pos = 'up';
            }else if(offset.bottom >= this.#box.offsetHeight){
                pos = 'down';
            }else{
                pos = 'right';
            }
        }else if(this.#options.direction == 'down'){
            if(offset.bottom >= this.#box.offsetHeight){
                pos = 'down';
            }else if(offset.top >= this.#box.offsetHeight){
                pos = 'up';
            }else if(offset.right >= this.#box.offsetWidth){
                pos = 'right';
            }else if(offset.left >= this.#box.offsetWidth){
                pos = 'left';
            }else {
                pos = 'down';
            }
        }else{
            if(offset.top >= this.#box.offsetHeight){
                pos = 'up';
            }else if(offset.bottom >= this.#box.offsetHeight){
                pos = 'down';
            }else if(offset.right >= this.#box.offsetWidth){
                pos = 'right';
            }else if(offset.left >= this.#box.offsetWidth){
                pos = 'left';
            }else {
                pos = 'up';
            }
        }

        let positions = this.getPosition(pos);

        PipUI.style(this.#box, {top: positions.top+'px', left: positions.left+'px'});

        this.#box.setAttribute('data-popup-direction', pos);

        if(typeof this.#options.repositionCallback == 'function'){
            this.#options.repositionCallback(this, positions, pos);
        }

        PipUI.trigger(this.#box, 'update-position-popup-pipui', this.#id, this.#options, this);

        if(PipUI.Logger && this.#options.debug){
            PipUI.Logger.info(PipUI.i18n().get('popup.d_update_position'), this.#id, this.#options, positions, pos);
        }

        return this;
    }



    /** * @return {this} */
    update(){

        if(!this.#options.title){
            this.#options.title = this.#title.innerHTML;
        }

        if(!this.#options.content){
            this.#options.content = this.#content.innerHTML;
        }

        let trigger = this.#options.triggers[0];

        if(typeof trigger != 'undefined'){
            if(!this.#options.title){
                this.#options.title = trigger.getAttribute('data-popup-title') ?? '';
            }

            if(!this.#options.content){
                this.#options.content = trigger.getAttribute('data-popup-content') ?? '';
            }

            let direction = trigger.getAttribute('data-popup-direction');

            if(direction){
                this.#options.direction = direction;
            }

            let autoclose = trigger.getAttribute('data-popup-autoclose');

            if(autoclose){
                this.#options.autoclose = parseInt(autoclose);
            }

            let overlay = trigger.getAttribute('data-popup-overlay');

            if(overlay){
                this.#options.overlay = overlay == 'true';
            }

            let overclose = trigger.getAttribute('data-popup-overclose');

            if(overclose){
                this.#options.overclose = overclose == 'true';
            }

            trigger.setAttribute('data-popup-direction', this.#options.direction);
        }


        this.#overlay = document.querySelector('.popup-overlay');

        if(!this.#overlay && this.#options.overlay){
            this.#overlay = PipUI.create(this.#options.templates.overlay);

            document.body.append(this.#overlay);
        }

        if(this.#options.title){
            this.#title.innerHTML = this.#options.title;

            PipUI.style(this.#title, 'display', null);
        }else{
            PipUI.style(this.#title, 'display', 'none');
        }

        if(this.#options.content){
            this.#content.innerHTML = this.#options.content;

            PipUI.style(this.#content, 'display', null);
        }else{
            PipUI.style(this.#content, 'display', 'none');
        }

        let self = this;

        this.#triggers.forEach(trigger => {
            trigger.removeEventListener('click', self.#triggerCallback);
        });

        self.#triggerCallback = e => {
            e.preventDefault();

            if(!self.isOpen()){
                self.open();
            }else{
                self.close();
            }
        }

        this.#triggers = [];

        this.#options.triggers.forEach(trigger => {
            trigger.setAttribute('data-popup-id', self.#id);

            trigger.addEventListener('click', self.#triggerCallback);

            this.#triggers.push(trigger);
        });

        if(typeof this.#options.updateCallback == 'function'){
            this.#options.updateCallback(this);
        }

        PipUI.trigger(this.#box, 'update-popup-pipui', this.#id, this.#options, this);

        if(PipUI.Logger && this.#options.debug){
            PipUI.Logger.info(PipUI.i18n().get('popup.d_update'), this.#id, this.#options);
        }

        return this;
    }


    /** @return {boolean} */
    isOpen(){
        return PipUI.hasClass(this.#box, this.#options.openedClass);
    }



    /**
     * @param {function|undefined} callback
     *
     * @return {this} */
    close(callback) {

        if(!this.isOpen()){ return this; }

        PipUI.removeClass(this.#options.triggers, this.#options.openedTriggerClass);

        PipUI.removeClass(this.#box, this.#options.openedClass);

        PipUI.removeClass(this.#target, this.#options.targetActiveClass);

        if(this.#overlay){
            PipUI.removeClass(this.#overlay, this.#options.openedOverlayClass);

            if(this.#oldPosition == 'static'){
                PipUI.style(this.#box, {
                    'position': this.#oldPosition
                });
            }
        }

        if(typeof callback == 'undefined'){
            callback = this.#options.closeCallback;
        }

        if(typeof callback == 'function'){
            callback(this);
        }

        PipUI.trigger(this.#box, 'close-popup-pipui', this.#id, this.#options, this);

        if(PipUI.Logger && this.#options.debug){
            PipUI.Logger.info(PipUI.i18n().get('popup.d_close'), this.#id, this.#options);
        }

        return this;
    }



    /**
     * @param {function|undefined} callback
     *
     * @return {this} */
    open(callback){

        this.updatePosition();

        PipUI.addClass(this.#options.triggers, this.#options.openedTriggerClass);

        PipUI.addClass(this.#box, this.#options.openedClass);

        PipUI.addClass(this.#target, this.#options.targetClass);

        PipUI.addClass(this.#target, this.#options.targetActiveClass);

        if(this.#options.overlay){
            PipUI.addClass(this.#overlay, this.#options.openedOverlayClass);

            this.#oldPosition = PipUI.style(this.#box, 'position')[0].position;

            if(this.#oldPosition == 'static'){
                PipUI.style(this.#box, {'position': 'relative'});
            }
        }else{
            if(this.#overlay){
                PipUI.removeClass(this.#overlay, this.#options.openedOverlayClass);
            }
        }

        if(typeof callback == 'undefined'){
            callback = this.#options.closeCallback;
        }

        if(typeof callback == 'function'){
            callback(this);
        }

        PipUI.trigger(this.#box, 'open-popup-pipui', this.#id, this.#options, this);

        if(PipUI.Logger && this.#options.debug){
            PipUI.Logger.info(PipUI.i18n().get('popup.d_open'), this.#id, this.#options);
        }

        if(this.#options.autoclose > 0){
            let that = this;

            if(typeof this.#autocloseTimeout != 'undefined'){
                clearTimeout(this.#autocloseTimeout);
                this.#autocloseTimeout = undefined;
            }

            this.#autocloseTimeout = setTimeout(() => {
                that.close();
                that.#autocloseTimeout = undefined;
            }, this.#options.autoclose);
        }

        return this;
    }
}

PipUI.ready(document, () => {

    PipUI.body('click', '[data-popup]:not([data-popup-id])', (e, trigger) => {
        e.preventDefault();

        let target = trigger.getAttribute('data-popup-target');

        let options = {
            triggers: [trigger]
        };

        options.target = target ? target : trigger;

        let popup = new PopupComponent(trigger.getAttribute('data-popup'), options);

        setTimeout(() => popup.open(), 100);
    });

    document.addEventListener('click', e => {

        document.querySelectorAll('.popup.popup-active[data-popup-id]').forEach(item => {
            let target = e.target.closest('[data-popup-id]');

            if(target === null){
                let popup = PipUI.Storage.get('popup', item.getAttribute('data-popup-id'));

                if(popup.getOptions().overclose){
                    popup.close();
                }
            }else{
                let id = target.getAttribute('data-popup-id');

                let popup = PipUI.Storage.get('popup', item.getAttribute('data-popup-id'));

                if(popup.getID() != id && popup.getOptions().overclose){
                    popup.close();
                }
            }
        });
    });

    PipUI.body('click', '.popup-overlay.overlay-active', e => {
        e.preventDefault();

        let popups = PipUI.Storage.get('popup');

        Object.keys(popups).forEach(key => {
            if(popups[key].isOpen()){ popups[key].close(); }
        });
    });
});


if(typeof PipUI != 'undefined'){
    PipUI.addComponent('Popup', PopupComponent.VERSION);
    PipUI.required('Popup', 'Storage', '1.0.0', '>=');
    /** @return {PopupComponent} */
    PipUI.Popup = PopupComponent;


    PipUI.i18n()
        .set('popup.d_create_instance', '[Popup] Создание объекта')
        .set('popup.d_target_not_found', '[Popup] Не найден элемент назначения')
        .set('popup.d_open', '[Popup] Открытие всплывающего блока')
        .set('popup.d_close', '[Popup] Закрытие всплывающего блока')
        .set('popup.d_update', '[Popup] Обновление всплывающего блока')
        .set('popup.d_update_position', '[Popup] Обновление позиции всплывающего блока');
}