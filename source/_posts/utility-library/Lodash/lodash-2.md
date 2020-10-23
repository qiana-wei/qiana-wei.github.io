---
title: Loadsh-2:Lodash中的FP模块
date: 2020-10-21 16:06:48
tags: ['Lodash','函数式编程']
category: 'Lodash'
---

# **lodash/fp**

lodash中的fp模块提供了实用的，对**函数式编程**友好的方法

提供了不可变的**自动柯里化、函数优先、数据置后**的方法。

**lodash模块与lodash/fp模块方法对比**

```js
//lodash 模块
const _ = require('lodash')
_.map(['a','b','c'],_.toUpper)
//['A','B','C']
_.map(['a','b','c'])
//['a','b','c']
_.split('Hello World',' ')
//['Hello','World']

//lodash/fp 模块
const fp = require('lodash/fp')
fp.map(fp.toUpper,['a','b','c'])
//['A','B','C']
fp.map(fp.toUpper)(['a','b','c'])
//['A','B','C']

fp.split(' ','Hello World')
fp.split(' ')('Hello World')
//['Hello','World']

```

**例子**

```js
//NEVER SAY DIE -> never-say-die
const fp = require('lodash/fp')
const f = fp.flowRight(fp.join('-'),fp.map(fp.toLower),fp.split(' '))
//测试
console.log(f('NEVER SAY DIE'))
//never-say-die
```

## map方法

lodash与lodash/fp中map的区别

在lodash函数中，map的第二个参数接受三个参数(当前值,index,源数组)

在fp模块中，map仅接受一个参数（当前值）

```js
//将['32','8','10']转换为[32,8,10]
//lodash
const _ = require('lodash')
let result = _.map(['32','8','10'],parseInt)
console.log(result)
//[ 32, NaN, 2 ]

/*解析
在lodash函数中，map的第二个参数接受三个参数,所以，parseInt执行的分别是
    parseInt('32',0,['32','8','10')
    parseInt('8',1,['32','8','10'])
    parseInt('10',2,['32','8','10'])
parseInt 函数本身接受的参数，第一个为要转换的数据，第二个为基准进制，
所以，
    32以0进制进行转换，即10进制转换，所以结果为32
    8以1进制进行转换，本身不存在1进制，所以结果为NaN
    10以2进制进行转换，所以结果为2
 */

//lodash/fp
const fp = require('lodash')
// 方法优先，数据置后
let resultFp = fp.map(parseInt,['32','8','10'])
console.log(resultFp)
//[ 32, 8, 10 ]
```

