---
title: 一道面试题引发的思考--EventLoop
date: 2020-09-15 23:18:13
tags: ["异步执行","EventLoop","任务队列"]
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

这道题考察的是 **异步函数的执行**  以及  **浏览器Event-Loop**。还涉及到了**函数调用栈**、**setTimeOut**，**Promise**等知识点。

### 异步执行函数

#### 为什么使用异步执行函数？

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

#### 异步是在哪里执行的？

我们知道。函数执行时，将函数推入调用栈，执行完成后，推出调用栈。所以，才会有阻塞问题。

那么，异步执行的函数，是在哪里执行的呢？

JS引擎不能做，那浏览器来做嘛。

[Web API](https://developer.mozilla.org/zh-CN/docs/Learn/JavaScript/Client-side_web_APIs/Introduction)可以帮助我们来实现**异步**、**非阻塞**。

所以，当遇到需要异步执行的函数或方法时，将函数或方法置于Web API中执行，调用栈继续推入、推出主线程上的函数及方法。

当Web API中异步的函数或方法执行完成后(像是setTimeOut时间计数结束、Ajax异步请求得到了结果。。。)，将回调函数加入**任务队列** <span style="color:#ccc">(  what?任务队列又是什么？  os：终于到重点了)</span>，

 当函数调用栈为空时，开始逐个将回调函数推入栈中执行，执行完成后推出栈，并推入下一个回调函数。。



举个肯德基点餐的例子，大概理解一下。(以下故事纯属杜撰，如有雷同，纯属巧合)

*肯德基夜班，只有一个厨师和一个收银员，肯德基规定，只有在本职工作完成的情况下，才可以做其他工作。(即，在有人点餐的时候，收银员不能做出餐工作。厨师没有将所有餐品做完时，不允许做出餐工作。)*

*而此时，突然来了一群人要点餐。*

*客户点餐后，执行异步操作(等待厨师出餐，厨师出餐后，按序将餐放置于出餐平台)*

*当收银员点餐完成后，按餐品顺序叫号，客人取餐。*



在上面这个例子中

收银员---**函数调用栈**

厨师----**WebAPI**

出餐台---**任务队列**

叫号取餐---**回调函数内容**



常用的**浏览器API**，包括

* 操作文档的API(DOM操作)
* 从服务器获取数据的API(Ajax)
* 用于绘制和操作图形的API(canvas,WebGL,requestAninationFrame)
* 音频和视频API(HTMLMediaElement,Web Audio API,WebRTC)
* 设备API(定位，系统通知)
* 客户端存储API(WEB Stroage API)

### 任务队列

任务队列分为  **宏任务队列**  和  **微任务队列**

什么是微任务，什么又是宏任务呢？

常见宏任务、微任务如下：

**宏任务**：

* I/O, setTimeout
*  setInterval
* requsetAnimationFrame(浏览器才有)
* setImmediate(Node才有)

**微任务**：

* Promise.then
* Promise.catch
* Promise.finally,
* MutationObserver(浏览器才有)
* process.nextTick(Node才有)

还是上面那个例子：

*有个人在取餐的时候，提出，他的炸薯条需要多几包番茄酱，他还需要一些纸巾*

*那 收银员 在给他出餐的时候，就需要额外执行完当前取餐客户的需求，才能继续服务后面的客户*

这就相当于下面的代码

```javascript
setTimeout(()=>{
	//取餐
	New Promise(()=>{
		//额外添加番茄酱
		//额外添加纸巾
		resolve()
	}).then(()=>{
		//给予番茄酱
		//给予纸巾
	})
},'等餐时间')
```

### Event Loop

> 浏览器事件循环。

一个完整的浏览器循环过程：

1. 初始状态，调用栈空，微任务队列空，宏任务队列中只有一个script脚本(整体代码)。
2. 全局上下文(script标签)推入调用栈，同步执行代码。遇到异步执行的代码，交于Web API处理，分别推入宏任务队列及微任务队列
3. 同步执行代码至此那个完成后，逐个推入**微任务队列**中任务(**微任务队列是一队一队执行的**)
4. 微任务队列清空后，推入一个宏任务至调用栈，若宏任务执行过程中，又产生了新的微任务，则执行完全部微任务后才会在推一个宏任务进入调用栈（**宏任务是一个一个执行的**)

### 回看题目

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

首先，调用栈执行主线程任务

console.log(1) -----  输出1

然后遇到了  setTimeout(()=>{console.log(2)},1000)，交由 Web API进行处理，1s后，将回调函数入队宏任务队列，此时发现调用栈主线程尚未执行完，则，回调函数继续等待在**宏任务队列**。

3s后，调用栈执行  console.log(4)   ----- 输出 4

然后遇到setTimeout,交于Web API处理，将回调函数入队**宏任务队列**。

调用栈执行Promise函数，执行console.log(10)----输出10，执行foo.bar()--一个未定义函数，将promise.catch交于WebAPI处理，将回调函数入队 **微任务队列**

调用栈执行console.log(14)----输出14



**综上，主线任务执行完毕后，输出结果为    1,4,10,14**



主线任务执行完毕后，推入宏任务至调用栈前，检查微任务队列有无任务。执行微任务队列中的回调函数输出----13

**此时，输出结果为1,4,10,14,13**

微任务队列清空后，宏任务队列第一个出队，推入调用栈，执行console.log(2),---输出  2

微任务队列清空后，宏任务队列第一个出队，推入调用栈，执行console.log(5),console.log(6)---输出  5,6

遇到Promise，resolve，将Promise.then推给Web API执行，将回调函数推入微任务队列

推入宏任务至调用栈前，检查微任务队列有无任务，执行微任务队列中回调函数，输,7，8，将Promise.then推入微任务队列

推入宏任务至调用栈前，检查微任务队列有无任务，执行微任务队列中回调函数，输出9

最后，输出结果为1,4,10,14,13,2,5,6,7,8,9



*随便看看图解*

![EventLoop](./eventloop.gif)

