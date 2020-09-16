---
title: 一道面试题引起的思考--EventLoop
date: 2020-09-15 23:18:13
tags: ["异步执行","EventLoop"]
category: "JS"
---

### 题目

```js
console.log(1)
setTimeout(()=>{console.log(2)},1000)
let start = new Date()
while(new Date() - start < 3000){}
console.log(4)
setTimeout(()=>{
    new Promise((reslove,reject)=>{
        console.log(5)
        reslove()
        console.log(6)
    }).then(()=>{
        console.log(7)
        return new Promise((reslove)=>{
            console.log(8)
            reslove()
        })
    }).then(()=>{
        console.log(9)
    })
},0)
new Promise(()=>{
    console.log(10)
    foo.bar()
}).then(()=>{
    console.log(11)
}).then(()=>{
    console.log(12)
}).catch(()=>{
    console.log(13)
})

console.log(14)
```



输出结果：1,4,10,14,13,2,5,6,7,8,9

### 分析

这道题考察的是 **异步函数的执行**  以及  **浏览器Event-Loop**。还涉及到了**函数调用栈**、**setTImeOut**，**Promise**等知识点。

### 异步执行函数

#### 为什么使用异步执行函数

JavaScript为单线程程序，若其中某个函数或方法占用时间过长，阻塞了进程，导致用户一直需要等待当前函数执行完成之后才能进行下一步操作。

这严重影响了用户体验及程序运行效率。

为了解决这一问题，所以采用异步执行。

#### 异步解决方案

异步进化史：回调函数、Promise、Generator、ansyc/await

**回调函数**

回调函数是解决异步最常用的解决方案，但是当回调嵌套回调，回调又嵌套回调的时候，多层回调嵌套，造成“回调地狱”，使得代码的  可读性、可维护性被破坏。

**Promise**

为了解决上面的问题，Promise采用链式调用。

Promise执行resolve后，执行then中的方法，Promise中出现错误或执行reject后，执行catch中的方法。

代码清晰，逻辑简单。

.....(另外两个待补充)

#### 异步是在哪里执行的

这是个好问题。

我们知道。函数执行时，将函数推入调用栈，执行完成后，推出调用栈。所以，才会有阻塞问题。

那么，异步执行的函数，是在哪里执行的呢？

JS引擎不能做，那浏览器来做嘛。

[Web API](https://developer.mozilla.org/zh-CN/docs/Learn/JavaScript/Client-side_web_APIs/Introduction)可以帮助我们来实现异步、非阻塞。

常用的**浏览器API**，包括

* 操作文档的API(DOM操作)
* 从服务器获取数据的API(Ajax)
* 用于绘制和操作图形的API(canvas,WebGL,AninationFrame)
* 音频和视频API(HTMLMediaElement,Web Audio API,WebRTC)
* 设备API(定位，系统通知)
* 客户端存储API(WEB Stroage API)

所以，当遇到需要异步执行的函数或方法时，将函数或方法置于Web API中执行，调用栈继续推入、推出主线程上的函数及方法。当Web API中异步的函数或方法执行完成后，将回调函数加入**任务队列** <span style="color:#ccc">(  what?任务队列又是什么？  os：终于到重点了)</span>

### 任务队列

任务队列分为  **宏任务队列**  和  **微任务队列**



### Event Loop

> 浏览器事件循环。

