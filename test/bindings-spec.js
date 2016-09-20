import { Binding } from '../src/bindings'

describe('Binding', () => {
    it('sync model change to dom', () => {
        const model = {text: 200}
        const el = document.createElement('div')
        const binding = new Binding(el, function(el, value) {
            el.innerHTML = value
        }, 'text', model)
        binding.bind()
        expect(el.innerHTML).toBe('200')
        binding.value = 100
        expect(el.innerHTML).toBe('100')
        model.text = 12
        expect(el.innerHTML).toBe('12')              
    })

    it('update dom change to model', () => {
        const binder = {
            bind(el) {
                el.onchange = this.update
            },
            unbind() {
                el.onchange = null
            },
            sync(el, value) {
                el.checked = value
            },
            value(el) {
                return el.checked
            }
        }
        const model = {enable: true}
        const el = document.createElement('input')
        el.type = 'checkbox'
        const binding = new Binding(el, binder, 'enable', model)
        binding.bind()
        expect(el.checked).toBe(true)
        el.checked = false
        el.onchange()
        expect(model.enable).toBe(false)

        binding.unbind()
        el.checked = true
        expect(el.onchange).toBe(null)
        expect(binding.observer)
    })
})