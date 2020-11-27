---

title: ECMAScript
date: 2020-11-15 13:01:22
tags: ['JS','ES']
category: 'JS'
---

# ECMAScript与Javascript

ECMAScript通常看作Javascript的标准化规范。但实际上JavaScript是ECMAScript的扩展语言。

ECMAScript值提供了最基本的语法，只停留在语言层面，不能完成实际的功能开发。

JavaScript实现困ECMAScript的标准，并在其基础上进行了扩展，使得我们可以在浏览器环境中操作DOM和BOM，在Node环境中可以做读写文件的操作。

**node环境中**，JavaScript = ECMAScript + Node Apis（fs, net,....）

**浏览器环境中**，JavaScript = ECMAScript + Web Apis (DOM, BOM)

# ECMAScript的发展过程

在2015年前，ECMAScript的版本迭代和发展非常缓慢。

从2015年开始，ECMAScript每年都会添加一些新的特性，保持一个大版本的更新。

| 标准版本 | 名称                             | 发行时间   |
| -------- | -------------------------------- | ---------- |
| 11       | **ECMAScript 2020 (ES2020)**     | 2020年6月  |
| 10       | ECMAScript 2019 (ES2019)         | 2019年6月  |
| 9        | ECMAScript 2018 (ES2018)         | 2018年6月  |
| 8        | ECMAScript 2017 (ES2017)         | 2017年6月  |
| 7        | ECMAScript 2016 (ES2016)         | 2016年6月  |
| 6        | **ECMAScript 2015 (ES2015,ES6)** | 2015年6月  |
| 5.1      | ECMAScript 5.1 (ES5.1)           | 2011年6月  |
| 5        | ECMAScript 5(ES5)                | 2009年12月 |
| 4        | ECMAScript 4 (ES4)               | 被放弃     |
| 3        | ECMAScript 3 (ES3)               | 1999年12月 |
| 2        | ECMAScript 2 (ES2)               | 1998年6月  |
| 1        | ECMAScript 1 (ES1)               | 1997年6月  |

# ECMAScript2015的新特性

ECMAScript2015可以作为新时代ECMAScript标准的代表版本。

原因：

1. 与ES5之间版本变化比较大
2. 从ECMAScript2015版本开始，ECMAScript的命名规则发生了变化

>  有些开发者习惯用ES6泛指ES2015之后的所有新版本

## 1. 解决原有语法上的一些问题或不足

### let, const

#### let块级作用域

let声明的变量的作用域是块级作用域，只在代码块中起作用，在代码块外无法访问。

let声明的变量不会出现变量提升的现象。let必须先声明变量才能访问变量。

#### const 只读常量

const声明常量，声明过后不允许再被修改。

所以const的声明和赋值必须在一个语句中完成，不能先声明，再赋值。

const声明的常量不允许修改，是指不允许修改常量的内存地址，并不是不允许修改常量中的属性成员。

```js
//允许修改常量的属性成员
const obj	= {}
obj.name = 'const obj'
console.log(obj)
//{ name: 'const obj' }

//不允许修改常量的内存地址
const obj	= {}
obj = {
  name:"const obj"
}
console.log(obj)
//报错
```

### let  const  var  的区别

1. let和var都是声明变量的，const是声明常量的。
2. let和const的作用域都是块级作用域，var的作用域可以是全局作用域，也可以是函数作用域。
3. var声明的变量，有变量提升的特性。let声明的常量和const声明的变量必须先声明，后使用。

## 2.对原有语法进行增强

### 解构：Destructuring

#### 数组解构

1. 解构的成员变量与数组元素一一对应

```js
//test1
const array = [100,200,300]
//变量名称与数组元素一一对应
const [foo,bar,baz] = array
console.log(foo,bar,baz)
//100，200，300
```

2. 若解构某个位置的元素，其前面的元素也需要空值占位

```js
//test2
const array = [100,200,300]
//变量名称与数组元素一一对应
const [,,baz] = array
console.log(baz)
//300
```

3. `...`表示从当前位置开始往后的所有成员，所有结果会放在一个数组中

```js
//test3
const array = [100,200,300]
//...表示从当前位置开始往后的所有成员，所有的结果会放在一个数组中
const [foo,...rest] = array
console.log(rest)
//[200,300]
```

4. 当结构赋值的数量大于数组长度时，会返回`undefined`

```js
//test4
const array = [100,200,300]
const [foo,foo1,foo2,foo3] = array
console.log(foo3)
//undefined
```

5. 若要给提取到的成员设置默认值，可以在结构成员后面直接赋值

```js
//test5
const array = [100,200,300]
const [foo,foo1,foo2,foo3='default value'] = array
console.log(foo3)
//default value

//test6
const array = [100,,300]
const [foo,foo1=400,foo2,foo3='default value'] = array
console.log(foo1,foo3)
//400 default value
```

#### 对象解构

1. 对象解构需要根据属性名解构提取

```js
//test1
const obj = {
  name:"ojb name",
  age:18
}
//提取obj中的name属性，放置于name变量当中
const {name} = obj
console.log(name)
//obj name
```

2. 可以在解构位置的成员名后，重新为解构添加新的名称

