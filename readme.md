# 一个简单的 MVVM 实现

## 简介

一个简单的带有双向绑定的 MVVM 实现.
[例子](https://445141126.github.io/mvvm/)


## 使用
新建一个 ViewModel 对象, 参数分别为 DOM 元素以及绑定的数据即可.

## 指令

本 MVVM 的指令使用 data 数据, 即 data-html = "text" 表示这个 DOM 元素的 innerHTMl 为 model 中的 text 属性.
对某些指令还可以添加参数, 比如 data-on="reverse:click", 表示 DOM 元素添加 click 事件, 处理函数为 model 中的 reverse 属性.

- value: 可以在 input 中使用, 只对 checkbox 进行特殊处理
- text, html: 分别修改 innerText 和 innerHTML
- show: 控制指定元素显示与否
- each: 循环 DOM 元素, 每个元素绑定新的 ViewModel, 通过 $index 可以获取当前索引, $root 表示根 ViewModel 的属性
- on: 绑定事件,
- *: 绑定特定属性

## 参考
本实现主要参考 [rivets.js 的 es6 分支](https://github.com/mikeric/rivets/tree/es6), 其中 Observer 类是参考 [adapter.js](https://github.com/mikeric/rivets/blob/es6/src/adapter.js) 实现.
Binding 就是 [bindings.js](https://github.com/mikeric/rivets/blob/es6/src/bindings.js) 对应的简化, 相当于其他 MVVM 中指令, ViewModel 对应 [view.js](https://github.com/mikeric/rivets/blob/es6/src/view.js).

>> PS: 由于双向绑定只是简单的实现, 因此指令中的