function parseTemplate() {

}

export default class ViewModel {
    constructor(el, options) {
        this.els = el instanceof Array ? el : [el]
        this.options = options
        this.templateDelimiters = this.options.templateDelimiters || ['{', '}']
        this.model = this.options.model || {}
        
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
}