```js
//test2
const obj = {
  name:"ojb name",
  age:18
}
//提取obj中的name属性，放置于newName变量当中
const {name:newName} = obj
console.log(newName)
//obj name
```

3. 为解构添加默认值

```js
const obj = {
  name:"ojb name",
  age:18
}
const {name:newName = 'new obj name',age,sex='boy'} = obj
console.log(newName,age,sex)
//ojb name 18 boy
```

### 模版字符串

1. 模板字符串支持多行字符串

```js
const str = `hello es2015;
this is a \`string\``

console.log(str)
/*输出：
hello es2015;
this is a `string`
*/
```

2. 模板字符串支持通过差值表达式的方式，在字符串中嵌入变量或任何标准的js语句

```js
//test1
const name= 'tom'
const msg = `hey ${name}`
console.log(msg)
//hey tom

//test2
const sum = `1+2= ${1+2}`
console.log(sum)
//1+2=3

//test3
const number = 7
const msg = `there is ${number> 0 ? number : 'no'} ${number>0 ? 'dogs' :'dog'}`
console.log(msg)
//there is 7 dogs
```

3. 模板字符串函数标签

在模板字符串之前添加函数标签，调用函数。

标签函数能够接受到模板字符串中所有的常量字符串数组，以及所有的变量。

标签函数内部的返回值，即带标签的模板字符串的返回值。

```js
const name = 'tom'
const gender = true

function myTagFunc(string,name,gender){
  console.log(string,name,gender)
  return string[0]+name+string[1]+gender+string[2]
  //[ 'hey,', ' is a ', '.' ] tom true
}

const result = myTagFunc`hey,${name} is a ${gender}`
console.log(result)
//hey,tom is a true
```

函数标签的作用是可以对模板字符串进行加工,使返回的结果更适合用户阅读

```js
const name = 'tom'
const gender = true

function myTagFunc(string,name,gender){
  console.log(string,name,gender)
  const sex = gender ? 'man' : 'woman'
  return string[0] + name + string[1] + sex + string[2]
}
const result = myTagFunc`hey,${name} is a ${gender}`
console.log(result)
//hey,tom is a man
```

### 字符串扩展方法

`startWith('xx')`:判断字符串是否以xx开头

`endsWith('xx')`:判断字符串是否以xx结尾

`includes('xx')`:判断字符串是否包含xx

```js
const message = 'Error: foo is not defined.'
console.log(message.startsWith('Error'),message.endsWith('.'),message.includes('foo'))
//true true true
```

### 参数默认值

```js
function foo(enable = true){
  console.log('foo invoked - enable:',enable)
}
foo(false)
//foo invoked - enable: false
foo(0)
//foo invoked - enable: 0
foo('')
//foo invoked - enable: 
```

### `...`操作符

1. 对于不定参数函数，可以使用`...`将参数收敛至一个数组中。

```js
function foo(...args){
  console.log(args)
}
```

2. 展开数组

通过`...`操作符进行赋值，是深拷贝赋值

```js
const arr = ['foo','bar','baz']
console.log(...arr)
//foo bar baz 
```

### 箭头函数

1. this指向与普通函数指向不同

箭头函数不会改变this的指向。

```js
const person = {
  name:"tom",
  sayHi:function(){
    console.log(`hi, my name is ${this.name}`)
  },
  sayHello:()=>{
    console.log(`hello, my name is ${this.name}`)
  }
}
person.sayHi()
//hi, my name is tom
person.sayHello()
//hello, my name is undefined
```

2. 相当于普通函数，代码更简短，易读

### 对象字面量增强

当属性值与变量名相同时，可以省略变量名，只写属性名。

当属性为函数时，可以直接写函数

可以使用表达式的返回值，作为对象的属性名

```js
//之前写法
const bar = '345'
const obj = {
  foo:'123',
  bar:bar,
  module:function(){
    console.log('module')
  }
}
obj[Math.random()] = 123
//增强后
const bar = '345'
const obj = {
  foo:'123'
  bar,
  module(){
    console.log('module')
  },
  [Math.random]():123
}
```

### 对象扩展方法

1. Object.assign方法

将多个源对象的属性复制到一个目标对象中，如果对象中有相同的属性，则源对象的属性会覆盖掉目标对象只能够的属性。

并且复制过程是深拷贝，当再次修改源对象值时，不会改变target属性值

```js
const source = {
  a:123,
  b:345
}

const target = {
  a:1123,
  c:567
}
const result = Object.assign(target,source)

console.log(source)
//{ a: 123, b: 345 }
source.a = 2233
console.log(source)
//{ a: 2233, b: 345 }
console.log(target)
//{ a: 123, c: 567, b: 345 }
console.log(result)
//{ a: 123, c: 567, b: 345 }

