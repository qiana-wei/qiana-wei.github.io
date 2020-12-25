---
title: VUE-虚拟Dom
date: 2020-12-20 10:21:56
tags: ["VUE","VUE-虚拟Dom"]
category: "VUE"
---

# 什么是虚拟DOM？

虚拟Dom（Virtual DOM）是由普通的JS对象描述的DOM对象。因为不是真实的DOM，所以称为虚拟DOM。

# 为什么使用虚拟DOM？

真实Dom的对象成员特别多，创建一个Dom的成本是非常高的。

使用虚拟Dom来描述真实Dom，仅需要创建几个属性，创建虚拟DOM的开销要小于真实DOM。

```js
{
  sel: "div", //描述标签
  data: {},  //节点数据
  children: undefined,  //子节点，与text属性互斥
  text: "Hello virtual Dom", // 标签内的文本，与children互斥
  elm: undefined, //记录VNode对应的真实Dom
  key: undefined //用作优化
}
```

手动操作DOM比较麻烦，随着项目的复杂化，DOM操作的复杂度提升，为了简化DOM操作，出现了各种MVVM、MVC框架来解决视图和状态树同步的问题。

为了简化视图的操作，我们还可以使用模板引擎，但是模板引擎不能解决跟踪状态变化的问题，于是出现了虚拟DOM。

虚拟DOM的好处是当状态发生变化时，不需要立即更新DOM，只需要创建一个虚拟DOM树来描述DOM，虚拟DOM内部通过diff更新DOM变化的部分。

**虚拟DOM最终都需要去操作真实的DOM，虚拟DOM性能的优化肯定比不上真实DOM性能的优化，**但是，通过的虚拟DOM操作，能够更简便的去操作DOM，更精准的去操作DOM。

同时，虚拟DOM**接受 Parser 解析转化**，使很多事情可以在编译阶段完成，比如xss攻击、合并DOM操作、跨平台等。

# 虚拟DOM的作用

* 维护视图和状态的关系
* 复杂视图情况下，提升渲染性能
* 为开发提供更多可能，处理渲染DOM以外，还可以实现SSR（nuxt，next），原生应用（Weex，React Native）、小程序（mpvue，uni-app）等。

# VUE使用的虚拟DOM

Vue2.x内部使用的虚拟DOM是改造的[snabbdom](/2020/12/21/VUE/snabbdom/)。