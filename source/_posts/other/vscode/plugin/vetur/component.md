---
title: 利用vetur给自定义的vue组件添加属性提示
date: 2021-3-10 17:10:00
tags: ['VSCode','Vetur','Vue']
category: 'VSCode'
---

# 问题

最近封装了一些公共组件，发现当组件全局注册时，应用组件的时候，

发现

1. 使用组件的时候，组件标签无提示
2. 

组件标签无属性提示，而且`F12`或`command+点击`无法跳转到相对应组件。





package.json 添加

```json
{
  "vetur": {
    "tags": "./vetur/tags.json",
    "attributes": "./vetur/attributes.json"
  }
}
```





创建tags.json

```json
{ "foo-bar": { "description": "A foo tag", "attributes": ["foo-attr"] } }
```





创建attributes.json

```json
{ "foo-bar/foo-attr": { "description": "description of foo-attr" } }
```


**重启vscode**



vetur 文档： https://vuejs.github.io/vetur/
    git： https://github.com/vuejs/vetur


全局组建注册   https://vuejs.github.io/vetur/guide/global-components.html#example

自定义提示信息 https://github.com/vuejs/vetur/blob/master/docs/guide/component-data.md
    element tags ： https://github.com/ElementUI/element-helper-json/edit/master/element-tags.json
    element attrs： https://github.com/ElementUI/element-helper-json/blob/master/element-attributes.json


    