```

2. Object.is方法

判断两个值是否相等

```js
console.log(0==false,0===false,Object.is(0,false))
//true false false
console.log(NaN==NaN,NaN===NaN,Object.is(NaN,NaN))
//false false true
console.log(+0==-0,+0===-0,Object.is(+0,-0))
//true true false
```

### Proxy 代理对象

>  Proxy 对象用于定义基本操作的自定义行为（如属性查找，赋值，枚举，函数调用等）。

监视某个对象中的属性读写，可以使用ES5中的`Object.defineProperty`来为对象添加属性，能够捕获到对象中属性的读写过程。

Proxy，专门为对象设置访问代理器，可以轻松监视到对象的读写过程。

**作用**

1. 拦截和监视外部对对象的访问
2.  降低函数或类的复杂度
3. 在复杂操作前对操作进行校验或对所需资源进行管理

```js
const result = new Proxy(target,handler)
```

`target`: 要代理的对象。可以是JavaScript中的任何合法对象。如: 数组, 对象, 函数等

`handler`: 自定义代理对象的各种可代理操作

`result`: 被代理后的新对象,它拥有`target`的一切属性和方法.只不过其行为和结果是在`handler`中自定义的.

```js
//例子
const person = {
  name:'zce',
  age:20
}
const personProxy = new Proxy(person,{
  //获取目标对象属性值
  get(target,property){
    return property in target ? target[property] : undefined
  },
	//设置、新增属性值
  set(target,property,value){
    if(personProxy === 'age'){
      if(!Number.isInteger(value)){
        throw new TypeError (`${value} is not an int`)
      }
    }
    target[property] = value
  }
})
//新增属性值
personProxy.gender = true
//修改属性值
personProxy.age = 30
//获取属性值
console.log(personProxy.age)
//30
console.log(person)
//{ name: 'zce', age: 30, gender: true }
```

**与`Object.defineProperty`对比**

1. Object.defineProperty只能监视的对象的读取或写入

   Proxy能够监视到更多对象操作，如：delete操作，对象中的方法调用等。

   ```js
   const person = {
     name:"zce",
     age:18
   }
   const personProxy = new Proxy(person,{
     deleteProperty(target,property){
       console.log('delete,',property)
       //delete, age
       delete target[property]
     }
   })
   
   delete personProxy.age
   console.log(person))
   //{ name: 'zce' }
   ```

2. Proxy更好的支持数组对象的监视

   可以用于重写数组的操作方法

   ```js
   const list = []
   const listProxy = new Proxy(list,{
       set(target,property,value){
           console.log('set',property,value)
           target[property] = value
           return true
       }
   })
   listProxy.push(100)
   ```

3. Proxy是以非侵入的方式监管了对象的读写

   对于一个已经定义好的对象，不需要对对象本身进行任何的操作，就可以监视到其内部成员的读写。

### handler

| handle方法               | 触发方式                                                 | 例子                                                         |
| ------------------------ | -------------------------------------------------------- | ------------------------------------------------------------ |
| get                      | 在读取代理对象的某个属性时触发该操作                     | 读取值：proxy.foo                                            |
| set                      | 在给代理对象的某个属性赋值时触发该操作                   | 写入值：proxy.foo = 1                                        |
| has                      | 在判断代理对象是否拥有某个属性时触发该操作               | in 操作符：'foo' in proxy                                    |
| deleteProperty           | 在删除代理对象的某个属性时触发该操作                     | 删除值：delete proxy.foo                                     |
| getPrototypeOf           | 在读取代理对象的原型时触发该操作                         | Object.getPrototypeOf(proxy)                                 |
| setPrototypeOf           | 在设置代理对象的原型时触发该操作                         | Object.setPrototypeOf(proxy, null)                           |
| isExtensible             | 在判断一个代理对象是否是可扩展时触发该操作               | Object.isExtensible(proxy)                                   |
| preventExtensions        | 在让一个代理对象不可扩展时触发该操作                     | Object.preventExtensions(proxy)                              |
| getOwnPropertyDescriptor | 在获取代理对象某个属性的属性描述时触发该操作             | Object.getOwnPropertyDescriptor(proxy, "foo")                |
| defineProperty           | 在定义代理对象某个属性时的属性描述时触发该操作           | Object.defineProperty(proxy, "foo", {})                      |
| ownKeys                  | 在获取代理对象的所有属性键时触发该操作                   | Object.getOwnPropertyNames(proxy)、Object.getOwnPropertySymbols(proxy) |
| apply                    | 在调用一个目标对象为函数的代理对象时触发该操作           | proxy()                                                      |
| construct                | 在给一个目标对象为构造函数的代理对象构造实例时触发该操作 | new proxy()                                                  |



## 3.全新的对象、全新的方法、全新的功能

### Reflect   统一的对象操作API

reflect属于一个静态类，不能通过new的方式构建实力对象。只能够调用静态类中的一些静态方法。

Relfect内部封装了一系列对对象的底层操作（14个静态方法）。

Reflect成员方法就是Proxy处理对象的默认实现。

```js
const obj = {
  foo:"123",
  bar:"456"
}
const proxy = new Proxy(obj,{
  get(target,property){
    return Reflect.get(target,property)
  }
})
console.log(proxy.foo)
//123
```

Reflect最大的作用就是提供了一套用于操作对象的API，统一了对象的操作方式。

```js
const obj = {
  name:'zce',
  age:18
}
  
//之前
//判断obj是否有‘name’属性
console.log('name' in obj)

//获取obj的多有key
console.log(Object.keys(obj))

//删除obj的age属性
console.log(delete obj['age'])

