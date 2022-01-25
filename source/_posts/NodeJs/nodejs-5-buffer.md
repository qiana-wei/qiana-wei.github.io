---
title: NodeJs--Buffer
date: 2022-01-14 22:00:00
tags: ['NodeJs','NodeJs-Buffer']
category: 'NodeJs'
---

# Buffer是什么
Buffer是NodeJs的一个全局变量，是NodeJs的内置类，实现NodeJs平台下的二进制数据操作。
Buffer是一片内存空间，是V8堆内存之外的空间。空间回收由V8GC（垃圾回收机制）回收。
Buffer一般配合Stream流操作使用，充当数据缓冲区。

# Buffer实例创建

`alloc`:创建指定字节大小的Buffer。
`allocUnsafe`:创建指定大小的Buffer(不安全)
`from`:接受数据，创建Buffer
`from`可以接受三个种数据类型：字符串、数组、Buffer;
字符串默认使用`utf-8`编码。
数组中传入汉字时，需要先转成16进制或8进制或10进制或2进制数字。
通过Buffer类型创建Buffer时，两个Buffer的内存空间是不共享的。是两个独立的空间。 

```js
const b1 = Buffer.alloc(10)
const b2 = Buffer.allocUnsafe(10)
const b3 = Buffer.from('1')
```

```js
const b1 = Buffer.from("中")
console.log(b1) //<Buffer e4 b8 ad>
console.log(b1.toString())//中

const b2 = Buffer.from([0xe4, 0xb8, 0xad])
console.log(b2)//<Buffer e4 b8 ad>
console.log(b2.toString())//中
```

```js
const b1 = Buffer.alloc(3)
const b2 = Buffer.from(b1)
console.log(b1)//<Buffer 00 00 00>
console.log(b2)//<Buffer 00 00 00>

b1[0]=1

console.log(b1)//<Buffer 01 00 00>
console.log(b2)//<Buffer 00 00 00>
```

# Buffer实例方法
## `Buffer.fill(value[,offset[,end]][,encoding])`
`fill`: 使用数据填充Buffer。
> `value <string> | <Buffer> | <Uint8Array> | <integer>`: 用于填充Buffer的值
> 当给定的数据不足以填充满整个Buffer空间时，会重复填充，直到填满。当给定的数据多与Buffer空间时，多的部分将被舍掉。

```js
const b1 = Buffer.alloc(6)
console.log(b1) //<Buffer 00 00 00 00 00 00>

b1.fill('123')
console.log(b1)//<Buffer 31 32 33 31 32 33>
```
> `offset <integer>` 在开始填充Buffer之前要跳过的字节数,即从第几位开始填充, 默认值: 0。
```js
const b1 = Buffer.alloc(6)
console.log(b1)//<Buffer 00 00 00 00 00 00>

b1.fill('123',1)
console.log(b1)//<Buffer 00 31 32 33 31 32>
console.log(b1.toString())//12312
```
> `end <integer>` 停止填充 Buffer（不包括在内）的位置。 默认值: buf.length.
```js
const b1 = Buffer.alloc(6)
console.log(b1)//<Buffer 00 00 00 00 00 00>

b1.fill('123',2,4) //只填充第2 3个位置
console.log(b1)//<Buffer 00 00 31 32 00 00>

console.log(b1.toString())//12
```
> `encoding <string>`: 如果 value 是字符串，则为 value 的编码。 默认值: 'utf8'
> `返回: <Buffer>` buf 的引用。

## `Buffer.write(string[,offset[,length]][,encoding])`
`write`: 向Buffer中写入数据 
类似于`fill`但是不会重复写入数据。
write的第三个参数表示，要写入的数据长度。
> `string <string>`: 要写入 buf 的字符串。
> `offset <integer>`: 开始写入 string 之前要跳过的字节数。 默认值: 0。
> `length <integer>`: 要写入的最大字节数（写入的字节数不会超过 buf.length - offset）。 默认值: buf.length - offset。
> `encoding <string>`: string 的字符编码。 默认值: 'utf8'。
> `返回: <integer>`: 写入的字节数

## `Buffer.toString([encoding[,start[,end]]])`
> `toString`: 从Buffer中提取数据
> `encoding <string>`: 要使用的字符编码。 默认值: 'utf8'。
> `start <integer>`: 开始解码的字节偏移量。 默认值: 0。
> `end <integer>`: 停止解码的字节偏移量（不包括在内）。 默认值: buf.length.
> `返回: <string>`

```js
const b1 = Buffer.from("abcdefg")
console.log(b1)//<Buffer 61 62 63 64 65 66 67>
console.log(b1.toString())//abcdefg
console.log(b1.toString('utf8',3))//defg
console.log(b1.toString('utf8',3,6))//def

//utf8编码中，一个中文为三个字节
const b2 = Buffer.from("这是一句话")
console.log(b2)//<Buffer e8 bf 99 e6 98 af e4 b8 80 e5 8f a5 e8 af 9d>
console.log(b2.toString())//这是一句话
console.log(b2.toString('utf8',3))//是一句话
console.log(b2.toString('utf8',3,6))//是
```

## `Buffer.slice([start[,end]])`
> `slice`: 截取Buffer
> `start <integer>`: 新的 Buffer 将开始的位置。 默认值: 0。
> `end <integer>`: 新的 Buffer 将结束的位置（不包括在内）。 默认值: buf.length.
> `返回: <Buffer>`: 返回新的 Buffer，其引用与原始缓冲区相同的内存，但由 start 和 end 索引进行偏移和裁剪。

