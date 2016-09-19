import {
    isObject,
    isArray
} from './utils'

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
        this.target = obj
        this.target.$observer = this.target.$observer || this

        const $observer = this.target.$observer
        $observer.$$props = $observer.$$props || {}
        $observer.$$callbacks = $observer.$$callbacks || {}

        if (isArray(obj) && callback === undefined) {
            $observer.observeArray(obj, keypath.bind(obj))
        } else {
            $observer.observe(obj, keypath, callback.bind(obj))
        }

        return $observer
    }

    observe(target, keypath, callback) {
        const $observer = target.$observer
        let prop
        if (keypath.indexOf('.') != -1) {
            prop = keypath.split('.')
        } else {
            if ($observer.$$callbacks[keypath]) {
                $observer.$$callbacks[keypath].push(callback)
            } else {
                $observer.$$callbacks[keypath] = [callback]
            }
            prop = [keypath]
        }

        const key = prop[0]
        $observer.$$callbacks[key] = $observer.$$callbacks[key] || []
        const value = $observer.$$props[key] = target[key]
        observe(value, prop.slice(1).join('.'), callback)

        Object.defineProperty(target, key, {
            get() {
                return $observer.$$props[key]
            },
            set(newValue) {
                const value = $observer.$$props[key]
                if (newValue != value) {
                    $observer.$$props[key] = newValue
                    observe(newValue, prop.slice(1).join(','), callback)
                    $observer.$$callbacks[key].forEach((callback) => {
                        callback(newValue, value)
                    })
                }
            }
        })
        $observer.$$callbacks[key].forEach((callback) => {
            callback(value, value)
        })
    }

    observeArray(target, callback) {
        ARRAY_METHODS.forEach((method) => {
            target[method] = (...args) => {
                const oldValue = target.slice(0)
                Array.prototype[method].apply(target, args)
                callback(target, oldValue)
            }
        })
        callback(target, target)
    }
}

export default function observe(obj, keypath, callback) {
    if (isObject(obj)) {
        return new Observer(obj, keypath, callback)
    }
}