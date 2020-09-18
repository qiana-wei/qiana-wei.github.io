---
title: VUE粘贴剪切板内容
date: 2020-09-18 13:59:44
tags: ["VUE", "clipboard", "粘贴剪切板内容"]
category: "VUE"
---

> VUE 粘贴剪切板内容到页面

[复制到剪切板看这里](/2020/09/18/VUE/vue-clipboard2/)

### 使用方法

利用 paste 事件，读取剪切板中的内容，进行处理

```html
<input
  type="text"
  v-model="message"
  @paste.native.capture.prevent="pasteMaeesge($event)"
/>
<!-- prevent 阻止默认事件，使用pastMessage对输入框进行赋值 -->

<script>
  new Vue({
    //...
    data() {
      return {
        meaasge: null,
      };
    },
    methods: {
      pasteMaeesge($event) {
        let clipdata = $event.clipboardData || window.clipboardData;
        let message = clipdata.getData("text/plain");
        if (message.length == 0) {
          return;
        }
        //可以对message做一些额外的操作
        this.meaasge = message;
      },
    },
    //...
  });
</script>
```

### 例子

**粘贴 IP 地址到四个输入框**

```html
<input
  type="text"
  v-model="ipInfo.ip1"
  @paste.native.capture.prevent="pasteIP($event)"
/>
<input
  type="text"
  v-model="ipInfo.ip2"
  @paste.native.capture.prevent="pasteIP($event)"
/>
<input
  type="text"
  v-model="ipInfo.ip3"
  @paste.native.capture.prevent="pasteIP($event)"
/>
<input
  type="text"
  v-model="ipInfo.ip4"
  @paste.native.capture.prevent="pasteIP($event)"
/>

<script>
  new Vue({
    //...
    data() {
      return {
        ipInfo: {
          ip1: null,
          ip2: null,
          ip3: null,
          ip4: null,
        },
      };
    },
    methods: {
      pasteIP($event) {
        let clipdata = $event.clipboardData || window.clipboardData;
        let ipStr = clipdata.getData("text/plain");
        if (ipStr.length == 0) {
          return;
        }
        let ipArray = ipStr.split(".");
        if (ipArray.length !== 4) {
          alert("IP 格式错误");
          return;
        } else {
          //进一步判断ip格式
          this.ipInfo.ip1 = ipArray[0];
          this.ipInfo.ip2 = ipArray[1];
          this.ipInfo.ip3 = ipArray[2];
          this.ipInfo.ip4 = ipArray[3];
        }
      },
    },
  });
</script>
```
