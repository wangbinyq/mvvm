import {isFunction, isObject} from './utils'
import observe from './observe'

export class Binding {

    constructor(el, binder, keypath, model) {
        this.el = el
        if(isFunction(binder)) {
            this.binder = {
                sync: binder
            }
        } else {
            this.binder = binder
        }
        this.keypath = keypath
        this.keys = this.keypath.split('.')
        this.model = model
        this.bind = this.bind.bind(this)
        this.unbind = this.unbind.bind(this)
        this.sync = this.sync.bind(this)
        this.update = this.update.bind(this)
    }

    bind() {
        if(this.binder.bind) {
            this.binder.bind.call(this, this.el)
        }
        observe(this.model, this.keypath, this.sync)
    }

    unbind() {
        if(this.binder.unbind) {
            this.binder.unbind.call(this, this.el)
        }
    }

    sync() {
        if(this.binder.sync) {
            this.binder.sync.call(this, this.el, this.value)
        }
    }

    update() {
        if(this.binder.update) {
            this.binder.update.call(this, this.el)
        }
    }

    get value() {
        let res = this.model
        for(let i=0; i<this.keys.length; i++) {
            res = res[this.keys[i]]
            if(res === undefined) {
                break
            }
        }
        return res
    }

    set value(value) {
        let res = this.model
        let key = this.keys[this.keys.length - 1]
        for(let i=0; i<this.keys.length-1; i++) {
            let key = this.keys[i]
            if(res.hasOwnProperty(key)) {
                res = res[key] = {}
            }
        }
        res[key] = value
    }
}

export class TextBinding {

}

export class ComponentBinding {

}