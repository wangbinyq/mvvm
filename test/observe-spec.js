import observe from '../src/observe'

const ARRAY_METHODS = [
    'push',
    'pop',
    'shift',
    'unshift',
    'sort',
    'reverse',
    'splice'
]

describe('observe', () => {
    it('can observe', () => {
        let ob = observe({}, '', () => {})
        expect(ob).toBeDefined()

        ob = undefined
        ob = observe([], '', () => {})
        expect(ob).toBeDefined()
    })

    it('can watch prop changed', () => {
        let nval, obj = {a: 100}
        observe(obj, 'a', function() {
            nval = obj.a
        })
        expect(nval).not.toBeDefined()
        obj.a = 102
        expect(nval).toBe(102)
    })

    it('can watch nest prop changed', () => {
        let nval, obj = {a: {c: 100}}
        observe(obj, 'a.c', function() {
            nval = obj.a.c
        })
        obj.a.c = 102
        expect(nval).toBe(102)

        obj.a = {c: 20}
        expect(nval).toBe(20)     
    })

    it('can watch array changed', () => {
        let nval, arr = [1, 2, 3]
        observe(arr, '1', function() {
            nval = arr.slice(0)
        })
        arr[1] = 100
        expect(nval).toEqual(arr.slice(0))
    })

    ARRAY_METHODS.forEach(method => {
        it('can watch array ' + method + ' changed', () => {
            let nval, obj = {a: [1, 2, 3]}
            observe(obj, 'a.1', function() {
                nval = obj.a.slice(0)
            })
            expect(obj[method]).not.toBeDefined()
            obj.a[method](1)
            expect(nval).toEqual(obj.a.slice(0))
        })
    })

    it('can get and set value', () => {
        let obj = {a: 100}, nval
        const ob = observe(obj, 'a', () => {
            nval = obj.a
        })
        expect(ob.value).toBe(100)
        ob.value = 20
        expect(ob.value).toBe(20)
        expect(nval).toBe(20)
    })

    it('can watch complex object', () => {
        let obj = { a: 1, b: 2, c: [{ d: [4] }] }, nval
        const ob = observe(obj, 'c.0.d.0', function() {
            nval = obj.c[0].d[0]
        })
        ob.value = 20
        expect(nval).toBe(20)
    })

    it('can watch intermediary path changed', () => {
        let obj = { a: 1, b: {c: 20} }, nval
        const ob = observe(obj, 'b.c', function() {
            nval = obj.b.c
        })
        obj.b.c = 30
        expect(nval).toBe(30)
        obj.b = {c: 20}
        expect(nval).toBe(20)                    
    })

    it('can watch same object', () => {
        function cb() {
            cval = obj.c
        }
        let obj = { a: 1, b: 2, c: [{ d: [4] }] }
        let aval, bval, cval, dval
        const oba = observe(obj, 'a', function() {
            aval = obj.a
        })
        const obb = observe(obj, 'b', function() {
            bval = obj.b
        })
        const obc = observe(obj, 'c', cb)     
        const obd = observe(obj, 'c.0.d', function() {
            dval = obj.c[0].d
        })
        obj.a = 10
        expect(aval).toBe(10)
        obj.c[0].d = 20
        expect(dval).toBe(20)
        obj.c = [{d: 30}]
        expect(cval).toBe(obj.c)
        expect(dval).toBe(30)
        expect(obj.$callbacks['c'].length).toBe(2)       
        expect(obj.$callbacks['c'][0]).toBe(cb)    
        expect(obj.$callbacks['c'][1]).toBe(obd.update)      
    })
})