//使用reflect
console.log(Reflect.has(obj,'name'))
console.log(Reflect.ownKeys(obj))
console.log(Reflect.deleteProperty(obj,'age'))
```

**Reflect方法**

1. **Reflect.get(target, property[,receiver])**

   参数：

   ​	target：需要取值的目标对象

   ​	propertyKey：需要获取的值的键值

   ​	receiver：如果`target`对象中指定了`getter`，`receiver`则为`getter`调用时的`this`值	

   返回值：属性的值

   描述：从对象中取属性值

2. **Reflect.set(target,property,value[,receiver])**

   参数：

   ​	target:设置属性的目标对象

   ​	property:需要设置的属性名称

   ​	value：设置的属性值

   ​	receiver：如果遇到`setter`,`reciver`则为`setter	`调用时的`this`值

   返回值：Boolean值，表示是否成功设置属性

   描述：在对象上设置属性

3. **Reflect.has(target,propetyKey)**

   参数：

   ​	target：目标对象

   ​	propwetyKey：属性名，需要检查目标对象是否存在此属性

   返回值：Boolean值，表示是否存在此属性。

   描述：检查一个对象是否拥有某个属性

4. **Reflect.deleteProperty(target,propertyKey)**

   参数：

   ​	target: 目标对象

   ​	propertyKey:属性名，要在目标对象上删除的属性名

   返回值：Boolean值，表示该属性是否被成功删除

   描述：删除一个对象上的属性

5. **Reflect.getPrototypeOf(target)**

   参数：

   ​	target:获取原型的目标对象	

   返回值：给定对象的原型。如果给定对象没有继承的属性，则返回 `null`

   描述：返回指定对象的原型 

6. **Reflect.setPrototypeOf(target, property)**

   参数：

   ​	target:设置原型的目标对象

   ​	property:对象的新原型（一个对象或 `null`）

   返回值：Boolean值，表明是否原型已经成功设置

   描述：改变指定对象的原型

7. **Reflect.isExtensible(target)**

   参数：

   ​	target:检查是否可扩展的目标对象

   返回值：Boolean值，值表明该对象是否可扩展

   描述：判断一个对象是否是可扩展的

8. **Reflect.preventExtensions(target)**

   参数：

   ​	target:阻止扩展的目标对象

   返回值：Boolean值，表明目标对象是否成功被设置为不可扩展

   描述：阻止新属性添加到对象

9. **Reflect.getOwnPropertyDescriptor(target, propertyKey)**

   参数：

   ​	target:需要寻找属性的目标对象

   ​	propertyKey:获取自己的属性描述符的属性的名称

   返回值：如果属性存在于给定的目标对象中，则返回属性描述符,否则返回undefined

   描述：返回一个属性描述符

10. **Reflect.defineProperty(target, propertyKey, attributes)**

    参数：

    ​	target:目标对象

    ​	propertyKey:要定义或修改的属性的名称

    ​	attributes:要定义或修改的属性的描述

    返回值：Boolean值，表明属性是否被成功定义

    描述：允许精确添加或修改对象上的属性

11. **Reflect.ownKeys(target)**

    参数：

    ​	target:获取自身属性键的目标对象

    返回值：由目标对象的自身属性键组成的数组

    描述：取目标对象自身的属性键组成的数组

12. **Relfect.apply(target, thisArgument, argumentsList)**

    参数：

    ​	target: 目标函数

    ​	thisArgument: target函数调用时绑定的this对象

    ​	argumentsList: target函数调用时传入的实参列表，该参数应该是一个类数组的对象

    返回值：返回值是调用完带着指定参数和 `this` 值的给定的函数后返回的结果

    描述：调用一个方法并且显式地指定 `this` 变量和参数列表(arguments) ，参数列表可以是数组，或类似数组的对象

13. **Reflect.construct(target, argumentsList[, newTarget])**

    参数：

    ​	target: 被运行的目标构造函数

    ​	argumentsList: 类数组，目标构造函数调用时的参数

    ​	newTarget: 作为新创建对象的原型对象的`constructor`属性

    返回值：以`target`（如果`newTarget`存在，则为`newTarget`）函数为构造函数，`argumentList`为其初始化参数的对象实例
    
    描述：使用可变的参数来调用构造函数

### Promise

提供了一种全新的异步编程方案，解决了传统异步编程中回调函数嵌套过深的问题。

### class类

使用class关键词声明一个类型。

```js
class Person{
  //构造函数
  constructor(name){
    this.name = name
  }
  say(){
    console.log(`hi, my name is ${this.name}`)
  }
}

const tom = new Person('tom')
tom.say()
```

#### 静态成员 static

类中包含实例方法和静态方法。

实例方法需要通过这个类型构造的实例对象去调用。

静态方法只需要通过类型本身去调用。

```js
class Person{
  //构造函数
  constructor(name){
    this.name = name
  }
  say(){
    console.log(`hi, my name is ${this.name}`)
  }
  static creat(name){
    return new Person(name)
  }
}

const tom = Person.creat('tom')
tom.say()
```

静态方法挂载在类型上面，所以静态方法内部的this不是指向某个实例对象，而是指向当前的类型。

#### 类的继承 extends

```js
class Person{
  constructor(name){
    this.name = name
  }
  say(){
    console.log(`hi, my name is ${this.name}`)
  }
}

