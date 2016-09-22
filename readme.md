# 一个简单的 MVVM 实现

## 简介

随着 web 前端编程变得越来越复杂, jQuery 式的直接操作 DOM 的代码变得越来越不高效, 因此在前几年逐渐出现了很多框架, 前有 backbone, spine 等传统 mvc 的框架, 后有 angular, vue 等 MVVM 以及 react 这些框架出现. 使用 MVC 类型框架虽然能使我们编写的前端能有一个框架, 但是具体的业务还是需要直接操作 DOM 元素. 而 MVVM 双向数据绑定的出现, 将我们从 DOM 操作中解放出来, html 模版也使得逻辑和视图分离, 令前端开发变得简单和高效.

本文将通过实现一个简单的 MVVM 来阐述 MVVM 的基本原理. 希望能使读者加深对　MVVM 框架的理解.

## 基本组成

>> ViewModel:
    

>> binders:
    ViewModel 的属性, 每一个 binder 可以作为 DOM 的属性, 实现执行的功能.

>> Binding:
    将数据和 DOM 上指定的 binder 绑定在一起, 实现双向绑定.

>> Observer:
    观察数据的变化, 并调用回调.