class AnimationComponent {
    static VERSION = '1.0.0';

    #options = {
        debug: false
    }

    /** @return {HTMLElement} */
    #target;

    #animations = {};

    #effects = {};

    #callbacks = {};



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

    constructor(element, options) {
        this.#target = PipUI.e(element);

        this.fadeIn = this.fadeIn.bind(this);

        this.fadeOut = this.fadeOut.bind(this);

        this.slideUp = this.slideUp.bind(this);

        this.slideDown = this.slideDown.bind(this);

        this.slideLeft = this.slideLeft.bind(this);

        this.slideRight = this.slideRight.bind(this);

        this.hide = this.hide.bind(this);

        this.show = this.show.bind(this);

        this.animate = this.animate.bind(this);

        this.setOptions(options);

        if(this.#options.debug){ PipUI.Logger.info('[Animations] Animations inited'); }
    }

    #run(name, keyframes, options, finishCallback, completeCallback){
        if(this.#options.debug){ PipUI.Logger.info('[Animations] Starting '+name+' animation'); }

        for(let i = 0; i < this.#target.length; i++){

            let target = this.#target[i];

            if(typeof target.animation_id == 'undefined'){
                target.animation_id = Math.random().toString();
            }

            keyframes = keyframes(target);

            this.#effects[target.animation_id] = new KeyframeEffect(target, keyframes, options);

            this.#animations[target.animation_id] = new Animation(this.#effects[target.animation_id], target.ownerDocument.timeline);

            this.#animations[target.animation_id].play();

            this.#callbacks[target.animation_id] = () => {
                if(AnimationsComponent.debug){ PipUI.Logger.info('[Animations] Animation '+name+' complete'); }

                if(typeof finishCallback == 'function'){
                    finishCallback(target);
                }

                if(typeof completeCallback == 'function'){ completeCallback(target); }

                this.#animations[target.animation_id].removeEventListener('finish', this.#callbacks[target.animation_id]);

                this.#callbacks[target.animation_id] = null;

                this.#animations[target.animation_id] = null;

                this.#effects[target.animation_id] = null;
            }

            this.#animations[target.animation_id].addEventListener("finish", this.#callbacks[target.animation_id]);
        }

        return this;
    }



    /**
     * @param {object} options
     *
     * @param {array} keyframes
     *
     * @param {function|undefined} complete
     * */
    animate(options, keyframes, complete){
        return this.#run('animate', () => keyframes, options, null, complete);
    }



    /**
     * @param {object} options
     *
     * @param {function|undefined} complete
     * */
    fadeIn(options, complete){
        return this.#run('fadeIn', target => {
            let styles = PipUI.style(target, ['display', 'opacity', 'visibility']);

            PipUI.style(target, {
                display: styles.display == 'none' ? 'block' : null,
                visibility: styles.visibility == 'hidden' ? 'visible' : null,
            });

            return [{opacity: 0}, {opacity: styles.opacity}];
        }, options, null, complete);
    }



    /**
     * @param {object} options
     *
     * @param {function|undefined} complete
     * */
    fadeOut(options, complete){
        return this.#run('fadeOut', () => [{opacity: 0}], options, target => {
            PipUI.style(target, {display: 'none'});
        }, complete);
    }



    /**
     * @param {object} options
     *
     * @param {function|undefined} complete
     * */
    slideDown(options, complete){

        return this.#run('slideDown', target => {
            let styles = PipUI.style(target, ['height', 'display', 'min-height', 'visibility', 'padding-top', 'padding-bottom', 'margin-top', 'margin-bottom', 'border-width']);

            PipUI.style(target, {
                display: styles.display == 'none' ? 'block' : null,
                visibility: styles.visibility == 'hidden' ? 'visible' : null,
                overflow: 'hidden'
            });

            return [
                {height: 0, minHeight: 0, paddingTop: 0, paddingBottom: 0, marginTop: 0, marginBottom: 0, borderWidth: 0},
                {height: target.offsetHeight+'px', minHeight: styles['min-height'], paddingTop: styles['padding-top'], paddingBottom: styles['padding-bottom'], marginTop: styles['margin-top'], marginBottom: styles['margin-bottom'], borderWidth: styles['border-width']}
            ];
        }, options, target => {
            PipUI.style(target, {overflow: null});
        }, complete);
    }



    /**
     * @param {object} options
     *
     * @param {function|undefined} complete
     * */
    slideUp(options, complete){

        return this.#run('slideUp', target => {
            PipUI.style(target, {overflow: 'hidden', width: target.offsetWidth+'px'});

            return [
                {height: target.offsetHeight+'px'},
                {paddingTop: 0, height: 0, minHeight: 0, paddingBottom: 0, marginTop: 0, marginBottom: 0, borderWidth: 0}
            ]
        }, options, target => {
            PipUI.style(target, {display: 'none', width: null, overflow: null});
        }, complete);
    }



    /**
     * @param {object} options
     *
     * @param {function|undefined} complete
     * */
    slideLeft(options, complete){
        return this.#run('slideLeft', target => {
            PipUI.style(target, {overflow: 'hidden', height: target.offsetHeight+'px'});

            return [
                {width: target.offsetWidth+'px'},
                {paddingLeft: 0, width: 0, minWidth: 0, paddingRight: 0, marginLeft: 0, marginRight: 0, borderWidth: 0},
            ];
        }, options, target => {
            PipUI.style(target, {display: 'none', height: null, overflow: null});
        }, complete);
    }



    /**
     * @param {object} options
     *
     * @param {function|undefined} complete
     * */
    slideRight(options, complete){

        return this.#run('slideRight', target => {
            let styles = PipUI.style(target, ['width', 'height', 'min-width', 'visibility', 'display', 'padding-left', 'padding-right', 'margin-left', 'margin-right', 'border-width']);

            PipUI.style(target, {
                display: styles.display == 'none' ? 'block' : null,
                visibility: styles.visibility == 'hidden' ? 'visible' : null,
                overflow: 'hidden'
            });

            PipUI.style(target, 'height', target.offsetHeight+'px');

            return [
                {paddingLeft: 0, width: 0, minWidth: 0, paddingRight: 0, marginLeft: 0, marginRight: 0, borderWidth: 0},
                {width: target.offsetWidth+'px', minWidth: styles['min-width'], paddingLeft: styles['padding-left'], paddingRight: styles['padding-right'], marginLeft: styles['margin-left'], marginRight: styles['margin-right'], borderWidth: styles['border-width']}
            ]
        }, options, target => {
            PipUI.style(target, {height: null, overflow: null});
        }, complete);
    }



    /**
     * @param {object} options
     *
     * @param {function|undefined} complete
     * */
    hide(options, complete){

        return this.#run('hide', target => {
            PipUI.style(target, {overflow: 'hidden'});

            return [
                {width: target.offsetWidth+'px', height: target.offsetHeight+'px'},
                {padding: 0, fontSize: 0, width: 0, height: 0, minWidth: 0, minHeight: 0, opacity: 0, margin: 0, borderWidth: 0},
            ];
        }, options, target => {
            PipUI.style(target, {display: 'none', overflow: null});
        }, complete);
    }



    /**
     * @param {object} options
     *
     * @param {function|undefined} complete
     * */
    show(options, complete){

        this.#run('show', target => {

            PipUI.style(target, {
                display: PipUI.style(target, 'display') == 'none' ? 'block' : null,
                visibility: 'visible',
                overflow: 'hidden'
            });

            let styles = PipUI.style(target, ['opacity', 'min-width', 'min-height', 'visibility', 'font-size', 'display', 'padding', 'margin', 'border-width']);

            return [
                {width: 0, height: 0, opacity: 0, fontSize: 0, minWidth: 0, minHeight: 0, margin: 0, padding: 0, borderWidth: 0},
                {
                    width: target.offsetWidth+'px',
                    height: target.offsetHeight+'px',
                    opacity: styles.opacity,
                    fontSize: styles['font-size'],
                    minWidth: styles['min-width'],
                    minHeight: styles['min-height'],
                    padding: styles['padding'],
                    margin: styles['margin'],
                    borderWidth: styles['border-width']
                }
            ];
        }, options, target => {
            PipUI.style(target, {
                display: null,
                visibility: null,
                overflow: null
            });
        }, complete);
    }
}

if(typeof PipUI != 'undefined'){
    PipUI.addComponent('Animation', AnimationComponent.VERSION);
    PipUI.required('Animation', 'Logger', '1.0.0', '>=');
    /** @return {AnimationComponent} */
    PipUI.Animation = AnimationComponent;
}