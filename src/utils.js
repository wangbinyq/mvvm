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