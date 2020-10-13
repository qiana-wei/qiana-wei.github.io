---
title: CSS3下的渐变文字效果
date: 2020-10-13 18:18:58
tags: ["CSS", "CSS3", "文字渐变效果"]
category: "CSS"
---

最近UI小姐姐迷上了各种渐变，背景渐变、下划线渐变已经满足不了她了。

a链接hover效果时，文字也要渐变~~

# 实现方案：background-clip + text-fill-color

```html
<h2 class="text-gradient">文字颜色渐变</h2>

<style>
   .text-gradient {  
       display: block;
       font-size: 130px;
       color: #ff00ad;
       background-image: linear-gradient(135deg,#ff00ad,#f70);
       background-clip: text;
       -moz-background-clip: text;
       -webkit-background-clip: text;
       -webkit-text-fill-color: transparent;
   }  
</style>
```

**效果图**

![文字颜色渐变](./text-gradient.png)