//Student 继承Person
class Student extends Person{
  constructor(name,number){
    //调用父类的构造函数
    super(name)
    this.number = number
  }
  hello(){
    //调用父类方法
    super.say()
    console.log(`my school number is ${this.number}`)
  }
}
const jack = new Student('jack',100)
jack.hello()
```

## 4.全新的数据类型和数据结构

### Set 数据结构

可以理解为集合，与传统的数组非常类似。但是set内部的成员是不允许重复的。

即每个值在Set中都是唯一的。

```js
const setData = new Set()

//在Set对象尾部添加一个元素。返回该Set对象。
console.log(setData.add(1).add(2).add(3))
//Set(3) { 1, 2, 3 }

//**属性**  返回 Set 对象中的值的个数
console.log(setData.size)
//3

//返回一个新的迭代器对象，该对象包含Set对象中的按插入顺序排列的所有元素的值
console.log(setData.values())
//[Set Iterator] { 1, 2, 3 }

//返回一个布尔值，表示该值在Set中存在与否。
console.log(setData.has(2))
//true

//如果Set 对象中存在该元素，则移除它并返回 true；否则如果该元素不存在则返回 false。
console.log(setData.delete(2))
//true

//按照插入顺序，为Set对象中的每一个值调用一次callBackFn
setData.forEach(item=>console.log(item))
//1
//3

//返回一个新的迭代器对象，该对象包含Set对象中的按插入顺序排列的所有元素的值的[value, value]数组。为了使这个方法和Map对象保持相似， 每个值的键和值相等
console.log(setData.entries())
//[Set Entries] { [ 1, 1 ], [ 3, 3 ] }

//移除Set对象内的所有元素。
console.log(setData.clear())
//undefined

console.log(setData)
//Set(0) {}
```

**应用---数组去重**

```js
const arr = [1,2,3,3,4,5,5,6]
const setResult = new Set(arr)
//将伪数组转化为数组
const result = Array.from(setResult)
//const result = [...setResult]
console.log(setResult)
//Set(6) { 1, 2, 3, 4, 5, 6 }
console.log(result)
//[ 1, 2, 3, 4, 5, 6 ]
```

### Map 数据结构

**`Map`** 对象保存键值对，并且能够记住键的原始插入顺序。任何值(对象或者[原始值](https://developer.mozilla.org/zh-CN/docs/Glossary/Primitive)) 都可以作为一个键或一个值。

```js

const mapData = new Map()
const tom = {name:"tom"}
//设置Map对象中键的值。返回该Map对象。
console.log(mapData.set(tom,90))
//Map(1) { { name: 'tom' } => 90 }
console.log(mapData.set('jon',20))
//Map(2) { { name: 'tom' } => 90, 'jon' => 20 }

// **属性** 返回Map对象的键/值对的数量。
console.log(mapData.size)
//2

//返回一个新的 Iterator对象， 它按插入顺序包含了Map对象中每个元素的键 
console.log(mapData.keys())
//[Map Iterator] { { name: 'tom' }, 'jon' }

//返回一个新的Iterator对象，它按插入顺序包含了Map对象中每个元素的值 。
console.log(mapData.values())
//[Map Iterator] { 90, 20 }

//返回一个布尔值，表示Map实例是否包含键对应的值。
console.log(mapData.has(tom))
//true

//返回键对应的值，如果不存在，则返回undefined。
console.log(mapData.get(tom))
//90

//按插入顺序，为 Map对象里的每一键值对调用一次callbackFn函数。如果为forEach提供了thisArg，它将在每次回调中作为this值
mapData.forEach(item=>console.log(item))
//90
//20

//返回一个新的 Iterator 对象，它按插入顺序包含了Map对象中每个元素的 [key, value] 数组。
console.log(mapData.entries())
//[Map Entries] { [ { name: 'tom' }, 90 ], [ 'jon', 20 ] }

//如果 Map 对象中存在该元素，则移除它并返回 true；否则如果该元素不存在则返回 false。
console.log(mapData.delete('jon'))
//true

//移除Map对象的所有键/值对 。
console.log(mapData.clear())
//undefined

console.log(mapData)
//Map(0) {}
```

**Objects与maps比较**

|          | Map                                                          | Object                                                       |
| -------- | ------------------------------------------------------------ | ------------------------------------------------------------ |
| 意外的键 | Map默认情况下不包含任何键。值包含显示插入的键。              | 一个Object有一个原型，原型链上的键名有可能与自己在对象上设置的键名产生冲突 |
| 键的类型 | 一个Map的键可以是任意值，包括函数、对象或任意基本类型。      | 一个Object的键必须是一个String或Symbol。                     |
| 键的顺序 | Map中的Key是有序的。因此，当迭代的时候，一个Map对象以插入的顺序返回键值。 | 一个Object的键是无序的。                                     |
| size     | Map的键值对个数可以同size属性获得                            | Object的键值对个数只能手动计算                               |
| 迭代     | Map是iterbale的，所以可以直接被迭代                          | 迭代一个 Object需要以某种方式获取他的键，然后才能迭代        |
| 性能     | 在频繁的增删键值对的场景下，表现更好                         | 在频繁的增删键值对的场景下，未作出优化                       |

### Symbol  --   一种全新的原始数据类型

symbol类型的数据是唯一的，表示一个独一无二的值。

**语法：**`Symbol([description])`,

​	description,可选的，字符串类型。对symbol的描述，可用于调试但不是访问symbol本

**作用：**为对象添加一个独一无二的属性名

```js
const symbolData1 = Symbol()
console.log(symbolData1)
//Symbol()
console.log(typeof symbolData1)
//symbol
console.log(Symbol() === Symbol())
//false
```

为了方便开发调试，Symbol类型允许我们传入一个字符串作为Symbol的描述文本

```js
console.log(Symbol('foo'))
//Symbol(foo)
console.log(Symbol('bar'))
//Symbol(bar)
```

从ES2015开始，Symbol可以作为对象的键。

```js
const obj = {
  [Symbol()]:123
}
console.log(obj)
//{ [Symbol()]: 123 }
```

利用Symbol实现私有成员

```js
//a.js
const name = Symbol()
const person = {
  [name]:'zce',
  say(){
    console.log(this.name)
  }
}

