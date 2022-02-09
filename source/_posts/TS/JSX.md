---
title: JSX
date: 2022-02-07 15:17:27
tags: ['TS','JSX']
category: 'TS'
---

# 是什么
JSX是一种嵌入式的类似XML的语法。它可以被转换成合法的JavaScript。
JSX因React框架而流行，但也存在其他的实现。
TS支持内嵌、类型检查以及将JSX直接编译为JavaScript。

# 基本用法
使用JSX必须做两件事：
1. 给文件一个`.tsx`的扩展名
2. 启用`jsx`选项

TS有三种JSX模式，这些模式仅在代码生成阶段起作用，类型检查并不受影响。

**preserve**：模式下生成代码中会保留JSX以供后续的转化操作使用。输出文件会带有`.jsx`扩展名。
**react**：模式会生成`React.createElement`，在使用前不需要在进行转换操作了。输出文件扩展名为`.js`。
**react-native**：模式相当于`preserve`模式，也保留了所有的JSX。输出文件扩展名为`.js`。

| 模式         | 输入     | 输出                       | 输出文件拓展名 |
| ------------ | -------- | -------------------------- | -------------- |
| preserve     | \<div/\> | \<div/\>                    | .jsx           |
| react        | \<div/\>  | React.createElement('div') | .js            |
| react-native | \<div/\>  | \<div/\>                    | .js            |

# `as`操作符

使用`as`操作符来进行类型断言。

```tsx
let foo = bar as foo
```

# 类型检查



