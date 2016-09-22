import _ from 'lodash'

function defined(obj) {
    return !_.isUndefined(obj) && !_.isNull(obj)
}

class Observer {
    constructor(obj, key, cb) {
        this.obj = obj
        this.key = key
        this.cb = cb
        this.obj.$$callbacks = this.obj.$$callbacks || {}
        this.obj.$$callbacks[this.key] = this.obj.$$callbacks[this.key] || []

        this.observe()
    }

    observe() {
        const observer = this
        const obj = observer.obj
        const key = observer.key
        const callbacks = obj.$$callbacks[key] 
        let value = obj[key]

        const desc = Object.getOwnPropertyDescriptor(obj, key)
        if(!(desc && (desc.get || desc.set))) {
            Object.defineProperty(obj, key, {
                get() {
                    return value
                },
                set(newValue) {
                    if(value !== newValue) {
                        value = newValue
                        
                        callbacks.forEach((cb) => {
                            cb()
                        })
                    }
                }
            })
        }
        if(callbacks.indexOf(observer.cb) === -1) {
            callbacks.push(observer.cb)
        }
    }

    unobserve() {
        if(defined(this.obj.$$callbacks[this.key])) {
            _.remove(this.obj.$$callbacks[this.key], this.cb)
        }
    }

    get value() {
        return this.obj[this.key]
    }

    set value(newValue) {
        this.obj[this.key] = newValue
    }
}

class Binding {
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

        this.observer = new Observer(this.vm.model, this.key, this.sync)
    }

    bind() {
        if(defined(this.binder.bind)) {
            this.binder.bind.call(this, this.el)
        }
        this.sync()
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

class ViewModel {
    constructor(el, model) {
        this.el = el
        this.model = model
        this.bindings = []

        this.compile(this.el)

        this.bind()
    }

    compile(el) {
        if(el.nodeType !== 1) {
            return
        }

        const dataset = el.dataset
        for(let data in dataset) {
            let binder = ViewModel.binders[data]
            let key = dataset[data]

            if(binder === undefined) {
                binder = ViewModel.binders['*']
            }

            if(defined(binder)) {
                this.bindings.push(new Binding(this, el, key, binder, data))
            }

        }

        el.childNodes.forEach((childEl) => {
            this.compile(childEl)
        })
    }

    bind() {
        this.bindings.sort((a, b) => {
            let aPriority = defined(a.binder) ? (a.binder.priority || 0) : 0
            let bPriority = defined(b.binder) ? (b.binder.priority || 0) : 0
            return bPriority - aPriority
        })
        this.bindings.forEach(binding => {
            binding.bind()
        })
    }
}

ViewModel.binders = {
    value: {
        bind(el) {
            el.addEventListener('change', this.update)
        },

        sync(el, value) {
            if(el.type === 'checkbox') {
                el.checked = !!value
            } else {
                el.value = value
            }  
        },

        value(el) {
            if(el.type === 'checkbox') {
                return el.checked
            } else {
                return el.value
            } 
        }
    },

    html: {
        sync(el, value) {
            el.innerHTML = value
        }
    },

    show: {
        priority: 2000,
        sync(el, value) {
            el.style.display = value ? '' : 'none'
        }
    },

    each: {
        
    },

    '*': {
        sync(el, value) {
            if(defined(value)) {
                el.setAttribute(this.type, value)
            } else {
                el.removeAttribute(this.type)
            }
        }
    }
}

const obj = {text: 'Hello', show: false}
new ViewModel(document.getElementById('vm'), obj)
obj.text += ' World'