---
title: Object.defineProperty
date: 2020-12-18 10:32:59
tags: ['JS','Object.defineProperty']
category: 'JS'
---

> ES5 中一个无法 shim 的特性,不支持 IE8 以及更低版本

> 直接在一个对象上定义一个新属性，或者修改一个对象的现有属性。并返回这个对象。

# 语法

```
Object.defineProperty(obj,prop,descriptor)
```

**参数**

`obj`:要定义的对象

`prop`:要定义或修改的属性的名称或 [`Symbol`](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Symbol) 

`descriptor`:要定义或修改的属性描述符

**返回值**

被传递给函数的对象

# 描述符

> 使用Object.defineProperty可以添加和修改对象的属性。

* 通过赋值操作添加的普通属性是可枚举的，在枚举对象属性是可以枚举到
* 可以改变属性的值，也可以删除属性的值。
* 允许修改默认的而外配置选项(属性描述)
* 默认情况下，使用 `Object.defineProperty()` 添加的属性值是不可修改（immutable）的

属性描述符是对象，分为两类：**数据描述符**和**存取描述符**。一个描述符只能是这两者其中之一，不能同时是两者。

**数据描述符**：具有值的属性，该值可以是可写的，也可以是不可写的。

**存取描述符**：由 getter 函数和 setter 函数所描述的属性，

# 描述符属性

**通用描述符属性**

`configurable`：属性的描述符是否够被修改，属性是否可以被删除。  **默认`false`**

`enumerable`：属性是否可以被枚举。**默认`false`**

**仅数据描述符可用属性**

`writable`：属性值是否可以修改。**默认`false`**

`value`：属性值。**默认`undefined`**

**仅存取描述符可用属性**

`get`：属性的 getter 函数。**默认`undefined`**

* 当访问该属性时，会调用此函数。
* 执行时不传入任何参数，但是会传入 `this` 对象（由于继承关系，这里的`this`并不一定是定义该属性的对象）。
* 该函数的返回值会被用作属性的值。

`set`：属性的 setter 函数。**默认`undefined`**

* 当属性值被修改时，会调用此函数。
* 该方法接受一个参数（也就是被赋予的新值），会传入赋值时的 `this` 对象

> 如果一个描述符不具有 `value`、`writable`、`get` 和 `set` 中的任意一个键，那么它将被认为是一个数据描述符。
>
> 如果一个描述符同时拥有 `value` 或 `writable` 和 `get` 或 `set` 键，则会产生一个异常。

**注意**

> 这些选项不一定是自身属性，也要考虑继承来的属性。
>
> 为了确认保留描述符的默认值，在设置之前，可能要冻结 [`Object.prototype`](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Object/prototype)，明确指定所有的选项，或者通过 [`Object.create(null)`](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Object/create) 将 [`__proto__`](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Object/__proto__) 属性指向 [`null`](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/null)。

# 实例

```js
let obj = {};
let descriptor = Object.create(null);//创建没有继承属性的描述符对象

descriptor.value = 'static'; // 设置描述符value属性

// 为对象新增key属性，属性不可修改，不可枚举，值为static
Object.defineProperty(obj, 'key', descriptor); 


obj.key = 'new key value'
console.log(obj)  // {key:"static"}    ---> 因为key值不可修改
console.log(Object.keys(obj)) // []    ---> 因为key值不可枚举


Object.defineProperty(obj, 'key2', {
  configurable:true,
  enumerable:true,
  writable:true,
  value:"key2 value"
}); 

obj.key2 = 'new key2 value'
console.log(obj)  // {key2: "new key2 value", key: "static"} 
console.log(Object.keys(obj)) // ["key2"]    
```