```js
const b1 = Buffer.from("abcdefg")
console.log(b1.slice())//<Buffer 61 62 63 64 65 66 67>
console.log(b1.slice().toString())//abcdefg

console.log(b1.slice(2,4))//<Buffer 63 64>
console.log(b1.slice(2,4).toString())//cd

//从后往前截取
console.log(b1.slice(-3))//<Buffer 65 66 67>
console.log(b1.slice(-3).toString())//efg

console.log(b1.slice(-3,-1))//<Buffer 65 66>
console.log(b1.slice(-3,-1).toString())//ef

console.log(b1)//<Buffer 61 62 63 64 65 66 67>
```
## `Buffer.indexOf(value[,byteOffset][,encoding]`
> `indexOf`: 在Buffer中查找数据，
> `value <string> | <Buffer> | <Uint8Array> | <integer>`: 要搜索的内容。
> `byteOffset <integer>`: 开始搜索 Buffer 的位置。 如果为负数，则从 Buffer 的末尾开始计算偏移量。 默认值: 0。
> `encoding <string>`: 如果 value 是字符串，则这是用于确定将在 Buffer 中搜索的字符串的二进制表示的编码。 默认值: 'utf8'。
> `返回: <integer>`: Buffer 中第一次出现 value 的索引，如果 buf 不包含 value，则为 -1。

```js
const b1 = Buffer.from("abcdefgabcdefg")
console.log(b1.indexOf('a'))//0
console.log(b1.indexOf('a',4))//7
console.log(b1.indexOf('h'))//-1
```
## `Buffer.copy(target[,targetStart[,sourceStart[,sourceEnd]]])`
> `copy`: 拷贝Buffer中的数据 
> `target <Buffer> | <Uint8Array>`: 要复制到的 Buffer 或 Uint8Array。
> `targetStart <integer>`: target 内开始写入的偏移量。 默认值: 0。
> `sourceStart <integer>`: Buffer 内开始复制的偏移量。 默认值: 0。
> `sourceEnd <integer>`: Buffer 内停止复制的偏移量（不包括）。 默认值: Buffer.length.
> `返回: <integer>`: 复制的字节数。

```js
const b1 = Buffer.from("abcdefghigklmn")
const b2 = Buffer.alloc(9)
const b3 = Buffer.alloc(9)

//将b1拷贝到b2
b1.copy(b2)

//将b1的4-8位拷贝到b2,从b2的第2位开始粘贴
b1.copy(b3,2,4,9)


console.log(b2)//<Buffer 61 62 63 64 65 66 67 68 69>
console.log(b2.toString())//abcdefghi

console.log(b3)//<Buffer 00 00 65 66 67 68 69 00 00>
console.log(b3.toString())//efghi
```

# Buffer的静态方法
## `Buffer.concat(list[, totalLength])`
> `concat`: 将多个Buffer拼接成一个新的Buffer
> `list <Buffer[]> | <Uint8Array[]>`: 要连接的 Buffer 或 Uint8Array 实例的列表。
> `totalLength <integer>`: 连接时 list 中 Buffer 实例的总长度。
> `返回: <Buffer>`: 返回的新Buffer是将list中所有Buffer实例连接在一起的结果。

如果，列表没有条目，或者`totalLength`为0，返回新的零长度`Buffer`
如果未提供 `totalLength`，则从 `list` 中的 `Buffer` 实例通过相加其长度来计算。
如果提供了 `totalLength`，则将其强制为无符号整数
如果 `list` 中 Buffer 的组合长度超过 `totalLength`，则结果截断为 `totalLength`。
```js
const b1 = Buffer.alloc(2)
const b2 = Buffer.alloc(3)
const b3 = Buffer.alloc(4)
const length = b1.length + b2.length + b3.length 
console.log(length) //2+3+4 = 9

const b4 = Buffer.concat([b1,b2,b3])
const b5 = Buffer.concat([b1,b2,b3],4)

console.log(b4)//<Buffer 00 00 00 00 00 00 00 00 00>
console.log(b4.length)//9

console.log(b5)//<Buffer 00 00 00 00>
console.log(b5.length)//4
```
```js
const bb1 = Buffer.alloc(2)
const bb2 = Buffer.from('abcd')
const bb3 = Buffer.alloc(2)
const bb4 = Buffer.from('123')

const bb5 = Buffer.concat([bb1,bb2,bb3,bb4])
const bb6 = Buffer.concat([bb1,bb2,bb3,bb4],4)

console.log(bb5)//<Buffer 00 00 61 62 63 64 00 00 31 32 33>
console.log(bb5.length)//11
console.log(bb5.toString())//abcd123

console.log(bb6)//<Buffer 00 00 61 62>
console.log(bb6.length)//4
console.log(bb6.toString())//ab
```

## `Buffer.isBuffer(obj)`
> `isBuffer`: 判断当前数据是不是Buffer
> `obj <Object>`: 要判断的元素
> `返回: <boolean>`:如果 obj 是 Buffer，则返回 true，否则返回 false

```js
console.log(Buffer.isBuffer(Buffer.alloc(2)))//true
console.log(Buffer.isBuffer(Buffer.from('1232')))//true
console.log(Buffer.isBuffer({}))//false
```


