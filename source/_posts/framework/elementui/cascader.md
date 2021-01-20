---
title: vue element 级联选择器获取对象
date: 2021-01-20 14:44:57
tags: ['Vue','ElementUI','cascader']
category: 'ElementUI'
---

# 场景

在vue项目使用ElementUI中的cascader级联选择器实现省市区三级联动时，ElementUI默认返回值为选中节点的`value`，但是很多时候，我们需要获取选中节点的`label`或者其他属性，甚至有时候，我们需要获取其父节点的`value`或`label`属性。

# 解决方案

## 1. ElementUI提供`getCheckedNodes`方法

ElementUI提供的`getCheckedNodes`方法，可以返回当前选中的节点。

```js
<el-cascader
  ref="cascader"
  placeholder="请选择"
  :options="options"
  @change="handleChange"
></el-cascader>

<script>
//...
methods: {
  handleChange() {
    console.log(this.$refs.cascader.getCheckedNodes())
  },
},
//...
</script>
```

此时，我们可以获取到选中的节点信息，并且可以通过该选中节点，找到其父节点或自节点。

**但是**，当级联选择器可筛选是，我们会发现，通过`getCheckedNodes`拿到的节点为上一次选择的节点，而非本次选择的节点。

这是由于VUE的异步更新DOM引起的，通过添加`Vue.nextTick(callback)`，使回调在DOM更新完成之后被调用，确保拿到最新的DOM。

```js
<el-cascader
  ref="cascader"
  placeholder="请选择"
  :options="options"
  filterable
  @change="handleChange"
></el-cascader>

<script>
//...
handleChange() {
  this.$nextTick(()=>{
    console.log(this.$refs.cascader.getCheckedNodes())
  })
},
//...
</script>
```

## 2. 通过value值筛选节点

在change之后，cascader会返回选中节点的value值，那我们有节点数据，有节点值，我们可以通过节点值在节点数据里筛选对应的节点信息嘛 。。。

然而。。。。我并不想写这个筛选～

直觉告诉我，ElementUI源码中一定有这个筛选的函数～

于是，我就去看了看ElementUI的源码，果然被我找到了。。

`getNodeByValue`方法是`cascader`与`cascader panel`公用的一个函数，定义在`cascader panel`组件中

需要通过`this.$refs.cascader.panpel.getNodeByValue(value)`的方式调用。

```js
<el-cascader
  ref="cascader"
  placeholder="请选择"
  :options="options"
  filterable
  @change="handleChange"
></el-cascader>

<script>
//...
handleChange(val) {
  const cascader = this.$refs.cascader;
  const node = cascader.panel.getNodeByValue(val);
  console.log(node)
},
//...
</script>
```

