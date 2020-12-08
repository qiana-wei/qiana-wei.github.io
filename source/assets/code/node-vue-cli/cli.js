#!/usr/bin/env node

const cProcess = require('child_process');

const inquirer = require("inquirer")

const path = require("path")
const fs = require("fs")
const ejs = require("ejs")


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
  // renderFiles(tempPath, destPath, answer)
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

  shellCwd =  `${answer.install == "yarn" ? answer.install : answer.install + ' install'} ${answer.ali ? "--registry=https://registry.npm.taobao.org": ""}`
  
  console.log("执行命令:"+shellCwd)

  const install = cProcess.exec(shellCwd,(err, stdout, stderr)=>{
    if(err) throw err
  });
  
  install.stdout.on("data",data=>{
    console.log(data)
  })

})