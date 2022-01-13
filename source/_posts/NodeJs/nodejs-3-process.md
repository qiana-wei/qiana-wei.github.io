---
title: NodeJs--process
date: 2022-01-12 22:00:00
tags: ['NodeJs','NodeJs-Process']
category: 'NodeJs'
---

# 是什么？
Node的全局变量

# 什么用？
1. 获取进程信息
    > 可以用来获取当前正在执行脚本的一些信息
    > 比如进程执行过程中对CPU、内存的消耗；当前执行进程的本地环境；
2. 执行进程操作
    > 监听进程执行过程中所执行的内置事件
    > 子进程通信等

# 获取资源：内存、CPU
## memoryUsage--内存使用空间

*执行文件内容：*
```js
console.log(process.memoryUsage())
```
*输出：*
```js
{
  rss: 17924096, // 当前常驻内存
  heapTotal: 4014080, // 当前脚本刚开始执行时申请的总的内存
  heapUsed: 2269160, // 当前脚本执行过程中使用的内存大小
  external: 771157, // 扩展内存--用来表示底层C或C++的核心模块占据的内存大小
  arrayBuffers: 9382 // 一片独立的空间大小，不占据V8所占用的内存
}
```
## cpuUsage -- cup使用
*执行文件内容：*
```js
console.log(process.cpuUsage())
```
*输出：*
```js
{ 
  user: 33480, // 用户所占用的CPU时间片段
  system: 11387 // 系统所占用的CPU时间片段
}
```
# 获取运行环境

> 运行目录、node环境、cpu架构、用户环境、系统平台

*执行文件内容：*

```js
console.log(process.cwd())// 运行目录
console.log(process.version)//node版本
console.log(process.versions)//node环境
console.log(process.arch)//cpu架构
console.log(process.env)//环境
console.log(process.env.NODE_ENV)//NODE环境变量
console.log(process.env.PATH)//系统环境变量
console.log(process.env.USERPROFILE)//管理员用户目录--写脚手架工具的时候会经常用到 --- windows系统
console.log(process.env.HOME)//管理员用户目录--写脚手架工具的时候会经常用到 ---mac系统
console.log(process.platform)//标识运行 Node.js 进程的操作系统平台的字符串
// 操作系统平台的字符串可能的值：
// 'aix'
// 'darwin' --mac
// 'freebsd'
// 'linux'
// 'openbsd'
// 'sunos'
// 'win32'--windows
// 'android' --  安卓系统（实验版本）
```

# 获取运行状态

> 启动参数、进程工作时占用的id：PID、进程运行时间

## process.argv--获取启动参数

*执行文件内容*

```js
//process.js
console.log(process.argv)
```

执行命令1

```bash
node ./process.js
```

*输出结果1*

```bash
[
  '/usr/local/Cellar/node/15.5.0/bin/node', # node 启动程序对应的完整路径
  '/Users/qiana/project/node-learn/process.js' # 当前进程文件的绝对路径
]
```



执行命令2

```bash
node ./process.js 1 2
```

*输出结果1*

```bash
[
  '/usr/local/Cellar/node/15.5.0/bin/node' ,# node 启动程序对应的完整路径
  '/Users/qiana/project/node-learn/process.js',# 当前进程执行文件的绝对路径
  '1', # 参数1
  '2' # 参数2
]
```

> ps：
>
> `process.argv0`存储了NodeJs启动时传入的`argv[0]`原始值的只读副本

## process.execArgv--获取进程启动时传入的命令行选项

*执行文件内容*

```js
//process.js
console.log(process.argv)
console.log(process.execArgv)
```

```bash
$ node --harmony ./process.js
```

*输出结果*

```bash
[
  '/usr/local/Cellar/node/15.5.0/bin/node',
  '/Users/weiqianqian/project/node-learn/process.js',
  '--version'
] # argv

[--harmony] # execArgv
```

## process.pid -- 获取进程工作时占用的id

*执行文件内容*

```js
//process.js
console.log(process.pid)
```

```bash
$ node ./process.js
```

*输出结果*
```bash
42593
```