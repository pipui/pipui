class LoggerComponent {
    static VERSION = '1.0.0';


    /**
     * @param {string} message
     *
     * @param {any} args
     * */
    static info = (message, ...args) => {
        console.info('[PipUI] '+message);

        for(let i = 0; i < args.length; i++) {
            console.info(args[i]);
        }
    }


    /**
     * @param {string} message
     *
     * @param {any} args
     * */
    static warn = (message, ...args) => {
        console.warn('[PipUI] '+message);

        for(let i = 0; i < args.length; i++) {
            console.warn(args[i]);
        }
    }


    /**
     * @param {string} message
     *
     * @param {any} args
     * */
    static error = (message, ...args) => {
        console.error('[PipUI] '+message);

        for(let i = 0; i < args.length; i++) {
            console.error(args[i]);
        }
    }


    /**
     * @param {string} message
     *
     * @param {any} args
     * */
    static log = (message, ...args) => {
        console.log('[PipUI] '+message);

        for(let i = 0; i < args.length; i++) {
            console.log(args[i]);
        }
    }
}

if(typeof PipUI != 'undefined'){
    PipUI.addComponent('Logger', LoggerComponent.VERSION);
    /** @return {LoggerComponent} */
    PipUI.Logger = LoggerComponent;
}