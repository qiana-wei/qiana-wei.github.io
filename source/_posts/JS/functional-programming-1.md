---
title: 函数式编程
date: 2020-10-11 16:47:21
tags: ['函数式编程','Lodash']
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
* lodash, underscore,ramda等库可以帮助我们进行函数式开发



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

# 函数组合（compose）

使用纯函数和柯里化容易写出洋葱代码，函数组合可以让我们把细粒度的函数重新组合成一个新的函数。

如果一个函数要经过多个函数处理才能得到最终值，这个时候，可以把中间过程合并成一个函数。

函数就像是数据的管道，函数组合就是把这些管道连接起来，让数据穿过多个管道形成最终结果。

**函数组合默认是从右向左执行**

```js
//例子，将f,g函数进行组合
function compose(f,g){
  return function(value){
    return f(g(value))
  }
}
```

###  **lodash**中的组合函数

lodash中flow()和flowRight()都可以组合多个函数。

flow()是从左到右运行。

flowRight()是从右到左执行。

```js
//lodash中使用flowRight函数，取数组最后一个值，并大写
const _ = require('lodash')
const reverse = array => array.reverse() //反转函数
const first = array => array[0]	//取最后一个值
const toUpper = str => str.toUpperCase() //大写
const f = flowRight(toUpper,first,reverse)//组合函数

//测试
let array = ['case',1,2,3,4,'Jack']
console.log(f(array))  //JACJK
```

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

### 函数组合结合律

函数组合要满足结合律(associative)

a\*b\*c == a\*(b\*c) == (a\*b)\*c

即函数f,g,h组合时，f,g组合后再与h组合  与 g,h组合后再与f组合，结果是一样的

```js
let f = compose(f,g,h)
let associative = compose(compose(f,g),h)  === compose(f,compose(g,h))
//associactive == true
```

### 如何调试函数组合

```js
const _ = require('lodash')

const split = _.curry((sep,str)=>_.split(str,sep))
const join = _.curry((sep,arr)=>_.join(arr,sep))
const map = _.curry((fn,array)=>_.map(array,fn))
//调试函数
const log = _.curry((tag,v)=>{
    console.log(tag,v)
    return v
})

const f = _.flowRight(join('-'),log('map后打印的'),map(_.toLower),log('split后打印的'),split(' '))

console.log(f('NEVER SAY DIE'))
// split后打印的 [ 'NEVER', 'SAY', 'DIE' ]
// map后打印的 [ 'never', 'say', 'die' ]
// never-say-die
```

# Lodash 中的FP模块

[点击看这里](/2020/10/21/utility-library/Lodash/lodash-2/)

# PointFree

pointFree是一种编程风格，其具体实现是函数的组合

pointFree：我们可以把数据处理的过程定义成与数据无关的合成运算，不需要用到代表数据的那个参数，值要把简单的步骤合成到一起。

在使用这种模式之前，我们需要定义一些辅助的基本运算函数。

即：

* 不需要指明要处理的数据
* 只需要合成运算的过程
* 需要定义一些辅助的基本运算函数

函数式编程即将运算过程抽象成函数，而PointFree即把我们抽象出来的函数，再组合成一个函数。

**案例**

```js
//将字符串中首字母提取，并转换为大写，使用‘.’作为分隔符
//world wild web => W.W.W
const fp = require('lodash/fp')
const f = fp.flow(fp.split(' '),fp.map(fp.flow(fp.first,fp.toUpper)),fp.join('.'))
//测试
console.log(f('world wild web'))
//W.W.W
```



# 函子（Funtor）

## 为什么要学函子

利用函子控制副作用，处理异常及异步操作。

## 什么是函子（Funtor）

容器：包含值和值的变形关系（变形关系即为函数）

函子：是一个特殊的容器，通过一个普通的对象来实现，该对象具有map方法。map方法可以接受一个参数，这个参数是对值进行处理的函数。

* 函子维护一个值，值不对外公布

* 函子有map方法，对值进行处理，并返回一个包含新值的函子

```js
class Container {
  static of(value){
    return new Container(value)
  }
  constructor(value){
    this._value = value
  }
  map(fn){
    return Container.of(fn(this._value))
  }
}
//链式调用
let r = Container.of(5)
    .map(x=>x+2)
    .map(x=>x*x)

console.log(r)
```

## 函子处理异常

```js
let rseult = Container.of(null)
    .map(x=>x.toUpperCase)

console.log(r)
//报错
```

当函子传入值为null时，函数因报错而没有输出。

### MayBe函子

MayBe函子可以处理输入值为**空值**的异常

```js
class MayBe {
  static of(value){
    return new MayBe(value)
  }
  constructor(value){
    this._value = value
  }
  map(fn){
    return  this.isNothing() ? MayBe.of(null) : MayBe.of(fn(this._value))
  }
  isNothing(){
    return this._value === null || this._value === undefined
  }
}

let r = MayBe.of('Hello World')
        .map(x=>x.toUpperCase())

let r2 = MayBe.of(null)
        .map(x=>x.toUpperCase())

let r3 = MayBe.of('Hello World')
        .map(x=>x.toUpperCase())
        .map(x=>null)
        .map(x=>x.split(' '))

console.log(r)
//MayBe { _value: 'HELLO WORLD' }
console.log(r2)
//MayBe { _value: null }
console.log(r3)
//MayBe { _value: null }
```

由上述例子可以看出，MayBe函子不会报错，但当异常发生时，不会报错，但也没有返回我们的预期。

MayBe函子虽然可以处理空值的问题，但是不知道是在哪一步发生了空值。

### Either函子

Either函子会在函数出现异常时，给出异常的提示信息，用于异常处理。

