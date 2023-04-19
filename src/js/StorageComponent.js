class StorageComponent {
    static VERSION = '1.0.0';

    static #storage = {}

    /**
     * @param {string} key
     *
     * @param {string|undefined} subkey
     *
     * @return {any}
     * */
    static get(key, subkey) {

        if(typeof subkey != 'undefined'){
            if(typeof this.#storage[key] == 'undefined'){ return; }

            return this.#storage[key][subkey];
        }

        return this.#storage[key];
    }

    /**
     * @param {string} key
     *
     * @param {any} value
     *
     * @param {string|undefined} subkey
     * */
    static set(key, value, subkey) {

        if(typeof subkey != 'undefined'){
            if(typeof this.#storage[key] == 'undefined'){
                this.#storage[key] = {};
            }

            this.#storage[key][subkey] = value;
        }else{
            this.#storage[key] = value;
        }
    }

    /**
     * @param {string} key
     *
     * @param {string|undefined} subkey
     * */
    static delete(key, subkey) {
        if(typeof this.#storage[key] == 'undefined'){ return; }

        if(typeof subkey != 'undefined'){
            if(typeof this.#storage[key][subkey] != 'undefined'){
                delete this.#storage[key][subkey];
            }

            return;
        }

        delete this.#storage[key];
    }

    /**
     * @return {object}
     * */
    static list() {
        return this.#storage;
    }
}

if(typeof PipUI != 'undefined'){
    PipUI.addComponent('Storage', StorageComponent.VERSION);
    /** @return {StorageComponent} */
    PipUI.Storage = StorageComponent;
}