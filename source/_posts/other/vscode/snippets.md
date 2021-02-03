---
title: 使用VSCode快速创建文件代码模板
date: 2021-2-3 10:49:58
tags: ['VSCode','Snippets']
category: 'VSCode'
---

**解决的问题：**

写vue项目的时候，每次创建一个新的vue文件，都要去写一堆基础且重复的模板代码。

虽然vetur在vscode中可以通过`vue`来在vue文件中创建基础模板。

但是，现在用ts写vue文件，也是有很多改动的。。

虽然可以用`prop`这类工具来创建文件，但是还要引入第三方库什么的。。。

就.......发现了这个神奇的东西

(ps:我之前几年的VSCode都白用了么？)

**需求目标：**

在vue文件中，通过`vt`（就是vueTS）的缩写，实现vue with ts 的基础vue模板。

通过`vtx`（就是vueTSX）的缩写，实现vue with tsx 的基础vue模板。

# 方法

在VSCode中，使用快捷键`command + shift +p`,输入`snippets`,选择`vue`.

也可以通过`首选项`->`用户片段`->`输入选择vue`

![snippets.png](./snippets.png)

![vue.png](./vue.png)

# 语法介绍

```bash
prefix      :代码片段名字，即输入此名字就可以调用代码片段。
body        :这个是代码段的主体.需要编写的代码放在这里,　　　　　 
$1          :生成代码后光标的初始位置.
$2          :生成代码后使用tab，光标切换的第二个位置，同理还有$3,$4,$5.....
${1,默认值}  :生成代码后光标的初始位置(1表示切换序号，tab切换后会直接选中后默认值，输入字符会替换默认值。)
description :代码段描述,输入名字后编辑器显示的提示信息。
```

**body内语法介绍**

* 多行代码以`,`隔开，每行代码以`""`包裹
* 换行符：`\n`或`\r`
* tab制表符：`\t`
* 代码内引号，需使用`\"`进行转义



# 愉快的编写自己的代码片段

```json
{
  // Place your snippets for vue here. Each snippet is defined under a snippet name and has a prefix, body and 
  // description. The prefix is what is used to trigger the snippet and the body will be expanded and inserted. Possible variables are:
  // $1, $2 for tab stops, $0 for the final cursor position, and ${1:label}, ${2:another} for placeholders. Placeholders with the 
  // same ids are connected.
  // Example:
  "vueTs": {
    "prefix": "vt",
    "body": [
      "<template>",
      "\t<div>\n",
      "\t</div>",
      "</template>\n",
      "<script lang=\"ts\">",
      "import { Vue, Component } from \"vue-property-decorator\";\n",
      "@Component({",
      "\tcomponents: {},",
      "})",
      "export default class ${1:MyComponent} extends Vue {\n",
      "}",
      "</script>\n",
      "<style scoped lang=\"scss\">\n",
      "</style>",
    ],
    "description": "A Vue with TS template"
  },
  "vueTsx": {
    "prefix": "vtx",
    "body": [
      "<script lang=\"tsx\">",
      "import { Vue, Component } from \"vue-property-decorator\";\n",
      "@Component({",
      "\tcomponents: {},",
      "})",
      "export default class ${1:MyComponent} extends Vue {",
      "\trender() {",
      "\t\treturn ",
      "\t}",
      "}",
      "</script>\n",
      "<style scoped lang=\"scss\">\n",
      "</style>",
    ],
    "description": "A Vue with TSX template"
  }
}
```

# 试用

新建test.vue文件，在vue文件中，输入`vt`

![vt.png](./vt.png)

回车即得到模板代码：

![vt-template.png](./vt-template.png)

vtx同理。

