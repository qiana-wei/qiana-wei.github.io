---
title: VUE框架基础知识
date: 2020-12-15 11:55:56
tags: ["VUE"]
category: "VUE"
---

# VUE 代码基础结构

VUE代码有两种渲染方式：

1. 使用模板渲染，vue内部会data中的数据填充到指定的模板中，并把模板渲染到浏览器

   ```html
   <div id="app">
     <p>名称：{{companent.name}}</p>
     <p>地址：{{companent.address}}</p>
   </div>
   
   <script src="./vue.js"></script>
   <script>
     new Vue({
       el:"#app",
       data:{
         companent:{
           name:"公司名称",
           addrress:"中国上海"
         }
       }
     })
   </script>
   ```

2. 使用render函数，创建虚拟DOM。

   render方法接收一个参数，这个参数是h函数，h函数用于创建虚拟DOM。

   render方法把h函数创建的虚拟DOM返回。

   $mount方法把虚拟DOM转换为真实DOM渲染到浏览器。

   ```html
   <div id="app">
   </div>
   
   <script src="./vue.js"></script>
   <script>
     new Vue({
       el: "#app",
       data: {
         companent: {
           name: "公司名称",
           addrress: "中国上海"
         }
       },
       render(h){
         return  h('div', [
           h('p', `名称：${this.companent.name}`),
           h('p', `地址：${this.companent.addrress}`),
         ])
       }
     }).$mount('#app')
   </script>
   ```

# 生命周期

![生命周期](./vue-lifecycle.jpeg)

# 常用语法

* 差值表达式----`{{}}`
* 指令 --- `v-bind,v-on,v-for,v-if...`,也可以自定义指令
* 计算属性和侦听器  ----  `computed,watch`,计算属性计算的结果会被缓存，对于一步操作或开销比较大的操作可以使用侦听器。
* Class和Style绑定，分别可以绑定数组或者对象。实际开发中建议使用Class绑定，使样式可以重用
* 条件渲染/列表渲染
* 表单输入绑定

# 常用概念

1. 组件

   组件是可复用的VUE实例，封装了HTML、CSS、JS。可是实现页面上的一个功能区域，可以被无限次复用

2. 插槽

   插槽是在组件中使用solt占位，在使用组件时，与占位位置对于的内容会填充到组件中，使组件更加灵活

3. 插件

   vue-router，vuex都是VUE的插件。

4. 混入 `mixin`

   如果多个组件都有相同的选项，就可以使用混入的方式，将选项合并，使代码重用。



