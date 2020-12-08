---
title: 前端工程化5-Gulp自动化构建实例
date: 2020-12-08 12:40:00
tags: ['前端工程化','自动化构建','Gulp']
category: '前端工程化'
---
> 完成一个项目的自动化构建

[项目代码看这里](https://github.com/qiana-wei/qiana-wei.github.io/tree/master/code-example/gulp-build)

# 项目目录结构及构建需求：

```powershell
# 项目目录
.
├── gulpfile.js  # gulp命令文件
├── package.json
├── public			# 静态文件，不需要编译，构建时执行复制操作
│   └── favicon.ico
├── src					# 资源文件目录
│   ├── about.html 
│   ├── assets
│   │   ├── fonts  # 字体文件在进行复制，图片文件进行压缩
│   │   │   ├── pages.eot
│   │   │   ├── pages.svg
│   │   │   ├── pages.ttf
│   │   │   └── pages.woff
│   │   ├── images # 图片文件进行压缩
│   │   │   ├── brands.svg
│   │   │   └── logo.png
│   │   ├── scripts # js文件进行es转换，并进行压缩
│   │   │   └── main.js
│   │   └── styles # scss文件进行转换，并进行压缩
│   │       ├── _icons.scss
│   │       ├── _variables.scss
│   │       └── main.scss
│   ├── index.html   # html由swig模板语言编写，需要进行编译，并进行压缩
│   ├── layouts
│   │   └── basic.html
│   └── partials
│       ├── footer.html
│       └── header.html
└── yarn.lock
```

# 构建开发过程

## 实现scss转换为css的构建

使用`gulp-sass`插件实现scss为css的转换

```js
// 实现这个项目的构建任务
const { src, dest } = require('gulp')
//用于编译scss为css文件
const sass = require('gulp-sass')  

//实现scss编译为css
const style = () => {
  // 指定文件输出base为src,会在dist目录中，创建相对应的子目录
  return src('src/assets/styles/*.scss', { base: "src/" })
    .pipe(sass({outputStyle:'expanded'}))//可以指定转换代码的样式格式
    .pipe(dest('dist'))
}

module.exports = {
  style
}
```

## 实现脚本文件ES6的编译

使用`gulp-babel`实现ES6的转换

使用`gulp-babel`不会自动安装babel/core核心模块，还需要手动安装`@babel/core`以及`@babel/preset-env`。

`@babel/preset-env`会默认将ES6的所有新特性进行转换

```js
const { src, dest } = require('gulp')
const babel = require('gulp-babel')

//实现脚本文件编译
const script = () =>{
  return src('src/assets/scripts/*.js', { base: "src/" })
    .pipe(babel({presets:['@babel/preset-env']}))//指定转换preset
    .pipe(dest('dist'))
}

module.exports = {
  script
}
```

## 实现模板文件的编译

模板文件中使用了模板引擎`swig`，使用`gulp-swig`进行编译

```js
const swig = require('gulp-swig')

//添加模板数据信息
data = {
  //...具体数据信息
}
//实现模板文件编译
const page = () =>{
  return src('src/*.html', { base: "src/" })
    .pipe(swig({data}))//使用swig转换
    .pipe(dest('dist'))
}
module.exports = {
  page
}
```

## 实现开发环境编译组合任务

结合上面的任务，各个编译之间没有依赖关系，可以并行编译

```js
const { src, dest, parallel} = require('gulp')
const sass = require('gulp-sass') 
const babel = require('gulp-babel')
const swig = require('gulp-swig')

const data = {
  //...具体数据信息
}

//实现scss编译为css
const style = () => {
 //...style任务
}

//实现脚本文件编译
const script = () =>{
 //...script任务
}

//实现模板文件编译
const page = () =>{
  //...page任务
}

const compile = parallel(style,script,page)

module.exports = {
  compile
}
```

## 实现图片、字体等静态文件的编译

图片文件需要进行压缩，字体文件及静态文件可以直接导入写入文件流

图片压缩使用工具``

```js
const { src, dest, parallel} = require('gulp')
const imagemin = require('gulp-imagemin')
//图片压缩
const img = ()=>{
  return src('src/assets/images/**', { base: "src/" })
    .pipe(imagemin())//压缩图片
    .pipe(dest('dist'))
}
//字体文件处理
const font = ()=>{
  return src('src/assets/fonts/**', { base: "src/" })
    .pipe(imagemin())//压缩字体文件的图片，不能压缩的文件不会进行处理
    .pipe(dest('dist'))
}
//静态文件复制
const extra = ()=>{
  return src('public/**', { base: "public/" })
    .pipe(dest('dist'))
}

module.exports = {
  img,
  font,
  extra
}
```

## 实现正式环境部署编译组合任务

```js
// 实现这个项目的构建任务
const { src, dest, parallel} = require('gulp')
//用于编译scss为css文件
const sass = require('gulp-sass') 

const babel = require('gulp-babel')

const swig = require('gulp-swig')

const imagemin = require('gulp-imagemin')

const data = {
  //..data数据
}


//实现scss编译为css
const style = () => {
 //...style任务
}

//实现脚本文件编译
const script = () =>{
 //...script任务
}

//实现模板文件编译
const page = () =>{
  //...page任务
}

//图片压缩
const img = ()=>{
  //...img任务
}
//字体文件复制
const font = ()=>{
  //...font任务
}
//静态文件复制
const extra = ()=>{
  //...extra任务
}

const compile = parallel(style,script,page)
const build = parallel(compile,img,font,extra)


module.exports = {
  compile,
  build
}
```

## 优化-- 构建前实现dist文件夹清除

`del`模块可以实现文件删除，它不是gulp的模块，但是可以在gulp中使用

`yarn add del --dev`

```js
const { src, dest, parallel,series} = require('gulp')
//清除文件
const del = require('del')

//用于编译scss为css文件
const sass = require('gulp-sass') 
//编译js
const babel = require('gulp-babel')
//swig模板填充编译
const swig = require('gulp-swig')
//图片压缩
const imagemin = require('gulp-imagemin')

const data = {
  //..data数据
}

//添加清除task
const clean = ()=>{
  return del(['dist'])
}

//实现scss编译为css
const style = () => {
 //...style任务
}

//实现脚本文件编译
const script = () =>{
 //...script任务
}

//实现模板文件编译
const page = () =>{
  //...page任务
}

//图片压缩
const img = ()=>{
  //...img任务
}
//字体文件复制
const font = ()=>{
  //...font任务
}
//静态文件复制
const extra = ()=>{
  //...extra任务
}

//在编译前清空文件
const compile = series(clean,parallel(style,script,page))
const build = parallel(compile,img,font,extra)

module.exports = {
  compile,
  build
}
```

## 优化--开发服务器实现热更新

使用`browser-sync`模块提供开发服务器，实现热更新

```js
const { src, dest, parallel,series, watch} = require('gulp')
const browerSync = require('browser-sync')
const serve = () =>{
  browerSync.init({
    notify: false,//关闭服务器启动提示
    port: 8888,//设置端口，
    open: false,//关闭自动启动浏览器
    files: 'dist/**',//监测文件更新后，热更新浏览器
    server:{
      baseDir: ['dist'],
      routes:{
        '/node_modules':"node_modules", // 处理node_modules引用
      }
    }
  })
}
const compile = series(clean,parallel(style,script,page))
const build = parallel(compile,img,font,extra)
//添加开发组合任务
const dev = series(build,serve)
module.exports = {
 dev
}
```

这里只是更新了dist的文件夹下文件，才会热更新服务器。

我们还需要对需要编译的文件进行监听，当文件发生变化时，自动更新至dist文件夹，从而进一步更新到浏览器

使用watch进行监听

```js
const { src, dest, parallel,series, watch} = require('gulp')
const browerSync = require('browser-sync')
const serve = () =>{
  watch('src/assets/styles/*.scss',style)  
  watch('src/assets/script/*.js',script)
  watch('src/*.html',page)
  
  watch([
    "src/assets/images/**",
    "src/assets/fonts/**",
    "public/**"
  ],browerSync.reload)

  browerSync.init({
    notify: false,//关闭服务器启动提示
    port: 8888,//设置端口，
    open: false,//关闭自动启动浏览器
    files: 'dist/**',//监测文件更新后，热更新浏览器
    server:{
      baseDir: ['dist','src','public'],//在开发阶段，图片、字体、静态文件等在源码中读取,
      routes:{
        '/node_modules':"node_modules", // 处理node_modules引用
      }
    }
  })
}
const compile = series(clean,parallel(style,script,page))
const build = parallel(compile,img,font,extra)
//添加开发组合任务
const dev = series(compile,serve)
module.exports = {
 dev,
 build
}

```

## 优化--处理构建注释

使用`useref`处理构建注释。

```powershell
yarn add gulp-useref --dev
```

```js
const { src, dest, parallel,series, watch} = require('gulp')
const loadPlugins = require('gulp-load-plugins')

exports.useref = ()=>{
  return src('dist/*.html',{base:"dist"})
      .pipe(plugins.useref({searchPath:['dist','.']}))
      .pipe(dest('dist'))
}
```

## 优化--压缩文件

`gulp-htmlmin`:压缩html

`gulp-uglify`：压缩js

`gulp-clean-css`：压缩css

`gulp-if`：在gulp中使用if

在处理构建注释时，对文件进行压缩

因为文件的读取流和输出流是同一个目录，所以我们对构建进行优化，将开发环境的代码放置临时文件夹`.temp`,对正式构建的代码，放置`dist`目录

```js
//....
const useref = ()=>{
  return src('.temp/*.html',{base:".temp"})
      .pipe(plugins.useref({searchPath:['.temp','.']}))
      .pipe(plugins.if(/\.js$/,plugins.uglify()))
      .pipe(plugins.if(/\.css$/,plugins.cleanCss()))
      .pipe(plugins.if(/\.html$/,plugins.htmlmin({
        //压缩空格
        collapseWhitespace:true,
        //压缩行内css与js
        minifyCSS:true,
        minifyJS:true
      })))
      .pipe(dest('dist'))
}
//...
```

# 最终代码

处理下编译命令组合，最终代码如下：

[项目代码看这里](https://github.com/qiana-wei/qiana-wei.github.io/tree/master/code-example/gulp-build)

```js
// 实现这个项目的构建任务
const del = require('del')
const browerSync = require('browser-sync')

const { src, dest, parallel,series, watch} = require('gulp')

const loadPlugins = require('gulp-load-plugins')
const plugins = loadPlugins()
//通过`plugin.`的方式调用模块

const data = {
  menus: [
    {
      name: 'Home',
      icon: 'aperture',
      link: 'index.html'
    },
    {
      name: 'Features',
      link: 'features.html'
    },
    {
      name: 'About',
      link: 'about.html'
    },
    {
      name: 'Contact',
      link: '#',
      children: [
        {
          name: 'Twitter',
          link: 'https://twitter.com/w_zce'
        },
        {
          name: 'About',
          link: 'https://weibo.com/zceme'
        },
        {
          name: 'divider'
        },
        {
          name: 'About',
          link: 'https://github.com/zce'
        }
      ]
    }
  ],
  pkg: require('./package.json'),
  date: new Date()
}

const clean = ()=>{
  return del(['dist','.temp'])
}

//实现scss编译为css
const style = () => {
  // 指定文件输出base为src,会在.temp目录中，创建相对应的子目录
  return src('src/assets/styles/*.scss', { base: "src/" })
    .pipe(plugins.sass({outputStyle:'expanded'}))//可以指定转换代码的样式格式
    .pipe(dest('.temp'))
}

//实现脚本文件编译
const script = () =>{
  return src('src/assets/scripts/*.js', { base: "src/" })
    .pipe(plugins.babel({presets:['@babel/preset-env']}))//指定转换preset
    .pipe(dest('.temp'))
}

//实现模板文件编译
const page = () =>{
  return src('src/*.html', { base: "src/" })
    .pipe(plugins.swig({data}))//使用swig转换
    .pipe(dest('.temp'))
}

const img = ()=>{
  return src('src/assets/images/**', { base: "src/" })
    .pipe(plugins.imagemin())//压缩图片，指定压缩信息
    .pipe(dest('dist'))
}

const font = ()=>{
  return src('src/assets/fonts/**', { base: "src/" })
    .pipe(plugins.imagemin())//压缩字体文件的图片，不能压缩的文件不会进行处理
    .pipe(dest('dist'))
}

const extra = ()=>{
  return src('public/**', { base: "public/" })
    .pipe(dest('dist'))
}

const useref = ()=>{
  return src('.temp/*.html',{base:".temp"})
      .pipe(plugins.useref({searchPath:['.temp','.']}))
      .pipe(plugins.if(/\.js$/,plugins.uglify()))
      .pipe(plugins.if(/\.css$/,plugins.cleanCss()))
      .pipe(plugins.if(/\.html$/,plugins.htmlmin({
        //压缩空格
        collapseWhitespace:true,
        //压缩行内css与js
        minifyCSS:true,
        minifyJS:true
      })))
      .pipe(dest('dist'))
}

const serve = () =>{
  watch('src/assets/styles/*.scss',style)  
  watch('src/assets/script/*.js',script)
  watch('src/*.html',page)
  
  watch([
    "src/assets/images/**",
    "src/assets/fonts/**",
    "public/**"
  ],browerSync.reload)

  browerSync.init({
    notify: false,//关闭服务器启动提示
    port: 8888,//设置端口，
    open: false,//关闭自动启动浏览器
    files: '.temp/**',//监测文件更新后，热更新浏览器
    server:{
      baseDir: ['.temp','src','public'],//在开发阶段，图片、字体、静态文件等在源码中读取,
      routes:{
        '/node_modules':"node_modules", // 处理node_modules引用
      }
    }
  })
}

const compile = series(parallel(style,script,page))
const build = series(
    clean,
    parallel(compile,img,font,extra),
    useref
  )
const dev = series(clean,compile,serve)

module.exports = {
  build,
  dev
}
```

# 优化--在package.json中添加构建命令

```json
"script":{
    "dev":"gulp dev",
    "build":"gulp build"
  },
```

