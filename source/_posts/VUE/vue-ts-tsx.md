---
title: 用TS和JSX(TSX)写VUE组件
date: 2021-2-2 10:21:56
tags: ["VUE","TS","TSX","JSX"]
category: "VUE"
---

最近封装小组件，然后小组件组合成大组件。

type的if-else的判断着实写烦了，类似小组件的props传值也要重复的写。。

然后用render函数的h又嫌麻烦.....恰好接触了点JSX，所以想着，用JSX来写render。。。

Enmmm...需要纠正一下，用js写的，叫jsx，那用ts写的，则叫tsx

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

   ```vue
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

## 内容

```tsx
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

## 属性

```tsx
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

```vue
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

```tsx
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

```tsx
render(){
  return (
  	<div>
  		<input {...{attrs:this.$attrs}}/>
  	</div>
  )
}
```

## 插槽

### 具名插槽及默认插槽

**模板组件**

```tsx
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

```vue
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

```tsx
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

```tsx
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

```tsx
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

**v-model**

```tsx
<input vModel={this.newTodoText} />
<input vModel_trim={this.newTodoText} />
```

**v-html**

```tsx
<p domPropsInnerHTML={html} />
```

**v-on**(事件绑定)

[jsx文档](https://github.com/vuejs/jsx#installation)给出的`vOn:click`的写法，我用的时候会报错。。也不知道是不是打开方式不对。。

可以使用`onClick={this.handleClick}`的方式

```tsx
render(){
  return(
  	<button onClick={this.handleClick}>on click</button>
    <button onClick_stop={this.handleClick}>含修饰符的click</button>
    //将原生事件绑定到组件
    <my-component nativeOn-click={this.click}>点击我</my-component>
    <comp nativeOnClick={this.click}>点击我</comp>
  )
}
```

当父子组件通过props和$emit传值时，可能需要在处理函数中添加额外的参数，可以使用下面这种绑定方式

```tsx
render(){
  return(
    <my-component onChange={($event)=>{this.handleChange($event,'otherInfo')}} >
    </my-component>
  )
}
```

也可以用这种方式,但是拿不到`$emit`的传值哦。

```tsx
render(){
  return(
    <my-component onChange={this.handleChange.bind(this,'otherInfo')} >
    </my-component>
  )
}
```

## 函数式组件

> 无状态（无响应式数据），无实例（无this上下文）

```tsx
export default ({ props }) => <p>hello {props.message}</p>
//组件名必须大写
const HelloWorld = ({ props }) => <p>hello {props.message}</p>
```


