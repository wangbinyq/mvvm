import Observer from './src/observer'
import ViewModel from './src'

const obj = {
    text: 'Hello', 
    show: false,
    reverse() {
        this.text = this.text.split('').reverse().join('')
    },
    obj: {
        arr: [
            'test1',
            'test2',
            'test3'
        ]
    },
    add() {
        this.obj.arr.push(this.text)
    },
    remove(index) {
        obj.obj.arr.splice(index, 1)
    }
}
const ob = new Observer(obj, 'a', () => { 
    console.log(obj.a) 
})
obj.a = 'You should see this in console'
ob.unobserve()
obj.a = 'You should not see this in console'

const vm = new ViewModel(document.getElementById('vm'), obj)