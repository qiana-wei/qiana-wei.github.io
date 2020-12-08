---
title: 前端工程化4-自动化构建-Gulp
date: 2020-12-08 10:40:00
tags: ['前端工程化','自动化构建','Gulp']
category: '前端工程化'

---

[官网看这里](https://www.gulpjs.com.cn/)

> Gulp:基于流的构建系统

# 安装

```powershell
# 安装gulp命令行工具
yarn --global gulp-cli=
# 项目局部安装，开发依赖
yarn add gulp --dev 
```

## 使用

在根目录下，创建`gulpfile.js`

### 基本使用

> 通过导出函数成员的方式定义任务。
>
> gulp中的任务是异步任务，需要使用回调函数标记执行结束

`gulpfile.js`是gulp的执行文件，在`gulpfile.js`中添加构建指令。

```js
//导出默认任务
exports.default = (done)=>{
  console.log('default task')
  //标示任务执行结束
  done()
}

// 导出test任务
exports.test = (done)=>{
  console.log('test task')
  //标示任务执行结束
  done()
}

//支持使用promise
exports.promise = ()=>{
  console.log('promise task')
  //Promise.resolve() 标示任务执行结束
  return Promise.resolve()
}

//node 环境大于8时，可以使用async/await
exports.async = async()=>{
  await new Promise(resolve=>{
    setTimeout(resolve,1000)
  })
  console.log('async task')
}
```

执行`gulp`，会自动运行`gulpfile.js`中的`default`任务

![gulp](./gulp1.jpg)

运行`gulp test`会执行`test`任务

![gulp](./gulp2.jpg)

**注意**：对于异步执行函数，任务完成标记需要在回调函数中执行

```js
exports.task = (done)=>{
  setTimeout(()=>{
    console.log("task")
    done()
  },1000)
}
```

### 组合任务

> 通过`series` 和 `parallel`实现组合任务
>
> `series`组合任务串行执行，用于组合一些有依赖关系，需要顺序执行的任务
>
> `parallel`组合任务并行执行，用于组合一些没有依赖关系，可以同时执行的任务

```js
const {series, parallel}  = require('gulp')
const task1 = (done)=>{
  setTimeout(()=>{
    console.log("task1")
    done()
  },1000)
}
const task2 = (done)=>{
  setTimeout(()=>{
    console.log("task2")
    done()
  },1000)
}

const task3 = (done)=>{
  setTimeout(()=>{
    console.log("task3")
    done()
  },1000)
}
exports.seriesTask = series(task1,task2,task3)
exports.parallelTask = parallel(task1,task2,task3)
```

执行`gulp seriesTask`，任务串行执行

![gulp-series](./gulp-series.jpg)

执行`gulp parallelTask`，任务并行执行

![gulp-parallel](./gulp-parallel.jpg)

### 错误处理

因为gulp任务回调函数式错误优先，所有处理任务执行错误，仅需在done回调函数中传入错误信息即可。

```js
const {series, parallel}  = require('gulp')
const task1 = (done)=>{
  setTimeout(()=>{
    console.log("task1")
    done()
  },1000)
}
const task2 = (done)=>{
  setTimeout(()=>{
    console.log("task2")
    done()
  },1000)
}

const task3 = (done)=>{
  setTimeout(()=>{
    console.log("task3")
    done()
  },1000)
}

// 导出test任务
const callback_error = (done)=>{
  console.log('callback_error task')
  //标示任务执行结束
  done(new Error("callback_error task failed"))
}

//同样支持Promise.reject
const promise_error = ()=>{
  console.log('promise error task')
  //Promise.reject() 标示任务执行失败
  return Promise.reject(new Error("promise_error task failed"))
}

const parallelTask = parallel(task1,callback_error,task2,task3)

module.exports = {
    callback_error,
    parallelTask
}
```

执行`callback_error`,报错

![gulp-error](./gulp-error.jpg)

执行组合函数，遇到错误任务时，会停止执行后续任务

![gulp-parallel](./gulp-error-parallel.jpg)

### 流的方式使用gulp

使用文件流实现文件复制

```js
const fs = require('fs')
exports.stream = ()=>{
  //读取文件流
  const readStream = fs.createReadStream('package.json')
  //写入文件流
  const writeStream = fs.createWriteStream('temp.txt')
  //通过pipe()将读取文件流导入写入文件流
  readStream.pipe(writeStream)
  //readStream end的时候即为任务结束的时机
  return readStream
}
```

![gulp-stream](./gulp-stream.jpg)

# gulp构建过程核心工作原理

> 读取文件，加工文件，写入另外一个位置

## 例子，实现css的压缩

使用fs模块读取和写入文件流。

使用`steram`的`Transform`实现文件内部的修改

```js
const fs = require('fs')
const {Transform} = require('stream')

exports.default = ()=>{
  //读取文件流
  const readFile = fs.createReadStream('normalize.css')
  //写入文件流
  const writeFile = fs.createWriteStream('notmalize.min.css')
  	
  //处理文件流
  const transform = new Transform({
    transform:(chunk,encoding,callback)=>{
      //核心转换过程
      //chunk：读取文件流中读取到的内容(Buffer)
      const input = chunk.toString()
      //替换或有的空格与css注释
      const output = input.replace(/\s+/g,"").replace(/\/\*.+?\*\//g,"")
      callback(null,output)
    }
  })
  
  //把读取的文件流导入写入文件流
  readFile
    .pipe(transform) // 先将读取文件流进行转换
    .pipe(writeFile) // 将转换结果导入到写入文件流
  return readFile
}	
```

*normalize.css*

```css
/* 这是body注释 */
body{
    background-color: #cccccc;
}
```

执行`gulp`

转换后的 *normalize.min.css*

```css
body{background-color:#cccccc;}
```

# 文件操作API

使用gulp的`src` 模块实现文件流读取，`dest`实现文件流写入

```js
const { src, dest }  = require('gulp')

exports.default = ()=>{
  return src('src/normalize.css')
  	.pipe(dest('dist'))
}

//可以使用通配符匹配所有文件
exports.css = ()=>{
  return src('src/s*.css')
  	.pipe(dest('dist'))
}
```

# 常用插件

1. `gulp-clean-css` 压缩css文件

   ```js
   const { src, dest }  = require('gulp')
   const cleanCss = require('gulp-clean-css')
   
   exports.default = ()=>{
     return src('src/normalize.css')
       .pipe(cleanCss()) // 先进行转换
       .pipe(dest('dist'))
   }
   ```

2. `gulp-rename`重命名文件

   ```js
   const { src, dest }  = require('gulp')
   const cleanCss = require('gulp-clean-css')
   const rename = require('gulp-rename')
   
   exports.default = ()=>{
     return src('src/normalize.css')
     	.pipe(cleanCss()) // 先进行转换
     	.pipe(rename({extname:".min.css",}))
     	.pipe(dest('dist'))
   }
   ```

3. gulp-sass`用于构建`scss`文件为`css`文件

   gulp-sass会默认认为`_`开头的scss文件为依赖样式，不会导出css文件

   ```js
   const { src, dest }  = require('gulp')
   const sass = require('gulp-sass')
   exports.default = ()=>{
     return src('src/assets/scss/*.scss',{base:'src'})
     	.pipe(sass()) // 进行转换
     	.pipe(dest('dist'))
   }
   ```

4. `gulp-babel`用于构建脚本文件，实现es6的向下转换

   使用`gulp-babel`不会自动安装babel/core核心模块，还需要手动安装`@babel/core`以及`@babel/preset-env`。

   `@babel/preset-env`会默认将ES6的所有新特性进行转换

   ```js
   const { src, dest } = require('gulp')
   const babel = require('gulp-babel')
   
   //实现脚本文件编译
   exports.default = () =>{
     return src('src/assets/scripts/*.js', { base: "src/" })
       .pipe(babel({presets:['@babel/preset-env']}))//指定转换preset
       .pipe(dest('dist'))
   }
   ```

5. `gulp-imagemin`用于图片压缩

   `gulp-imagemin`是图片无损压缩，只是删除了图片的一些附属信息。

   ```js
   const { src, dest } = require('gulp')
   const imagemin = require('gulp-imagemin')
exports.default = ()=>{
     return src('src/assets/images/*', { base: "src/" })
       .pipe(imagemin())//压缩图片
       .pipe(dest('dist'))
   }
   ```
   

6.  `gulp-load-plugins`用于管理plugin，能够自动加载所有的plugin

   ```powershel
   yarn add gulp-load-plugins --dev
   ```

   ```js
   const loadPlugins = require('gulp-load-plugins')
   const plugins = loadPlugins()
   //通过`plugin.`的方式调用模块
   const { src, dest, parallel,series} = require('gulp')
   exports.default = ()=>{
     return src('src/assets/images/*', { base: "src/" })
       .pipe(plugins.imagemin())//通过`plugin.imagemin`的方式调用图片压缩模块
       .pipe(dest('dist'))
   }
   ```

# 其他模块

1. `del`模块可以实现文件夹清空

   ```powershell
   yarn add del --dev
   ```

   ```js 
   const del = require('del')
   
   const clean = ()=>{
     return del(['dist'])
   }
   
   module.exports={
     clean
   }
   ```

2.  `browser-sync`服务器，模块提供开发服务器，实现热更新

   [看这里](/2020/12/08/engineering/gulp2/#优化–开发服务器实现热更新)

# 构建实例

[移步这里](/2020/12/08/engineering/gulp2/)