//b.js
//无法创建一个与a.js中name一样的Symbol，所以不能拿到name值，只能访问say方法
person.say()
```

**使用全局Symbol**

要创建跨文件可用的symbol，甚至跨域（每个都有它自己的全局作用域） , 使用 [`Symbol.for()`](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Symbol/for) 方法和  [`Symbol.keyFor()`](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Symbol/keyFor) 方法从全局的symbol注册表设置和取得symbol。

```js
//Symbol 维护字符串与Symbol之间的对应关系
//若传入的不是字符串，内部会自动转为字符串
const s1 = Symbol.for('foo')
const s2 = Symbol.for('foo')
console.log(s1,s2,s1===s2)
//Symbol(foo) Symbol(foo) true

console.log(Symbol.keyFor(s1))
//foo

console.log(Symbol.for('true') === Symbol.for(true))
//true
```

### for...of...循环

for循环：适合遍历普通数组

for..in 循环：适合遍历键值对

for..of循环：可以作为遍历所有数据结构的统一方式。

```js
//遍历数组
const arr = [100,200,300,400]
for(let item of arr){
  console.log(item)
  if(item > 200){
    //可以使用break终止循环
    break
  }
}
/*
100
200
300
400
*/
```

```js
//遍历Set数据
const setData = new Set(['foo','bar'])
for(let item of setData){
  console.log(item)
}
/*
foo
bar
*/
```

```js
//遍历Map数据
const mapData = new Map()
mapData.set('foo',123)
mapData.set('bar',456)
for(let item of mapData){
  console.log(item)
}
/*
[ 'foo', 123 ]
[ 'bar', 456 ]
*/
for(let [key,value] of mapData){
  console.log(key,value)
}
/*
foo 123
bar 456
*/
```

```js
//遍历对象
const obj = {
  foo:123,
  bar:456
}

for(let item of obj){
  console.log(item)
}
//报错！！
//obj is not iterable（对象是不可迭代的）
```

ES中能够表示有结构的数据类型越来越多，像Array，Object，Set，Map，甚至开发者可以组合使用这些数据类型来。

为了能够统一的遍历各种数据结构，ES2015提供了一个Iterable的接口。实现Iterable接口就是使用for..of..循环的前提。

所有可以使用for..of..循环的数据类型，内部必须实现了iterable的接口，即必须挂在一个iterator方法，iterator方法需要返回一个带有next方法的对象，我们不断调用next方法，就可以实现对数据的遍历。

```js
const setData = new Set(['foo','bar','baz'])
const iterator = setData[Symbol.iterator]()
console.log(iterator.next())
//{ value: 'foo', done: false }
console.log(iterator.next())
//{ value: 'bar', done: false }
console.log(iterator.next())
//{ value: 'baz', done: false }
console.log(iterator.next())
//{ value: undefined, done: true }
```

**实现可迭代接口**

```js
/*
obj:实现了可迭代接口（Iterable），内部必须有一个用于返回迭代器的iterator方法。
iterabor方法通过Symbol.iterator实现。

iterator方法实现了迭代器接口（Iterator），内部必须有一个用于迭代的next方法。

next方法实现了迭代结果接口（IterationResult），内部返回当前被迭代到的数据及是否迭代完成
*/
const obj = {
  store:['foo','bar','baz'],
  [Symbol.iterator]:function(){
    let index = 0
    const self = this
    return {
      next:function(){
        const result = {
          value:self.store[index],
          done:index >= self.store.length
        }
        index++
        return result
      }
    }
  }
}

for(let item of obj){
  console.log(item)
}
/*
foo
bar
baz
*/

```

**为什么实现迭代器接口？？ --- 迭代器模式**

对外提供给统一的实现接口，使外部不用关心内部的数据结构式怎样的。

### 生成器函数   Generator

为了在复杂的异步代码中，避免回调函数嵌套过深的问题，提供更好的异步编程解决方案。

**语法及基本应用**

生成器函数会自动返回一个生成器对象，调用对象的`next`方法，才会让对象的函数体开始执行。

执行过程中一旦遇到`yeild`关键词，函数的执行过程就会被暂停下来。`yeild`后面的值，将会作为结果返回。

继续调用生成器的`next`方法，函数会在暂停的地方继续执行。

```js
function * foo(){
  console.log('zce')
  return 100
}
const result = foo()
console.log(result)
//Object [Generator] {}
console.log(result.next())
//zce
//{ value: 100, done: true }
```

```js
function * foo(){
  console.log('111')
  yield 100
  console.log('222')
  yield 200
  console.log('333')
  yield 300
}

