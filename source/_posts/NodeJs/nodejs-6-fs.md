---
title: NodeJs--fs
date: 2022-01-15 22:00:00
tags: ['NodeJs','NodeJs-fs']
category: 'NodeJs'
---

# 是什么？
fs是node内置核心模块，提供文件系统操作的API。

**Fs模块-基本操作**
  - start
  - write
  - read
  - watcher

**Fs模块-常用方法**
  - 权限操作
    - chmod
    - chgrp
  - 文件增删改查
    - 打开/关闭
    - 读取
    - 写入
    - 删除
  - 工具方法

# 文件权限位
文件权限的标示。
[看这里～](/2020/12/06/other/shell/chmod/)

# 文件基本操作
`readFile`:读文件
`writeFile`:写文件
`watchFile`:监听

# 文件打开与关闭

## `fs.open(path[,flags[,mode]],callback)`
> `path <string> | <Buffer> | <URL>`
>` flags <string> | <number>` 对文件系统 flags 的支持。 默认值: 'r'。
> `mode <string> | <integer>` 默认值: 0o666 （可读可写）
> `callback <Function>`
> * `err <Error>`
> * `fd <integer>`

## `fs.close(fd,callback)`
> `fd <integer>`
> `callback <Function>`
> * `err <Error>`

```js
const fs = require('fs')
const path = require('path')

fs.open(path.resolve('data.txt'),'r',(err,fd)=>{
    console.log(fd) //文件操作符
    fs.close(fd,errr=>{
        console.log(fd,'关闭成功')
    })
})
```

# 大文件读写操作
## `fs.read(fd, buffer, offset, length, position, callback)`
> `fd <integer>`
> `buffer <Buffer> | <TypedArray> | <DataView>` 数据将写入的缓冲区。
> `offset <integer>` 要写入数据的 buffer 中的位置。
> `length <integer>` 读取的字节数。
> `position <integer> | <bigint>` 指定从文件中开始读取的位置。 如果 position 为 null 或 -1 ，则将从当前文件位置读取数据，并更新文件位置。 如果 position 是整数，则文件位置将保持不变。
> `callback <Function>`
> * `err <Error>`
> * `bytesRead <integer>`
> * `buffer <Buffer>`

从 fd 指定的文件中读取数据。
回调被赋予三个参数，(err, bytesRead, buffer)。
如果未同时修改文件，当读取的字节数为零时，则到达文件末尾。
如果此方法作为其 util.promisify() 版本被调用，则返回具有 bytesRead 和 buffer 属性的 Object 的 promise

## `fs.read(fd, [options,] callback)`
与`fs.read()`类似，options有默认值

```js
const fs = require('fs')
const path = require('path')

//read: 读操作，从磁盘文件中读取，写入到Buffer中
const buf = Buffer.alloc(10)

fs.open(path.resolve('data.txt'),'r',(err,readFd)=>{
    console.log(readFd)
    fs.read(readFd,buf,0,3,0,(err,readBytes,data)=>{
        console.log(readBytes)
        console.log(data)
    })
})
```

## `fs.write(fd, buffer[, offset[, length[, position]]], callback)`
> `fd <integer>`
> `buffer <Buffer> | <TypedArray> | <DataView> | <string> | <Object>`
> `offset <integer>`: 确定要写入的缓冲区部分偏移量
> `length <integer>`: 整数，指定要写入的字节数
> `position <integer>`: 从文件开头数据应被写入的偏移量。如果不是数值，则数据写入当前位置
> `callback <Function>`
> * `err <Error>`
> * `bytesWritten <integer>`: 从buffer写入的字节数
> * `buffer <Buffer> | <TypedArray> | <DataView>`

将Buffer写入fd制定的文件。如果Buffer是普通对象，则它必须具有自有的`toString`函数属性。


# 文件系统标志
 [文件系统标志](http://nodejs.cn/api/fs.html#file-system-flags)
 * `a`: 打开文件进行追加。如果文件不存在，则创建该文件。
 * `ax`: 类似于`a`。如果文件不存在，则失败
 * ``:
 * ``:
 * ``:
 * ``:
 * ``:
 * ``:
 * ``:
 * ``:
 * ``:
 * ``: