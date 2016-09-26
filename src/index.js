import _ from 'lodash'
import Binding from './binding'

function defined(obj) {
    return !_.isUndefined(obj) && !_.isNull(obj)
}



export default class ViewModel {
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
            const args = this.args.slice(1).map((key) => this.vm.model[key])
            el.addEventListener(this.args[0], (e) => { 
                args.unshift(e)
                this.observer.value.apply(this.vm.model, args) 
            })
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