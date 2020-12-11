---
title: 前端工程化8-Webpack-模块化打包工具
date: 2020-12-10 9:23:11
tags: ['前端工程化','webpack','模块化打包']
category: '前端工程化'
---
>  Webpack 作为**模块打包器**（Module bundle）本身就能解决代码打包的问题。

> 对于有兼容问题的代码，通过**模块加载器**（Loader）对其进行编译转换。

> Webpack还具有**代码拆分**的能力（Code Splitting），可以根据我们的需要去打包。

> Webpack支持以模块化的方式载入任意类型的资源文件---**资源模块**（Asset Module）

[Webpack官网](https://webpack.docschina.org/)

# 快速上手

## 安装

```powershell
yarn add webpack webpack-cli --dev
```

## 配置文件

webpack配置文件为`webpack.config.js`,是在node环境运行的代码

```js
//webpack.config.js
const path = require('path')

module.exports = {
  entry:"./src/main.js" // 入口文件
  output:{
    filename:"bundle.js" // 输出文件名
  	path: path.join(__dirname,'output')// 必须使用绝对路径
  }
}
```

## 工作模式

webpack4增加了工作模式的用法，是针对不同环境的几组预设配置。

通过cli参数`--mode`来规定编译环境

`mode`默认`production`,为生产环境打包

修改`mode`为`development`为开发环境打包

修改`mode`为`none`，做最原始形式的打包，不会做任何处理

```powershell
yarn webpack --mode development
```

可以在配置文件中配置模式

```js
//webpack.config.js
const path = require('path')

module.exports = {
  mode:"development",  //编译模式
  entry:"./src/main.js" // 入口文件
  output:{
    filename:"bundle.js" // 输出文件名
  	path: path.join(__dirname,'output')// 必须使用绝对路径
  }
}
```

# Webpack打包原理

webpack打包后整体生成的代码是个立即执行函数，函数内定义了`__webpack_modules__`数组，数组的每个元素是参数列表相同的函数，函数所对应的就是我们源代码中我们的模块。

`var __webpack_module_cache__ = {};`参数用于缓存加载过的模块

`__webpack_require__`函数用于加载模块、缓存模块、执行模块，返回模块的导出成员。

# 资源模块加载

Webpack内置的只有js模块加载器，如果需要加载其他资源模块，需要添加资源加载器（Loader）

例如加载css：





# 常用加载器(Loader)

> Loader 是Webpack实现整个前端模块化的核心。
>
> 通过loader可以实现加载任何类型的资源。

## 编译转换类型的loader

> 会把加载到的资源模块转换为js代码

### css-loader

`css-loader`:css资源加载器

`style-loader`:样式挂载器,将样式通过style标签注入

```powershell
yarn add css-loader style-loader --dev
```

在配置文件中添加loader配置：

```js
const path = require("path")
module.exports = {
  mode:"none",
  entry:"./src/index.css",
  output:{
    filename:"main.js",
    path:path.join(__dirname,"dist")
  },
  module:{
    rules:[
      {
        test:/.css$/,  // 使用正则表达式匹配要处理的文件类型
        use:['style-loader','css-loader']  // 表明使用什么loader,执行顺序从右向左执行，单个loader时是字符串，多个loader时是数组
      }
    ]
  }
}
```

### babel-loader

> webpack因为打包需要，所以会处理import和export，但是不是转换我们代码中其他的ES6特性

需要使用babel-loader来处理ES6特性

```powershell
yarn add babel-loader @babel/core @babel/preset-env --dev
```

## 文件操作类型的loader

> 将加载的文件拷贝到输出目录，同时将文件的访问路径向外导出

比如：

file-loader

## 代码质量检查

> 对代码进行检查，用于统一代码风格，提高代码质量。不会主动修改我们的代码。

比如

eslint-loader

# 常用插件（plugin）

(官网看这里)[https://www.webpackjs.com/plugins/]

## clean-webpack-plugin

> 清空dist目录

```powershell
yarn add clean-webpack-plugin --dev
```

```js
const { CleanWebpackPlugin }= require("clean-webpack-plugin")
module.exports = {
 	//...
  module:{
    rules:[
      //...
    ]
  },
  plugins:[
    new CleanWebpackPlugin(),
  ]
}
```

## html-webpack-plugin

> 自动生成使用打包结果的HTML

```powershell
yarn add html-webpack-plugin --dev
```
### 自动生成html文件

> 添加title内容及meta标签

```js
const HtmlWebpackPlugin = require("html-webpack-plugin")
module.exports = {
 //...
  module:{
    rules:[
    //...
    ]
  },
  plugins:[
    new HtmlWebpackPlugin({
      //添加配置,用于生成html动态配置信息
      title:"webpack title",
      meta:{
        viewport:'width=device-width'
      }
    })
  ]
}
```

### 使用模版文件

> 使用HtmlWebpackPlugin配置修改模板文件内信息,
>
> 添加meta标签

*模板文件--index.html*

```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>Document</title>
</head>
<body>
    <!-- lodash动态语法模板 -->
    <p><%= htmlWebpackPlugin.options.title %></p>
</body>
</html>
```

*配置模版文件*

```js
const HtmlWebpackPlugin = require("html-webpack-plugin")
const path = require("path")
module.exports = {
   //...
  module:{
    rules:[
      //...
    ]
  },
  plugins:[
    new HtmlWebpackPlugin({
      title:"webpack title",
      meta:{
        viewport:'width=device-width'
      },
      template:'./src/index.html' //指定模板文件
    })
  ]
}
```

### 输出多个模板文件

```js
const HtmlWebpackPlugin = require("html-webpack-plugin")
const path = require("path")
module.exports = {
   //...
  module:{
    rules:[
      //...
    ]
  },
  plugins:[
    //用于生成index.html
    new HtmlWebpackPlugin({
      title:'webpack title',
      meta:{
        viewport:'width=device-width'
      },
      template:'./src/index.html'
    }),
    //用于生成about.html
    new HtmlWebpackPlugin({
      filename:'about.html'
    })
  ]
}
```

### 多入口打包

[在后面配置优化-分割有介绍](#多入口打包)

## copy-webpack-plugin

> 不需要构建，复制文件

```powershell
yarn add copy-webpack-plugin --dev
```

**注意**`copy-webpack-plugin`在6.0版本之后，语法发生了变化

*old version*

```js
new CopyWebpackPlugin([
  { from: 'from/file.txt' }, // {output}/file.txt
  
  'from/file.txt', // equivalent
  
  { from: 'from/file.txt', to: 'to/file.txt' }, // {output}/to/file.txt

  { from: 'from/file.txt', to: 'to/directory' }, // {output}/to/directory/file.txt
  
  { from: 'from/directory' }, // Copy directory contents to {output}
  
  { from: 'from/directory', to: 'to/directory' }, // Copy directory contents to {output}/to/directory/
  
  { from: 'from/directory/**/*', to: '/absolute/path' }, // Copy glob results to /absolute/path/
])
```

*new version*

```js
new CopyWebpackPlugin({
  patterns:[
    { from: 'from/file.txt' }, // {output}/file.txt

    'from/file.txt', // equivalent

    { from: 'from/file.txt', to: 'to/file.txt' }, // {output}/to/file.txt

    { from: 'from/file.txt', to: 'to/directory' }, // {output}/to/directory/file.txt

    { from: 'from/directory' }, // Copy directory contents to {output}

    { from: 'from/directory', to: 'to/directory' }, // Copy directory contents to {output}/to/directory/

    { from: 'from/directory/**/*', to: '/absolute/path' }, // Copy glob results to /absolute/path/
  ]
})
```

## mini-css-extract-plugin

> 用于提取css到单独的文件

[在后面配置优化-css文件处理有介绍](#提取css文件到单个文件)

## optimize-css-assets-webpack-plugin

> 用于压缩提取的css文件

[在后面配置优化-css文件处理有介绍](#压缩提取的css文件)

## terser-webpack-plugin

> 用于压缩js文件

配置css文件压缩时，webpack会认为我们要自定义压缩，所以还需要手动配置js压缩

[在后面配置优化-css文件处理有介绍](#压缩提取的css文件)

# Webpack dev server

> Webpack配置中的`devServer`属性用于配置开发过程中的辅助工具

> 为项目提供友好的开发服务器

## 安装

```powershell
 yarn add webpack-dev-server --dev 
```

## 配置

```js
module.exports = {
   //...
  devServer:{
    //...devServer 相关配置信息
    contentBase: path.join(__dirname, 'dist'), //配置根路径
    port: 9000 //配置端口号
  }
  module:{
    rules:[
      //...
    ]
  },
  plugins:[
   //...
  ]
}
```

## 使用

```powershell
 yarn webpack serve 
```



## 提供跨域解决方案

`proxy`提供跨域解决方案

```js
module.exports = {
   //...
  devServer:{
    //...devServer 相关配置信息  
    proxy:{
      '/api': {
        target: 'http://www.example.com',
        pathRewrite: {
          '^/api' : ''
        },
        changeOrigin: true
      }
    }
  }
  module:{
    rules:[
      //...
    ]
  },
  plugins:[
   //...
  ]
}
```

## HMR-Hot Module Replacement （模块热更新）

> 在应用程序运行过程中实施替换某个模块，应用的运行状态不受影响

### 开启HMR

```powershell
webpack-dev-server --hot
```

或在配置文件中修改*

```js
const webpack = require('webpack')
module.exports = {
   //...
  devServer:{
    //...devServer 相关配置信息  
   hot:true
  }
  module:{
    rules:[
      //...
    ]
  },
  plugins:[
   //...
    new webpack.HotModuleReplacementPlugin()
  ]
}
```

### 处理js、图片热替换

*对于js文件热更新，需要手动进行些配置*

通过HMR API来配置文件热更新

**注意**，不同为js模块有不同的热替换逻辑，webpack无法提供统一的替换逻辑

```js
//main.js(入口文件)
import "./index.css"
import logo from  "./logo.png"
import createHeading from "./heading.js"

const heading =  createHeading()
document.body.append(heading)

const img = new Image()
img.src = logo
document.body.appendChild(img)

//HMR配置 js热更新
module.hot.accept('createHeading',()=>{
  console.log('heading模块更新了，需要在这里处理热更新逻辑')
  //...热更新逻辑代码
})

//HMR配置 图片热更新
module.hot.accept('./logo.png',()=>{
  //因为图片更改之后，图片的路径会发生变化，所以直接替换图片src即可
  img.src = logo
})
```

### hotOnly

在hot模式下，若热更新失败，会自动采用刷新页面的方式更新代码显示。

在hotOnly模式下，即使热更新失败，也不会自动刷新页面。会在控制台输出错误信息。

### 热更新配置注意事项

若在代码中添加了HMR API热更新配置时，需先判定是否有`module.hot`对象。

因为`module.hot`对象是HMR插件提供的，若没有在webpack配置中启用热更新，会发生报错。

# Webpack 配置Source Map

## SourceMap

> Source Map 是压缩代码与源代码的映射。

解决了前端引用了构建编译之后导致前端编写的代码与运行代码不一致产生的调试问题

## Webpack 配置Source Map

Webpack配置中的`devtool`属性用于配置开发过程中的辅助工具

```js
module.exports = {
   //...
  devtool:'source-map',
  module:{
    rules:[
      //...
    ]
  },
  plugins:[
    //...
  ]
}
```

## WebPack Source Map 对比

Webpack支持12中SourceMap打包方式，每种方式的效率和效果都不尽相同。

| 模式名称                     | 原理                                                         | 特点                                                         |
| ---------------------------- | ------------------------------------------------------------ | ------------------------------------------------------------ |
| eval                         | 将模块代码放到eval函数中执行，通过source url标注模块文件的路径。<br />不生成SourceMap | 速度最快<br />只定位原代码文件名称，不知道具体的行列信息     |
| eval-source-map              | 同eval。<br />生成SourceMap                                  | 相对于evel，可以准确定为到问题代码的行列信息                 |
| cheap-eval-source-map        | 同eval。<br />生成SourceMap                                  | 相对于eval-source-map，只能定位到行信息<br />定位到ES6转后的文件结果 |
| cheap-module-eval-source-map | 同eval。<br />生成SourceMap                                  | 相对于cheap-eval-source-map，<br />定位到未进行ES6转换的源码 |
| inline-source-map            | 以URL的方式，将source map嵌入到代码中                        | 引起代码体积增大                                             |
| hidden-source-map            | 生成source map文件，但是不引入source map文件                 | 生成source map文件，但是不引入source map文件                 |
| nosources-source-map         | 没有源代码，提供错误信息。保护源代码不被暴露                 | 能够看到错误出现的位置，但是点击错误后看不到源代码           |

## Webpack Source Map 选择

> 还是要根据自己的需要和需求选择

### 开发环境

`cheap-module-eval-source-map`:

1. 一般错误信信息定位到行就足够了
2. Loader准换后的代码与源代码一般都有比较大的差别，直接定位到源代码，更方便调试
3. 首次启动打包速度稍慢，但重写打包速度较快

### 生产模式

`none`:不生成SourceMap

1. 避免暴露源代码
2. 调试时开发阶段的事情，SourceMap是为了方便调试产生的

# 环境配置

前面提到过，webpack4增加了工作模式的用法，是针对不同环境的几组预设配置。

通过对不同环境进行不同的打包配置，达到效率最高化。

## 配置文件根据环境不同导出不同的配置

> 适用于中小型项目，一旦环境、配置多了，会比较混乱

webpack文件支持导出一个函数，函数接收两个参数：`env`(环境),`argv`(参数)

```js
module.eports = (env,argv)=>{
  config = [
    //....基础配置
  ]
  if(env == 'development'){
    config.mode = 'development'
    //..其他开发环境配置
  }
  
  if(env == 'production'){
     config.mode = 'production'
    //..其他开发环境配置
  }
  return config
}
```

*运行*

```powershell
yarn webpack --env development
```

## 不同环境对应不同配置文件

提取公共配置，再分别配置不同环境配置文件

`webpack.common.js`:公共配置

`webpack.dev.js`:开发环境配置

`webpack.prod.js`:生产环境配置

```js
//webpack.common.js
module.exports = {
  //配置信息
}
```

*使用webpack-merge模块合并配置*

```powershell
yarn add webpack-merge --dev
```

```js
//webpack.dev.js
const common = require('./webpack.common.js')
const merge = require('webpack-merge')

module.exports = merge(common,{
  mode:'development'
})
```

```js
//webpack.prod.js
const common = require('./webpack.common.js')
const merge = require('webpack-merge')

module.exports = merge(common,{
  mode:'production'
})
```

**因为此时已经没有了webpack默认文件，所有需要指定启动文件**

```powershell
yarn webpack --config webpack.dev.js
```

可以将命令配置到packaje.json中方便使用

# 优化配置

## Define Plugin

> 为代码注入全局成员

> 在production环境下，会默认启用。为代码中注入`process.env.NODE_ENV`的常量。

使用define plugin可以帮助我们为不同的环境注入不同的环境变量。如API_BASE_URL。

```js
//webpack.config.js
const webpack = require('webpack');
mosdule.exports= {
  //..
  plugins:[
    new webpack.DefinePlugin({
      API_BASE_URL:'"https://www.example.js"'   // 需要是个js代码片段
    })
  ]
}
```

## Tree Shaking

> 检查代码中为引用的代码并移除。

> 在production环境下，会默认启用。

TreeShaking 不是webpack中的一个配置选项，是一组功能搭配使用

`optimization`属性用于集中配置webpack优化功能

```js
module.exports = {
    mode:'none',
    entry:'./src/index.js',
    output:{
        filename:'bundle.js'
    },
    optimization:{
        usedExports:true, // 打包的模块不导出未使用的模块
        concatenateModules:true, //合并模块
        minimize:true, //压缩代码，删除空格，删除无用代码，删除未使用代码模块
    }
}
```

### Tree Shaking & babel

由Webpack打包的代码必须是使用ESModule的。

而为了转换代码中ECMAScript的新特性，需要使用babel-loader。

babel-loader很有可能将ESModule转换为CommomJS，导致TreeShaking不能生效。

可以手动限制preset关闭module转换

```js
module.exports = {
    mode:'none',
    entry:'./src/index.js',
    output:{
        filename:'bundle.js'
    },
  	module:{
      rules:[
        {
          test:'/.js$/',
          use:{
            loader:'babel-loader',
            options:{
              presets:[
                ['@babel/preset-env',{moduls:flase}]  // 'auto','commonjs',
              ]
            }
          }
        }
      ]
    },
    optimization:{
        usedExports:true, // 打包的模块不导出未使用的模块
        concatenateModules:true, //合并模块
        minimize:true, //压缩代码，删除空格，删除无用代码，删除未使用代码模块
    }
}
```

## sideEffiets -- 副作用

> 打包前判断模块是否有副作用，若没有副作用，则没有用到的模块不会被打包。

> 在production环境下，会默认启用。

```json
//packaje.json
{
  "sideEffects":false  //表明项目中所有代码模块都没有副作用
}
```

```js
//webpack.config.js
module.exports = {
  mode:'none',
  entry:'./src/index.js',
  output:{
    filename:'bundle.js'
  },
  optimization:{
		sideEffects:true  //开始sideEffects
  }
}
```

### 确保代码没有副作用

> 副作用：函数内部与外部互动。
>
> 比如：修改全局变量的值，通过原型的方式拓展方法

**标示有副作用的代码**

```js
//packaje.json
{
  "sideEffects":[
    "./src/extend.js",
    "./assets/*.css"
  ]
}
```

## 代码分割

> 分包，按需加载。

> 将模块按照我们所设计的规则打包到不同文件中，从而提高相应速度。

### 多入口打包

> 适用于多页面应用程序

```js
const HtmlWebpackPlugin = require('html-webpack-plugin')
module.exports= {
  entry:{
    index:'./src/index.js',
    about:'./src/about.js'
  },
  output:{
    filename:'[name].bundle.js'
  },
  plugins:[
    new HtmlWebpackPlugin({
      filename:'index.html',
      template:'./src/index.html',
      chunks:['index']  	//指定需要注入的文件
    }),
    new HtmlWebpackPlugin({
      filename:'about.html',
      template:'./src/about.html',
      chunks:['about']  //指定需要注入的文件
    })
  ]
}
```

**提取公共模块**

```js
const HtmlWebpackPlugin = require('html-webpack-plugin')
module.exports= {
  entry:{
    index:'./src/index.js',
    about:'./src/about.js'
  },
  output:{
    filename:'[name].bundle.js'
  },
  optimization:{
    //提取公共模块
    splitChunks:{
      chunks:'all'
    }
  },
  plugins:[
    new HtmlWebpackPlugin({
      filename:'index.html',
      template:'./src/index.html',
      chunks:['index']  	//指定需要注入的文件
    }),
    new HtmlWebpackPlugin({
      filename:'about.html',
      template:'./src/about.html',
      chunks:['about']  //指定需要注入的文件
    })
  ]
}
```

### 动态导入

> 需要某个模块时，再加载这个模块

> Webpac支持动态导入的方式加载模块，所有动态导入的模块都会自动分包。

在开发代码中使用ES Module 动态导入即可。

```js
//index.js
const render = ()=>{
  if(xx){
    import('./news/news').then({default as news}=>{
      	//...
    })
  }else{
     import('./posts/posts').then({default as posts}=>{
      	//...
    })
  }
}
```



默认动态导入的模块打包的文件名就仅是一个序号。

如果需要给动态导入的文件制定文件名，可以使用**魔法注释**

**魔法注释**

```js
//index.js
const render = ()=>{
  if(xx){
    import(/* webpackChunkName:'news' */'./news/news').then({default as news}=>{
      	//...
    })
  }else{
     import(/* webpackChunkName:'posts' */'./posts/posts').then({default as posts}=>{
      	//...
    })
  }
}
```

当魔法注释指定的文件名相同时，会打包至统一文件

## css文件处理

### 提取css文件到单个文件

使用`MiniCssExtractPlugin`实现CSS文件按需加载

```powershell
yarn add mini-css-extract-plugin --dev
```

```js
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
module.exports = {
  module:{
    rules:[
     {
        test:/\.css$/,
       use:[
         MiniCssExtractPlugin.loader,  //不需要使用style标签注入样式代码，使用link标签的形式注入
         'css-loader'
       ]
     }
    ]
  },
  plugins:[
    new MiniCssExtractPlugin()
  ]
}
```

### 压缩提取的css文件

webpack内置仅压缩js，其他形式的文件需要额外的配置来压缩

`optimize-css-assets-webpack-plugin`插件可以用来压缩css文件

```powershell
yarn add optimize-css-assets-webpack-plugin --dev
```

```js
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const OptimizeCssAssetsWebpackPlugin = require('optimize-css-assets-webpack-plugin')
module.exports = {
  module:{
    rules:[
     {
        test:/\.css$/,
       use:[
         MiniCssExtractPlugin.loader,  //不需要使用style标签注入样式代码，使用link标签的形式注入
         'css-loader'
       ]
     }
    ]
  },
  plugins:[
    new MiniCssExtractPlugin(),
    new OptimizeCssAssetsWebpackPlugin()  // 任何情况下都可以使用
  ]
}
```

*或者* 放置在配置优化的minimizer数组中，只有开启minimize时，才会进行压缩。

但是此时，webpack会认为我们要自定义压缩，所以我们还要手动添加js压缩插件

```js
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const OptimizeCssAssetsWebpackPlugin = require('optimize-css-assets-webpack-plugin')
const TerserWebpackPlugin = require('terser-webpack-plugin')
module.exports = {
  module:{
    rules:[
     {
        test:/\.css$/,
       use:[
         MiniCssExtractPlugin.loader,  //不需要使用style标签注入样式代码，使用link标签的形式注入
         'css-loader'
       ]
     }
    ]
  },
  optimization:{
    minimize:true,
    minimizer:[
      new OptimizeCssAssetsWebpackPlugin(),
      new TerserWebpackPlugin()
    ]
  },
  plugins:[
    new MiniCssExtractPlugin(),
  ]
}
```

## 文件Hash

> 避免文件更新缓存

output和插件中的filename都支持使用占位符的方式来定义文件名。

###  [hash]

> 项目级别的。任何一个文件有改动，所有文件打包的hash值都会变化。

```js
module.exports = {
  output:{
    filename:'[name]-[hash]-bundle.js'
  },
  plugins:[
    new MiniCssExtractPlugin({
      filename:'[name]-[hash]-bundle.js'
    })
  ]
}
```

### [chunkhash]

> chunk级别的，文件改动后，只有同一chunk的文件发生打包时hash值会发生变化

```js
module.exports = {
  output:{
    filename:'[name]-[chunkhash]-bundle.js'
  },
  plugins:[
    new MiniCssExtractPlugin({
      filename:'[name]-[chunkhash]-bundle.js'
    })
  ]
}
```

### [contenthash]

> 文件级别的，不同文件有不同hash值。

```js
module.exports = {
  output:{
    filename:'[name]-[contenthash]-bundle.js'
  },
  plugins:[
    new MiniCssExtractPlugin({
      filename:'[name]-[contenthash]-bundle.js'
    })
  ]
}
```

## 指定hash长度

```js
module.exports = {
  output:{
    filename:'[name]-[chunkhash:8]-bundle.js'
  },
  plugins:[
    new MiniCssExtractPlugin({
      filename:'[name]-[chunkhash:8 ]-bundle.js'
    })
  ]
}
```



