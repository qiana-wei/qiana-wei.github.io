---
title: Lodash-1
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

