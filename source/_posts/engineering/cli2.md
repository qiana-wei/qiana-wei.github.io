---
title: 前端工程化3-脚手架实践
date: 2020-12-07 21:40:00
tags: ['前端工程化','脚手架工具','node cli']
category: '前端工程化'
---
使用node搭建一个简单的脚手架工具实践

# 脚手架实现原理

脚手架实际上就是通过命令行交互，询问用户一些问题，然后将问题的答案结合预设的模板文件，输出映射文件形成项目结构。

脚手架应用，实际就是一个node cli应用。

# 自定义一个小型脚手架工具

脚手架的需求：

1. 创建一个简单的vue项目结构
2. 通过命令行交互询问用户项目名称
3. 通过命令行询问用户，使用yarn 或npm安装依赖 或 不安装依赖
4. 若用户选择安装依赖，通过用户询问，是否使用淘宝镜像安装依赖

# 搭建过程

[完整项目文件看这里](https://github.com/qiana-wei/qiana-wei.github.io/tree/master/source/assets/)

1. 创建脚手架项目目录`node-vue-cli`,通过`yarn init`初始化一个`package.json`

2. 创建`cli.js`文件，并在`package.json`文件中添加`bin`属性，值为 `cli.js`。`cli.js`文件即为脚手架配置文件。

3. node的脚手架配置文件，需添加`#!/uer/bin/env node`的文件头。先简单添加一个log语句，将cli工具link到全局，执行`node-vue-cli`,看cli工具是否正常工作。

   ```js
   #!/usr/bin/env node
   
   console.log('node-vue-cli')
   ```

   ```shell
   yarn link
   node-vue-cli
   ```

4. 创建模板文件目录`templates`,并添加项目模板文件。

5. 命令行交互，需要使用`inquirer`模块，安装`inquirer`模块

   ```shel
   yarn add inquirer --dev
   ```

   通过`inquirer.prompt`发起命令行交互询问。`inquirer.prompt`方法接收一个数组，用于配置询问信息。返回值是一个Promise，可以使用then方法获得用户回答的信息，并在then方法结合回答信息执行一些操作，实现项目搭建。

   ```js
   #!/usr/bin/env node
   
   const inquirer = require("inquirer")
   
   inquirer.prompt([
     //question
   ]).then(answer=>{
     //actions
   })
   ```

6.  首选询问项目名称，结合模板文件，生成项目结构

   通过`path`获取`templates`的目录地址

   通过`cwd`获取目标目录地址

   通过`fs`读取`templates`的目录下所有的文件（`fs.readdir`），写入文件目标文件(`fs.writeFileSync`)，创建文件夹(`fs.mkdir`)

   通过`ejs`的`ejs.renderFile`读取文件内容

   

   `fs.readdir`,接收两个参数：**templates目录地址**和**回调函数**，回调函数内接收templates目录下所有文件相对于templates目录的相对路径。

   `ejs.renderFile`接收三个参数：**文件路径**、**模板替换内容**、**回调函数**，回调函数内接收替换完成的文件内容

   

   **首先，我们先写一个文件渲染的函数**，因为我们的templates文件夹下有嵌套文件夹，所以需要递归去渲染文件。

   ```js
   /**
    * 递归读取templates下所有文件
    * @param {string} dirPath 模板文件路径
    * @param {string} destPath 输出文件路径
    * @param {Object} answer 用户回答
    */
   let renderFiles = function (dirPath, destPath, answer) {
     //获取文件列表
     fs.readdir(dirPath, (err, files) => {
       if (err) throw err
       files.forEach(item => {
         //更新文件路径
         let filePath = path.join(dirPath, item)
         //检查文件信息
         fs.stat(filePath, (err, stats) => {
           if (err) throw err
           if (stats.isFile()) {
             //如果是文件文件
             ejs.renderFile(filePath, answer, (err, result) => {
                 fs.writeFileSync(path.join(destPath, item), result)
             })
           } else {
             //是文件夹，创建文件夹。并递归执行读取文件操作
             let destDirPath = path.join(destPath, item)
             fs.mkdir(destDirPath, (err) => {
               if (err) throw err
               renderFiles(filePath, destDirPath, answer)
             })
           }
         })
       })
     })
   }
   ```

   **然后编写询问项目名称与是否安装依赖的交互**，并渲染开始文件。

   ```js
   #!/usr/bin/env node
   
   const path = require("path")
   const fs = require("fs")
   const ejs = require("ejs")
   
   const inquirer = require("inquirer")
   
   //.....renderFiles函数
   
   inquirer.prompt([
     {
       type: "input",
       name: "name",
       message: "项目名称"
     },
     {
       type: "list",
       name: "install",
       message: "是否安装依赖",
       choices:['yarn','npm','none']
     }
   ]).then(answer => {
     const tempPath = path.join(__dirname, "templates")
     const destPath = process.cwd()
     renderFiles(tempPath, destPath, answer)
   })
   ```

   因为是否安装依赖与是否使用淘宝镜像是有先后关系的，所有在then函数中返回一个新的Promise，用于询问是否使用淘宝镜像,并将前两个交互的答案合并，传给后续then方法

   ```js
   #!/usr/bin/env node
   
   const path = require("path")
   const fs = require("fs")
   const ejs = require("ejs")
   
   const inquirer = require("inquirer")
   
   //.....renderFiles函数
   
   inquirer.prompt([
     {
       type: "input",
       name: "name",
       message: "项目名称"
     },
     {
       type: "list",
       name: "install",
       message: "是否安装依赖",
       choices:['yarn','npm','none']
     }
   ]).then(answer => {
     const tempPath = path.join(__dirname, "templates")
     const destPath = process.cwd()
     renderFiles(tempPath, destPath, answer)
     if(answer.install == "none") return false
   
     return new Promise(resolve=>{
       inquirer.prompt([
         {
           type: "confirm",
           name: "ali",
           message: "是否使用淘宝镜像",
           default:true
         }
       ]).then(answer2=>{
         resolve({...answer,...answer2})
       })
     })
   }).then(anster=>{
     //处理answer
   })
   ```

7.  处理执行安装依赖

   在node中，可以使用子进程来实现shell命令执行。

   引入子进程依赖`const cProcess = require("chile-process")`

   使用子进程`exce(<shell cmd>,callback)`方法，实现依赖安装

   ```js
   #!/usr/bin/env node
   
   const cProcess = require('child_process');
   
   const inquirer = require("inquirer")
   
   const path = require("path")
   const fs = require("fs")
   const ejs = require("ejs")
   
   //....renderFiles
   
   inquirer.prompt([
     {
       type: "input",
       name: "name",
       message: "项目名称"
     },
     {
       type: "list",
       name: "install",
       message: "是否安装依赖",
       choices:['yarn','npm','none']
     }
   ]).then(answer => {
     const tempPath = path.join(__dirname, "templates")
     const destPath = process.cwd()
     renderFiles(tempPath, destPath, answer)
     if(answer.install == "none") return false
   
     return new Promise(resolve=>{
       inquirer.prompt([
         {
           type: "confirm",
           name: "ali",
           message: "是否使用淘宝镜像",
           default:true
         }
       ]).then(answer2=>{
         resolve({...answer,...answer2})
       })
     })
     
   }).then(answer=>{
     //不需要安装依赖
     if(!answer) return
   	//拼装命令
     shellCwd =  `${answer.install == "yarn" ? answer.install : answer.install + ' install'} ${answer.ali ? "--registry=https://registry.npm.taobao.org": ""}`
     
     console.log("执行命令:"+shellCwd)
   	//执行命令
     const install = cProcess.exec(shellCwd,(err, stdout, stderr)=>{
       if(err) throw err
     });
     //显示命令执行详情
     install.stdout.on("data",data=>{
       console.log(data)
     })
   })
   ```

# 测试使用

1. 使用`yarn link`将cli命令link到全局
2. 新建项目目录，在项目目录中使用`node-vue-cli`,回答命令行交互问题，自动执行模板文件下载与开发依赖安装。
3. 执行`yarn serve`测试项目是否正常运行