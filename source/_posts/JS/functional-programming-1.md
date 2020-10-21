---
title: 函数式编程-1
date: 2020-10-11 16:47:21
tags: ['函数式编程']
category: 'JS'
---

# 什么是函数式编程

> 函数式编程（Function Programming, 缩写：FP）。是一种[编程范式](/2020/10/11/JS/programming-parading/)。

函数式编程将计算机运算视为函数运算，并且避免使用程序状态以及易变对象。

λ演算(lambda calculus)是函数式编程最重要的基础。

λ演算的函数可以接受函数作为输入和输出。

# 为什么学习函数式编程

**1.外部环境需要**

* 函数式编程是随着React的流行收到越来越多的关注。
  * React中的高阶组件是由高阶函数来实现的。高阶函数是函数式编程的一个特性。
  * React的原生生态Redux使用了函数式编程的思想
* Vue3也开始拥抱函数式编程
  * Vue3的composition Api越来越偏向函数式
  * Vue2的源码中也大量使用了高阶函数

**2.函数式编程本事益处**

* 得益于函数式编程变量的不可变性，函数引用透明，没有副作用。
* 由于函数式编程没有副作用，不影响外部环境，不依赖外部环境，使得函数式编程的程序不易出错，易于单元测试和调试
* 函数式编程无this指向问题
* 函数式编程多个线程不共享状态，不争夺资源，不需要锁保护可变状态，不会出现锁死现象。所以能够够好的处理并发问题。
* 在函数式编程中，将表达式赋值给变量时，不做计算，当变量第一次被使用时才会做计算，通过惰性求值，提高性能。

**3.外部环境支持**

* 打包过程中可以更好的使用 tree shaking过滤无用代码
* loads, underscore,ramda等库可以帮助我们进行函数式开发



# 函数式编程的特性

## 1.函数是一等公民

> 在函数式编程中，函数可以在任何地方定义、使用。

函数可以存储在变量中，可以作为参数，可以作为返回值。

**把函数赋值给变量**

```js
//把函数赋值给变量
let fn = function(){
  console.log('Hello First-class Function')
}
fn()
```

## 2.高阶函数

> 可以把函数作为参数传递给另外一个函数。
>
> 函数可以作为另外一个函数的返回值



### 高阶函数--函数作为参数

```js
// 模拟forEach
let forEach = function(array,fn){
   for(let i = 0;i<array.length;i++){
      fn(array[i])
   }
}
//测试
let arr = [1,2,3,4,5]
forEach(arr,function(item){
   console.log(item)
})

//模拟filter
let filter= function(array,fn){
  let result = []
  for(let i = 0;i<array.length;i++){
    if(fn(array[i])){
      arr.push(array[i])
    }
  }
  return result
}

//测试
let arr = [1,2,3,4]
let newArray = filter(arr,function(item){
  return item > 2
})

console.log(newArray)
```

### 高阶函数---函数作为返回值

```js
//模拟once函数
const once =  function(fn){
  let isDone = false;
  return function(){
    if(!isDone){
      isDone = true;
      fn.apply(this,arguments)
    }
  }
}
//测试
let pay = once(function(money){
  console.log(money)
})
pay(5)
pay(5)

//结果
// 5

```

### 高阶函数的意义

抽象可以帮我们屏蔽实现的细节，只需要关注我们的目标。

高阶函数用来抽象通用问题。

将复用的粒度降低到函数级别，使函数变得灵活。

### 常用高阶函数

模拟map

```js
const map = function(array,fn){
  let result = [];
  for(let value of array){
    result.push(fn(value))
  }
  return result
}

// 测试
let array = [1,3,4,5,6]
let result = map(array,item=>{
  return item*item
})
//箭头函数不加花括号时，有默认返回值
//let result = map(array,item=>item*item)
console.log(result)
//[1,9,16,36,25]
```

## 3.闭包

 函数中引用了**自由变量**，便形成了闭包。

自由变量：不属于当前函数作用域的变量。

**闭包的本质**：

函数在执行的时候会放到一个执行栈上，当函数执行完毕后，会从执行栈上移除。

**但是堆上的作用域成员因为被外部引用，不能释放**，因此内部函数依然能够访问外部函数的成员。

闭包延长了外部函数内部变量的作用范围。

## 4.不可变性（纯函数）

### 概念

函数式编程不保留计算的中间结果，所哟变量是无状态的，不可变的。

纯函数：相同的输入始终会得到相同的输出，而且没有任何可观察的副作用。

