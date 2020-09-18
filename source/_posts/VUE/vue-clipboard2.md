---
title: VUE复制到剪切板功能 --- vue-clipboard2
date: 2020-09-18 11:55:56
tags: ["VUE", "clipboard", "复制到剪切板"]
category: "VUE"
---

> 在 VUE 中实现复制到剪切板功能

[粘贴剪切板内容到页面看这里](/2020/09/18/VUE/past-clioboardData/)

### 工具

`vue-clipboard2`,[官方文档看这里](https://vue-clipboard2.inndy.tw/)

### 安装

```shell
npm install vue-clipboard2 --save
```

### 使用

```js
//main.js 引入并使用

import Vue from "vue";
import VueClipboard from "vue-clipboard2";

Vue.use(VueClioboard);
```

**方式 1**

```html
<div id="app"></div>
<template id="temp">
  <div class="container">
    <input type="text" v-model="message" />
    <button
      type="button"
      v-clipboard:copy="message"
      v-clipboard:success="onCopy"
      v-clipboard:error="onError"
    >
      copy message
    </button>
  </div>
</template>

<script>
  new Vue({
    el: "#app",
    template: "#temp",
    data() {
      return {
        message: "copy message",
      };
    },
    methods: {
      onCopy(e) {
        alert("copued" + e.text);
      },
      onError(e) {
        alert("Failed to copy");
      },
    },
  });
</script>
```

**方式 2**

```html
<div id="app"></div>
<template id="temp">
  <div class="container">
    <input type="text" v-model="message" />
    <button type="button" @click="doCopy">copy message</button>
  </div>
</template>

<script>
  new Vue({
    el: "#app",
    template: "#temp",
    data() {
      return {
        message: "copy message",
      };
    },
    methods: {
      doCopy() {
        this.$copyText(this.message).then(
          function (e) {
            //成功函数
            alert("Copied message");
          },
          function (e) {
            //失败函数
            alert("Faild to copy message");
          }
        );
      },
    },
  });
</script>
```