const result = foo()
console.log(result)
//Object [Generator] {}
console.log(result.next())
//111
//{ value: 100, done: false }
console.log(result.next())
//222
//{ value: 200, done: false }
console.log(result.next())
//333
//{ value: 300, done: false }
console.log(result.next())
//{ value: undefined, done: true }
```

**生成器函数的应用**

```js
//发号器
function * createIdMaker(){
    let id = 1
    while(true){
      yield id++
    }
}
const idMaker = createIdMaker()
console.log(idMaker.next())
console.log(idMaker.next())
console.log(idMaker.next())
console.log(idMaker.next())
/*
{ value: 1, done: false }
{ value: 2, done: false }
{ value: 3, done: false }
{ value: 4, done: false }
*/
```

```js
//对象的Iterator方法
const todos = {
  life:['吃饭','睡觉','打豆豆'],
  learn:['语文','英语','数学'],
  work:['喝茶'],
  [Symbol.iterator]:function * (){
    const all = [...this.life,...this.learn,this.work]
    for(let item of all){
      yield item
    }
  }
}

for(let item of todos){
  console.log(item)
}
```

### ES Modules

> 语言层面的模块标准化

#  ECMAScript 2016

## includes 方法

> 检查数组中是否包含指定元素

```js
const arr = ['foo',1,NaN,false]
console.log(arr.includes(NaN))
//true
```

## 指数运算符  (底数 ** 指数)

```js
console.log(Math.pow(2,10))
//1024
console.log(2**10)
//1024
```

# ECMAScript 2017

## Object扩展方法

```js
const obj = {
  foo:'value1',
  bar:'value2'
}

//Object.values   返回对象中的所有值
console.log(Object.values(obj))
//[ 'value1', 'value2' ]

//Object.entries   以数组的形式返回对象中的键值对
console.log(Object.entries(obj))
//[ [ 'foo', 'value1' ], [ 'bar', 'value2' ] ]
	//可以利用Object.entries将一个对象转换为一个Map类型的对象
	console.log(new Map(Object.entries(obj)))
	//Map(2) { 'foo' => 'value1', 'bar' => 'value2' }

//Object.getOwnPropertyDescriptors  获取对象中属性的完整描述信息
console.log(Object.getOwnPropertyDescriptors(obj))
/*
{
  foo: {
    value: 'value1',
    writable: true,
    enumerable: true,
    configurable: true
  },
  bar: {
    value: 'value2',
    writable: true,
    enumerable: true,
    configurable: true
  }
}
*/
```

## 字符串填充方法

用给定字符串填充目标字符串的开始或结束位置，知道字符串达到指定长度

```js
const books = {
  html:5,
  css:16,
  javascript:128
}
for(let [name,count] of Object.entries(books)){
  console.log(`${name.padEnd(16,'-')} | ${count.toString().padStart(3,'0')}`)
}
/*
html------------ | 005
css------------- | 016
javascript------ | 128
*/
```

## 允许在函数参数中添加尾逗号

```js
function(bar,baz,){
  //...
}
```

## Async/Await

解决异步函数回调嵌套过深的问题，是Promise的语法糖。



# ECMAScript2020

## 动态导入语句 `import()`

标准的`import()`导入的模块是静态的。所有被导入的模块，在加载时就被编译，不能做到按需加载，浪费性能，降低了首页的加载速度。

在之前，为了使用动态按需导入，需要使用`require()`语句。

```js
//之前
if(isLoaded){
  const menu = require('./menu.js')
}
//使用动态导入语句import
if(isLoaded){
  const menu = import('./menu.js')
}
```

**import返回的是Promise对象**，在某些事件回调中使用动态导入时，可以在then函数中，对事件进行处理。

```js
ele.onclick=()=>{
  import('./menu.js').then(res=>{
    //处理函数
  }).catch(error=>{
    //错误处理
  })
}
```

**import也支持在await语句中使用**

```js
const menu = await import('./menu.js')
```

## String` 的 `matchAll` 方法

> 返回一个包含所有匹配正则表达式的结果的迭代器。可以使用for..of..循环，也可使用`...` 或Array.form转换为数组

```js
const str = '2020-11-18'
const reg = /\d/g  // 匹配数字
console.log(str.matchAll(reg))
//Object [RegExp String Iterator] {}
console.log([...str.matchAll(reg)])
/*
[
  [ '2', index: 0, input: '2020-11-18', groups: undefined ],
  [ '0', index: 1, input: '2020-11-18', groups: undefined ],
  [ '2', index: 2, input: '2020-11-18', groups: undefined ],
  [ '0', index: 3, input: '2020-11-18', groups: undefined ],
  [ '1', index: 5, input: '2020-11-18', groups: undefined ],
  [ '1', index: 6, input: '2020-11-18', groups: undefined ],
  [ '1', index: 8, input: '2020-11-18', groups: undefined ],
  [ '8', index: 9, input: '2020-11-18', groups: undefined ]
]
*/
```

## `import.meta`

`import.meta`返回一个含有`url`属性的对象。`url`为当前模块的url路径，只能在模块内部使用。

