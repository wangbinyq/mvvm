import observe from '../src/observe'

describe('observe', () => {
    it('can observe', () => {
        let ob = observe({}, '', () => {})
        expect(ob).toBeDefined()

        ob = undefined
        ob = observe([], '', () => {})
        expect(ob).toBeDefined()

        ob = undefined
        ob = observe('', '', () => {})
        expect(ob).not.toBeDefined() // not observe literal
    })

    it('can watch prop changed', () => {
        let nval, oval, obj = {a: 100}
        observe(obj, 'a', function(newValue, oldValue) {
            nval = newValue
            oval = oldValue
        })
        expect(oval).toBe(100)
        expect(nval).toBe(100)
        obj.a = 102
        expect(nval).toBe(102)
        expect(oval).toBe(100)
    })

    it('can watch nest prop changed', () => {
        let nval, oval, obj = {a: {c: 100}}
        observe(obj, 'a.c', function(newValue, oldValue) {
            nval = newValue
            oval = oldValue
        })
        obj.a.c = 102
        expect(nval).toBe(102)
        expect(oval).toBe(100) 

        obj.a = {c: 20}
        expect(nval).toBe(20)     
        expect(oval).toBe(undefined)     
    })

    it('bind obj of callback', () => {
        let self, obj = {a: {c: 100}}
        const ob1 = observe(obj, 'a', function(newValue, oldValue) {
            self = this
        })
        expect(self).toBe(obj)
    })

    it('return same observe object', () => {
        let anval, aoval, cnval, coval, obj = {a: {c: 100}}
        const ob1 = observe(obj, 'a', function(newValue, oldValue) {
            anval = newValue
            aoval = oldValue
        })
        const ob2 = observe(obj, 'a.c', function(newValue, oldValue){
            cnval = newValue
            coval = oldValue            
        })
        expect(ob2).toBe(ob1)
        expect(anval).toBe(aoval)
        expect(anval).toBe(obj.a)
        expect(cnval).toBe(coval)
        expect(cnval).toBe(obj.a.c)

        obj.a = {c: 20}

    })
})