拥有两个函子，当函数异常时，返回记录异常信息并其中一个函子。

```js
class Left{
  static of(value){
    return new Left(value)
  }
  constructor(value){
    this._value = value
  }
  map(fn){
    return this
  }
}

class Right{
  static of(value){
    return new Right(value)
  }
  constructor(value){
    this._value = value
  }
  map(fn){
    return Right.of(fn(this._value))
  }
}

function paseJson(str){
  try{
    return Right.of(JSON.parse(str))
  }catch(e){
    return Left.of({error:e.message})
  }
}
//异常
let r1 = paseJson('{name:zs}')
console.log(r1)
//Left { _value: { error: 'Unexpected token n in JSON at position 1' } }

//正常
let r = paseJson('{"name":"zs"}')
    .map(x=>x.name.toUpperCase())
console.log(r)
//Right { _value: 'ZS' }
```

### IO函子

* IO函子中的_value是一个函数，是把函数作为值来处理的
* IO函子可以把不纯的动作存储到_value中，延迟执行这个不纯的操作(惰性执行)，将有副作用的操作延迟到调用的时候
* 将有副作用的操作交给调用者来处理

```js
const fp = require('lodash/fp')
class IO{
  //返回值
  static of(value){
    return new IO(function(){
      return value
    })
  }
  constructor(fn){
    this._value = fn
  }
  //将map中的函数与of中的函数组合成一个新的函数
  map(fn){
    return new IO(fp.flowRight(fn,this._value))
  }
}

//测试

//process  node进程，execPath node执行位置
let r = IO.of(process).map(p=>p.execPath)
/*
将函数
function(){
  return value
}
与函数
p=>p.execPath
组合成一个函数组合

返回一个IO函子
*/
console.log(r)
//   IO { _value: [Function (anonymous)] }
console.log(r._value())
//   /usr/local/Cellar/node/14.2.0/bin/node
```

## 函子处理异步

[Folktale](https://folktale.origamitower.com/)是一个标准的函数式编程库。没有提供很多功能函数，值提供了一些函数式处理的操作。

```js
//folktale中的curry 与 compose
const { compose,curry} = require('folktale/core/lambda')
const { toUpper,first } = require('lodash/fp')

let f = curry(2,(x,y)=>x+y)
console.log(f(2,3))
console.log(f(2)(3))

let fn = compose(toUpper,first)
console.log(fn(['One','Two']))
```

### Tsak 函子处理异步

```js
//	异步读取文件
const fs = require('fs')
const {task} = require('folktale/concurrency/task')
const {split,find} = require('lodash/fp')
function readFile(fileName){
  return task(resolver=>{
    fs.readFile(fileName,'utf-8',(error,data)=>{
      if(error){
        resolver.reject(error)
      }
      resolver.resolve(data)
    })
  })
}

readFile('package.json')//返回task函子
  .map(split('\n'))
  .map(find(x=>x.includes('version')))
  .run()//执行
  .listen({
    onRejected:error=>{
      console.log(error)
    },
    onResolved:value=>{
      console.log(value)
    }
  })
```

## Pointed函子

pointed函子指实现了of静态方法的函子。

of方法是为了避免使用new来创建对象，更深层上，of方法用来把值放在上下文(context)，然后在上下文中处理值。（把值放在容器中，用map来处理值。）

## Monad函子

Monad函子是可以变扁的Pointed函子，解决函子嵌套的问题。

一个函子如果具有join和of两个方法并遵守一些定律，则这个函子为Monad函子。

monad函子内部实现

```js
const fs = require('fs')
const { curry,flowRight} = require('lodash/fp')

class IO {
  static of(value){
    return new IO(function(){
      return value
    })
  }
  constructor(fn){
    this._value = fn
  }
  map(fn){
    return new IO(flowRight(fn,this._value))
  }
  join(){
    return this._value()
  }
  flatMap(fn){
    return this.map(fn).join()
  }
}
let readFile = function(fileName){
  return new IO(function(){
    return fs.readFileSync(fileName,'utf-8')
  })
}
let print = function(x){
  return new IO(function(){
    console.log(x)
    return x
  })
}
let r = readFile('package.json')
    .flatMap(print)
    .join()
```

# 思维导图

{% pullquote mindmap mindmap-md %}
  - 函数式编程
    - 概念
      - 是一种编程范式
    - 特性
      - 1.函数是一等公民
      - 2.变量不可变性
      - 3.无可见的副作用
      - 4.高阶函数
      - 5.闭包
      - 6.柯里化、偏函数
    - 优点
      - 1.无可见的副作用
      - 2.不易出错，易于测试
      - 3.能够更好的处理并发问题
      - 4.无this指向问题
      - 5.惰性求值，益于性能优化
    - 函数式编程基础
      - 纯函数
      - 柯里化
      - 管道
      - 函数组合
    - 函子
      - Functor
      - MayBe：处理函数空值问题
      - Either：处理函数异常问题
      - IO：处理函数异步问题，返回函子
      - Monad： 处理函子嵌套调用问题，通过join调用函子
      - Task：处理函子异步问题
    - 辅助工具
      - lodash，lodash/fp
      - folktale
{% endpullquote %}

备注：
函数式编程是一种编程范式。
将运算过程抽象成函数
常用的编程范式还有：
  面向过程编程（命令式编程）、面向对象编程、范型编程等
函数式编程中，函数不是指计算机编程中的函数，而是数学中的函数，描述的是输入与输出的映射关系。
函数式编程中，变量也非计算机编程中值的存储单元，而是数学中的值，具有不可变性。
这也就注定了函数式编程中函数没有副作用的特性，即相同输入会得到相同输出。
故而使得函数式编程不易出错，易于测试。

