import { defined, bindEvent, unbindEvent, getString } from './utils'

const CHANGE_EVENT = 'change'

export default {
    text(el, value) {
        el.innerText = defined(value) ? value : ''
    },

    html(el, value) {
        el.innerHTML = defined(value) ? value : ''
    },

    show(el, value) {
        el.style.display = value ? '' : 'none'
    },

    hide(el, value) {
        el.style.display = value ? 'none' : ''
    },

    enable(el, value) {
        el.disabled = !value
    },

    disabled(el, value) {
        el.disabled = !!value
    },

    checked: {
        bind(el) {
            bindEvent(el, CHANGE_EVENT, this.update)
        },

        unbind(el) {
            unbindEvent(el, CHANGE_EVENT, this.update)
        },

        sync(el, value) {
            if(el.type === 'radio') {
                el.checked = getString(el.value) === getString(value)
            } else {
                el.checked = !!value
            }
        }
    },

    unchecked: {
        bind(el) {
            bindEvent(el, CHANGE_EVENT, this.update)
        },

        unbind(el) {
            unbindEvent(el, CHANGE_EVENT, this.update)
        },

        sync(el, value) {
            if(el.type === 'radio') {
                el.checked = getString(el.value) !== getString(value)
            } else {
                el.checked = !value
            }
        }        
    },

    value: {
        bind: function(el) {
            if (!(el.tagName === 'INPUT' && el.type === 'radio')) {
                this.event = el.tagName === 'SELECT' ? 'change' : 'input'

                bindEvent(el, this.event, this.publish)
            }
        },

        unbind: function(el) {
            if (!(el.tagName === 'INPUT' && el.type === 'radio')) {
                unbindEvent(el, this.event, this.publish)
            }
        },

        sync: function(el, value) {
            if (el.tagName === 'INPUT' && el.type === 'radio') {
                el.setAttribute('value', value)
            } else {
                if (el.type === 'select-multiple') {
                    if (value instanceof Array) {
                        Array.from(el.options).forEach(option => {
                            option.selected = value.indexOf(option.value) > -1
                        })
                    }
                } else if (getString(value) !== getString(el.value)) {
                    el.value = defined(value) ? value : ''
                }
            }
        }        
    },

    if: {

    }
}