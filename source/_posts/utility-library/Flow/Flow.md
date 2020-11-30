---
title: Flow-静态类型检测器
date: 2020-11-25 11:12:26
tags: ['JS','Flow']
category: 'Flow'
---

# 简介

Flow是一个Javascript静态类型检测器。通过**静态类型注释**的方式检查代码是否含有错误，在开发阶段避免一些因为数据类型而引发的错误。

```js
// @flow
function sum(a:number,b:number){
  return a + b
}
/*
  square函数入参为数据类型，若参数不是数据类型，就会报错。
*/
```

**注意**，因为VSCode的代码检测工具并不支持静态类型的注解方式，所以在开发过程中，需要在Setting中关闭`Javascript Validate Enable`选项。

# 安装

[官网文档点这里](https://flow.org/en/docs/install/)

**安装工具：yarn**

```powershell
yarn add flow-bin --dev
```

**配置.flowconfig 文件**

```powershell
yarn flow init
```

**执行flow命令**,执行类型检查

```powershell
yarn flow
```



# 编译

## flow-remove-types模块

**安装**

```powershell
yarn add flow-remove-types --dev
```

**使用**

`yarn flow-remove-types <源文件目录> -d <编译文件导出目录>`

```powershell
yarn flow-remove-types src -d dist
```

```js
//源文件 -- src/flow.js
// @flow
function sum(a:number,b:number){
    return a +b
}

sum(100,100)
```

```js
//编译文件 -- dist/flow.js
//      
function sum(a       ,b       ){
    return a +b
}

sum(100,100)
```

## babel

**安装**

```powershell
yarn add @babel/core @babel/cli @babel/preset-flow --dev
```

`@babel/core`: balel 的核心模块

`@babel/cli`: babel的cli工具，可以直接在命令行中使用babel命令完成编译

`@babel/preset-flow`: babel的转换flow注解的插件

**配置babel**

```
//.babelrc
{
    "presets":["@babel/preset-flow"]
}
```

**执行编译**

`yarn babel <源文件> -d <编译文件>`

```powershell
yarn babel code/flow -d dist
```

```js
//dist/flow.js
function sum(a, b) {
  return a + b;
}

sum(100, 100);
```

# 使用开发工具插件

[官网提供的插件看这里](https://flow.org/en/docs/editors/)

Flow官方提供的VSCode使用的插件是Flow Language Support，可以直接在开发工具中直接显示错误提示。

# flow语法及功能

## 类型注解

### 函数参数

```js
//@flow
function sum(a:number,b:number){
  return a + b
}
```

### 变量

```js
//@flow
let num: number = 100 //100 |  NaN | Infinity
let str: string = "this is a string"
let booleanType:boolean = false //false | true

let nullType: null = null
let undefinedType: void = undefined  //void 表示undefined
let symbolType: symbol = Symbol()

//ES2020中的BigInt类型暂不支持（2020年11月30日）
//let bigInt: bigInt = 100n 
```

### 函数

> 表示函数的返回值类型

```js
//@flow
function foo():number{
  return 100
}

function fooVoid():void{
  console.log('no return')
  //no return
}
```

## 数据类型

[官方文档看这里](https://flow.org/en/docs/types/)

### 类型推断

flow能够自行根据代码，推断参数的数据类型。

```js
//@flow
function square(n){
  return n*n
}
```

在上面`square`函数中，参数`n`在函数内执行了乘法操作，flow就会推断`n`为`number`类型。

当参数传入`非number`时，就会报错提示。

### 原始数据类型

```js
//@flow
let num: number = 100 //100 |  NaN | Infinity
let str: string = "this is a string"
let booleanType:boolean = false //false | true

let nullType: null = null
let undefinedType: void = undefined  //void 表示undefined
let symbolType: symbol = Symbol()

//ES2020中的BigInt类型暂不支持（2020年11月30日）
//let bigInt: bigInt = 100n 
```

### Maybe 类型 -- `?types`

```js
let maybeType: ?string = 'maybe string'
```

`maybeType`可以是指定`type`数据类型，也可以是`null`和`void(undefined)`

**可选参数类型**

```js
//@types
function foo(value: ?string){
  //...
}
foo('string value')
foo(null)
foo(undefined)
foo()
```

### 数组类型

```js
//@flow
const array1: Array<number> = [1,2,3] // 全部由数字组成的数组
const array2:number[] = [1,2,3] // 全部由数字组成的数组

const array3:[string,number] = ['foo',100] //固定长度，固定数据类型 --- 元组
```

### 对象类型

```js
//@flow
const obj1: {
    foo:string,
    bar:number,
    baz?:string//可选对象属性
  } = {
      foo:'str foo',
      bar:200
  }
```

> 可选对象属性，即对象可以有也可以没有改属性值

**限制对象键值对类型**

限制obj对象的键必须是字符串，值必须是数字:

```js
//@flow
const obj:{[string]:number} = {
  foo:100
}
```

限制obj对象的键必须是字符串，值可以是数字和字符串:

```js
//@flow
const obj:{[string]:number | string} = {
  foo:100,
  baz:'baz string'
}
```

### 函数类型

限制参数类型及返回值类型:

```js
//flow
function foo(value: ?string):void{
  //...
}

/*
参数为可选参数，参数类型可以是string，null，undefined
无返回值
*/
```

限制回调函数参数类型及返回值：

```js
//flow
function foo(callback:(string,number)=>void){
  callback('string',100)
}

foo((str,n)=>{
  //str --- string
  //n --- number
})
```

### 或类型

> 允许设置多个数据类型

```js
//@flow
const data:string | number = 100
```

data可以`string`或`number`

### 字面量类型

> 限制变量必须是某个执行的值

```js
//@flow
const status = "success" | "warning" | "danfer" = "success"
```

### 自定义类型

> 使用`type`关键字，定义混合类型的数据类型

```js
//@flow
// 定义一个String或Nubmer类型的数据类型
type StringOrNumber = string | number
const data:StringOrNumber = 'string'
```

### Mixed和Any

> Mixed和Any都可以接受任意类型的数据

```js
//@flow
function passMixed(value:mixed){
  //...
}
//passMixed接收任意类型的数据

function passAny(value:any){
  //...
}
//passAny接收任意类型的数据
```

**区别**

mixed类型，需要先判定数据类型，才能使用对应的数据类型

any类型可以不做数据类型判定，将数据当作任意类型来使用

```js
//@flow
function passMixed(value:mixed){
  if(typeof value === 'string'){
    value.substr(1);
  }
  if(typeof value === 'number'){
    value* value;
  }
}

function passAny(value:any){
   value.substr(1);
   value* value;
}

```

## flow 运行环境API

```js
//@flow
const element:HTMLElement | null = document.getElementById('app')
```

[Api声明文件](https://github.com/facebook/flow/tree/master/lib)

`core.js `: javascript自身标准库中的成员(例如：Object，Array，Map，Math，Json。。。)

`dom.js`:dom相关api

`bom.js`:bom相关api

`cssom.js`:css相关api

`node.js`:node环境相关api

