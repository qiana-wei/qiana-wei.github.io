---
title: 记录一次Hexo博客搭建
date: 2020-09-14 00:28:49
tags: Hexo
category: Hexo
---

[官网戳这里](https://hexo.io/zh-cn/docs)

## 一、安装环境

1.安装`node`, [node 官网点这里](https://nodejs.org/zh-cn/download/)

2.安装`git`,[git 官网点这里](https://git-scm.com/downloads)

3.安装`hexo`,[hexo 官网点这里](https://hexo.io/zh-cn/)

```shell
# hexo安装
npm install hexo-cli -g
```

## 二、创建项目

利用 hexo-cli 创建项目

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

使用命令`hexo serve`或者 package.json 中配置的`npm run serve` 启动项目

默认启动 localhost:4000，访问即可看到一个初始化的 hexo 博客站啦～

## 四、主题

hexo 允许使用者贡献主题，所以 hexo[主题列表](https://hexo.io/themes/)有超级多的主题,我们可以选择其中自己喜欢的作为自己博客的主题。

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

github 搜索 hexo-theme-Chic，下载[hexo-theme-Chic](https://github.com/Siricee/hexo-theme-Chic)主题

```shell
# 进入themes文件夹
cd themes
# 克隆主题，并命名主题文件夹未Chic
git clone https://github.com/Siricee/hexo-theme-Chic.git Chic
```

**修改`_config.yml`**

修改`_config.yml`中 themes 为 Chic，应用 Chic 主题

**根据主题文档配置主题**

1. 修改\_config.yml 文件中配置信息

2. 添加 Tag、Category、About 页面

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

ps：由于 Chic 主题是英文的，而且没有做国际化。所以，我修改了主题支持国际化

```ejs
//模板语法
<%- __('Tags')%>   // 静态翻译
<%- _p('archive_b',"3")%>  //动态替换
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

使用 hello-world.md 测试一下

修改 category 为‘Test’，修改 tags 为['test','Hello world']

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

_首页_

![首页图片](/assets/img/hexo/index.jpg)

_文档_

![文档图片](/assets/img/hexo/posts.jpg)

_分类列表_

![分类列表图片](/assets/img/hexo/categories1.jpg)

_分类详情_

![分类详情图片](/assets/img/hexo/categories2.jpg)

_标签列表_

![标签列表图片](/assets/img/hexo/tags1.jpg)

_标签详情_

![标签详情图片](/assets/img/hexo/tags2.jpg)

## 五、写文档

### 创建新文档或新页面

```shell
hexo new [layout] <title>
```

`layout`,默认为`post`，可以通过修改 `_config.yml` 中的 `default_layout` 参数来指定默认布局

**layout**

hexo 默认含有三种`layout`，

post 创建后，将存储于`source/_post`中

draft 创建后，将存储于`source/_draft`中

page 创建后，将存储于`source/<page-name>中`

**文件名称**

```shell
hexo new 记录一次Hexo博客搭建 -p hexo/hexo
```

创建`source/hexo/hexo.md`,文件内 title 为 ‘记录一次 Hexo 博客搭建’

### 草稿

`_draft`中的文件不会显示在页面中，可以使用`publish`命令发布草稿中的文件，届时，`_draft`中的文件将移动到`_posts`文件夹中。

```shell
hexo publish [layout] <title>
```

### Front-matter

Front-matter 是文件最上方用`---`分隔的部分，用于指定文章的变量

| 参数       | 描述             | 默认值                         |
| ---------- | ---------------- | ------------------------------ |
| layout     | 布局             |                                |
| title      | 标题             | 文章的文件名/创建时指定的名称  |
| date       | 创建日期         | 文件创建日期                   |
| updated    | 更新日期         | 文件更新日期                   |
| comments   | 开启文章评论功能 | true（要看 themes 有没有评论） |
| tags       | 标签             |                                |
| categories | 分类             |                                |
| permalink  | 覆盖文章网站     |                                |

**categories 具有顺序性，多个分类之间是父子关系**

如果要给一篇文章设置多个分类，可以使用 list 的形式

```markdown
categories:
- [Diary, PlayStation]
- [Diary, Games]
- [Life]
```

此时这篇文章同时包括三个分类： `PlayStation` 和 `Games` 分别都是父分类 `Diary` 的子分类，同时 `Life` 是一个没有子分类的分类。

### 资源文件夹----文章资源文件夹

`source`文件夹用于存放静态文件，如 css, js, 图片等。

如果文章只有少量文件，可以将文件放置于`source/images`文件夹中，通过`![](/images/img.png)`的方法引用。

但是，如果文章多了，图片多了，最后资源会难以管理。

所以，为了有规律的提供静态资源，为了能够将静态资源分布到各个文章上，Hexo 提供了更组织化的方式管理资源。

通过`config.yml`文件中的`post_assets_folder`设置为`true`，Hexo 将会在每次通过`hexo new [layout] <title>` 命令创建新文章时，自动创建一个与该文章文件一样名字的资源文件夹。

将与文章相关的资源放置于这个关联文件夹中之后，可以通过相对路径引用它们。

## 六、部署

Hexo 文档提供了[ GitHub Pages 部署](https://hexo.io/zh-cn/docs/github-pages)，[GitLab Pages 部署](https://hexo.io/zh-cn/docs/gitlab-pages)以及利用[hexo-deployer-git 一键部署](https://hexo.io/zh-cn/docs/one-command-deployment)三种方式。

我选用了一键部署这种方式，毕竟懒---

**安装** hexo-deployer-git

```shell
npm install hexo-deployer-git --save
```

**配置** 参数

```yaml
# _config.yml
deploy:
type: git
repo: <repository url>
branch: [branch]
message: [message]
```

| 参数    | 描述     | 默认值                                                                    |
| ------- | -------- | ------------------------------------------------------------------------- |
| repo    | 库地址   |                                                                           |
| branch  | 分支名称 | `gh-pages` (GitHub)<br/>`coding-pages` (Coding.net)<br/>`master` (others) |
| message | 提交信息 | `Site updated: {{ now('YYYY-MM-DD HH:mm:ss') }}`                          |
| token   |         |                                                                           |

repo 地址选择 ssh，我是直接部署到<userName>.github.io 这个仓库哒。

**推送至远程**

执行`hexo clean && hexo deploy`

输入 github 用户名及密码

**配置 github**

将仓库中默认分支设置为`_config.yml`中配置的分支名

**And Why**

在执行`hexo deploy`时，Hexo 会将`public`目录中的文件和目录推送至`_config.yml`中指定的远程仓库及分支中，并且**完全覆盖**该分支下已有内容
