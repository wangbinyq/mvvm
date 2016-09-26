import _ from 'lodash'


function parse(expr) {

}


export default class Watcher {
    constructor(vm, exprOrFn, cb) {
        this.vm = vm
        this.model = this.vm.model
        this.cb = cb
        if(_.isFunction(exprOrFn)) {
            this.getter = exprOrFn
            this.setter = null
        } else {
            const res = parse(exprOrFn)
            this.getter = res.getter
            this.setter = res.setter
        }
    }
}