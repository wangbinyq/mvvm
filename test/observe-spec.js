import observe from '../src/observe'

describe('observe', () => {
    it('can observe', () => {
        let ob = observe({}, 'a', () => {})
        expect(ob).toBeDefined()

        ob = undefined
        ob = observe([], () => {})
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
        expect(oval).toBe(20)    
    })

    it('bind obj of callback', () => {
        let self, obj = {a: {c: 100}}
        const ob1 = observe(obj, 'a', function(newValue, oldValue) {
            self = this
        })
        expect(self).toBe(obj)
    })

    it('can observe same object', () => {
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
        expect(anval).toBe(obj.a)
        expect(cnval).toBe(20)
    })

    it('can watch array changed', () => {
        let arr = [1, 2, 3], nval, oval
        observe(arr, function(newValue, oldValue) {
            nval = newValue.slice(0)
            oval = oldValue.slice(0)
        })
        expect(nval).toEqual(arr.slice(0))
        expect(oval).toEqual(arr.slice(0))

        arr.push(4)
        expect(nval).toEqual([1, 2, 3, 4])
        expect(oval).toEqual([1, 2, 3])

        observe(arr, '1', function(newValue, oldValue) {
            nval = newValue
            oval =oldValue
        })
        expect(nval).toBe(2)
        arr[1] = 0
        expect(nval).toBe(0)
    })

    it('can observe complex object', () => {
        let obj = { a: 1, b: 2, c: [{ d: [4] }] }, nval, oval
        observe(obj, 'c.0.d.0', function(newValue, oldValue) {
            nval = newValue
            oval =oldValue           
        })
        expect(nval).toBe(4)
        expect(oval).toBe(4)
        obj.c[0].d[0] = 100
        expect(nval).toBe(100)
        expect(oval).toBe(4)
    })
})