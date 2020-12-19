---
title: VUE-响应式原理与数据双向绑定
date: 2020-12-17 10:21:56
tags: ["VUE","VUE-响应式原理"]
category: "VUE"
---

讲讲vue数据响应式与数据双向绑定。

# 数据响应式

数据模式仅仅是普通的Javascript对象。当改变数据时，视图也会进行更新，避免繁琐的DOM操作，提高开发效率。

# 数据双向绑定

其原理即通过数据响应式与事件绑定。

当数据发生变化时，视图会进行更新。当视图改变，数据也会随之改变。

# 数据驱动

数据驱动是Vue最独特的特性之一。

开发过程中仅需要关注数据本身，不需要关心数据是如何渲染的。

# Vue响应式核心原理

vue2.x和vue3.0的响应式实现有所不同。

**Vue2.x**中，通过[`Object.defineProperty`](/2020/12/18/JS/Object.defineProperty/)来劫持对象中的**属性**，给属性添加getter/setter。

每一个属性创建一个dep对象，dep负责收集依赖和通知watcher对象。

当数据发生变化时，dep对象通知watcher对象，watcher对象负责更新视图

**vue3.0中**，使用[Proxy](/2020/11/15/JS/ECMAScript/#Proxy-代理对象)进行数据代理。Proxy直接监听对象，而非属性。

# 发布订阅模式 和 观察者模式

## 发布订阅模式

* 发布者
* 订阅者
* 信号中心

某个任务执行完成，就像信号中心“发布(publish)”一个信号，其他任务可以向信号中心“订阅(subscribe)”这个信号,从而知道什么时候自己可以开始执行。

```js
//信号中心
class EventEmit {
  constructor() {
    this.subs = Object.create(null)
  }

  // 注册事件
  $on(eventType, handler) {
    this.subs[eventType] = this.subs[eventType] ? this.subs[eventType] : []
    this.subs[eventType].push(handler)
  }

  //触发事件
  $emit(eventType) {
    if (this.subs[eventType]) {
      this.subs[eventType].forEach(handler => {
        handler()
      });
    }
  }
}
```

发布者发布事件，比如发布者发布事件“add”，调用事件中心的$emit方法，触发“add”事件，事件中心找到"add"事件对应的处理函数并执行。

事件处理函数函数是有订阅者提供的，若订阅者想知道"add"事件是否发生了变化，需要订阅事件中心中的"add"事件。

事件中心的作用是隔离发布者和订阅者，去除其之间的依赖关系。

## 观察者模式

* 发布者(目标) -- Dep
  * subs数组：存储所有的观察者
  * addSub()：添加观察者
  * notify()：当事件发生，调用所有观察者的update()方法
* 观察者(订阅者)-- Watcher
  * update()：当事件发生时，具体要做的事情

**没有事件中心**，订阅者的update方法是由发布者调用的。

```js
//发布者
class Dep {
  constructor() {
    //记录订阅者
    this.subs = []
  }
  addSub(sub) {
    if (sub && sub.update) {
      this.subs.push(sub)
    }
  }
  notify() {
    this.subs.forEach(sub => {
      sub.update()
    })
  }
}

//观察者
class Watcher {
  // 事件发生时触发函数
  update() {
    console.log('update')
  }
}
```

## 区别

**发布订阅模式**：由同一的调度中心调度，发布者和订阅者不需要知道对方的存在

**观察者模式**：由具体的目标调度，当事件触发，发布者就会调用观察者的方法。发布者和观察者之间存在依赖关系。

# 数据双向绑定

实现数据响应式，结合事件监听，即实现数据双向绑定。

事件监听，触发事件时，修改数据，触发数据响应式，继而修改视图展示。

