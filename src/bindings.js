import {isFunction, defined} from './utils'
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
        this.model = model

        this.bind = this.bind.bind(this)
        this.unbind = this.unbind.bind(this)
        this.sync = this.sync.bind(this)
        this.update = this.update.bind(this)
    }

    bind() {
        if(defined(this.binder.bind)) {
            this.binder.bind.call(this, this.el)
        }
        this.observer = observe(this.model, this.keypath, this.sync)
        this.sync()
    }

    unbind() {
        if(defined(this.observer)) {
            this.observer.unobserve()
        }
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
        if(defined(this.binder.value)) {
            this.value = this.binder.value(this.el)
        }
    }

    get value() {
        if(defined(this.observer)) {
            return this.observer.value
        }
    }

    set value(newValue) {
        if(defined(this.observer)) {
            this.observer.value = newValue
        }
    }
}

export class TextBinding extends Binding {
    constructor(el, binder, keypath, model) {
        super(el, binder, keypath, model)

        this.keypath = keypath
        this.formatterObservers = {}

        this.binder = {
            sync: (el, value) => {
                el.innerText = defined(value) ? value : ''
            }
        }

        this.sync = this.sync.bind(this)
    }

    // Wrap the call to `sync` to avoid function context issues.
    sync() {
        super.sync()
    }
}

export class ComponentBinding extends Binding {

}