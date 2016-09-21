import binders from '../src/binders'
import {Binding} from '../src/bindings'

describe('binders', () => {
    it('can bind text', () => {
        const el = document.createElement('div'), obj = {}
        const binding = new Binding(el, binders.text, 'value', obj)
        binding.bind()
        expect(el.innerText).toBe('')
        obj.value = 'test'
        expect(el.innerText).toBe('test')
    })

    it('can bind html', () => {
        const el = document.createElement('div'), obj = {}
        const binding = new Binding(el, binders.html, 'value', obj)
        binding.bind()
        expect(el.innerHTML).toBe('')
        obj.value = '<test />'
        expect(el.innerHTML).toBe('<test></test>')
    })
})