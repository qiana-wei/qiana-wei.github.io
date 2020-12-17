---
title: Vue-Router的使用
date: 2020-12-15 15:55:56
tags: ["VUE","Vue-Router"]
category: "VUE"
---
# vue-router3 的基本使用

1. 引入`vue-router`。
2. 在Vue实例中**注册路由组件**。
3. 规定一些路由规则，即路由与组件的对应关系。
4. 创建VueRouter实例，即`router`对象，并为vueRouter添加路由规则
5. 在创建Vue实例的过程中注册router对象
6. `vue-router` 暴露的`router-view`组件，是组件的占位符，当路由匹配时，`vue-router`加载的组件会替换`router-view`
7. `vue-router`暴露的`router-link`组件，用于创建链接。

*router/index.js*

```js
import Vue from 'vue'
//1.引入VueRouter对象
import VueRouter from 'vue-router'

//路由模板
import Layout from '../components/Layout'

//导入组件
import Home from '../views/Home.vue'
import Login from '../views/Login.vue'

//2.在VUE实例中注册路由组件
Vue.use(VueRouter)

//3.创建路由规则
const routes = [
  {
    path:'/',
    component:Layout,
    children:[
      {
        path:'',
        name:'Home',
        component:Home
      },{
        path:'about',  // 可以使用相对路径，相对父路由的路径
        name:'About',
        component: () => import(/* webpackChunkName: "about" */ '../views/About.vue')
      },{
        //动态路由
        path:'/detail/:id', // 也可以使用绝对路径
        name:'Detail',
        //开启props可以在Detail组件中，通过props拿到URL中的参数
        props:true,
        component:()=>import(/* webpackChunkName:'detail' */'../views/Detail.vue')
      }
    ]
  },
  {
    path:'/login',
    name:'Login',
    component:Login
  }
]

//4.创建VueRouter实例--router对象
const router = new VueRouter({
  mode:'history',
  routes
})

export default router
```

*main.js*

```js
import Vue from 'vue'
import App from './App.vue'
import router from './router'
//5.在Vue实例中注册router对象
new Vue({
  router,
  render: h => h(App)
}).$mount('#app')
```

*App.vue*

```html
<template>
  <div id="app">
    <div id="nav">
      <!-- 7.router-link组件，用于创建链接 -->
      <router-link to="/">Home</router-link> |
      <router-link to="/about">About</router-link>
    </div>
     <!-- 6.router-view 组件，用于组件占位 -->
    <router-view/>
  </div>
</template>
```

# vue-router4的基本使用

[官方文档看这里](https://next.router.vuejs.org/guide/#router-view)

**在vue3中使用vue-router4**

1. 引入`vue-router`的`createRouter`方法及`createWebHistory`方法。
2. 规定一些路由规则，即路由与组件的对应关系。
3. 创建router实例，并为router添加路由规则
4. 在创建Vue实例的过程中注册router对象
5. `vue-router` 暴露的`router-view`组件，是组件的占位符，当路由匹配时，`vue-router`加载的组件会替换`router-view`
6. `vue-router`暴露的`router-link`组件，用于创建链接。

*router.js*

```js
//1.引入vue-router的createRouter方法及createWebHistory方法
import { createRouter, createWebHistory } from "vue-router";
import Home from "../views/Home.vue";

//2.规定路由规则
const routes = [
  {
    path: "/",
    name: "Home",
    component: Home
  },
  {
    path: "/about",
    name: "About",
    component: () =>
      import(/* webpackChunkName: "about" */ "../views/About.vue")
  }
]

//3.创建路由实例
const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
})

export default router;
```

*main.js*

```js
import { createApp } from "vue";
import App from "./App.vue";
import router from "./router";

createApp(App)
  .use(router)
  .mount("#app");
```



# Vue.use()

`Vue.use`的作用是注册组件，接收一个参数。

若参数是函数，`Vue.use()`内部直接执行函数来注册组件。

若参数是对象，`Vue.use()`则执行对象的`install`方法来注册组件

# 路由规则

定义一个数组，数组中存储一些路由规则的对象。

路由组件对象相应的路径，当路径发生变化时，会加载对应的组件。

# 创建Vue实例的过程中注册router对象

当我们创建Vue实例的时候，配置router选项，会给vue实例注册`$router`和`$route`两个属性。

`$route`:是路由规则，存储了当前路由的数据。

`$router`:是路由对象，路由对象提供与路由相关的方法如`$router.push()`, `$router.replace()`, `$router.go()`等

`$router.currentRoute`是当前路由规则，当不方便拿到`$route`时，可以通过`$router.currentRoute`拿到当前路由规则。

# 动态路由

动态路由，通过占位来匹配路由中变化的部分。

当动态路由开启props可以在Detail组件中，通过props拿到URL中的参数

```html
<script>
export default {
  name:'Detail',
  props:['id']
}
</script>
```

当未开启props时，可以通过 `$route.params.id`来获取URL中的参数

# 路由嵌套

提取公共模板到`Layout.vue`组件中，在Layout组件中之使用`router-view`来占位变化的组件。

在路由规则配置中，子路由path配置可以是相对路径也可以是绝对路径。

# 编程式导航

1. `$router.push()`:参数接收两种方式

* 字符串：即要跳转的路由地址

* 对象：

  ```js
  $router.push({
    name:'PathName',
    params::{
    //传递路由参数
      id:1
    }
  })
  ```

2. `$router.replace()`：参数形式与`$router.push()`相同

   但是，replace方法不会记录本次历史。会改变当前历史。
3. `$router.go()`：跳转到某次记录，参数可以是负数（后退），也可以是正数（前进）

# Hash和History模式的区别

## 表现形式

* hash：`https://www.example.com/#/test?id=1234`
* history：`https://www.example.com/test/1234`

## 原理

**hash模式**基于锚点，以及`onhashchange`事件修改页面。

当地址发生变化时，触发`onhashchange`事件，根据锚点不同，呈现不同的组件到页面。

**history模式**是基于H5的`History API`，实现客户端路由。

* `history.pushState()`,IE 10以后才支持，只修改路径，记录到历史，不向服务器发送请求
* `history.replaceState()`，修改路径，不记录到历史，不向服务器发送请求

通过调用`history.pushState`方法改变地址栏，并将当前地址记录到浏览历史中。

监听`popstate`事件，当点击浏览器前进、后退按钮时，调用`history.back()`和`history.forward()`方法时才会触发`popstate`事件。

当地址改变之后，根据当前路由地址找到相应的组件，重新进行渲染。

## 服务端支持

**hash模式**不需要服务端支持。

**history模式**需要服务端支持。

> history模式，使用前端路由，路由发生变化时，不想服务端发送请求。
>
> 当页面刷新时，想服务端发送请求，导致页面找不到。
>
> 所以，需要在想服务端发送请求，找不到页面时，返回vue的index页面，再由前端路由控制页面显示。

# History 模式服务端支持

**node服务器配置**

```js
const path = require('path')
//处理history模式的模块
const history = require('connect-history-api-fallback')
//express
const express = require('express')

const app = express()
//注册处理history模式的中间件
app.use(history())
//注册处理静态资源的中间件，网站根目录
app.use(express.static(path.join(__dirname,'../web')))

//开启服务器
app.listen(3000,()=>{
  console.log('服务器开启，端口：3000')
})
```

**nginx环境**

```
server {
	listen	80;
	server_name	localhost;
	
	location /{
		root	html;
		index	index.html	index.htm;
		try_files $uri	$uri/	/index.html; # 尝试访问文件
	}
}
```

