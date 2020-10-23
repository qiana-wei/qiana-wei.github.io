---
title: Lodash-1:基本概念
date: 2020-10-18 13:54:16
tags: ['Lodash','函数式编程']
category: "Lodash"
---

# Lodash是什么

*Lodash* 是一个一致性、模块化、高性能的JavaScript 实用工具库。

[中文网站看这](https://www.lodashjs.com/)

[英文网站看这里](https://lodash.com/)

# 为什么使用Lodash

Lodash能够降低array、number、object、string等的使用难度，从而使使用Javascript更加简单。

Lodash的模块化非常适用于：

* 遍历Array、Object、String
* 对值进行操作和检测
* 创建符合功能的函数

# 使用

## 安装

```shell
npm install lodash
```

## 使用

```js
const _ = require('lodash')
```



# 常用函数

### 1. memoize 记忆函数

```js
//模拟memoize函数
function memoize(fn){
  let cache = {}
  return function(...args){
    let key = JSON.stringify(args)
    cache[key] = cache[key] ?? fn(...args)
    return cache[key]
  }
}
```

### 2. curry 函数柯里化

```js
//模拟curry
function curry(fn){
  return function curriedFn(...args){
    // args.length实参
    //fn.length 形参
    if(args.length < fn.length){
      //args2 后续调用传入的实参
      return function(...args2){
        //回调函数，组合多次调用传入的参数
        return curriedFn(...[...args,...args2])
      }
    }
    return fn(...args)
  }
}
```

### 3. 组合函数

```js
//模拟flowRight
function flowRight(...args){
  return function(value){
    return args.reverse().reduce(function(acc,cur){
      return cur(acc)
    },value)
  }
}
```

**ps**: reduce()方法：

`reduce()` 方法对数组中的每个元素执行一个由您提供的**reducer**函数(升序执行)，将其结果汇总为单个返回值。

**reducer** 函数接收四个参数

* Accumulator(acc)(累计器)
* Current Value(cur)(当前值)
* Current Index(idx)(当前索引)
* Source Array(src)(源数组)

语法：

```js
arr.reduce(callback(accumulator, currentValue[, index[, array]])[, initialValue])
```

**initialValue**：作为第一次调用 `callback`函数时的第一个参数的值。 

如果没有提供初始值，则将使用数组中的第一个元素。

 在没有初始值的空数组上调用 reduce 将报错。
