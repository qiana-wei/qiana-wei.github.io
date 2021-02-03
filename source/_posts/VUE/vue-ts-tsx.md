---
title: 用TS和JSX(TSX)写VUE组件
date: 2021-2-2 10:21:56
tags: ["VUE","TS","TSX","JSX"]
category: "VUE"
---

# 用TS和JSX(TSX)写VUE组件

最近封装小组件，然后小组件组合成大组件。

type的if-else的判断着实写烦了，类似小组件的props传值也要重复的写。。

然后用render函数的h又嫌麻烦.....恰好接触了点JSX，所以想着，用JSX来写render。。。

>JSX = Javascript + XML
>
>TSX = TypeScript + XML
>
>本文中用的是TSX

# 配置VUE支持JSX(TSX)

根据[官网文档](https://cn.vuejs.org/v2/guide/render-function.html#JSX)以及友好的[插件链接](https://github.com/vuejs/jsx)，我们可以知道：

1. 安装

  ```shell
  npm install @vue/babel-preset-jsx @vue/babel-helper-vue-jsx-merge-props
  ```

2. 添加presets到babel配置文件----`babel.config.js`

  ```js
  module.exports = {
    presets: ['@vue/babel-preset-jsx'],
  }
  ```

3. 在`tsconfig.json`中，添加tsx支持

  ```json
  {
    "include": [
      "src/**/*.ts",
      "src/**/*.tsx",
      "src/**/*.vue",
      "tests/**/*.ts",
      "tests/**/*.tsx"
    ],
  }
  ```

4. 在`vue.config.js`中，添加webpack解析别`.tsx`

  ```js
  module.exports = {
    configureWebpack: (config) => {
      config.resolve = { // 配置解析别名
        extensions: ['.js', '.ts', '.tsx', '.json', '.vue'],
    },
  }
  ```

5. 在vue文件中，`script`标签设置`lang='tsx'`

  ```xml
  <script lang="tsx">
  import { Vue, Component } from 'vue-property-decorator'
  @Component({
    components: {},
  })
  export default class Example extends Vue {
    render(){
      return <h1>jsx</h1>
    }
  }
  </script>
  ```

  到这就可以使用tsx愉快的写render函数啦～

6. 然而总是有很多意外，如果是使用cil创建的项目，有可能会遇到这个错误：

   <span style="color:#f00">`Duplicate declaration "h" (This is an error on an internal node. Probably an internal error.)`</span>

   babel配置文件，这样修改一些就可以解决了：

  ```js
  module.exports = {
    presets: [
      ['@vue/babel-preset-jsx',
        {
          "injectH": false
        }]
    ]
  }
  ```


# 语法

> 仅展示与render相关部分

## content

```xml
render(){
  return (
    <div>
      <h1>文本内容</h1>
      <h2>动态内容：{this.message}</h2>
      /* 单标签元素 */
      <input />
      /* 自定义组件 */
      <my-conponent></my-conponent>
    </div>
  )
}
```

<span style="color:#f00">特别注意：</span>

当使用自定义组件时，标签必须是**小驼峰(myComponent**)或**使用'-'分隔(my-component)**的写法，不能是大驼峰写法(MyComponent)

## 插槽

### 具名插槽及默认插槽

**模板组件**

```xml
render(){
  return (
    <div>
      // 文本
      <p>这是插槽模板中的固定文本</p>
      //默认插槽
      {this.$slots.default}
      //具名插槽
      {this.$slots.header}
      {this.$slots.content}
      {this.$slots.footer}
    </div>
  )
}
```

*相当于vue模板的这种写法*

```xml
<template>
<div>
  <p>这是插槽模板中的固定文本</p>
  <slot></slot>
  <slot name="header"></slot>
  <slot name="content"></slot>
  <slot name="footer"></slot>
</div>
</template>
```

**使用插槽模板组件**

```xml
render(){
  return (
    <my-component>
      <p>默认插槽位置</p>
      <div slot="header">
        <header>这是header</header>
      </div>
      <div slot="content">这是content</div>
      <div slot="footer">
        <footer>这是footer</footer>
      </div>
    </my-component>
  )
}
```

### 作用域插槽

**模板组件**

```xml
render(){
  return(
    <div>
      { this.$scopedSlots.person({
        name:'Jon',
        age:'20'
      }) }
    </div>
  )
}
```

**使用插槽模板组件**

```xml
render(){
  const scopedSlots = {
    person:props=><p>this is {props.name} who is {props.age} years old.</p>
  }
  return (
    <my-component scopeSlots={ scopedSlots }></my-component>
  )
}
```

## 指令

### v-model

> 新版 vue-cli4 中，已经默认集成了 JSX 语法对 v-model 的支持，可以直接使用 `<input v-model={this.value}>`
> 如果项目比较老，可以安装插件 babel-plugin-jsx-v-model 来进行支持

```xml
<input vModel={this.newTodoText} />
<input vModel_trim={this.newTodoText} />

<input v-model={this.newTodoText} />
<input v-model_trim={this.newTodoText} />
```

### v-html，v-text

```xml
//v-html
<div domPropsInnerHTML={html}></div>
//v-text
<div domPropsInnerTEXT={text}></div>
<div>{ text }</div>
```

### v-bind

```xml
render(){
  return (
    <div>
      <input type="text" placeholder={ this.placeholderText } />
    </div>
  )
}
```

**绑定属性对象**

*vue写法*

```xml
<template>
  <div>
    <input v-bind="inputAttrs" />
  </div>
</template>
<script>
export default{
  data(){
    return {
      inputAttrs:{
        type:"text",
        placeholder:"please input..."
      }
    }
  }
}
</script>
```

*tsx写法*

```xml
render(){
  const inputAttrs={
    type:"text",
    placeholder:"please input..."
  }
  return (
    <div>
      <input {...{attrs:inputAttrs}}/>
    </div>
  )
}
```

同理，父子孙三级组件传递通过`v-bind="$attrs"`传递属性时，也可以这样书写

```xml
render(){
  return (
    <div>
      <input {...{attrs:this.$attrs}}/>
    </div>
  )
}
```



### v-on(事件绑定,事件监听)

[jsx文档](https://github.com/vuejs/jsx#installation)给出的`vOn:click`的写法，我用的时候会报错。。也不知道是不是打开方式不对.

总结了4种方式

```xml
render(){
  return(
    <button onClick={this.handleClick}>不能传递参数</button>
    <button onClick={this.handleClick.bind(this, 'params')}>绑定this，传递额外参数</button>
    <my-component onChange={($event)=>{this.handleChange($event,'params')}}>使用箭头函数，可以传事件参数及额外参数</my-component>
    <my-component 
      on={{
        change:this.handleChange,
        input:this.handleInput
      }}
      nativeOn={{
        click: this.handleClick
      }}
      >使用箭头函数，可以传事件参数及额外参数
    </my-component>
  )
}
```

**注意**：需要传递参数时，不能使用`onClick={this.handleClick(params)}`
<span style="color:#f00">传递参数时，这种写法在每次render的时候都会自动执行一次方法</span>

**不传递 参数时的写法：**

```xml
render(){
  return(
    <button onClick={this.handleClick}>on click</button>
    <button onClick_stop={this.handleClick}>含修饰符的click</button>
    //将原生事件绑定到组件（原生事件只能绑定在组件上）
    <my-component nativeOn-click={this.click}>点击我</my-component>
    <comp nativeOnClick={this.click}>点击我</comp>
  )
}
```

**传递参数时的写法：**

使用bind绑定或者使用箭头函数的方式

```xml
render(){
  return(
    <button type="button" onClick={this.handleClick.bind(this, 'params')}></button>
    <button type="button" onClick={($event) => this.handleClick($event,'params')}></button>
    <my-component onChange={this.handleChange.bind(this,'params')} ></my-component>
    <my-component onChange={($event)=>{this.handleChange($event,'params')}} ></my-component>
  )
}
```

**监听多个事件时，可以使用对象的方式去监听事件**

```xml
render() {
  return (
    <my-component 
      on={{
        change:this.handleChange,
        input:this.handleInput
      }}
      nativeOn={{
        click: this.handleClick
      }}
      >使用箭头函数，可以传事件参数及额外参数
    </my-component>
  )
}
```

## 函数式组件

> 无状态（无响应式数据），无实例（无this上下文）

```xml
export default ({ props }) => <p>hello {props.message}</p>
//组件名必须大写
const HelloWorld = ({ props }) => <p>hello {props.message}</p>
```

# 特别使用

当我们需要render的模板比较大时，可以提取部分模板到函数中，最后通过组装函数，实现模板组装。

甚至，我们可以在methods定义函数，在render中调用函数，渲染模板。

```xml
<script lang="tsx">
import { Vue, Component } from 'vue-property-decorator'
@Component({
  components: {},
})
export default class Example extends Vue {
  render(){
    const renderSolt = ()=>{
      return (
        <div slot="slotTest">
          hahahahah
        </div>
      )
    }
    return (
      <div class="index">
        <my-component>
          { renderSolt() }
        </my-component>
      </div>
    )
  }
}
</script>
```


或者

```xml
<script lang="tsx">
import { Vue, Component } from 'vue-property-decorator'
@Component({
  components: {},
})
export default class Example extends Vue {
  renderSolt(){
    return (
      <div slot="slotTest">
        hahahahah
      </div>
    )
  }
  render(){
    return (
      <div class="index">
        <my-component>
          { this.renderSolt() }
        </my-component>
      </div>
    )
  }
}
</script>
```



