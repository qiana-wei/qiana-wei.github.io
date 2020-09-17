---
title: 一道面试题引发的思考--async/await
date: 2020-09-17 18:15:30
tags: ["异步执行","EventLoop","async/await"]
category: "JS"
---

### 题目
```javascript
async function async1(){
    console.log("A")
    async2();
    console.log("B")
}
async function async2(){
    console.log("C")
}
console.log("D")
setTimeout(function(){
    console.log('F')
},0)
async1()
new Promise(function(resolve){
    console.log("G")
    resolve()
}).then(function(){
    console.log("H")
})
console.log("I")
```

//浏览器环境下

输出结果：D，A，C，B，G，I，H，F

### 分析

这道题考察的是**异步函数的执行**，**浏览器Event-Loop**，**async/await**，**Promise**....

[异步函数执行、浏览器Event-Loop看这里](/2020/09/15/JS/event-loop/)

好~~

看过上面的异步函数执行和浏览器Event-Loop之后，

现在我告诉你，async中没有await的时候，async函数就是一个纯同步函数。

相信你一定可以得出上面的结果。



