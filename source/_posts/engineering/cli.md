---
title: 前端工程化2-脚手架工具
date: 2020-12-04 10:40:00
tags: ['前端工程化','脚手架工具']
category: '前端工程化'
---

# 脚手架概念

> 自动帮我们创建项目基础文件的工具。

脚手架的本质作用：创建项目基础结构、提供项目规范和约定。

# 常用的脚手架工具

目前市场上有很多成熟的脚手架工具。

**为特定的项目类型服务的脚手架**：其实现方式都是通过提供一下项目信息，脚手架根据信息创建对应的项目基础结构。只适用于自己所服务的那个项目。

* React项目：[create-react-app](https://www.html.cn/create-react-app/docs/getting-started/)

* Vue项目：[@vue/cli](https://cli.vuejs.org/zh/guide/), [vue-cli](https://github.com/vuejs/vue-cli/tree/v2#vue-cli--)

* Angular项目：[angular-cli](https://cli.angular.io/)

**通用型项目脚手架工具**：

[Yeoman](https://yeoman.io/), 可以根据一套模板生成对应的项目结构。

[Plop](https://plopjs.com/), 用于创建特定类型文件,小而美的脚手架工具

## Yeoman

> 用于创建现代化Web应用的脚手架工具

可以通过Yeoman创建Generator创建任何类型的项目，即我么可以通过创建自己的Generator来创建自己的脚手架。

### 基本使用

>  需要node环境的支持。

#### 安装

**安装yeoman**

```powershell
yarn global add yo 
```

**安装对应generator**  (比如想要生成一个node模块的项目，需要安装`generator-node`)

Generators 是一个名字为 `generator-XXX` 的 npm 包。

[Generators  列表](https://yeoman.io/generators/),或者可以使用

```powershell
yarn global add generator-node
```

#### 创建项目目录

比如创建`yeoman-node-module`目录

```powershell
mkdir yeoman-node-module
```

#### 运行generator创建项目

```powershell
yo node
```

*根据命令行信息提示，输入相关信息*

#### Yeoman Sub Generator

> 在已有的项目基础之上添加特定文件。

比如通过generator-node下的cli sub generator生成一个cli应用所需要的文件。`yo <generator>:<sub-generator>`

```powershell
yo node:cli
```

项目中package.json中添加了

```json
"bin": "lib/cli.js",
"dependencies": {
  "meow": "^3.7.0"
}
```

并创建了`lib/cli.js`文件

此时，我们就可以将我们的模块作为一个全局的命令行模块去使用了。

#### 将本地模块link到全局范围

```powershell
yarn link
```

安装项目依赖后，我们就可以通过模块名称来运行我们生产的模块了

```powershell
yeoman-node-module --help
```

> 若发生了权限相关问题的报错，可以使用`chmod 755 <filemane>`来修改文件权限。
>
> [chmod修改权限命令](/2020/12/06/other/shell/chmod/)

> 若使用yarn发生command not found的错误，需要确认命令是否正确，或需要[添加 yarn 到 PATH 环境变量中](https://yarn.bootcss.com/docs/install/#mac-stable)。

### 步骤总结

1. 明确需求---要做一个什么类型的项目
2. 找到合适的Generator
3. 全局范围安装找到的Generator
4. 通过`yo`运行对应的Generator
5. 通过命令行交互填写选项信息
6. 生成需要的项目结构

#### 例子：webapp

1. 需求，开发一款webapp
2. 合适的Generator--generator-webapp
3. 全局范围安装Generator--`yarn global add generator-webapp`
4. 运行Generator -- `yo webapp`

## Plop

> 小型脚手架工具，用于创建项目中特定类型文件的小工具。
>
> 一般不会独立去使用，一般将Plop集成到项目中，用于自动生成同类型的项目文件。

解决的痛点：

比如在开发中，每个组件由js、css、test.js三个文件组成，那我们每次创建一个组件就需要手动创建三个文件，并且需要在文件中重复写入一些基础代码。

### 基本使用

#### 安装

将plop作为一个基本模块安装到开发依赖中

```powershell
yarn add plop --dev
```

#### 创建plop生成器

1. **在项目根目录下创建`plopfile.js`---plop工作的入口文件**

   `plopfile.js`需要接收一个plop对象，用于创建生成器任务

   使用`module.exports`导出一个函数，使`plop`接收一个形式参数，

   plop.setGenerator接收两个参数：Generator名称，生成器的配置选项

   ```js
   //plopfile.js
   module.export = plop=>{
     plop.setGenerator('component',{
       //描述
       description:"create a component",
       //命令行交互
       prompts:[
         {
           type:"input",
           name:"name",
           message:"component name",//提示
           default:"Mycomponent"//默认值
         }
       ],
       //创建完成后执行动作对象
       actions:[
         {
           type:"add",//添加一个全新的文件
           path:"src/components/{{name}}/{{name}}.js",//name即命令行交互中输入的name值
           templateFile:"plop-templates/components.hbs"
         },{
           type:"add",//添加一个全新的文件
           path:"src/components/{{name}}/{{name}}.css",//name即命令行交互中输入的name值
           templateFile:"plop-templates/components.css.hbs"
         },{
           type:"add",//添加一个全新的文件
           path:"src/components/{{name}}/{{name}}.test.js",//name即命令行交互中输入的name值
           templateFile:"plop-templates/components.test.hbs"
         }
       ]
     })
   }
   ```

2.  **添加模板文件**

   模板文件使用`handlebars`语法书写。[官网看这里](https://handlebarsjs.com/zh/), [我的笔记看这里](/2020/12/06/utility-library/Handlebars/handlebars/)

#### 使用plop generator

因为在安装plop模块的时候，plop提供了一个cli程序，所以可以通过yarn来找到plop命令。

`yarn plop <generator-name>`

```powershell
yarn plop component
```

### 步骤总结

1. 将plop模块作为项目开发依赖安装
2. 在项目根目录下创建`plopfile.js`作为plop入口文件
3. 在`plopfile.js`文件中定义脚手架任务
4. 编写用于生成特定类型文件的模板
5. 通过plop提供的CLI运行脚手架任务

# 开发一款脚手架

## 使用Yeoman搭建自己的手脚架 --- 自定义Generator 

### Generator名称

yeoman规定，Generator的名称必须是`generator-<name>`的形式

### Generator基础结构介绍

```shell
|-generators/        # 生成器目录
|   |-app/           # 默认生成器目录
|		|  |-index.js    # 默认生成器实现
|		|
|		|-component      # 其他生成器目录（子生成器）
|		   |-index.js    # 其他生成器实现
|-package.json       # 模块包配置文件
```

### 实例：创建一个generator-sample的Generator

#### 创建generator目录

```powershell
# 创建目录并进入目录
mkdir generator-sample
cd generator-sample
# 初始化 package.json
yarn init
```

#### 添加yeoman-generator模块

> yeoman-generator模块提供了生成器的一个基类，在这个基类中提供了一些工具函数，让我们在创建生成器的时候更加便捷。

```powershell
yarn add yeoman-generator
```

#### 按照Generator结构要求，添加结构文件

> generators/app/index.js 是Generator的核心入口。
>
> 需要导出一个继承自Yeoman Generator的类型。
>
> Yeoman Gernerator在工作的时候会自动调用我们在此类型中定义的一些生命周期函数
>
> 我们在这些方法中可以通过调用父类提供的一些工具方法实现一些功能：如文件写入

```js
//index.js
const Generator =require('yeoman-generator')

module.exports = class extends Generator{
  writing(){
    //Yeoman自动在成文件时调用此方法
    //尝试
    //fs是不是node中原生的fs，是经过高度封装的fs模块
    //write接收两个参数：写入文件的绝对路径，写入文件的内容
    this.fs.write(
      //通过父类的destinationPath方法，自动获取生成项目目录路径
      this.destinationPath('temp.txt'),
      //内容用随机数代替。
      Math.random().toString()
    )
  }
}
```

#### 将generator link到全局，成为全局模块包

> 为了让Yeoman能够找到我们写的`generator-sample`

```powershell
yarn link
```

#### 使用自定义的generator

1. 创建项目文件夹
2. 在项目文件夹下执行`yo sample`

我们会发现，项目文件夹下有了`temp.txt`文件，并在文件内写入了随机数。

### 实例改进1：通过模板文件创建文件

> 相对于手动创建每一个文件，模板的方式大大提高了效率

在生成器目录下添加`templates`目录，在目录下创建模板文件。

模板文件内部可以使用EJS模板标记输出数据，例如`<%= title %>`,

也可以使用其他的EJS语法，例如：

```ejs
<% if (success) {%>
success text
<% }%>
```

在生成文件时，就不用借助于`fs.write`方法去写入文件，可以使用fs中专门使用模版引擎的方法--`copyTpl`

`copyTpl`方法接收三个参数：模板文件路径、输出文件路径、模板数据上下文

```html
<!-- templates/index.html -->
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title><%= title %></title>
</head>
<body>
    
</body>
</html>
```

```js
const Generator =require('yeoman-generator')
module.exports = class extends Generator{
  writing(){
    //模板文件路径  -- 模板文件路径
    const tmpl = this.templatePath('index.html')
    //输出目标路径  -- 通过父类的destinationPath方法，自动获取生成项目目录下对应的文件路径
    const outpur = this.destinationPath('index.html')
    //模板数据上下文
    const context = { title:"Hello sample generator",success:true }
    //copyTpl方法会自动将我们的模板文件映射到目标文件上
    this.fs.copyTpl(tmpl,outpur,context)
  }
}
```

项目文件夹下执行`yo sample`,会发现，创建了`index.html`文件，并自动将“Hello sample generator”填充到了`<%= titlte %>`位置

### 实例改进2：接收用户输入数据

> 在Generator中，想要发起一个命令行交互的询问，可以通过实现Generator中的`prompting()`方法。

在`prompting`方法中，可以通过调用父类提供的`prompt()`方法，发出对用户的询问。

`prompt()`是一个Promise方法，返回一个Promise。在`prompting`中将`prompt`返回，Yeoman在工作中将会获得更好的异步流程控制。

`prompt()`接收一个数组参数，数组中的每一项都是一个问题对象。

```js
prompting(){
  this.prompt([
    {
      type:'input', // 输入方式
      name:'prompt_name', //最终得到结果的键
      message:"your project name", // 提示信息
      default: this.appname //appname为项目生成目录名称，问题的默认值。
    }
  ]).then(answers=>{
    //用户输入结果，键为定义的prompt_name，值为用户输入的结果  {prompt_name:'user input value'}
    //将用户输入结果挂载到this对象上，方便后面使用
    this.answers = answers
  })
}
```

```js
//index.js
const Generator = require('yeoman-generator')

module.exports = class extends Generator {
  prompting() {
    return this.prompt([{
      type: 'input',
      name: 'title',
      message: "your project name",
      default: this.appname
    }]).then(answers => {
      this.answers = answers
    })
  }
  writing() { // 模板文件路径  -- 模板文件路径
    const tmpl = this.templatePath('index.html')
    // 输出目标路径  -- 通过父类的destinationPath方法，自动获取生成项目目录下对应的文件路径
    const outpur = this.destinationPath('index.html')
    // 模板数据上下文
    const context = this.answers
    // copyTpl方法会自动将我们的模板文件映射到目标文件上
    this.fs.copyTpl(tmpl, outpur, context)
  }
}
```

运行`yo sample`,要求输入title，执行完成后，发现`index.html`文件中，将输入的title内容填充到了`<%= titlte %>`位置

### 实例改进3: 创建一系列文件

在templates文件夹下，放置一些列模版文件，在index.js中，循环拷贝映射文件到目标文件上。

```powershell
|-tempaltes
|   |-README.md
|   |-package.json
|   |-src
|   	 |-index.html
```

简单的写下文件内容

```md
README.md 文件
# <%= name %>
命令行提供的项目名称将替代name值
```

```html
<!--index.html -->
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title><%= title %></title>
</head>
<body>
    <p><%%= name %></p>
  	<p>命令行输入的title值将替换title</p>
    <p>name行将输出EJS模板</p>
</body>
</html>

```

```json
//packaje.json
{
  "name": "<%= name %>",
  "version": "1.0.0",
  "main": "index.js",
  "author": "qiana-wei",
  "license": "MIT",
  "dependencies": {
    "yeoman-generator": "^4.12.0"
  }
}
  
```



```js
// index.js
//引入yeoman-generator模块
const Generator = require('yeoman-generator')
//导出继承了generator的类
module.exports = class extends Generator {
  //询问信息填写
  prompting() {
    return this.prompt([{
      type: 'input',
      name: 'title',
      message: "your web title",
      default: this.appname
    },
    {
      type: 'input',
      name: 'name',
      message: "your project name",
      default: this.appname
    }]).then(answers => {
      this.answers = answers
    })
  }
  writing() {
    const templates = [
      'README.md',
      'package.json',
      'src/index.html',
    ]
    templates.forEach(item => {
      this.fs.copyTpl(
        this.templatePath(item),
        this.destinationPath(item),
        this.answers
      )
    })
  }
}
```

### 模板相关问题

1. 当需要原封不动的输出EJS模板标记时，将模板改为`<%%= template info %>`,输出文件的模板标记即为`<%= template info%>`

### 发布Generator

> Generator实际为一个npm模块，发布Generator即发布一个npm模块

将已写好Generator模块通过`npm publish`发布为一个公开模块即可。

1. 将源代码托管于一个开源的代码管理仓库
2. 使用`npm publish`或`yarn publish`命令发布
3. 若使用的是淘宝镜像，发布时需要指定为官方镜像

```powershell
yarn publish --registry=https://registry.yarnpkg.com
```

# 脚手架的工作原理

> 启动脚手架过后，通过询问相关信息，将回答的结果结合模板文件，生成项目结构

脚手架工具即一个node cli应用，所以创建一个脚手架工具即创建一个node cli工具。

## 实例：创建一个node cli应用

1. 创建项目目录`sample-cli`

2. 通过`yarn init`创建`package.json`文件

3. 修改`package.json`文件，添加`bin`属性，指定为`cli.js`

   ```json
   {
     "name": "sample-cli",
     "version": "1.0.0",
     "bin":"cli.js",
     "main": "index.js",
     "license": "MIT"
   }
   ```

4. 添加`cli.js`

   cli的入口文件必须有个特定的文件头`#!/usr/bin/env node`。

   若系统为Luinx或MacOS的话，需要修改文件权限为755

   ```js
   #!/usr/bin/env node
   
   console.log('cli working')
   ```

5. 通过`yarn link`将模块link到全局

6. 在全局使用`sample-cli`命令，若console.log正常执行，则cli工具的基础已经可以正常工作了。

7. 完善脚手架命令

   脚手架工作过程：

   * 通过命令行交互询问用户问题
   * 根据用户回答结果生成文件

   node中使用命令行交互需要使用`inquirer`模块，安装该模块。

   ```powershell
   yarn add inquirer
   ```

   `inquirer`模块通过`prompt`方法发起命令行询问

   ```js
   //cli.js
   #!/usr/bin/env node
   
   const inquirer = require('inquirer')
   inquirer.prompt([
     {
       type:"input",
       name:"name",
       message:"Project name",
     }
   ]).then(answers=>{
     console.log(answers)
   })
   ```

8. 创建模板

   创建`tenplates`目录，在目录下创建模板文件(可以使用EJS模板语法)

   ```html
   <!--index.html-->
   <!DOCTYPE html>
   <html lang="en">
   <head>
     <meta charset="UTF-8">
     <meta name="viewport" content="width=device-width, initial-scale=1.0">
     <title><%= name %></title>
     <link rel="stylesheet" href="./style.css">
   </head>
   <body>
       
   </body>
   </html>
   ```

   ```css
   //style.css
   body{
     background-color: #cccccc;
   }
   ```

9.  根据模板文件创建目标文件

   > 通过`path.join` 获取tempaltes文件目录
   >
   > 通过node 的`process.cwd()`获取命令执行的文件目录
   >
   > 通过`fs.readdir`获取templates文件夹下的所有文件,`fs.writeFileSync()`方法写入文件
   >
   > 通过`ejs`模块的`ejs.renderFile()`方法，读取文件内容

   ```js
   //cli.js
   #!/usr/bin/env node
   const fs = require('fs')
   const path = require('path')
   const inquirer = require('inquirer')
   const ejs = require('ejs')
   inquirer.prompt([
     {
       type: "input",
       name: "name",
       message: "Project name",
     }
   ]).then(answers => {
     //模板目录 
     const tempDir = path.join(__dirname, 'templates')
     //目标目录
     const distDir = process.cwd()
   
     //将模板目录下为文件输出到目标目录
     fs.readdir(tempDir, (err, files) => {
       if (err) throw err
       files.forEach(item => {
         //item是相对template的相对路径
         ejs.renderFile(path.join(tempDir, item), answers, (err, result) => {
           if (err) throw err
           //写入文件
           fs.writeFileSync(path.join(distDir, item), result)
         })
       })
     })
   })
   ```

   



