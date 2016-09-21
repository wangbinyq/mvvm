import binders from './binders'
import {Binding, TextBinding} from './bindings'
import {defined} from './utils'

function parseTemplate() {

}

export default class ViewModel {
    constructor(el, options) {
        this.els = el instanceof Array ? el : [el]
        for(let key in options) {
            this[key] = options[key]
        }
        this.templateDelimiters = this.templateDelimiters || ['{', '}']
        this.model = this.model || {}
        
        this.build()
    }

    build() {
        this.bindings = []

        let elements = this.els, i, len
        for(i = 0, len = elements.length; i < len; i++) {
            this.complie(elements[i])
        }
    }

    compile(el) {
        let block = false
        if(el.nodeType === 3) {
            let delimiters = this.templateDelimiters
            if(delimiters) {

            }
        } else if(el.nodeType === 1) {
            block = this.traverse(el)
        }

        if(!block) {
            el.childNodes.forEach((childEl) => {
                this.compile(childEl)
            })
        }
    }

    traverse(el) {
        let bindingRegExp = new RegExp(`^${this.prefix}-`)
        let block = el.nodeName === 'SCRIPT' || el.nodeName === 'STYLE'
        let attributes
        
        Array.prototype.slice.call(el.attributes).forEach((attribute) => {
            if(bindingRegExp.test(attribute.name)) {
                let type = attribute.name.replace(bindingRegExp, '')
                let binder = this.binders[type]
                if(!binder) {
                    Object.keys(this.binders).forEach(identifier => {
                        let value = this.binders[identifier]

                        if(identifier !== '*' && identifier.indexOf('*') > -1) {
                            let regexp = new RegExp(`^${identifier.replace(/\*/g, '.+')}$`)

                            if (regexp.test(type)) {
                                binder = value
                            }
                        }
                    })
                }

                if(!defined(binder)) {
                    binder = this.binders['*']
                }

                if(binder.block) {
                    block = true
                    attributes = [attribute]
                }
            }
        })

        attributes = attributes || Array.prototype.slice.call(el.attributes)

        attributes.forEach((attribute) => {
            if(bindingRegExp.test(attribute.name)) {
                let type = attribute.name.replace(bindingRegExp, '')
                this.buildBinding(Binding, el, type, attribute.value)
            }
        })

        if(!block) {
            let type = el.nodeName.toLowerCase()

            if(this.components[type] && !el._bound) {
                // TODO ComponentBinding
            }
        }

        return block
    }
}

ViewModel.binders = binders
ViewModel.prefix = 'x'