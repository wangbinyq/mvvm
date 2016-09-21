export function isArray(obj) {
    return Object.prototype.toString.call(obj) === '[object Array]'
}

export function isObject(obj) {
    return typeof obj === 'object'
}

export function isInArray(arr, item) {
    return isArray(arr) && arr.indexOf(item) != -1
}


export function isFunction(obj) {
    return Object.prototype.toString.call(obj) === '[object Function]'    
}

export function defined(obj) {
    return !(obj === undefined || obj === null)
}

export function bindEvent(el, event, cb) {
    el.addEventListener(event, cb)
}

export function unbindEvent(el, event, cb) {
    el.removeEventListener(event, cb)
}

export function getString(value) {
    return defined(value) ? value.toString() : undefined
}