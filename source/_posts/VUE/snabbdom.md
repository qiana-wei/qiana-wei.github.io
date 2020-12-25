---
title: snabbdom-最开的virtual DOM 之一
date: 2020-12-21 10:21:56
tags: ["VUE","VUE-snabbdom"]
category: "VUE"
---

[官方文档戳这里](https://github.com/snabbdom/snabbdom)

[友好的中文文档翻译戳这里---版本较为落后](https://github.com/coconilu/Blog/issues/152)

# 基本使用

## 安装

```powershell
yarn add snabbdom 
```

## 使用

> 由于snabbdom内部在package.json中使用export重新导出了包，但export只有webpack5才支持，所以，在使用snabbdom而未使用webpack5时，需补全导入路径。

```js
//初始化函数
import { init } from 'snabbdom/src/package/init'

//创建虚拟DOM的帮助函数
import { h } from 'snabbdom/src/package/h'

//导入模块
//便于切换class
import { classModule } from 'snabbdom/src/package/modules/class'
//为元素添加属性
import { propsModule } from 'snabbdom/src/package/modules/props'
// //处理元素上的样式，支持动画
import { styleModule } from 'snabbdom/src/package/modules/style'
// //事件监听
import { eventListenersModule } from 'snabbdom/src/package/modules/eventlisteners'

//创建patch函数
let patch = init([
  classModule,
  propsModule,
  styleModule,
  eventListenersModule
])

// 找到DOM容器
let container = document.getElementById('app')

//创建虚拟dom
/**
<h1 id="hello" class="world" onClick="handleSome">
    <a href="/test">Hello World</a>
    <span>Span Hello world</span>
</h1>
 */
//
let vnode = h(
  // sel
  "h1#hello.world", 

  //data,on事件监听
  {                   
    on: {
      click: handleSome
    }
  },
  
  //children
  [
    h('a',{props:{href:'/test'}},'Hello World'),
    h('span','Span Hello World')
  ]
)

//patch可以将真实的元素转换成Vnode
patch(app,vnode)

function handleSome(){
  console.log('111')
}
```

* `init`：init函数是一个高阶函数，接收`Module`和`domApi`,返回一个`patch`函数.

* `patch`函数有两个参数。第一个是表示当前视图的DOM元素或vnode。第二个是表示更新后的新视图的vnode。`patch(oldVnode, newVnode)`

  如果传递带有父节点的DOM元素，`newVnode`将被转换为DOM节点，传递的元素将被创建的DOM节点替换。如果传递旧的vnode, Snabbdom将有效地修改它以匹配新vnode中的描述。

  传递的任何旧vnode都必须是上一个`patch`调用的结果vnode。这是必要的，因为Snabbdom将信息存储在vnode中。这使得实现更简单、更高性能的体系结构成为可能。这也避免了创建新的旧vnode树

* `h`：h函数接收选择器、数据、子节点，是一个根据参数个数及参数类型不同区分的重载函数。

  参数类型：`h(sel)`,`h(sel,data)`,`h(sel,children)`,`h(sel,data,children)`

  返回结果：虚拟节点`VNode`

## 清空页面元素

目前，snabbdom还没有api用于从元素节点上取消虚拟DOM树挂载。

可以使用挂载注释节点的方式来清空页面元素

```js
 patch(oldVnode, h('!'))
```

# 模块

> snabbdom的核心库并不能处理元素的属性和样式，需要使用模块处理

snabbdom官方提供了6个模块

* attributes
  * 设置DOM元素的属性，使用`SetAttribute()`
  * 处理布尔类型的属性
* props
  * 与attributes模块类似，设置DOM元素的属性`element[attr] = value`
  * 不处理布尔类型的属性
* class
  * 切换类样式
* style
  * 设置行内样式，支持动画
  * 设置`remove`,`destroy`,`delayed`属性
* dataset
  * 设置`data-*`自定义属性
* eventlisteners
  * 注册和移除事件

## 模块使用

1. 导入模块
2. 通过init()注册模块
3. 使用h()函数创建VNode时，第二个参数可以设置为对象，添加模块信息

# snabbdom 源码解析

## init.ts

init函数，返回一个patch函数，patch函数接收两个VNode，并最终返回一个VNode

## h.ts

h函数是一个重载函数，可以接收1～3个参数，调用vnode函数创建VNode，函数结果返回以一个VNode

## vnode.ts

定义了VNode对象的接口

```js
export interface VNode {
  //选择器
  sel: string | undefined
  //元素数据
  data: VNodeData | undefined
  //子节点
  children: Array<VNode | string> | undefined
  //记录真实DOM节点
  elm: Node | undefined
  //元素文本信息，与children互斥
  text: string | undefined
  //用于优化
  key: Key | undefined
}
```

vnode函数，返回VNode对象，用于描述虚拟DOM。

## patch函数

> 对比两个VNode，把VNode差异渲染到真实Dom并返回VNode

* patch(oldVNode,newVNode)
* 打补丁，把新节点中变化的内容渲染到真实的DOM，最后返回新节点作为下一次处理的旧节点
* 对比新旧VNode是否相同（节点的key和sel相同）
  * 如果不是相同节点，删除之前的内容，重新渲染
  * 如果是相同节点，
    * 判断新的VNode是否有text，如果有，且与oldVNode的text不同，更新文本内容
    * 判断新的VNode是否有children，使用diff算法判断子节点是否发生变化
* diff过程只进行同层级比较

```typescript
function patch (oldVnode: VNode | Element, vnode: VNode): VNode {
  let i: number, elm: Node, parent: Node
  //保存新插入节点的队列
  const insertedVnodeQueue: VNodeQueue = []
  //执行模块的pre钩子函数
  for (i = 0; i < cbs.pre.length; ++i) cbs.pre[i]()

  //如果oldVNode不是VNode，创建VNode并设置elm
  if (!isVnode(oldVnode)) {
    //把真实DOM转换为空的VNode
    oldVnode = emptyNodeAt(oldVnode)
  }

  //  如果新旧节点相同（sel和key）
  if (sameVnode(oldVnode, vnode)) {
    //找节点差异并更新Dom
    patchVnode(oldVnode, vnode, insertedVnodeQueue)
  } else {
    //如果新旧节点不同，设置elm为旧节点elm，
    //!表示绝对不为空
    elm = oldVnode.elm!
    //获取旧节点的父元素作为节点
    parent = api.parentNode(elm) as Node
    //创建VNode对应的DOM元素，触发init/create钩子函数
    createElm(vnode, insertedVnodeQueue)

    if (parent !== null) {
      //如果父节点不为空，将VNode对应的DOM插入到文档中
      api.insertBefore(parent, vnode.elm!, api.nextSibling(elm))
      //移除旧节点
      removeVnodes(parent, [oldVnode], 0, 0)
    }
  }

  //执行用户设置的insert钩子函数
  for (i = 0; i < insertedVnodeQueue.length; ++i) {
    insertedVnodeQueue[i].data!.hook!.insert!(insertedVnodeQueue[i])
  }
  //执行用户设置的post钩子函数
  for (i = 0; i < cbs.post.length; ++i) cbs.post[i]()
  //返回vnode
  return vnode
}
```

## createElm函数

> 将虚拟Dom转换为真实Dom元素

```typescript
function createElm (vnode: VNode, insertedVnodeQueue: VNodeQueue): Node {
  let i: any
  let data = vnode.data
  //执行用户传入的init钩子函数
  if (data !== undefined) {
    const init = data.hook?.init
    if (isDef(init)) {
      init(vnode)
      //避免用户在init函数中修改了data，重新赋值vnode.data给data
      data = vnode.data
    }
  }

  //将vnode转换为真实的DOM对象
  const children = vnode.children//vnode中的子节点
  const sel = vnode.sel //vnode的选择器

  //  如果是注释节点
  if (sel === '!') {
    //如果vnode没有定义text，赋值text为空字符串
    if (isUndef(vnode.text)) {
      vnode.text = ''
    }
    //创建注释节点
    vnode.elm = api.createComment(vnode.text!)
  } else if (sel !== undefined) {
    // 创建Dom元素
    // Parse selector
    const hashIdx = sel.indexOf('#')
    const dotIdx = sel.indexOf('.', hashIdx)
    const hash = hashIdx > 0 ? hashIdx : sel.length
    const dot = dotIdx > 0 ? dotIdx : sel.length
    const tag = hashIdx !== -1 || dotIdx !== -1 ? sel.slice(0, Math.min(hash, dot)) : sel
    const elm = vnode.elm = isDef(data) && isDef(i = data.ns)
    ? api.createElementNS(i, tag)  // 创建带有命名空间的标签svg
    : api.createElement(tag) // 创建普通元素标签

    //设置id
    if (hash < dot) elm.setAttribute('id', sel.slice(hash + 1, dot))
    //设置class
    if (dotIdx > 0) elm.setAttribute('class', sel.slice(dot + 1).replace(/\./g, ' '))
    //执行create钩子函数
    for (i = 0; i < cbs.create.length; ++i) cbs.create[i](emptyNode, vnode)

    if (is.array(children)) {
      //如果有子元素，循环创建子元素并插入到elm中
      for (i = 0; i < children.length; ++i) {
        const ch = children[i]
        if (ch != null) {
          api.appendChild(elm, createElm(ch as VNode, insertedVnodeQueue))
        }
      }
    } else if (is.primitive(vnode.text)) {
      //如果元素内容是文本，创建文本节点，并插入到elm中
      api.appendChild(elm, api.createTextNode(vnode.text))
    }
    //获取hook
    const hook = vnode.data!.hook
    if (isDef(hook)) {
      //执行create钩子函数
      hook.create?.(emptyNode, vnode)
      //执行insert钩子函数
      if (hook.insert) {
        insertedVnodeQueue.push(vnode)
      }
    }
  } else {
    //创建文本
    vnode.elm = api.createTextNode(vnode.text!)
  }
  // 返回新建的DOM
  return vnode.elm
}
```
**createElm函数总结**

1. 触发用户定义的init钩子函数

2. 将Vnode转换为DOM对象，存储到Vnode.elm中
   * sel 为 “!”
     * 创建注释节点
   * sel 为空
     * 创建文本节点
   * sel 不为空且不为“!”
     * 创建对应的DOM对象
     * 触发模块的create钩子函数
     * 创建子节点的DOM对象
     * 触发用户定义的create钩子函数
     * 如果vnode有insert钩子函数，追加vnode到队列

3. 返回vnode.elm

## removeVnodes & addVnodes

> removeVnodes：批量删除节点
>
> addVnodes：批量添加节点

## patchVnode

> 对比新旧两个节点，更新他们的差异

**patchVnode**

1. 触发prepatch钩子函数
2. 触发update钩子函数
3. 新节点有text属性，且不等于旧节点的text属性
   * 如果老节点有children，移除老节点children对应的DOM元素
   * 设置新节点对应的DOM元素的textContent
4. 新老节点都有children，且不相等
   * 调用updateChildren()
   * 对比子节点并更新子节点的差异
5. 只有新节点有children属性
   * 如果老节点有text属性，清空对应DOM元素的textContent
   * 添加所有的子节点
6. 只有老节点有children属性
   * 移除所有的老节点
7. 只有老节点有text属性
   * 清空对应DOM元素的textContent
8. 触发postpatch钩子函数

## updateChildren

> diff算法的核心，对比新旧节点的children，更新DOM

同级别的子节点依次比较，事件复杂度为0(n)。

在进行同级别节点比较的时候，首先会对新老节点数组的开始和结尾节点设置标记索引，遍历的过程中移动索引。

在对开始和结束节点比较的时候，总共有四种情况：

* oldStartVnode/newStartVnode
* oldEndVnode/newEndVnode
* oldStartVnode/newEndVnode
* oleEndVnode/newStartVnode