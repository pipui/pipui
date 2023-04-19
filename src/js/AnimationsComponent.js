class AnimationsComponent {
    static VERSION = '1.0.0';

    static debug = false;

    static #run = (name, element, keyframes, finishAnimation, options, complete) => {
        if(this.debug){ PipUI.Logger.info('Starting '+name+' animation'); }

        let animation = element.animate(keyframes, options);

        let callback = () => {
            if(AnimationsComponent.debug){ PipUI.Logger.info('Animation '+name+' complete'); }

            finishAnimation();

            if(typeof complete == 'function'){ complete(element); }

            animation.removeEventListener('finish', callback);
        };

        animation.addEventListener('finish', callback, false);
    }

    static #before = (element) => {
        let animations = element.getAnimations();

        for(let i = 0; i < animations.length; i++){
            animations[i].cancel();
        }
    }

    /**
     * @param {HTMLElement} element
     *
     * @param {object} options
     *
     * @param {function|undefined} complete
     * */
    static fadeOut = (element, options, complete) => {

        this.#before(element);

        this.#run('fadeOut', element, [{opacity: 0}], () => {
            PipUI.style(element, {display: 'none', opacity: null});
        }, options, complete);
    }

    /**
     * @param {HTMLElement} element
     *
     * @param {object} options
     *
     * @param {function|undefined} complete
     * */
    static fadeIn = (element, options, complete) => {

        this.#before(element);

        let styles = PipUI.style(element, ['display', 'opacity', 'visibility']);

        PipUI.style(element, {
            display: styles.display == 'none' ? 'block' : null,
            visibility: styles.visibility == 'hidden' ? 'visible' : null,
        });

        this.#run('fadeIn', element, [{opacity: 0}, {opacity: styles.opacity}], () => {
            PipUI.style(element, {opacity: null});
        }, options, complete);
    }

    /**
     * @param {HTMLElement} element
     *
     * @param {object} options
     *
     * @param {function|undefined} complete
     * */
    static slideUp = (element, options, complete) => {

        this.#before(element);

        PipUI.style(element, {overflow: 'hidden'});

        this.#run('slideUp', element, [
            {height: element.offsetHeight+'px'},
            {paddingTop: 0, height: 0, paddingBottom: 0, marginTop: 0, marginBottom: 0, borderWidth: 0},
        ], () => {
            PipUI.style(element, {display: 'none', height: null, overflow: null, marginTop: null, marginBottom: null, paddingTop: null, paddingBottom: null, borderWidth: null});
        }, options, complete);
    }

    /**
     * @param {HTMLElement} element
     *
     * @param {object} options
     *
     * @param {function|undefined} complete
     * */
    static slideDown = (element, options, complete) => {

        this.#before(element);

        let styles = PipUI.style(element, ['height', 'display', 'visibility', 'padding-top', 'padding-bottom', 'margin-top', 'margin-bottom', 'border-width']);

        PipUI.style(element, {
            display: styles.display == 'none' ? 'block' : null,
            visibility: styles.visibility == 'hidden' ? 'visible' : null,
            overflow: 'hidden'
        });

        let height = element.offsetHeight;

        PipUI.style(element, {
            height: 0,
            paddingTop: 0,
            paddingBottom: 0,
            marginTop: 0,
            marginBottom: 0,
            borderWidth: 0
        });

        this.#run('slideDown', element, [
            {height: height+'px', paddingTop: styles['padding-top'], paddingBottom: styles['padding-bottom'], marginTop: styles['margin-top'], marginBottom: styles['margin-bottom'], borderWidth: styles['border-width']}
        ], () => {
            PipUI.style(element, {height: null, overflow: null, marginTop: null, marginBottom: null, paddingTop: null, paddingBottom: null, borderWidth: null});
        }, options, complete);
    }

    /**
     * @param {HTMLElement} element
     *
     * @param {object} options
     *
     * @param {function|undefined} complete
     * */
    static slideLeft = (element, options, complete) => {

        this.#before(element);

        PipUI.style(element, {overflow: 'hidden', height: element.offsetHeight+'px'});

        this.#run('slideLeft', element, [
            {width: element.offsetWidth+'px'},
            {paddingLeft: 0, width: 0, paddingRight: 0, marginLeft: 0, marginRight: 0, borderWidth: 0},
        ], () => {
            PipUI.style(element, {display: 'none', width: null, height: null, overflow: null, marginLeft: null, marginRight: null, paddingLeft: null, paddingRight: null, borderWidth: null});
        }, options, complete);
    }

    /**
     * @param {HTMLElement} element
     *
     * @param {object} options
     *
     * @param {function|undefined} complete
     * */
    static slideRight = (element, options, complete) => {

        this.#before(element);

        let styles = PipUI.style(element, ['width', 'height', 'visibility', 'display', 'padding-left', 'padding-right', 'margin-left', 'margin-right', 'border-width']);

        PipUI.style(element, {
            display: styles.display == 'none' ? 'block' : null,
            visibility: 'hidden',
            paddingLeft: 0,
            paddingRight: 0,
            marginLeft: 0,
            marginRight: 0,
            borderWidth: 0,
            overflow: 'hidden'
        });

        let width = element.offsetWidth;

        let height = element.offsetHeight;

        PipUI.style(element, {width: 0, height: height+'px', visibility: styles.visibility == 'hidden' ? 'visible' : null});

        this.#run('slideRight', element, [
            {width: width+'px', paddingLeft: styles['padding-left'], paddingRight: styles['padding-right'], marginLeft: styles['margin-left'], marginRight: styles['margin-right'], borderWidth: styles['border-width']}
        ], () => {
            PipUI.style(element, {height: null, width: null, overflow: null, marginLeft: null, marginRight: null, paddingLeft: null, paddingRight: null, borderWidth: null});
        }, options, complete);
    }

    /**
     * @param {HTMLElement} element
     *
     * @param {object} options
     *
     * @param {function|undefined} complete
     * */
    static hide = (element, options, complete) => {

        this.#before(element);

        PipUI.style(element, {overflow: 'hidden', height: element.offsetHeight+'px', width: element.offsetWidth+'px'});

        this.#run('hide', element, [
            {width: element.offsetWidth+'px', height: element.offsetHeight+'px'},
            {padding: 0, fontSize: 0, width: 0, height: 0, opacity: 0, margin: 0, borderWidth: 0},
        ], () => {
            PipUI.style(element, {display: 'none', width: null, height: null, fontSize: null, opacity: null, overflow: null, margin: null, padding: null, borderWidth: null});
        }, options, complete);
    }

    /**
     * @param {HTMLElement} element
     *
     * @param {object} options
     *
     * @param {function|undefined} complete
     * */
    static show = (element, options, complete) => {

        this.#before(element);

        let styles = PipUI.style(element, ['width', 'height', 'opacity', 'visibility', 'font-size', 'display', 'padding-left', 'padding-right', 'margin-left', 'margin-right', 'padding-top', 'padding-bottom', 'margin-top', 'margin-bottom', 'border-width']);

        PipUI.style(element, {
            display: styles.display == 'none' ? 'block' : null,
            visibility: 'hidden',
            overflow: 'hidden'
        });

        let width = element.offsetWidth;

        let height = element.offsetHeight;

        PipUI.style(element, {width: 0, height: 0, opacity: 0, padding: 0, margin: 0, fontSize: 0, borderWidth: 0, visibility: styles.visibility == 'hidden' ? 'visible' : null});

        this.#run('show', element, [
            {
                width: width+'px',
                height: height+'px',
                opacity: styles.opacity,
                fontSize: styles['font-size'],
                paddingLeft: styles['padding-left'],
                paddingRight: styles['padding-right'],
                marginLeft: styles['margin-left'],
                marginRight: styles['margin-right'],
                paddingTop: styles['padding-top'],
                paddingBottom: styles['padding-bottom'],
                marginTop: styles['margin-top'],
                marginBottom: styles['margin-bottom'],
                borderWidth: styles['border-width']
            }
        ], () => {
            PipUI.style(element, {
                height: null,
                width: null,
                overflow: null,
                opacity: null,
                fontSize: null,
                marginLeft: null,
                marginRight: null,
                paddingLeft: null,
                paddingRight: null,
                marginTop: null,
                marginBottom: null,
                paddingTop: null,
                paddingBottom: null,
                borderWidth: null
            });
        }, options, complete);
    }
}

if(typeof PipUI != 'undefined'){
    PipUI.addComponent('Animations', AnimationsComponent.VERSION);
    PipUI.required('Animations', 'Logger', '1.0.0', '>=');
    /** @return {AnimationsComponent} */
    PipUI.Animations = AnimationsComponent;
}