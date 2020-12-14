---
title: 前端工程化9-Webpack模块化打包实例
date: 2020-12-08 12:40:00
tags: ['前端工程化','webpack','模块化打包']
category: '前端工程化'
---
> 完成一个VUE项目的Webpack模块化打包实例

[项目代码看这里](https://github.com/qiana-wei/qiana-wei.github.io/tree/master/code-example/webpack-build)

# 项目目录解构及构建需求

```powershell
# 项目目录
.
├── public   # 静态文件，不需要编译，构建时执行复制操作
│   ├── favicon.ico
│   └── index.html
└── src      # 资源文件目录
    ├── App.vue  # VUE入口文件
    ├── assets   # 图片文件进行压缩
    │   └── logo.png
    ├── components # Vue文件，模块化打包
    │   └── HelloWorld.vue
    ├── main.js  # 入口文件
    └── style.less # 样式文件，编译为css
```

**构建需求**

1. 开发过程中，使用webpack server作为开发服务器，使用eslint监测代码质量
2. VUE文件模块化打包
3. less文件，编译为css文件
4. js文件，ES6新特性需进行转换。
5. 图片文件需进行压缩
6. 打包后的js文件、css文件、html文件需要压缩
7. 开发环境，`/api/xxx`请求需代理至测试服务器`http://test.example.com`
8. .....

# 构建开发过程

## 环境

`webpack`: 5.10.0

`node`:v14.2.0

`npm`:6.14.4

`yarn`:1.22.4

## 初始准备

1. 安装webpack：`yarn add webpack webpack-cli --dev`

2. 在根目录创建`webpack.common.js`、`webpack.dev.js`、`webpack.prod.js`分别用于配置公共构建配置、开发环境构架配置、生产环境构建配置

3. 配置webpack基础配置.先在`webpack.common.js`配置文件中写入基础配置，先让webpack能够完成最基础的打包构建，最后优化时再进行配置文件分割。

   ```js
   let path = require('path')
   
   module.exports = {
     mode:"none",
     entry:"./src/main.js",
     output:{
       path:path.join(__dirname,'dist'),
       filename:"[name].js"
     },
   }
   ```

4. 修改`package.json`, `script`命令，方便构建打包

   ```json
   {
     "script":{
       "dev":"webpack --config webpack.common.js",
       "build":"webpack --config webpack.build.js",
     }
   }
   ```

   



## 资源加载器配置

### vue 加载器

**安装**`vue-loader`,`vue-template-compiler`

```powershell
yarn add vue-loader vue-template-compiler --dev
```

**配置**

```js
let path = require('path')

const vueLoaderPlugin = require('vue-loader/lib/plugin')

module.exports = {
  mode:"none",
  entry:"./src/main.js",
  output:{
    path:path.join(__dirname,'dist'),
    filename:"[name].js"
  },
  module:{
    rules:[
      {
        test: /\.vue$/,
        loader: 'vue-loader'
      }
    ]
  },
  plugins:[
    //vue
    new vueLoaderPlugin()
  ]
}
```

### less && css

安装`less`,` less-loader`,`css-loader`,`style-loader`

```powershell
yarn add less less-loader css-loader style-loader --dev
```

配置 loader

```js
let path = require('path')

const vueLoaderPlugin = require('vue-loader/lib/plugin')

module.exports = {
 //...
  module:{
    rules:[
     //....
      {
        test: /\.less$/,  //处理less
        use:['style-loader','css-loader','less-loader']
      },
      {
        test: /\.css$/, //处理css
        use:['style-loader','css-loader']
      }
    ]
  },
  plugins:[
    //...
  ]
}
```

### 图片资源加载

**安装**

```powershell
yarn add url-loader file-loader --dev
```

**使用**

```js
let path = require('path')

const vueLoaderPlugin = require('vue-loader/lib/plugin')

module.exports = {
 //...
  module:{
    rules:[
     //...
      {
        test: /\.(png|jpg|gif)$/,
        use:{
          loader:'url-loader',
          options:{ 
            limit:10 * 1024  // 对进行base64转换的图片进行尺寸限制，
          }
        }
      }
    ]
  }
}
```

### ES6新特性转换

安装`babel-loader`,`@babel/core`,`@babel/preset-env`

```powershell
yarn add babel-loader @babel/core @babel/preset-env --dev
```

*配置loader*

```js
let path = require('path')

const vueLoaderPlugin = require('vue-loader/lib/plugin')

module.exports = {
  //...
  module:{
    rules:[
      //...
      {
        test: /.\js/,
        use:{
          loader:'babel-loader',
          options:{
            presets:['@babel/preset-env']
          }
        }
      }
    ]
  },
 	//...
}
```

## 其他自动化处理

### 静态资源文件构建处理

**安装** `copy-webpack-plugin `

```powershell
yarn add copy-webpack-plugin  --dev
```

**配置**

```js
let path = require('path')

const vueLoaderPlugin = require('vue-loader/lib/plugin')
const CopyWebpackPlugin = require('copy-webpack-plugin')

module.exports = {
  //...
  module:{
    rules:[
     //..loaders
    ]
  },
  plugins:[
    //vue
    new vueLoaderPlugin(),
    new CopyWebpackPlugin({
      patterns:[
        {
          from:'public/favicon.ico',
        }
      ]
    }),
  ]
}
```

### 处理html文件

#### 1. 将bundle.js自动填充到html

**安装**`html-webpack-plugin`

```powershell
yarn add html-webpack-plugin --dev
```

**配置**

```js
let path = require('path')

const vueLoaderPlugin = require('vue-loader/lib/plugin')
const CopyWebpackPlugin = require('copy-webpack-plugin')

module.exports = {
  //...
  module:{
    rules:[
     //..loaders
    ]
  },
  plugins:[
    //vue
    new vueLoaderPlugin(),
    new CopyWebpackPlugin({
      patterns:[
        {
          from:'public/favicon.ico',
        }
      ]
    }),
    new HtmlWebpackPlugin({
      template:path.join(__dirname,'public/index.html'),
      title:'VUE Webpack Prodtion'
    })
  ]
}
```

#### 2. 处理BASE_URL

`BASE_URL`使用的是`process.env`的值。也可以共享webpack在plugins中DefinePlugin的值。

```js
let path = require('path')
const webpack = require('webpack')

const vueLoaderPlugin = require('vue-loader/lib/plugin')
const CopyWebpackPlugin = require('copy-webpack-plugin')
const HtmlWebpackPlugin  = require('html-webpack-plugin')

module.exports = {
  //...
  module:{
    rules:[
      //..loaders
    ]
  },
  plugins:[
    //vue
    new vueLoaderPlugin(),
    new CopyWebpackPlugin({
      patterns:[
        {
          from:'public/favicon.ico',
        }
      ]
    }),
    new webpack.DefinePlugin({
      BASE_URL: '"/"'
    }),
    new HtmlWebpackPlugin({
      template:path.join(__dirname,'public/index.html'),
      title:'VUE Webpack Prodtion'
    })
  ]
}
```

# 添加ESLint

**安装**

```powershell
yarn add eslint eslint-loader eslint-plugin-vue babel-eslint --dev
```

**配置**

```js
module.exports = {
  //...
  module:{
    rules:[
      //...
      {
        enforce: 'pre',
        test: /\.(js|vue)$/,
        loader: 'eslint-loader',
        exclude: /node_modules/
      }
    ]
  },
 	//...
}
```

# 使用webpack-dev-server 启动服务

**安装**

```powershell
yarn add webpack-dev-server --dev
```

**配置**

```js
module.exports = {
  //...
  devServer:{
    contentBase:path.join(__dirname,'dist')
  },
  //...
}
```

**修改packaje.json**

```json
{
  "scripts": {
    "dev": "webpack serve --config webpack.common.js",
    "build": "webpack --config webpack.build.js",
    "lint": "echo \"请使用 ESLint 实现此任务\""
  },
}
```

运行**yarn dev**,启动服务器，发现浏览器报错“http://localhost:8080/[Object%20Module]”

## 问题1:浏览器报错 “http://localhost:8080/[Object%20Module]”

这个问题是由于图片文件使用ES Module打包引起的。

修改`url-loader`配置

```js
{
  test: /\.(png|jpg|gif)$/,
  use:{
    loader:'url-loader',
    options:{ 
      limit:10 * 1024 , // 对图片进行压缩
      esModule: false,
    }
  }
},
```

## 问题2: 修改代码，自动编译但浏览器不会自动更新

> 添加target配置，告诉webpack，代码运行环境

```js
module.export = {
  target: 'web'
}
```

# 环境配置

到目前为止，我们的基础的webpack打包配置已经完成。

现在，我们需要根据环境不同，配置不同的环境变量。

## 环境变量合并

> 使用`webpack-merge`来合并公共配置与开发配置和生产配置。

**安装**

```powershell
yarn add webpack-merge --dev
```

**webpack.dev.js**

```js
const {merge} = require('webpack-merge')
const common = require('./webpack.common.js')

module.exports = merge(common,{
  mode:'development',
  target:'web',
  //添加开发环境特有的配置
})
```

**webpack.prod.js**

```js
const {merge} = require('webpack-merge')
const common = require('./webpack.common.js')

module.exports = merge(common,{
  mode:'production'
  //添加生产环境特有的配置
})
```

**修改package.json**

```js
{
  "scripts": {
    "dev": "webpack serve --config webpack.dev.js",
    "build": "webpack --config webpack.build.js",
    "lint": "echo \"请使用 ESLint 实现此任务\""
  },
}
```

## 优化开发环境配置

### 添加代理

**使用`webpack-dev-server`的proxy**将api请求代理到测试服务器`http://test.example.com`

```js
//webpack.dev.js
const {merge} = require('webpack-merge')
const common = require('./webpack.common.js')

module.exports = merge(common,{
  mode:'development',
  target:'web',
  devServer:{
    proxy:{
      '/api':{
        target:'http://test.example.com',
        pathRewrite:{
          '^/api':''
        },
        changeOrigin:true
      }
    },
  }
  //添加开发环境特有的配置
})
```

### 添加热加载（HMR）

`vue-loader`内部实现了`vue-hot-reload-api`,当webpack开启了热更新之后，更新vue模块代码时，`vue-loader`会自动处理热更新。

**启动HMR**

```js
//webpack.dev.js
const {merge} = require('webpack-merge')
const common = require('./webpack.common.js')

module.exports = merge(common,{
  mode:'development',
  target:'web',
  devServer:{
    proxy:{
      '/api':{
        target:'http://test.example.com',
        pathRewrite:{
          '^/api':''
        },
        changeOrigin:true,
      }
    },
    hot:true
  },
  //添加开发环境特有的配置
})
```

当父子组件数据传递时，更新父组件数据，会更新父组件和子组件。若只想更新子组件：可以使用vue-hot-reload-api配置vue热加载

**安装**

```powershell
yarn add vue-hot-reload-api --dev
```

**配置使用**

*VUE文件*

```vue
<template>
  <div id="app">
    <img alt="Vue logo" src="./assets/logo.png">
    <HelloWorld msg="Welcome to Your Vue.js App"/>
    <input type="text">
  </div>
</template>

<script>
import HelloWorld from './components/HelloWorld.vue'

if (module.hot) {
  const api = require('vue-hot-reload-api')
  const Vue = require('vue')
  api.install(Vue)
  if (!api.compatible) {
    throw new Error('vue-hot-reload-api is not compatible with the version of Vue you are using.')
  }
  module.hot.accept()
  if (!module.hot.data) {
    api.createRecord('very-unique-id', HelloWorld)
  } else {
    api.rerender('very-unique-id', HelloWorld)
  }
}

export default {
  name: 'App',
  components: {
    HelloWorld
  },
}
</script>
```

此时，启动webpack server，当更新App.vue中msg的数据时，就只会更新HelloWorld模块，而不是刷新整个页面了。

## 优化生产环境配置

### 输出文件添加hash

```js
const {merge} = require('webpack-merge')
const common = require('./webpack.common.js')

module.exports = merge(common,{
  mode:'production',
  output:{
    filename:"[name]-[hash:8].js"
  },
  //添加生产环境特有的配置
})
```

### 编译前清空dist目录

**安装**`clean-webpack-plugin`

```powershell
yarn add clean-webpack-plugin --dev
```

```js
const {merge} = require('webpack-merge')
const common = require('./webpack.common.js')

const {CleanWebpackPlugin} = require('clean-webpack-plugin')

module.exports = merge(common,{
  mode:'production',
  output:{
    filename:"[name]-[hash:8].js"
  },
  plugins:[
    new CleanWebpackPlugin()
  ]
  //添加生产环境特有的配置
})
```

## 拆分css文件

**安装**`mini-css-extract-plugin`

```powershell
yarn add mini-css-extract-plugin --dev
```
*webpack.common.js*

```js
const MiniCssExtractPlugin = require('mini-css-extract-plugin')

module.exports={
  //...
  module:{
    rules:[
      {
        test: /\.css$/, //处理css
        use:[MiniCssExtractPlugin.loader,'css-loader']
      },
      {
        test: /\.less$/,
        use:[MiniCssExtractPlugin.loader,'css-loader','less-loader']
      },
    }
  }
}
```

*webpack.prod.js*

```js
const MiniCssExtractPlugin = require('mini-css-extract-plugin')

module.exports={
  //...
  module:{
  },
  plugins:[
	 	new MiniCssExtractPlugin({
      filename:'[name]-[hash:8].css'
    })
  ]
}
```

**压缩css**

安装`optimize-css-assets-webpack-plugin`

```powershell
yarn add optimize-css-assets-webpack-plugin --dev
```

```js
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const OptimizeCssAssetsWebpackPlugin = require('optimize-css-assets-webpack-plugin')

module.exports={
  //...
  module:{
  },
  plugins:[
	 	new MiniCssExtractPlugin({
      filename:'[name]-[hash:8].css'
    }),
    new OptimizeCssAssetsWebpackPlugin()
  ]
}
```

### 添加tree shaking

```js
optimization:{
    usedExports:true,
    concatenateModules:true,
    minimize:true,
  },
```



