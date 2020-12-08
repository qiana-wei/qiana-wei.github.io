---
title: Mac上查看目录结构树
date: 2020-12-08 13:49:58
tags: ['Mac']
category: 'Mac'
---

> 前提：安装了homebrew

# 安装
```shell
brew install tree
```

# 使用

在项目目录下执行命令

* `tree -a`显示所有文件

* `tree -d` 只显示文件夹；
* `tree -L n` 显示项目n层结构。n表示层级数。例如`tree -L -2`,显示项目两级层级结构；
*  `tree -I pattern` 用于过滤不想要显示的文件或者文件夹。比如过滤`node_modules`文件夹，`tree -I "node_modules"`；
* `tree > tree.md` 将项目结构输出到`tree.md`这个文件。

更多命令可以使用`tree --help` 查看

# 示例

比如我们需要`tree-dir`目录下，除`node_modules`目录的所有目录结构，并输出到`tree-dir.md`文件中

```powershell
cd tree-dir
tree -a -I "node_module" > tree-dir.md
```



