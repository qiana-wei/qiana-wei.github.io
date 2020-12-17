---
title: Vue-Router 模拟实现
date: 2020-12-16 15:52:56
tags: ["VUE","Vue-Router"]
category: "VUE"
---

# 类图

根据VueRouter的使用，模拟实现一个VueRouter类。

| 类名：VueRouter                                              |
| ------------------------------------------------------------ |
| 属性：<br />options:记录构造函数中传入的对象<br />data:响应式的对象，记录路由地址<br />routeMap:记录路由地址和组件间的关系 |
| 方法：<br />_ install(Vue):void----静态方法，实现vue.use()<br />+ Constructor(Options):VueRouter<br />+ init():void<br />+ initEvent():void----注册popstate方法，监听浏览器历史<br />+ initRouteMap():void-----初始化routerMap属性<br />+ initComponents(Vue):void-----创建router-link及router-view组件 |

# 简单实现

简单模拟vue-router

实现基础路由跳转、router-view、router-link、历史记录操作。

```js
let _Vue = null

class VueRouter {
  static install(Vue) {
    //1.判断当前插件是否已将经安装
    if (VueRouter.install.installed) {
      return
    }
    VueRouter.install.installed = true

    //2.把Vue的构造函数记录到全局变量中，因为在VueRouter的实例方法中也要使用这个Vue的构造函数
    _Vue = Vue

    //3.把创建Vue实例时传入的Router对象注入到所有的Vue实例上$router
    //混入，在插件里面，给所有的Vue实例混入一个选项。全局混入，它将影响每一个之后创建的 Vue 实例
    //在这个选项设置一个beforeCreate，在beforeCreate钩子中可以获取到Vue实例，给Vue实例原型上注入$router
    _Vue.mixin({
      beforeCreate() {
        //只有Vue实例的$options中才有router属性，而组件实例的$options中没有
        if (this.$options.router) {
          _Vue.prototype.$router = this.$options.router
          this.$options.router.init()
        }
      }
    })
  }

  constructor(options) {
    //定义属性
    this.options = options.routes;
    this.routerMap = {}
    //使用observable来创建一个响应式的对象
    this.data = _Vue.observable({
      current:'/'
    })
  }

  init(){
    this.initRouteMap()
    this.initCompinents(_Vue)
    this.initEvent()
  }

  initRouteMap(){
    //遍历路由规则，将路由规则解析成键值对的形式
    this.options.forEach(item=>{
      this.routerMap[item.path] = item.component
    })
  }

  initCompinents(Vue){
    const _this = this; // this指向vue-router实例
    Vue.component('router-link',{
      props:{
        to:String
      },
      render(h){
        return h('a',{
          //注册属性
          attrs:{
            href:this.to
          },
          //注册事件
          on:{
            click:this.clickHandle
          }
        },[this.$slots.default])
      },
      methods:{
        clickHandle(e){
          history.pushState({},'',this.to)
          this.$router.data.current = this.to
          //阻止默认事件
          e.preventDefault()
        }
      }
    })

    Vue.component('router-view',{
      render(h){
        //获取当前路由组件
        const component = _this.routerMap[_this.data.current]
        return h(component)
      }
    })
  }

  initEvent(){
    //处理浏览器历史记录变化
    // 注册popstate事件
    window.addEventListener('popstate',()=>{
      this.data.current = window.location.pathname
    })
  }
}

export default VueRouter
```

