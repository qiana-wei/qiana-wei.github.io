---
title: 前端工程化7-模块化开发-ES Module
date: 2020-12-09 11:40:11
tags: ['前端工程化','模块化开发','ESModule','CommonJS',]
category: '前端工程化'
---

# 语法特性

1. ES Module自动采用严格模式，或略"use strict"
2. 每个ES Module都是运行在自己的私有作用域中
3. ES Module是通过"CORS"进行文件请求的，需要请求资源服务端在响应头中添加对应的"CORS"标头。
4. ES Module不支持文件的形式访问，需要启动http server的形式来让yem工作起来
5. ES Module中的`script`标签会延迟执行脚本---相当于`defer`属性

# 用法

## 1. 应用模块到HTML

通过给`script`标签添加`type = "module"`属性，来声明这个脚本是一个模块

```html
<script type="module" src="main.mjs"></script>
<script type="module">
	console.log('this is a mudule')
</script>
```

## 2. 导出模块的功能

> ES Module 模块可以多次导出, 且有多种导出方式

**注意**，单个导出和统一导出，只是对模块成员进行导出的方式不同，若进行了单个导出就不能再进行统一导出了。否则会出现**重复导出的错误**

而默认导出是指模块文件的默认导出，若对模块成员进行了单个或统一导出，仍然可以规定其为模块默认导出项。



若模块仅需要导出一个模块成员，可以使用**单个导出 + 默认导出**的方式

若模块需要导出多个模块成员，建议使用**统一导出**的方式

**不建议**使用 **单个导出 + 统一导出**的组合导出方式，因为这种方式不利于代码的可维护性和可读性

```js
//module.js
const foo = "es module"
const fooFun = function(){
  console.log('foo function')
}

//单个导出函数
export function hello(){
  console.log("hello")
}
//单个导出变量
export const name = "name string"
//单个导出类
export class Person{
  constructor(){
    console.log("class")
  }
}
//统一导出
export { foo,fooFun }
//默认导出 foo
export default foo
```

## 3. 导入模块功能

> 1.导入模块必须使用完整的文件扩展名
>
> 2.引用相对路径时，不能省略`./`，否则会解析为加载第三方模块
>
> 3.可以使用绝对路径引用
>
> 4.可以直接引用网络文件（完整的url）
>
> 5.可以通过`impirt {} from './module.js'`来执行模块，而不提取模块中的成员
>
> ​	简写为` import './module.js'`

**导入默认成员**

```js
//app.js
import defaultPerson from "./module.js"
console.log(defaultPerson) // 输出“es module”
```

**导入统一导出或单个导出成员**

```js
//app.ja
import {foo,fooFun,hello,name,Person} from "./module.js"

console.log(foo)  //输出 es module
fooFun()  //输出 foo function
hello()  //输出 hello
console.log(name) //输出 name string
new Person() //输出 class
```

**多次分别导入默认成员于普通成员**

```js
//app.ja
import {foo,fooFun,hello,name,Person} from "./module.js"
import defaultPerson from "./module.js"

console.log(defaultPerson) // 输出“es module”

console.log(foo)  //输出 es module
fooFun()  //输出 foo function
hello()  //输出 hello
console.log(name) //输出 name string
new Person() //输出 class
```

**一次性导入默认成员于普通成员**

```js
//app.ja
import defaultPerson,{foo,fooFun,hello,name,Person} from "./module.js"

//或使用as重命名的方式导入
//import {foo,fooFun,hello,name,Person, default as defaultPerson} from "./module.js"

console.log(defaultPerson) // 输出“es module”

console.log(foo)  //输出 es module
fooFun()  //输出 foo function
hello()  //输出 hello
console.log(name) //输出 name string
new Person() //输出 class
```

**创建模块对象**

当模块成员特别多时，可以通过`*`的方式提取模块中的所有成员，再通过`as`的方式将所有成员全部放在一个对象中.

```js
import * as mod from './module.js
//mod的属性即为模块的模块成员
```

**导入变量文件**

import只能出现在文件最顶层，不能嵌套在if语句中。

import也不能使用变量文件名

可以使用`import()`函数来导入变量文件名或在代码嵌套中使用，该函数返回一个`Promise`对象.

```js
//app.js
let file;
if(xxx){
  file = "module.js"
  import(file).then(res=>{
    //res即为模块成员
  })
}
```

## 4. 重命名方式

使用`as`对导出或导入成员进行重命名

若将导出模块成员重命名为`default`，即将模块成员作为模块默认导出成员

**导出成员重命名**

