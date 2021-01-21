---
title: 使用nrm 管理镜像地址
date: 2021-01-21 11:19:58
tags: ['NPM','nrm']
category: 'NPM'
---

# 使用nrm 管理镜像地址

安装

```powershell
npm install -g nrm
```

查看镜像列表

```powershell
nrm ls
```

```powershell
* npm -------- https://registry.npmjs.org/
  yarn ------- https://registry.yarnpkg.com/
  cnpm ------- http://r.cnpmjs.org/
  taobao ----- https://registry.npm.taobao.org/
  nj --------- https://registry.nodejitsu.com/
  npmMirror -- https://skimdb.npmjs.com/registry/
  edunpm ----- http://registry.enpmjs.org/
```

切换镜像

```powershell
nrm use taobao
```

添加镜像

```powershell
nrm add <r_name> <r_url>
```

删除镜像

```powershell
nrm del <r_name>
```

