---
title: npm package 依赖版本问题
date: 2022-01-20 11:19:58
tags: ['NPM','package.json','package-lock.json']
category: 'NPM'
---

# 依赖包安装规则
`npm install` 命令执行时，`npm`会尝试从`package-lock.json`文件中下载依赖。
如果没有`package-lock.json`文件，则会根据`package.json`文件中规则下载对应的依赖。

# package.json中的依赖规则
## 版本号规则
`package.json`中的依赖，版本号采用的是`主版本号·次版本号·补丁版本号`的格式。
主版本号变更，一般会存在一些不兼容的迭代。
次版本号变更，一般能够向下兼容，在兼容的基础上新增或弃用一些api
补丁版本号变更，一般是针对之前的api做一些修复。
## 依赖更新规则
`~`: 只更新补丁版本号
`^`: 不更新最左边非零数字的版本号；
* 若版本号为`0.0.1`,不会执行更新
* 若版本号为`0.1.0`,只更新补丁版本号，可以升级到`0.1.1`、`0.1.2`,不会升级到`0.2.0`
* 若版本号为`1.0.0`,可以更新次版本号及补丁版本号，可以升级到`1.1.1`、`1.2.2`,不会升级到`2.0.0`

`>`: 只接受高于指定版本的任何版本
`>=`: 只接受高于或等于指定版本的任何版本
`<`: 只接受低于指定版本的任何版本
`<=`: 只接受低于或等于指定版本的任何版本
`=`: 只接受指定版本
`-`: 接受一定范围的版本
`||`: 接受组合集合内的版本
`latest`: 使用可使用的最新版本
无符号: 等同于`=`,只接受指定版本

# package-lock.json

npm5版本中，引入了`package-lock.json`文件，相对于`package.json`,`package-lock.json`不仅可以跟踪项目中使用的npm包，还可以跟踪到每个npm包的确切版本。用来确保，每个项目都可以用用完整且相同的`node_modules`树，达到项目表现一致的目的。

# npm ci

众所周知，如果`package.json`中依赖没有锁定的话，使用`npm install`安装依赖，将会更新文件。
所有，有可能导致，依赖树不一致。

`npm ci`命令类似于`npm install`，但它只在用于自动化环境。
通过跳过某些面向用户的功能，它可以比常规的npm安装快得多。它也比常规安装更严格，它可以帮助捕获由大多数 `npm` 用户的增量安装的本地环境引起的错误或不一致。

总之，使用npm install和使用的主要区别npm ci是：
* 该项目必须有一个`package-lock.json`或`npm-shrinkwrap.json`。
* 如果程序包锁中的依赖项与其中的依赖项不匹配`package.json`，`npm ci`则将退出并显示错误，而不是更新程序包锁。
* `npm ci `只能一次安装整个项目：使用此命令无法添加单个依赖项。
* 如果a`node_modules`已经存在，它将在`npm ci`开始安装之前自动删除。
* 它永远不会写入`package.json`或任何包锁;安装基本上是冻结的。


**参考**
* https://juejin.cn/post/7053817421156761614?utm_source=gold_browser_extension
* https://cloud.tencent.com/developer/section/1490280