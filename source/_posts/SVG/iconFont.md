---
title: svg-icon
date: 2021-05-08 14:36:24
tags: ['SVG','icon','icon-font']
category: 'SVG'
---
vue中封装`svg-icon`组件，实现svg图片作为iconFont。

# 功能目标：

使用svg图片作为iconFont，能够实现不同状态下的颜色修改。

# 实现：

1. [准备icon的svg图片](#1.准备icon的svg图片)
2. [编写`svg-icon`组件，用于渲染图片图标](#2.编写`svg-icon`组件，用于渲染图片图标)
3. [全局注册svg-icon组件](#3.引入svg文件模块，全局注册svg-icon组件)
4. [配置`vue.config`文件，实现svg、icon打包](#4.配置`vue.config`文件，实现svg、icon打包)

## 1.准备icon的svg图片

`vue`项目，`src`目录下，

1. 创建`icons/svg`目录，用于存放svg图片
2. 创建`index.ts`文件，用于全局注册`svg-icon`组件

![icons目录](./svg.png)

## 2.编写`svg-icon`组件，用于渲染图片图标

在components目录下，创建`SvgIcon.vue`文件，编写`svg-icon`组件

```vue
<template>
  <svg :class="svgClass" aria-hidden="true" v-on="$listeners">
    <use :xlink:href="iconName" />
  </svg>
</template>

<script lang="ts">
  import { Vue, Component, Prop } from 'vue-property-decorator';

  @Component({
    components: {},
    name: 'SvgIcon',
  })
  export default class MyComponent extends Vue {
    @Prop({ default: '' }) iconClass!: string;
    @Prop({ default: '' }) className!: string;

    get iconName() {
      return `#icon-${this.iconClass}`;
    }

    get svgClass() {
      if (this.className) {
        return 'svg-icon ' + this.className;
      } else {
        return 'svg-icon';
      }
    }
  }
</script>

<style scoped lang="scss">
  .svg-icon {
    width: 1em;
    height: 1em;
    fill: currentColor;
  }
</style>

```

**注解：**

` fill: currentColor;`：

1. fill是svg元素的一种属性。
   对于形状元素、文本，定义了绘制元素的颜色。
   对于动画，定义了最终状态。
   在这里，我们用的是他对于元素、文本颜色的定义。
2. currentColor是css中的变量，变量值是当前元素的color值。
   如果当前元素没有显性的定义一个color值，则继承父元素color值。----便于icon与文字颜色匹配。

## 3.引入svg文件模块，全局注册svg-icon组件

`icons/index.ts`:

```typescript
import Vue from 'vue';
import SvgIcon from '@/components/SvgIcon.vue'; // svg组件

// 全局注册svg-icon组件
Vue.component('svg-icon', SvgIcon);

//webpack--自动化导入svg模块
const req = require.context('./svg', false, /\.svg$/);
const requireAll = (requireContext: any) => {
  requireContext.keys().map(requireContext);
};
requireAll(req);

```

## 4.配置`vue.config`文件，实现svg、icon打包

**安装`svg-sprite-loader`**

[svg-sprite-loader--用于创建SVG精灵的Webpack加载器。](https://www.npmjs.com/package/svg-sprite-loader)

```shell
npm install svg-sprite-loader -D
# via yarn
yarn add svg-sprite-loader -D
```

修改`vue.config`,修改svg打包方式

```javascript
const path = require('path');

module.exports = {
  //.....省略其他配置
  chainWebpack(config) {
    config.module
      .rule('svg')
      .exclude.add(path.resolve(__dirname, 'src/icons'))
      .end();
    config.module
      .rule('icons')
      .test(/\.svg$/)
      .include.add(path.resolve(__dirname, 'src/icons'))
      .end()
      .use('svg-sprite-loader')
      .loader('svg-sprite-loader')
      .options({
        symbolId: 'icon-[name]',
      })
      .end();
  },
  //.....省略其他配置
};
```

# 可能出现的问题

若出现color赋值无效，

1. 检查下svg源文件的fill属性的写法，用`style="fill:#000000"`的写法试试看
2. 检查有没有`fill=none`,删掉试试看（如果删掉图片发生了变化，当我没说～）
3. 可能把fill都删了就好使了。

