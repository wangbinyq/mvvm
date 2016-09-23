import _ from 'lodash'

function defined(obj) {
    return !_.isUndefined(obj) && !_.isNull(obj)
}

const ARRAY_METHODS = [
    'push',
    'pop',
    'shift',
    'unshift',
    'sort',
    'reverse',
    'splice'
]

class Observer {
    constructor(obj, keypath, callback) {
        this.obj = obj
        this.keypath = keypath
        this.callback = callback
        this.objectPath = []
        this.update = this.update.bind(this)

        this.tokenize()

        if(this.key && _.isObject(this.target = this.realize())) {
            this.observe(this.key, this.target, this.callback)
        }
    }

    tokenize() {
        this.tokens = this.keypath.split('.')
        this.key = this.tokens.pop()
    }

    observeMutations(obj, key) {
        let mutations = obj[key]
        if(!_.isArray(mutations)) {
            return
        }
        ARRAY_METHODS.forEach((method) => {
            mutations[method] = (...args) => {
                Array.prototype[method].apply(mutations, args)
                if(obj.$callbacks[key]) {
                    obj.$callbacks[key].forEach((cb) => {
                        cb()
                    })
                }
            }
        })
    }

    realize() {
        let current = this.obj, unreached = false, prev
        this.tokens.forEach((token, index) => {
            if(_.isObject(current)) {
                if(typeof this.objectPath[index] !== 'undefined') {
                    if(current !== (prev = this.objectPath[index])) {
                        this.unobserve(token, prev, this.update)
                        this.observe(token, current, this.update)
                        this.objectPath[index] = current
                    }
                } else {
                    this.observe(token, current, this.update)
                    this.objectPath[index] = current
                }
                current = current[token]
            } else {
                if(unreached === false) {
                    unreached = index
                }

                if(prev = this.objectPath[index]) {
                    this.unobserve(token, prev, this.update)
                }
            }
        })

        if(unreached !== false) {
            this.objectPath.splice(unreached)
        }

        return current
    }

    update() {
        let next, oldValue
        if((next = this.realize()) !== this.target) {
            if(_.isObject(this.target)) {
                this.unobserve(this.key, this.target, this.callback)
            }

            if(_.isObject(next)) {
                this.observe(this.key, next, this.callback)
            }

            oldValue = this.value
            this.target = next
            if (_.isFunction(this.value) || this.value !== oldValue) {
                this.callback()
            }
        }
    }

    observe(key, target, callback) {
        target.$callbacks = target.$callbacks || {}
        target.$callbacks[key] = target.$callbacks[key] || []
        let desc = Object.getOwnPropertyDescriptor(target, key)

        if (!(desc && (desc.get || desc.set))) {
            let value = target[key]
            const observer = this
            Object.defineProperty(target, key, {
                get() {
                    return value
                },
                set(newValue) {
                    if(newValue !== value) {
                        value = newValue
                        if(target.$callbacks[key]) {
                            target.$callbacks[key].forEach((cb) => {
                                cb()
                            })
                        }
                        observer.observeMutations(target, key)
                    }
                }
            })
        }

        if(target.$callbacks[key].indexOf(callback) === -1) {
            target.$callbacks[key].push(callback)
        }
        this.observeMutations(target, key)
    }

    unobserve(key, target, callback) {
        if(key === undefined) {
            let obj
            this.tokens.forEach((token, index) => {
                if(obj = this.objectPath[index]) {
                    this.unobserve(token, obj, this.update)
                }
            })
            if(_.isObject(this.target)) {
                this.unobserve(this.key, this.target, this.callback)
            }
        } else {
            if(target.$callbacks && target.$callbacks[key]) {
                const index = target.$callbacks[key].indexOf(callback)
                if(index !== -1) {
                    target.$callbacks[key].splice(index, 1)
                }
            }
        }
    }

    get value() {
        if(_.isObject(this.target)) {
            return this.target[this.key]
        }
        
    }

    set value(newValue) {
        if(_.isObject(this.target)) {
            this.target[this.key] = newValue
        }     
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

class ViewModel {
    constructor(el, model) {
        this.el = el
        this.model = model
        this.bindings = []

        this.compile(this.el)

        this.bind()
    }

    compile(el) {

        let block = false

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
                if(binder.block) {
                    block = true
                }
                this.bindings.push(new Binding(this, el, key, binder))
            }
            el.removeAttribute(`data-${data}`)
        }

        if(!block) {
            el.childNodes.forEach((childEl) => {
                this.compile(childEl)
            })
        }
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

    unbind() {
        this.bindings.forEach(binding => {
            binding.unbind()
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
        block: true,

        bind(el) {
            if(!defined(this.marker)) {
                let attr = this.args[0]
                this.marker = document.createComment(`mvvm - each - ${attr}`)
                this.iterated = []

                el.removeAttribute('data-each')
                el.parentNode.insertBefore(this.marker, el)
                el.parentNode.removeChild(el)
            } else {
                this.iterated.forEach((vm) => {
                    vm.bind()
                })
            }
        },

        unbind(el) {
            if(defined(this.iterated)) {
                this.iterated.forEach((vm) => {
                    vm.unbind()
                })
                this.iterated = []
            }
        },

        sync(el, value) {
            let item = this.args[0]
            let collection = value || []
            
            this.iterated.forEach((vm) => {
                vm.unbind()
                this.marker.parentNode.removeChild(vm.el)
            })
            this.iterated = []

            collection.forEach((model, $index) => {
                let data = {
                    $index,
                    [item]: model,
                    $root: this.vm.model
                }
                let template = el.cloneNode(true)
                let vm = new ViewModel(template, data)
                this.iterated.push(vm)
                this.marker.parentNode.appendChild(template)
            })
        }
    },

    on: {
        bind(el) {
            el.addEventListener(this.args[0], () => { this.observer.value() })
        }
    },

    '*': {
        sync(el, value) {
            if(defined(value)) {
                el.setAttribute(this.args[0], value)
            } else {
                el.removeAttribute(this.args[0])
            }
        }
    }
}


const obj = {
    text: 'Hello', 
    show: false,
    reverse() {
        obj.text = obj.text.split('').reverse().join('')
    },
    obj: {
        arr: [
            'test1',
            'test2',
            'test3'
        ]
    },
    add() {
        obj.obj.arr.push(obj.text)
    }
}
const ob = new Observer(obj, 'a', () => { 
    console.log(obj.a) 
})
obj.a = 'You should see this in console'
ob.unobserve()
obj.a = 'You should not see this in console'

const vm = new ViewModel(document.getElementById('vm'), obj)