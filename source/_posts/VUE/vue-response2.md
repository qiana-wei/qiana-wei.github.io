---
title: VUE-响应式原理--模拟一个最小版本的vue
date: 2020-12-18 18:21:56
tags: ["VUE","VUE-模拟一个最小版本的vue"]
category: "VUE"
---

**完整代码**：[点击这里](https://github.com/qiana-wei/qiana-wei.github.io/tree/master/code-example/simple-vue)

# 需求

实现以下功能：

```html
<body>
  <div id="app">
    <p>差值表达式msg：<span>{{msg}}</span></p>
    <p>差值表达式count：<span>{{count}}</span></p>

    <p>指令v-text，msg</p>
    <p v-text="msg"></p>

    <p>指令v-model，count</p>
    <input type="text" v-model="count">
  </div>


  <script src="./vue.js"></script>

  <script>
    var vm = new Vue({
      el: "#app",
      data: {
        msg: "消息",
        count: 3
      }
    })
  </script>
</body>
```

1. 数据差值绑定
2. 数据指定绑定
3. 数据响应式
4. 数据方向绑定

# Vue 构成

**Vue**负责将data成员注入到vue实例上，并将data转为getter/setter。

**Vue**内部调用**Observer**(数据劫持，对data中的属性进行监听)及**Compiler**(解析指令，替换数据)

**Observer**劫持数据，对data中的属性进行监听，并发送给**Dep**

**Dep**接收到数据变化，调用**Watcher**的Update方法



# Vue类

## 功能

1. 接收初始化参数
2. 将data中的属性注入到vue实例中，转化为getter/setter
3. 调用observer监听data中属性的变化
4. 调用compiler解析指令/差值表达式

## 类图

| 类名：Vue                                                    |
| ------------------------------------------------------------ |
| 属性：<br />+ $options: 记录构造函数参数<br />+ $data:记录响应式的data数据<br />+ $el: 属性元素 |
| 方法：<br />_ proxyData(): 劫持data数据，将数据转变为getter/setter |

## 初步代码

*vue.js*

```js
class Vue {
  constructor(options) {
    //1.通过属性保存参数数据
    this.$options = options || {}
    this.$data = options.data || {}  //$data中的数据才是真正用来监听，实现响应式的数据
    this.$el = typeof options.el === 'string' ? document.querySelector(options.el) : options.el

    //2.将data数据转换为getter/setter，注入到data实例中,方便调用
    this._proxyData(this.$data)

    //TODO1 3.调用observe对象，监听数据变化

    //TODO2 4.调用compiler对象，解析指令和差值表达式

  }

  //代理数据，代理data中的属性
  _proxyData(data) {
    // 遍历data中的所有属性，将data数据注入到vue实例中
    for (let key in data) {
      Object.defineProperty(this, key, {
        configurable: true,
        enumerable: true,
        get() {
          return data[key]
        },
        set(newValue) {
          if (newValue === data[key]) {
            return
          }
          data[key] = newValue
        }
      })
    }
  }
}
```

# Observer类

## 功能

1. 将data选项中的属性转换为响应式数据
2. data中的某个属性也是对象，则该属性也应是响应式的
3. data中的某个属性重新赋值为对象时，该对象也应是响应式的
4. 数据变化，发送通知

## 类图

| Observer                                                     |
| ------------------------------------------------------------ |
| 属性：无                                                     |
| 方法：<br />+ walk(data):遍历data中的数据<br />+ defineReactive(obj, key,value):响应式数据 |

## 初步代码

*observer.js*

```js
class Observer {
  constructor(data) {
    this.walk(data)
  }

  walk(data) {
    //1. 判断data是否是对象
    if (!data || typeof data !== 'object') {
      return
    }
    //2.若data是对象，遍历data中的所有，调用defineReactive
    for (let key in data) {
      // 若属性值为对象，递归调用
      this.walk(data[key])
      this.defineReactive(data, key, data[key])
    }
  }

  defineReactive(obj, key, value) {
    let _this = this
    Object.defineProperty(obj, key, {
      configurable: true,
      enumerable: true,
      get() {
        // TODO 判断有无观察者，并添加观察者
        
        //若使用obj[key]会引发死循环，因为使用obj[key]即会触发get方法
        return value
      },
      set(newValue) {
        if (newValue === value) {
          return
        }
       value = newValue
        //若新赋值的值为对象，对象也应该是响应式的。
       _this.walk(newValue)
        //TODO 数据变化时，发送通知
      }
    })
  }
}
```

*vue.js*

```js
class Vue{
  constructor(options) {
    //1.通过属性保存参数数据
    this.$options = options || {}
    this.$data = options.data || {}  //$data中的数据才是真正用来监听，实现响应式的数据
    this.$el = typeof options.el === 'string' ? document.querySelector(options.el) : options.el

    //2.将data数据转换为getter/setter，注入到data实例中,方便调用
    this._proxyData(this.$data)

    //TODO1 3.调用observe对象，监听数据变化
		new Observer(this.$data)
    //TODO2 4.调用compiler对象，解析指令和差值表达式
    
}
```

> 当调用vm.msg时，触发get(), 在vue.js中获取data.msg时, data即传入的$data。
>
> 而获取data.msg时，触发get(), 在observer.js中获取value，value为walk循环遍历$data时传入的value。

# Compiler类

Ps:直接操作的Dom，没有使用虚拟Dom

## 功能

1. 编译模板，解析指令、差值表达式
2. 页面首次渲染
3. 当数据发生变化时，重新渲染页面

## 类图

| Complier                                                     |
| ------------------------------------------------------------ |
| 属性：<br />+ el:模板元素<br />+ vm: vue实例                 |
| 方法：<br />+compile(el):编译模板元素<br />+compilElement(node):解析元素中的指令 <br />+compileText(node): 解析元素中的文本<br />+isDirective(attrName): 判断是否是指令<br />+isTextNode(node):判断是否是文本节点<br />+isElementNode(node):判断是否是元素节点 |

## 初步代码

```js
class Compiler {
  constructor(vm) {
    this.el = vm.$el
    this.vm = vm
    this.complie(this.el)
  }
  // 编译模板，处理文本节点和元素节点
  complie(el) {
    // this.vm.render(this.el)

    //  获取元素所有子节点(伪数组)
    let childNodes = [...el.childNodes]
    //遍历子节点
    childNodes.forEach(node => {
      //处理节点编译
      if (this.isTextNode(node)) {
        this.compileText(node)
      } else if (this.isElementNode(node)) {
        this.compilElement(node)
      }

      //判断节点是否有子节点，如果有子节点，递归调用节点编译
      if (node.childNodes && node.childNodes.length) {
        this.complie(node)
      }
    })

  }

  //  编译元素节点，处理指令
  compilElement(node) {
    //遍历元素属性
    let attributes = [...node.attributes]
    attributes.forEach(attr => {
      if (this.isDirective(attr.name)) {
        let handleName = attr.name.substr(2)
        let key = attr.value
        this.update(node, key, handleName)
      }
    })
  }

  update(node, key, handleName) {
    let updateFn = this[handleName + 'Updater']
    updateFn && updateFn(node, this.vm[key])
  }

  textUpdater(node, value) {
    node.textContent = value
  }

  modelUpdater(node, value) {
    node.value = value
  }

  //编译文本节点，处理差值表达式
  compileText(node) {
    let reg = /\{\{(.+?)\}\}/
    let value = node.textContent
    if (reg.test(value)) {
      let key = RegExp.$1.trim()
      node.textContent = value.replace(reg, this.vm[key])
    }
  }

  //判断是否是指令
  isDirective(attrName) {
    return attrName.startsWith('v-') || attrName.startsWith(':')
  }

  //判断是否是元素节点
  isElementNode(node) {
    return node.nodeType === 1
  }

  //判断是否是文本节点
  isTextNode(node) {
    return node.nodeType === 3
  }
}
```

# Dep类

## 功能

1. 在data getter中收集依赖，添加观察者
2. 在data setter中通知依赖，通知所有观察者

## 类图

| Dep                                                          |
| ------------------------------------------------------------ |
| 属性：<br />+subs： 用于存储观察者                           |
| 方法：<br />+addSub(sub):用于添加观察者<br />+notify()：用于通知观察者 |

## 初步代码

```js
class Dep {
  constructor() {
    //存储所有观察者
    this.subs = []
  }

  // 添加观察者
  addSub(sub) {
    if (sub && sub.update) {
      this.subs.push(sub)
    }
  }
  //发送通知
  notify() {
    this.subs.forEach(sub => {
      sub.update()
    })
  }
}
```

**需要在data的get中，收集依赖，在data的setter中通知依赖**

在observer类中，处理响应式数据时，统一定义发布者dep = new Dep()。

在set函数中，当数据方式变化时，调用dep.notify()方法，通知观察者。

在get函数中，收集依赖，当存在观察者时，添加观察者。

在观察者类中，为Dep类添加静态属性target，指向当前观察者。

```js
//observer.js
//...
defineReactive(obj, key, value) {
  let _this = this

  //为每一个属性创建一个Dep对象, 负责收集依赖，并发送通知
  let dep = new Dep()

  Object.defineProperty(obj, key, {
    configurable: true,
    enumerable: true,
    get() {
      //判断有无观察者，并添加观察者
      Dep.target && dep.addSub(Dep.target)
      //若使用obj[key]会引发死循环，因为使用obj[key]即会触发get方法
      return value
    },
    set(newValue) {
      if (newValue === value) {
        return
      }
      value = newValue
      //若新赋值的值为对象，对象也应该是响应式的。
      _this.walk(newValue)
      //数据变化时，发送通知
      dep.notify()
    }
  })
}
//...
```

# Watcher 类

## 功能

1. 当数据变化时触发依赖，dep通知所有watcher实例，更新视图
2. 自身实例化时，向dep对象中添加自己

## 类图

| Watcher                                                      |
| ------------------------------------------------------------ |
| 属性：<br />+ vm:vue实例<br />+ key:要更新的属性名称<br />+callback: 回调函数<br />+oldValue: 之前的值 |
| 方法：<br />+ update():更新视图                              |

## 初步代码

```js
class Watcher {
  constructor(vm, key, callback) {
    this.vm = vm;
    this.key = key;
    this.callback = callback;

    //将Watcher类添加到Dep类的target属性中
    //触发get方法，将Watcher添加到Dep中
    Dep.target = this
    // 获取之前的值，触发了get方法
    this.oldValue = vm[key];
    // 防止后面重复添加
    Dep.target = null 
  }

  update() {
    let newValue = this.vm[this.key]
    if (newValue == this.oldValue) {
      return
    }
    this.callback(newValue)
  }
}
```

**需要在更新视图的操作中，添加Watcher对象**，即在`Compiler`类中，添加Watcher对象。

```js
//compiler.js
//...
//  编译元素节点，处理指令
compilElement(node) {
  //遍历元素属性
  let attributes = [...node.attributes]
  attributes.forEach(attr => {
    if (this.isDirective(attr.name)) {
      let handleName = attr.name.substr(2)
      let key = attr.value
      this.update(node, key, handleName)
    }

  })
}

update(node, key, handleName) {
  let updateFn = this[handleName + 'Updater']
  updateFn && updateFn(node,this.vm[key])

  //创建Watcher对象，当数据改变，更新视图
  new Watcher(this.vm,key,newValue=>{
    updateFn(node,newValue)
  })
}

//编译文本节点，处理差值表达式
compileText(node) {
  let reg = /\{\{(.+?)\}\}/
  let value = node.textContent
  if (reg.test(value)) {
    let key = RegExp.$1.trim()
    node.textContent = value.replace(reg, this.vm[key])

    //创建Watcher对象，当数据改变，更新视图
    new Watcher(this.vm,key,(newValue)=>{
      //数据变化时，
      node.textContent = newValue
    })
  }
}

//...
```

**到此时，数据响应式已实现了**

# 数据双向绑定

到目前，数据响应式已经实现了，当数据发生变化时，视图会随之变化。

现在，需要添加事件绑定，当视图发生变化时，数据也随之变化。

视图输入是在表单元素中，即v-model绑定的元素。

```js
//compiler.js
//...
update(node, key, handleName) {
  let updateFn = this[handleName + 'Updater']
  updateFn && updateFn.call(this,node,this.vm[key],key)

  //创建Watcher对象，当数据改变，更新视图
  new Watcher(this.vm,key,newValue=>{
    updateFn.call(this,node,newValue,key)
  })
}

// v-model
modelUpdater(node, value,key) {
  node.value = value
  //表单元素注册事件，实现数据双向绑定
  node.addEventListener('input',()=>{
    //赋值，触发set，触发响应式机制,更新视图
    this.vm[key] = node.value
  })
}
//...
```

# 完整代码

[见github仓库：https://github.com/qiana-wei/qiana-wei.github.io/tree/master/code-example/simple-vue](https://github.com/qiana-wei/qiana-wei.github.io/tree/master/code-example/simple-vue)

