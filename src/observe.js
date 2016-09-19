import {isObject, isArray} from './utils'

class Observer {
    constructor(obj, keypath, callback) {
        this.target = obj
        this.target.$observer = this
        this.$$observeProps = {}
        this.$$callbacks = {}
        this.observe(keypath, callback)
    }

    observe(keypath, callback) {
        let path, refCallback = callback.bind(this.target)
        if(keypath.indexOf('.') != -1) {
            refCallback = null
            path = keypath.split('.')
        } else {
            path = [keypath]
        }

        const $observer = this
        const target = $observer.target
        const key = path[0]
        
        const value = $observer.$$observeProps[key] = target[key]
        observe(value, path.slice(1).join('.'), callback)
        Object.defineProperty(target, key, {
            get() {
                return $observer.$$observeProps[key]
            },
            set(newValue) {
                const value = $observer.$$observeProps[key]
                if(newValue != value) {
                    $observer.$$observeProps[key] = newValue
                    observe(newValue, path.slice(1).join('.'), callback)
                    if(refCallback) {
                        refCallback(newValue, value)
                    }
                }
            }
        })
        if(refCallback) {
            refCallback(value, value)
        }
    }
}

export default function observe(obj, keypath, callback) {
    if(isObject(obj)) {
        if(obj.$observer) {
            obj.$observer.observe(keypath, callback)
            return obj.$observer
        }
        return new Observer(obj, keypath, callback)
    }
}