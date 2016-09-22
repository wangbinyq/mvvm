# 一个简单的 MVVM 实现

## 简介

一个简单的带有双向绑定的 MVVM 实现.
[例子](https://445141126.github.io/mvvm/)

本实现主要参考 [rivets.js 的 es6 分支](https://github.com/mikeric/rivets/tree/es6), 其中 Observer 类是参考 [adapter.js](https://github.com/mikeric/rivets/blob/es6/src/adapter.js) 实现, 但是没有实现 keypath, 也就是说只能 observe 对象的属性, 而不能 observe 子对象的属性.
Binding 就是 [bindings.js](https://github.com/mikeric/rivets/blob/es6/src/bindings.js) 对应的简化, 相当于其他 MVVM 中指令, ViewModel 对应 [view.js](https://github.com/mikeric/rivets/blob/es6/src/view.js).
