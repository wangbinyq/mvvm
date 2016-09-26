import Observer from './observer'

import _ from 'lodash'

function defined(obj) {
    return !_.isUndefined(obj) && !_.isNull(obj)
}

export default class Binding {
    constructor(vm, el, key, binder, type) {
        this.vm = vm
        this.el = el
        this.key = key
        this.binder = binder
        this.type = type
        if(_.isFunction(binder)) {
            this.binder.sync = binder
        }

        this.bind = this.bind.bind(this)
        this.sync = this.sync.bind(this)
        this.update = this.update.bind(this)

        this.parsekey()
        this.observer = new Observer(this.vm.model, this.key, this.sync)
    }

    parsekey() {
        this.args = this.key.split(':').map((k) => k.trim())
        this.key = this.args.shift()
    }

    bind() {
        if(defined(this.binder.bind)) {
            this.binder.bind.call(this, this.el)
        }
        this.sync()
    }

    unbind() {
        if(defined(this.observer)) {
            this.observer.unobserve()
        }
        if(defined(this.binder.unbind)) {
            this.binder.unbind(this.this.el)
        }
    }

    sync() {
        if(defined(this.observer) && _.isFunction(this.binder.sync)) {
            this.binder.sync.call(this, this.el, this.observer.value)
        }
    }

    update() {
        if(defined(this.observer) && _.isFunction(this.binder.value)) {
            this.observer.value = this.binder.value.call(this, this.el)
        }
    }
}