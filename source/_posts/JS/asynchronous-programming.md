---
title: JS异步编程
date: 2020-10-23 16:05:09
tags: ['JS','异步编程','回调函数','Promise','Generator','Async']
category: 'JS'
---
# 为什么使用异步编程
JavaScript为单线程程序，若其中某个函数或方法占用时间过长，阻塞了进程，导致用户一直需要等待当前函数执行完成之后才能进行下一步操作。

这严重影响了用户体验及程序运行效率。

为了解决这一问题，所以采用异步执行。

# 异步解决方案

异步进化史：回调函数、Promise、Generator、ansyc/await

## 回调函数 -- 所有异步编程方案的根基

由调用者定义，交由执行者执行的函数，被称为回调函数。

**缺点**

当有多层回调嵌套时，产生回调地狱。不利于代码的可读性及可维护性。

## Promise -- 更优雅的异步编程方案

promise状态：

Pending（等待），Fulfilled（成功），Rejected（失败）。

### 基本用法

```js
const promise = new Promise(function(resolve,reject){
  //这里用于“兑现”承诺
  resolve(100)//承诺达成
})
promise.then(function(value){
  console.log('resolve',value)
  //100
},function(error){
  console.log('rejected',error)
})
```

### 使用案例

```js
//promise 封装ajax
function ajax(url){
  return new Promise(function(resolve,reject){
    var xhr = new XMLHttpRequest()
    xhr.open('GET',url)
    xhr.responseType = 'json'
    xhr.onload = function(){
      if(this.status == 200){
        resolve(this.response)
      }else{
        reject(new Error(this.responseText))
      }
    }
    xhr.send()
  })
}

//测试
ajax('./foo.json').then(res=>{
  console.log(res)
},error=>{
  console.log(error)
})
```

### 链式调用

嵌套使用Promoise是使用promise最大的误区。

Promise**链式**调用，避免回调嵌套。

promise的then方法中，若是返回一个Promise，则下一个then方法则是为上一条then方法执行回调。

若返回的是一个普通的值，则这个值作为下一个then方法中的接收值。

若未返回任何值，则默认返回*undefied*

* Promise 的then方法会返回一个全新的Promise对象
* 后面的then方法是在为上一个then方法中返回的Promise注册回调
* 前面的then方法中回调函数的返回值会作为面then方法回调的参数
* 如果回调中返回的是Promise，那后面的then方法的回调会等待Promise结束后执行

### 异常处理

**手动捕获异常**

then方法接收onFulfilled方法和onRejected方法，当Promise函数执行出现异常时，会执行onRejected回调函数，进行异常处理。

catch方法可以接受onRejected方法，当Promise函数执行出现异常时，会执行onRejected回调函数，进行异常处理。

**区别**

通过catch方法会捕获前面所有Promise的异常

then方法中的onRejected方法只能捕获当前Promise的异常

**unhandledrejection**

全局注册unhandledrejection方法，用于捕获没有手动捕获的异常

```js
window.addEventListener('unhandledrejection',event=>{
  const {reason,promise} = event
  console.log(reason,promise)
  event.preventDefault()
  //reason => Promise 失败原因，一般是一个错误对象
  //promise => 出现异常的Promise对象
},false)
```

### Promise 静态方法

**Promise.resolve()**

> 快速将一个值转化为Promise对象
>
> 若接收参数为一个Promise对象，则Promise对象会被原样返回
>
> 若接收参数为一个对象，且对象中的then方法为有onFulfilled和onrejected回调的函数，则实现了一个thenable的接口，对象可以像Promise一样被then执行。

```js
Promise.resolve('foo')
	.then(res=>{
  	console.log(res)
  	//foo
})

//等价于
new Promise(resolve=>{
  resolve('foo')
}).then(res=>{
  console.log(res)
  //foo
})
```

```js
//thenable对象
Promise.resolve({
  then:function(onFulfilled,onRejected){
    onFulfilled('foo')
  }
})
.then(res=>{
  console.log(res)
  //foo
})
```

**Promose.reject()**

> 快速创建一个一定会失败的Promise对象

无论传入什么参数，都会作为Promise失败的原因。

### Promise 并行执行

**Promise.all()**

> 将多个Promise合并为一个Promise统一管理

接收一个数组，数组中元素为Promise对象。

所有Promise执行完成后，返回一个Promise对象，Promise对象中包含一个数组，数组中记录着每个Promise执行的结果。

若Promise执行中有任务失败，则整个Promise结束。

**Promise.race()**

> 将多个Promise合并为一个Promise

多个promise对象中有一个执行完成后，新的Promise执行完成。

### Promise执行时序

promise的then方法是异步微任务，要等所有同步任务执行完成之后，才会执行。

[任务队列](/2020/09/15/JS/event-loop/#任务队列)

[EventLoop](/2020/09/15/JS/event-loop/#Event-Loop)

## Generator --- 生成器函数

调用生成器函数时，不会执行函数，而是回返回一个**生成器对象**，手动调用**生成器对象**的**next**方法，才会执行函数。

在函数内部，可以使用`yield`关键词返回一个值，并可以通过next方法返回值中的value拿到该返回值。

`yield`方法不会像return语句一样结束函数的执行，只是暂停函数的执行。下次执行next会继续执行函数。

若使用next方法时传入值，则可以在yeild中接收这个值。

在生成器函数中，可以使用try/catch捕获生成器throw的异常。

### 异步方案

```js
//ajax异步方法
function ajax(url){
  return new Promise(function(resolve,reject){
    var xhr = new XMLHttpRequest()
    xhr.open('GET',url)
    xhr.responseType = 'json'
    xhr.onload = function(){
      if(this.status == 200){
        resolve(this.response)
      }else{
        reject(new Error(this.responseText))
      }
    }
    xhr.send()
  })
}
//生成器函数
function * main(){
  try{
    const users = yeild ajax('/api/user.json')
    console.log(users)

    const posts = yeild ajax('/api/posts.json')
    console.log(posts)
  }catch(e){//捕获异常
    console.log(e)
  }
  
}

const g = main() // 生成器对象
```

```js
//普通执行处理函数
const result =g.next() // 执行函数，得到Promise对象
result.value.then(data=>{//处理Promise结果
  //函数继续执行，data作为yeild的返回值，赋值给users
  //result2 得到posts Promise对象
  const result2 = g.next(data) 
  if(result2.done) return
  result2.value.then(data=>{//处理posts Promise结果
    g.next(data)  //函数继续执行，data作为yeild的返回值，赋值给posts
  })
})
```

```js
//递归执行函数处理
function handleResult(result){
  if(result.done) return //生成器结束
  result.value.then(res=>{
    handleResult(g.next(data))
  },error=>{
    g.throw(error)//抛出异常
  })
}
handleResult(g.next())
```

*封装执生成器函数执行器*

```js
function co(generator){
  const g = generator()
  function handleResult(result){
    if(result.done) return //生成器结束
    result.value.then(res=>{
      handleResult(g.next(data))
    },error=>{
      g.throw(error)//抛出异常
    })
  }
  handleResult(g.next())
}
//外部执行
co(main)
```







