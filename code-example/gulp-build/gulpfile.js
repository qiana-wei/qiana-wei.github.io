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