纯函数类似于数学中的函数，用来描述输入与输出之间的映射关系。

### 例子

slice返回数组中的指定部分，不修改原数组-------slice函数是纯函数

splice对数组进行操作，返回该数组，会改变原数组-----splice函数不是纯函数

### 纯函数的好处

1. 可缓存

   因为纯函数对相同的输入始终有相同的输出，所以可以把纯函数的结果缓存起来。

   **Lodash memoize函数**

   ```js
   const _ = require('loadsh');
   
   const getAreas = function(r){
     console.log('半径：',r)
     return Math.PI * r * r
   }
   
   let getAreasWithMemory() = _.memoize(getAreas)
   
   console.log(getAreasWithMemory(4)) // 半径：4   50.26548245743669
   console.log(getAreasWithMemory(4)) // 50.26548245743669
   console.log(getAreasWithMemory(4)) // 50.26548245743669
   console.log(getAreasWithMemory(5)) // 半径：5   78.53981633974483
   console.log(getAreasWithMemory(4)) // 50.26548245743669
   
   //getAreasWithMemory函数在有相同输入的时候，getAreas仅执行一次，后续结果在缓存中读取
   ```

   **模拟memoize函数**

   ```js
   const memoize = function(fn){
     let cache = {}
     return function(){
       let key = JSON.stringify(arguments)
       cache[key] = cache[key] ?? fn(...arguments)
       return cache[key]
     }
   }
   ```

2. 可测试

   纯函数始终有输入与输出，单元测试是断言函数的结果，所以，纯函数让测试更方便

3. 并行处理
   * 在多线程环境下，并行操作存在共享数据时很可能会发生意外情况
   * 纯函数是封闭空间，不需要访问共享的内存数据，所以在并行环境下可以任意运行纯函数

## 5. 副作用

由于函数依赖外部的状态，就无法保证函数会有相同的输出，就会带来副作用。

### 副作用来源

* 配置文件
* 数据库
* 获取用户的输入

所有的外部交互都有可能带来副作用，副作用也使得方法的通用性下降，不利于拓展和可重用性。

同时，副作用会给程序带来安全隐患及不确定性。

但是副作用又不可能完全禁止，尽量控制它们在可控范围内发生。

## 6.柯里化（Currying）

**将多个入参的函数，转化为需要更少入参的函数的方法**

柯里化是把**接受 n 个参数的 1 个函数**改造为**只接受 1个参数的 n 个互相嵌套的函数**的过程。

**也就是 *fn(a,b,c)*会变成*fn(a)(b)(c)* **

```js
//原函数
function generateName(prefix, type, itemName) {
  return prefix + type + itemName
}
//柯里化后
function generateName(prefix) {  
  return function(type) {
    return function (itemName) {
      return prefix + type + itemName
    }    
  }
}
// 柯里化后调用
var itemFullName = generateName('洗菜网')('生鲜')('菠菜')
```

**lodash中的柯里化函数**

**_.curry(fn)**

​	**功能**：创建一个函数，该函数接收一个或多个function参数。

如果function所需要的参数都被提供，则执行function并返回结果。

否则继续返回该函数并等待接收剩余的参数。

​	**参数**：需要柯里化的函数

​	**返回值**：柯里化后的函数

```js
//模拟lodash curry方法
function curry(fn){
  return function curriedFn (...args){// 给函数命名，方便递归调用
    // 判断实参 和 形参 个数是否相同
    if(args.length < fn.length){
      //不同，返回函数，等待后续参数
      return function(...args2){
        return curriedFn(...[...args,...args2])
      }
    }
    // 相同，执行函数
    return fn(...args)
  }
}

function getSum(a,b,c){
  return a + b + c
}

let getSumWithCurry = curry(getSum)
// function curriedFn

console.log(getSumWithCurry(1)(2)(3))
console.log(getSumWithCurry(1,2)(3))
console.log(getSumWithCurry(1)(2,3))
```

**总结**

1. 函数柯里化可以让我们给一个函数传递较少的参数，得到一个已经记住了某些固定参数的新函数
2. 这是一种对参数的缓存
3. 使得函数变得更灵活，让函数粒度更小
4. 把多元函数转化为一元函数，可以组合使用函数产生强大的功能

## 7.偏函数

与函数柯里化类似。

一个函数接收一个有多个参数的函数，返回一个需要较少参数的函数

偏函数将一个或多个参数固定到内部，返回一个需要较少参数的函数。