```js
//module.js
const foo = "es module"
const fooFun = function(){
  console.log('foo function')
}
class Person{
  constructor(){
    console.log('Person class')
  }
}

export { 
	foo as name, // 将foo 重命名为name，在导入模块成员时，使用name导入
	fooFun as funName, // 将fooFun 重命名为funName，在导入模块成员时，使用funName导入
  Person as default //Person 重命名为 default，即Person作为模块的默认导出成员
}
```

**导入成员重命名**

> Person作为模块的默认导出成员，可以作为默认成员导入，也可以通过重命名的方式，作为普通模块成员导入
> 	作为默认成员导入，仅需提供一个名称即可
> 	作为普通成员导入，因为default是一个关键词，所以需要对default进行重命名

```js
//app.js
//导入模块时，对模块成员进行重命名，
//将name重命名为moduleName，将funName重命名为methods
import Person,{ name as moduleName, funName as methods, default as PersonClass } from "./modules.js"

//使用模块成员时，使用重命名后的名称
new Person()
console.log(moduleName)
methods()
new personClass()
```

## 5.合并模块

想要将模块聚集到一起时，可以将多个子模块聚集到一个父模块。

```js
//main.js
export { module1 } from "./module1"
export { module2 } from "./module2"
export { module3 } from "./module3"

/*
相当于
  import { module1 } from "./module1"
  import { module2 } from "./module2"
  import { module3 } from "./module3"

  export {module1,module2,module3}
*/
```

```js
//app.js
import {module1,module2,module3} from "./main.js"
```

# 特殊说明

1. `export { xx1,xx2 }` 的语法并不是字面量的导出，`import { xx1,xx2 } from "xx.js"`也不是解构赋值。

   `export default { }` 导出的是一个对象，表示模块的默认导出成员是一个对象

2. 对外导出成员时，导出的是引用关系。模块导入是地址引用，不是拷贝复制。

3. 导入的模块成员是只读的。不能修改导入的模块成员

# 兼容处理--polyfill

> 可以在浏览器中直接支持ES Module中的大多数特性

## 在浏览器中直接

[`browser-es-module-loader`](https://github.com/ModuleLoader/browser-es-module-loader)：在浏览器中直接

为了避免支持ESModule的浏览器重复执行，对polyfill的引用添加`nomdule`属性

```html
<script nomodule src="polyfill.js"></script>
<script>
  import { foo } from './module.js'
  console.log(foo)
</script>
```

这种方式需要在浏览器运行时编译代码，效率低，正式环境不要使用

## 通过编译的方式使用

[polyfill](https://polyfill.io/v3/)

可以使用gulp、webpack等方式编译代码后，在浏览器中使用

# Node对ES Module的支持

> 目前，Node已经提供对ES Module支持的测试版本了
>
> Node 版本需要 `>=8.5.0`

## 编译方法

在node中使用ES Module时，需要添加`--experimental-modules`的参数，表明启用ES Module的实验特性

**注意**，若没有进行配置，文件拓展名要修改为`mjs`

```powershell
node --experimental-modules test.mjs
```

**在package.json**中配置`type`为`module`后，ES Module 模块的拓展名可以使用`js`

```json
{
  "type":"module"
}
```

运行`node --experimental-modules app.js `是可以执行的。

若此时想要使用commonJS模块，需要将commonJS文件的后缀修改为`cjs`

## 可以载入node原生模块与第三方模块

```js
import fs from "fs"
import _ from "loadsh"
fs.writeFileSync('./foo.txt','es module work')
console.log(_.cameCase('ES Module'))
```

**第三方模块需要使用默认导入的方式导入默认成员**

**对于node原生模块，可以使用提取的方式提取对应模块**(官方内置模块做了兼容)

```js
import {writeFileSync} from "fs"
writeFileSync('./foo.txt','es module work')
```

## 可以载入CommonJS提供的成员

```js
//common.js
module.exports = {
  foo:"commonjs export value"
}
```

```js
//esmodule.js
import mod from "./common.js"
console.log(mod) // 输出："commonjs export value"
```

## 使用babel实现低版本node兼容ES Module

**安装**

```powershell
yarn add @babel/node @babel/core @babel/preset-env --dev
```

**使用**`@babel/preset-env`----插件集合，包含了最新的js标准中的所有新特性

直接使用：

```powershell
yarn babel-node app.js --presets=@babel/preset-env
```

配置`@babel/preset-env`后使用，使用preset进行转换配置

在文件`.babelrc`中添加

```
{
	"presets":["@babel/preset-env"]
}
```

使用：`yarn babel-node app.js`



**使用**`@babel/plugin-transform-module-commonjs`---- 具体插件：将ESModule转换为CommonJS

```powershell
yarn add plugin-transform-module-commonjs --dev
```

配置`@babel/plugin-transform-module-commonjs`，

```
{
	"presets":["@babel/plugin-transform-module-commonjs"]
}
```

使用：`yarn babel-node app.js`

