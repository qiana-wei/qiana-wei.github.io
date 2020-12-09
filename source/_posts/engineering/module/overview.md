---
title: 前端工程化6-模块化开发
date: 2020-12-09 10:40:11
tags: ['前端工程化','模块化开发','ESModule','CommonJS','ADM','CDM']
category: '前端工程化'
---

> 模块化是最主流的代码组织方式。
>
> 将复杂代码按照功能不同，划分为不模块单独维护的方式来提高开发效率，降低维护成本。

模块化只是一个思想。

# 模块化演变过程

**Stage1**：文件划分--约定每个文件即为一个模块

缺点

1. 污染全局作用域
2. 命名冲突问题
3. 无法管理模块间依赖关系
4. 完全依靠约定

**Stage2**： 命名空间方式--将每个模块包裹成一个全局对象的方式

缺点：

1. 没有私有空间
2. 无法管理模块间依赖关系

**Stage3**：IIFE--立即执行函数，将模块中每个成员包裹在一个立即执行函数中。

函数内成员作为函数作用域内的成员，确保了函数外部无法访问函数内成员。

解决了私有成员的问题以及模块间依赖关系的问题

# 模块化标准

> 最佳实践方式：
>
> 在node环境中使用**CommonJs**规范组织模块
>
> 在浏览器环境中使用**ES Module**规范组织模块

CommonJs是node内置的模块系统，在node环境中使用标准的CommonJs标准即可。

在浏览器环境中，由于**ES Module**是ES2015才提出的模块化标准，所以存在浏览器兼容问题。

## CommonJs规范

> 同步方式加载模块

1. 一个文件就是一个模块
2. 每个模块都有单独的作用域
3. 通过module.exports导出成员
4. 通过require函数载入模块

## AMD + require.js

> 异步加载模块

**使用`define`函数定义**

```js
//定义一个模块
define('module1',['jquery','./modules'],function($,module2){
  //导出成员
  return {
    strat:function(){
      $('body').animate({margin:'200px'})
      module2()
    }
  }
})
```

**使用`require`载入一个模块**

```js
require(['./module1'],function(module1){
  module1.start()
})
```

> 目前绝大多数的第三方库都支持AMD

**缺点**

1. AMD使用起来相对复杂
2. 模块JS文件请求频繁

## CMD + sea.js

> CMD是sea.js在推广过程中对模块定义的规范化产出
>
> CMD规范类似于CommonJS规范

```js
define(function(require,exports,module){
  var $ = require('jquery')
  //通过exports 或者 module.exports 对外暴露成员
  module.exports = function(){
    //...
  }
})
```

## ESModule

> ES Module是Javascript原生模块

[详细内容看这里～](/2020/12/09/engineering/module/ESModule/)

## 对比

| ESModule                                                     | CommonJS                                                     |
| ------------------------------------------------------------ | ------------------------------------------------------------ |
| 导入模块必须使用完整的文件扩展名<br />引用相对路径时，不能省略`./`，否则会解析为加载第三方模块 | 导入模块可以省略文件扩展名<br />可以同导入目录的方式导入目录下的`index.js` |
| 可以导出多个成员<br />使用`export xx`,`export {}`, `export default xx`导出成员<br />输出值是引用值 | 只能导出一个默认成员<br />使用`export.xx`，`module.exports = {xx}`导出成员<br />输出值是拷贝值 |
| 可以导入commonJS Module                                      | 不能导入ES Module                                            |
| 使用`import`导入成员                                         | 使用`require`导入成员                                        |
| 浏览器环境中使用                                             | Node环境中使用                                               |

# 模块化打包工具

> 打包工具解决的是前端整体的模块化，并不是单指JavaScript模块化

## 为什么使用模块化打包工具

1. ES Module存在环境兼容问题
2. 模块文件过多，网络请求频繁
3. 所有的前端资源都需要模块化

## 对打包工具的要求

1. 新特性代码编译----能够编译代码，将新特性做向下兼容处理
2. 模块化JavaScript打包----能够将散落的模块文件打包到一起，解决模块文件频繁发生请求的问题
3. 支持不同类型的资源文件----需要能够支持不同种类的前端资源文件

## 工具

### Webpack 

> Webpack 作为**模块打包器**（Module bundle）本身就能解决代码打包的问题。
>
> 对于有兼容问题的代码，通过**模块加载器**（Loader）对其进行编译转换。
>
> Webpack还具有**代码拆分**的能力（Code Splitting），可以根据我们的需要去打包。
>
> Webpack支持以模块化的方式载入任意类型的资源文件---**资源模块**（Asset Module）

[详细信息看这里](/2020/12/10/engineering/webpack/overview/)

### Rollup

> 一款ES Module打包器
>
> 其初衷是提供一个充分利用ES Module分享特性的高效打包器。

Rollup与Webpack的作用类似，但是Rollup更加小巧。

Rollup中并不支持类似HMR这种高级特性。

[详细信息看这里](/2020/12/10/engineering/module/rollup/)

## Parcel

> 零配置的前端应用打包器

### 安装

```powershell
yarn add parcel-bundler --dev
```

### 使用

官方建议使用index.html作为打包入口

根据script找到js文件并顺着模块引用寻找模块进行打包。

```powershell
yarn parcel src/index.html
```

#### 模块热更新

使用`module.hot.accept`实现模块热更新。

当前模块或当前模块所依赖的模块更新后，会自动执行。

```js
//module.js
if(module.hot){
  module.hot.accept(()=>{
    console.log("hmr")
  })
}
```

#### 自动安装依赖

在模块中引用了为安装的依赖时，保存后，parcel会自动执行模块安装。

#### 支持其他资源模块

```js
//module.js
import logo from "./logo.png"
```

#### 支持动态导入

```js
//module.js

import('module1.js').then(res=>{
  console.log('load module1')
})
```

## 生产打包

```powershell
yarn parcel build src/index.html
```

## 优缺点

**优点**

1. 零配置
2. 构建速度快（多进程同时打包）

