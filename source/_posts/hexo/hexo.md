---
title: 记录一次Hexo博客搭建
date: 2020-09-14 00:28:49
tags: Hexo
category: Hexo
---

[官网戳这里](https://hexo.io/zh-cn/docs)

## 一、安装环境

1.安装`node`, [node官网点这里](https://nodejs.org/zh-cn/download/)

2.安装`git`,[git官网点这里](https://git-scm.com/downloads)

3.安装`hexo`,[hexo官网点这里](https://hexo.io/zh-cn/)

```shell
# hexo安装
npm install hexo-cli -g
```

## 二、创建项目

利用hexo-cli 创建项目

```shell
# 创建项目,mac init时，直接安装了依赖包
hexo init <project-name>

# 若未安装依赖包，进入项目，安装项目依赖
cd <project-name>
npm install
```

**项目目录**

```shell
├── _config.yml  # Hexo配置文件
├── package.json # 依赖包配置文件
├── scaffolds    # 模板文件夹
├── source       # 资源文件夹
|   ├── _drafts
|   └── _posts
└── themes       # 主题文件夹
```

## 三、启动项目

使用命令`hexo serve`或者package.json中配置的`npm run serve` 启动项目

默认启动localhost:4000，访问即可看到一个初始化的hexo博客站啦～

## 四、主题

hexo允许使用者贡献主题，所以hexo[主题列表](https://hexo.io/themes/)有超级多的主题,我们可以选择其中自己喜欢的作为自己博客的主题。

当然，我们也可以自己创建主题，发布主题。[官方文档戳这里](https://hexo.io/zh-cn/docs/themes)

只要在 `themes` 文件夹内，新增一个任意名称的文件夹，并修改 `_config.yml` 内的 `theme` 设定，即可切换主题。

### 主题构成

主题文件夹目录

```shell
.
├── _config.yml # 主题的配置文件,主题配置文件修改时会自动更新，无需重启 Hexo Server
├── languages  # 语言包，用于国际化
├── layout  #布局文件夹，存放主题的模板文件
├── scripts # 脚本文件夹。在启动时，Hexo 会载入此文件夹内的 JavaScript 文件
└── source #资源文件夹
```

呐呐呐，我的目的是快速搭建一个博客，就选用了主题列表中的一个主题[Chic](https://github.com/Siricee/hexo-theme-Chic)

### 使用主题

**下载主题**

gi thub搜索hexo-theme-Chic，下载[hexo-theme-Chic](https://github.com/Siricee/hexo-theme-Chic)主题

```shell
# 进入themes文件夹
cd themes
# 克隆主题，并命名主题文件夹未Chic
git clone https://github.com/Siricee/hexo-theme-Chic.git Chic
```

**修改`_config.yml`**

修改`_config.yml`中themes为Chic，应用Chic主题

**根据主题文档配置主题**

1. 修改_config.yml文件中配置信息

2. 添加Tag、Category、About页面

```shell
# 添加页面
hexo new page tag
hexo new page category
hexo new page about

```

```markdown
// 配置页面
cd source/tag

//source\tag\index.md
---
title: Tag
layout: tag
---

//source\category\index.md
---
title: Category
layout: category
---

//source\about\index.md
---
title: About
---
```

3. 修改主题中的文案为中文

ps：由于Chic主题是英文的，而且没有做国际化。所以，我修改了主题支持国际化

```ejs
//模板语法
<%- __('Tags')%>
```

```yml
//default.yml
categories: 分类
Categories: 分类
Category: 分类
tags: 标签
Tags: 标签
Tag: 标签
Posts: 文档
About: 关于

search: 搜索
tagcloud: 标签云
tweets: 推文
prev: 上一页
next: 下一页
comment: 留言
archive_a: 归档
archive_b: "归档: %s"
page: 第 %d 页
recent_posts: 最新文章
newer: 下一篇
older: 上一篇
share: 分享
powered_by: Powered by
rss_feed: RSS Feed
back: 后退
home: 首页
Author: 作者
Date: 日期
```

好，到目前为止，我们的主题已经可以使用了。

使用hello-world.md测试一下

修改category为‘Test’，修改tags为['test','Hello world']

```markdown
//hello-world.md

---
title: Hello World
category: Test
tags: ['test','Hello Words']
---
Welcome to [Hexo](https://hexo.io/)! This is your very first post. Check [documentation](https://hexo.io/docs/) for more info. If you get any problems when using Hexo, you can find the answer in [troubleshooting](https://hexo.io/docs/troubleshooting.html) or you can ask me on [GitHub](https://github.com/hexojs/hexo/issues).

```

此时访问站点可以看到

*首页*


![首页图片](/assets/img/hexo/index.jpg)

*文档*

![文档图片](/assets/img/hexo/posts.jpg)

*分类列表*

![分类列表图片](/assets/img/hexo/categories1.jpg)

*分类详情*

![分类详情图片](/assets/img/hexo/categories2.jpg)

*标签列表*

![标签列表图片](/assets/img/hexo/tags1.jpg)

*标签详情*

![标签详情图片](/assets/img/hexo/tags2.jpg)


## 五、写文档

### 创建新文档或新页面

```shell
hexo new [layout] <title>
```

`layout`,默认为`post`，可以通过修改 `_config.yml` 中的 `default_layout` 参数来指定默认布局

**layout**

hexo默认含有三种`layout`，

post创建后，将存储于`source/_post`中

draft创建后，将存储于`source/_draft`中

page创建后，将存储于`source/<page-name>中`

**post name**

```shell
hexo new 记录一次Hexo博客搭建 -p hexo/hexo
```

创建`source/hexo/hexo.md`,文件内title为‘记录一次Hexo博客搭建’

