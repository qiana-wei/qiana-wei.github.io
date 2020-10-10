---
title: image-webpack-loader
date: 2020-10-10 17:23:11
tags: ['webpack','npm']
category: 'webpack'
---

最近新换了电脑，然后，项目环境从头搭~~

遇到了`image-webpack-loader`安装失败，或者安装成功，但是启动项目的时候，png图片处理失败报错的问题。

### 报错信息

报错大概是这样的。。

![报错1](error1.png)

这样的。。

![报错2](error2.png)



几经探索，发现了解决方案。

### MAC OS 系统解决方案

```shell
brew install libpng
```

### winsows 系统解决方案

在管理员环境下，安装(window图标上右键，有`windows powershell (管理员)`选项)

```shell
npm install -g windows-build-tools
```

运行成功后是这样的

![windows-build-tools](windows-build-tools.png)

