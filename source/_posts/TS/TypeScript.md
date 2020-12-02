---
title: TypeScript
date: 2020-11-27 11:17:27
tags: ['TS']
category: 'TS'
---

[TS官网了解一下](https://www.typescriptlang.org/zh/)

# 简介

TypeScript是JavaScript的超集。在JavaScript基础上添加了一些扩展特性（更强大的类型系统及对ES新特性的支持）。最终，TS会被编译为JS。

TS可以帮助我们在开发阶段发现代码的类型异常，提高开发效率以及编码的可靠程度。

因为TS最终会被编译为JS，而且，最低可以编译为ES3，所以，在任何一种JavaScript运行环境的开发，都可以使用TS进行开发。

TS作为一门完整的开发语言，其功能更加强大，生态也更加健全和完善。

# 与JS比较

TS不是一种新的语言，是JS的超集。为JS的生态增加了类型机制，并最终将代码编译为纯粹的JS。

| TypeScript                                                   | JavaScript                               |
| ------------------------------------------------------------ | ---------------------------------------- |
| JS的超集                                                     | 一种脚本语言，用于创建动态网页           |
| 强类型，支持静态和动态类型                                   | 若类型，没有静态类型选项                 |
| 可以在编译期间发现并纠正错误。                               | 作为一种解释型语言，只能在运行时发现错误 |
| 需要编译成JS，编译支持支持ES3，ES4，ES5，ES6等，以便被浏览器理解 | 不需要编译，可以直接被浏览器理解         |
| 支持模块、泛型和接口                                         | 不支持模块、泛型和接口                   |

# 优缺点

**优点**

1. TS属于渐进式的，兼容JS，对ECMAScript有很好的支持
2. 在编译阶段就可以发现大部分错误，不需要在运行时才发现，有利于提高编程效率与编码可靠度。
3. TS的语法增强了代码的可读性和可维护行，结合编译器与IDE的功能，提高了编码效率。

**缺点**

1. 语言本身有很多概念，像是接口、泛型等，提高了学习成本
2. 项目初期，TS的接口定义、编译配置等会增加开发成本
3. 从集成到构建需要一些工作量
4. 可能与一些第三方库结合不完美，需要单独添加一些声明。

# 安装

**工具：yarn**

```powershell
yarn add typescript --dev
```

# 编译

```powershell
yarn tsc <文件名>
```

# 配置文件

**初始化`tsconfig.json`配置文件**

```powershell
yarn tsc --init
```

```json
//tsconfig.json
{
  "compilerOptions":{
    "target":"es5", /*编译后的文件采用的ES标准，'ES3','ES5','ES2015', 'ES2016', 'ES2017', 'ES2018', 'ES2019', 'ES2020', or 'ESNEX*/
    "module":"commonjs", /*输出的代码采用什么方式进行模块化,'none', 'commonjs', 'amd', 'system', 'umd', 'es2015', 'es2020', or 'ESNext'*/
    "outDir":"dist/ts", /*编译结果，输出文件目录*/
    "rootDir":"code/ts", /*源文件目录*/
    "sourceMap":true, /*开始源代码映射，调试时可以使用sourceMap文件调试TS源代码*/
    
    /*类型检查选项*/
    "strict":true, /*开启严格模式，开启所有严格检查选项，对类型的检查非常严格，要为每个成员明确指定类型,不能隐式推断*/
    "strictNullCheck":true, /*开启严格的null检查机制，对明确的指定类型变量，其值不能为空（null 或 undefined）*/
  }
}
```

**编译整个项目**

```powershell
yarn tsc
```

# 数据类型

## 原始数据类型

> 在TS非严格模式下，`string`,`number`,`boolean`数据类型允许数据为`null`或`undefined`
>
> 在严格模式下或开启“strictNullCheck”时，则不允许

### `string`,`number`,`boolean`

```js
//严格模式下
const str: string = 'str string'
const num: number = 100 // NaN, Infinity
const booleanType: boolean = true // false

//非严格模式下
const str: string = 'str string' // null, undefined
const num: number = 100 // NaN, Infinity, null, undefined
const booleanType: boolean = true // false, null, undefined
```

### `void`空值

```js
//严格模式下
const voidType:void = undefined

//非严格模式下
const voidType:void = undefined //null
```

### `null`,`undefined`

```js
const nullType: null = null
const undefinedType: undefined = undefined
```

### `Symbol`

> 需要添加ES6
>
> 通过lib选项添加额外的标准库支持

```json
//tsconfig.json
{
   "lib": ['ES6','dom','bom','ES2020'], /* Specify library files to be included in the compilation. */
}
```

```typescript
const symbolType:symbol  = Symbol()
```

### `BigInt`

> 当编译版本低于ES2020时，不能够使用`BigInt`数据类型哦😭

```typescript
const BigIntType:bigint = 20n
```

## Object 类型

> TS中的Object类型并不仅仅指对象，而是泛指对象类型，包含Object、Array、函数等

```typescript
const foo: object = function(){} //[] //{}
const obj: {foo:number} = {foo:100}
```

## 数组

```typescript
// 定义元素类型为数字的数组
const arr1 = Array<number> = [1,2,3]
const arr2 = number[] = [1,2,3]

// 定义参数类型为数字，返回值为数字的函数
function sum(...args: number[]):number{
  return args.reduce((pre,current)=>pre + current,0)
}
```

## 元组

> 明确元素数量以及元素类型的数组

```typescript
const temp: [number,string] = [20,'name']

//通过下标的方式获取元素
const age = temp[0]
const name = temp[1]

//通过结构赋值的方式获取元素
const [age,name] = temp
```

```typescript
//通过Object.entries获取对象中的键值数组，其中的键值即为元组

Object.entries({
  foo:123,
  bar:245
})
```

## 枚举类型 `enum`

> 枚举可以给值起一个更具有语义化的名字，并且枚举不会产生期望以外的值。

枚举的值可以是数字或字符串，若值为数字，不对值进行赋值时，会默认从0开始递增赋值。

若仅赋值第一个值，则后面的值会以第一个值为基础进行递增。

```typescript
enum PostStatus {
  Draf = 0,
  Unpublished = 1,
  Published = 2
}

enum PostStatus1 {
  Draf, //0
  Unpublished, //1
  Published //2
}

enum PostStatus2 {
  Draf = 1, //1
  Unpublished, //2
  Published //3
}

//使用
const post = {
  status : PostStatus.Draf
}
```

**注意**：使用枚举会造成变量入侵，会影响编译结果，会编译为双向的键值对对象。

即使用枚举对象的键存储了值，又使用枚举对象的值，存储了键。

所以可以通过key的方式获取枚举对象的值，也可以通过值获取枚举对象的键

```js
//编译结果
var PostStatus;
(function (PostStatus) {
    PostStatus[PostStatus["Draf"] = 1] = "Draf";
    PostStatus[PostStatus["Unpublished"] = 2] = "Unpublished";
    PostStatus[PostStatus["Published"] = 3] = "Published";
})(PostStatus || (PostStatus = {}));
//使用
var post = {
    status: PostStatus.Draf
};
```

```js
PostStatus[1]//Draft
PostStatus.Draft // 1
```

**常量枚举**

若在代码中不会使用索引器的方式访问枚举，可以使用常量枚举

```typescript
const enum PostStatus1 {
  Draf, //0
  Unpublished, //1
  Published //2
}

//使用
const post = {
  status : PostStatus.Draf
}
```

```js
//编译结果
Object.defineProperty(exports, "__esModule", { value: true });
//使用
var post = {
    status: 3 /* Draf */
};
```

使用常量枚举，不会造成变量入侵，编译结果会直接使用枚举值替换。

## 函数类型约束

函数类型约束，即对函数的输入（参数）及输出（返回值）进行类型约束。

针对函数的不同声明方式：

**函数声明方式**

```js
//c为可选参数
function foo(a: number, b: number, c?: number):string{
  return "foo function"
}

//任意个数参数 -- 使用rest操作符
function foo(a: number, b: number, ...rest:number[]):string{
  return "foo function"
}
```

**函数表达式方式**

```js
const foo: (a:number, b:number) => string = function(a: number, b: number): string{
  return "foo function2"
}
```

## 任意类型--`any`

> TS不会对any类型做类型检查

```js
function stringify(value:any){
  return JSON.stringify(value)
}
```

## 隐式类型推断

```typescript
let age = 18 // age被推断为number
age = 'string'//报错，因为前面已经隐式推断age为number类型

let foo // foo被推断为any类型,再给foo赋任何类型的值，都不会报错
foo = 100
foo = 'string'
```

## 类型断言

> 类型断言不等于类型转换，类型断言仅是编译阶段的类型限制，不会改变数据的类型。

```typescript
const nums = [110,120,119,112]
const res = nums.find(i=> i>0)

const square = res * res // Ts推断，res的值为number或undefined，使用乘法操作符会报错。
```

可以通过`as`语法，断言res为`number`数据类型

```typescript
const nums = [110,120,119,112]
const res = nums.find(i=> i>0)
//断言res为number类型
const num1 = res as number
const square = num1 * num1 
```

也可以通过`<number>`断言res为`number`数据类型

**注意**：在使用JSX时，`<xx>`语法会产生冲突

```typescript
const nums = [110,120,119,112]
const res = nums.find(i=> i>0)
//断言res为number类型
const num1 = <number>res
const square = num1 * num1 
```

# 接口--`interface`

> 是一种契约，用于约定对象的结构

```typescript
// 定义接口
interface Post{
  title:string;
  content:string;
}
// 定义符合接口类型的对象
const post:Post = {
  title:"post title",
  content:"post content"
}
//函数参数为指定接口类型
function printPost(post:Post){
  console.log(post.title)
  console.log(post.content)
}
//调用函数
printPost(post)
```

**可选成员**

```typescript
interface Post{
  title:string;
  content:string;
  subTitle?:string
}
```

**只读成员**

```typescript
interface Post{
  title:string;
  content:string;
  subTitle?:string;
  readonly summary:string
}
```

**动态成员**

```typescript
interface Cache{
  [key:string]:string | number
}
```

# 类

> 描述一类具体事物的抽象特征，描述一类具体对象的抽象成员。
>
> 子类继承拓展父类

ES6之前，使用函数+原型 模拟实现类

ES6之后，添加了class关键词，定义类。

> 在ts中，类的属性需要明确声明，而不是可以在constructor中动态添加

## 访问修饰符

TS对ES6种的类进行了拓展，添加了成员访问修饰符：`public`:共有成员,`private`：私有成员,`pprotected`：受保护成员

```typescript
class Person{
  public name:string
 	private age:number
 	protected gender:boolean = true
  constructor(name:string,age:number){
     this.name = name
     this.age = age
  }
 	sayHi(msg:string):void{
   console.log(`hi,${this.name}`)
 	}
  sayAge():number{
    return this.age
  }
}

class Student extends Person{
  constructor(name:string,age:number){
    super(name,age)
    console.log(this.age) // 报错：属性“age”为私有属性，只能在类“Person”中访问
    console.log(this.gender)//可以在子类访问受保护成员
  }
  sayAge():number{
    return super.sayAge()
  }
}

const tom = new Person('tom',18)
console.log(tom.name) // tom
console.log(tom.age)// 报错，属性“age”为私有属性，只能在类“Person”中访问
console.log(tom.gender)// 报错，属性“gender”受保护，只能在类“Person”及其子类中访问。
const jon = new Student('jon',20)
console.log(jon.sayAge()) //20
```

### private与protected的区别

private为私有成员，成员仅属于当前类。只能在当前类中使用，在子类及类的实现中都不能访问。

​			在子类中，可以通过调用了这个属性的方法，间接访问。

protected为受保护成员，成员可以在当前类及子类中访问，在类的实现中不能访问。

### 构造函数的访问修饰符

> 构造函数的默认访问修饰符为`public`

当把构造函数的访问修饰符修改为`private`或者`protected`时，就不能够在外部构造类的实例了。

```typescript
class Person{
  name:string
  age:number
  private constructor(name:string,age:number){
    this.name = name
    this.age = age
  }
}

const tom = new Person('tom',18)// 报错：类“Person”的构造函数是私有的，仅可在类声明中访问。
```

在这种情况下，只能在类的内部添加静态方法，用于创建类的实例。

```js
class Person{
  name:string
  age:number
  private constructor(name:string,age:number){
    this.name = name
    this.age = age
  }
	static create(name:string,age:number){
    return new Person(name,age)
  }
}

const tom = Person.create('tom',18)
console.log(tom.name)// tom
```

## 只读属性 -- `readonly`

> 通过readonly 来修饰属性，使属性变为只读属性。

```typescript
class Person{
  name:string
  age:number
  private readonly gender:boolean = false
  constructor(name:string,age:number){
    this.name = name
    this.age = age
    console.log(this.gender)
  }
  changeGender():void{
    this.gender = true // 报错：无法分配到 "gender" ，因为它是只读属性。
  }
}
```

## 类与接口

不同的类之间也有可能有共同的特种，对于这些类与类之间的共同的特征可以使用接口去抽象。

```typescript
//抽象吃方法
interface Eat{
  eat(food:string):void
}
//抽象跑方法
interface Run{
  run(distance:number):void
}

class Person implements Eat, Run{
  eat(food:string):void{
    console.log(`优雅的吃${food}`)
  }
  run(distance:number):void{
    console.log(`直立行走了${distance}`)
  }
}

class Animal implements Eat, Run{
  eat(food:string):void{
    console.log(`呼呼的吃${food}`)
  }
  run(distance:number):void{
    console.log(`四足行走了${distance}`)
  }
}
```

## 抽象类

> 抽象类与接口类似，用于抽象类的一些方法
>
> 不同的是，接口只用于定义一些方法，不会有具体实现。在抽象类可以有一些具体实现

当类被定义为抽象类之后，就只能够被继承，不能再通过new去实例化对象。

在类中可以定义抽象方法，抽象方法同样不需要有具体实现，继承了抽象方法的子类中，必须有抽象方法的实现。

当实例化子类时，子类同时拥有父类的实例方法，同时也拥有自身实现的实例方法。

```typescript
abstract class Animal{
  eat(food:string):void{
    console.log(`呼呼的吃${food}`)
  }
  abstract run(distance:number):void
}

class Dog extends Animal{
  run(distance: number): void {
    console.log(`四足行走了${distance}`)
  }
}

const dog = new Dog()
dog.eat('狗粮')
dog.run(300)
```

# 泛型

> 在定义函数、接口或类的时候，没有指定具体的类型，在使用的时候，再指定具体类型的特征。

目的：最大程度的复用代码

```typescript
function creatArray<T>(length:number,value:T):T[]{
  const arr  = Array<T>(length).fill(value)
  return arr
}

console.log(creatArray<string>(3,'foo'))
console.log(creatArray<number>(3,100))
```

# 类型声明

使用第三方模块时，若第三方模块没有类型声明文件，需要添加额外的类型声明或添加类型声明模块

```typescript
import { camelCase } from 'lodash'
//类型声明
declare function camelCase(input:string):string
const res = camelCase('hello typed')
```

添加lodash的类型声明模块

```powershell
npm install @types/loadsh --dev
## yarn add @types/loadsh --dev
```
在`/node_modules/@types/lodash`中会发现很多`.d.ts`的文件，这些`.d.ts`的文件即为类型声明文件

```typescript
import { camelCase } from 'lodash'
//类型声明
const res = camelCase('hello typed')
```

# 作用域问题

当多个Ts文件拥有同一个全局变量名称时，会出现不能重复定义变量的错误提示。

我们可以通过`export {}` 语句，将整个ts文件作为模块（ES module），使其中的变量作用域为模块。