## 导出模块的命名空间

> export * as name from 'module'

ES2020新支持的语法

```js
export * as utils from 'module'
```

等价于

```js
import * as utils from 'module'
export {utils}
```

**\*\*注意，`export * as utils from 'module' `语句不会真的导入模块，因此在语句所在的模块中，是获取不到 `utils`的**

## Promise.allSettled`

Promise中，如果参数中的任何一个promise为reject的话，则整个Promise.all 调用会立即终止，并返回一个reject的新的 Promise 对象。

Promise.allSettled跟Promise.all类似, 其参数接受一个Promise的数组, 在所有Promise对象运算完成后，返回一个新的Promise对象，并带有一个对象数组，表示每个输入的Promise对象对应的结果。

```js
const promise1 = Promise.resolve('promise1 reoslve')
const promise2 = Promise.reject('promise2 reject')
const promise3 = new Promise((resolve,reject)=>{
  setTimeout(()=>{
    resolve('promise3 setTimeout reoslve')
  })
})

Promise.allSettled([promise1,promise2,promise3]).then(res=>{
  console.log(res)
})

/*
[
	{status: "fulfilled", value: "promise1 reoslve"}
	{status: "rejected", reason: "promise2 reject"}
	{status: "fulfilled", value: "promise3 setTimeout reoslve}
]
*/
```

## 一种新的数据类型：`BigInt`

>  允许开发者在 JS 中使用更大的整数进行数据处理

Javascript中，最大整数位2的53次方减一（Math.pow(2,53)-1）,但是BigInt不受这个限制。

**BigInt与Number是两种数据类型，两种数据类型之间不能计算，但是可以进行比较操作。**

为了区分BigInt与Number数据类型，BigInt数据会在数据末尾加添加后缀`n`.

```js
//number 最大数值为2^53，即9007199254740992，最大安全数值为2^53-1，即9007199254740991
const num1 = 9007199254740992
console.log(9007199254740992+1)
//9007199254740992

const num2 = 9007199254740992n
console.log(9007199254740992n+1n)
//9007199254740993n

console.log(99n + 1);
//报错
```

可以使用`BigInt`来初始化`BigInt`

```js
const bigInt = BigInt(999)
console.log(bigInt)
//999n
```

BigInt与Number进行比较

```js
console.log(99n == 99); 
//true
console.log(99n === 99); 
//false 
```

## `GlobalThis`

ES2020引入`GlobalThis`,在各个环境中，都可以使用`GlobalThis`拿到顶层对象。

JS中存在一个顶层对象，但这个顶层对象在各个环境中的名称却不尽相同。在`GlobalThis`引入之前，为了拿到这个顶层对象，需要对环境进行判断。

```js
//Web 中，window，self
//Web Workers中，self
//Node中，Global
const getGlobal = function () {
    if (typeof self !== 'undefined') { return self; }
    if (typeof window !== 'undefined') { return window; }
    if (typeof global !== 'undefined') { return global; }
    throw new Error('unable to locate global object');
};
```

`GlobalThis`引入的目的，就是提供一种标准化的访问全局对象的方式。

## 空位合并操作符--Nullish coalescing Operator--`??`

操作符：`??`,当左侧值为nullish，即`null` 或`undefined`时，返回右侧操作数，否则返回左侧操作数。

类似于操作符`||`。`||`判定的值为false时，返回右侧操作数，而`??`只有判定值为nullish，即`null`或`undefined`时才返回右侧操作数。

```js
console.log(false || '||输出值1')
//||输出值1
console.log(false ?? '??输出值1')
//false            
            
console.log(0 || '||输出值2')
//||输出值2
console.log(0 ?? '??输出值2')
0            
           
console.log(null || '||输出值3')
//||输出值3
console.log(null ?? '??输出值3')
//??输出值3         
            
console.log(undefined || '||输出值4')
//||输出值4
console.log(undefined ?? '??输出值4') 
//??输出值4           
            
console.log("" || '||输出值5')
//||输出值5
console.log("" ?? '??输出值5')
//
```

## 可选链操作符--Optional Chaining--`?.`

当我们要读取一个多层嵌套对象中的某个值时，需要先确认其前置对象存不存在。

例如，

```js
const Jon = {
  dad:{
    name:"Jon dad",
    dad:{
      name:"Jon GrandPa",
    }
  },
  mom:{
    name:"Jon mom",
    mon:{
      name:"Jon GrandMa",
    }
  }
}
```

当我们读取`Jon.dad.mom.name`时就会报错`Uncaught TypeError: Cannot read property...`，因为没有`Jon.dad.mom`这个值。因此，我们要读取`Jon.dad.mom.name`前，需要判定有`Jon`、`Jon.dad`、`Jon.dad.mom`、`Jon.dad.mom.name`

```js
if(Jon&&Jon.dad&&Jon.dad.mom&&Jon.dad.mom.name){
  console.log(Jon.dad.mom.name)
}
```

`?.`很好的解决了这个问题，我们只需要调用`Jon?.dad?.mon?.name`,即可以达到`Jon&&Jon.dad&&Jon.dad.mom&&Jon.dad.mom.nam`的目的

当值为`nullish`时，即`null`或`undefined`时，直接返回`undefined`

