import { Binding } from '../src/bindings'

describe('Binding', () => {
    it('sync model change to dom', () => {
        const model = {text: 'Hello world'}
        const el = document.createElement('div')
        const binding = new Binding(el, function(el, value) {
            el.innerHTML = value
        }, 'text', model)
        binding.bind()
        expect(el.innerHTML).toBe('Hello world')
        binding.value = 100
        expect(el.innerHTML).toBe('100')
        model.text = 12
        expect(el.innerHTML).toBe('12')              
    })

    it('update dom change to model', () => {
        const model = {enable: true}
        const el = document.createElement('input')
        el.type = 'checkbox'
    })
})