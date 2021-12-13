---
title: 利用git安装依赖包
date: 2021-12-13 19:50:58
tags: ['Git','npm']
category: 'Git'
---
# 利用git安装依赖包

```shell
#ssh
npm install git+ssh://git@github.com/qiana-wei/qiana-wei.github.io.git#dev --save
yarn add git+ssh://git@github.com/qiana-wei/qiana-wei.github.io.git

# https
npm i git+https://github.com/qiana-wei/qiana-wei.github.io.git#master --save-dev
yarn add git+https://github.com/qiana-wei/qiana-wei.github.io.git#master
```

坑：
yarn link 不安装cli 命令

注意：
1. package.json 要添加 "license": "ISC",否则会报错
2. 私有仓库下载包，需要使用ssh
    注意：git@github.com:qiana-wei  中的`:`要改成`/`
    npm install git+ssh://git@github.com/qiana-wei/qiana-wei.github.io.git --save
    yarn add git+ssh:git@github.com/qiana-wei/qiana-wei.github.io.git ----- 待验证
