---
title: 每日算法-LeetCodeEnWeekChallenge3
date: 2020-12-09 10:11:21
tags: ["算法", "LeetCode"]
category: "算法"
---

[算法来源:LeetCode英文版](https://leetcode.com/explore/challenge/card/december-leetcoding-challenge/570/week-2-december-8th-december-14th/3559/)

# 题目
![题目](./code.png)

# 粗暴解法
粗暴解法思路很简单，就两层for循环就能解决问题了。

```js
/**
 * @param {number[]} time
 * @return {number}
 */
var numPairsDivisibleBy60 = function(time) {
  let num = 0;
  let len = time.length;
  for(let i=0;i <len-1; i++){
    for(let j=i+1;j<len;j++){
      let sum = time[i]+time[j]
      if(sum%60==0){
        num++
      }
    }
  }
  return num
};
```

# 优化，使用Map存储数据

两数之和要被60整除，所以，我们可以将数据缩小值60以内，Map中存储缩小后的值（a），以及值出现了几次(n)。

当后续数组中出现，需要与这个值(a)相加才能被60整除的数(b)时，则表示这个数值(b)与Map中存储的值(a)对应的每个实际值相加都可以被60整除。所以num需要加n。

```js
/**
 * @param {number[]} time
 * @return {number}
 */
var numPairsDivisibleBy60 = function(time) {
  let num = 0;
  let timeMap = new Map()
  let len = time.length
  for(let i =0;i<len;i++){
    let value = time[i]   //原始值
    let valuelimt60 = value%60  || 60 //整除60后，相当于60以内的值,如果能自身可以被60整除，存储60
    let needValue = 60-valuelimt60  || 60 //需要与谁相加整除，如果能自身可以被60整除，需要60
   
    //如果Map中有需要的值，得到有多少个值，与num相加
    let hasNeedValue = timeMap.get(needValue)
    if(hasNeedValue){
      num += hasNeedValue
    }

    // 存储新的值，获取需要存储的值在map中的个数
    let hasLimtValue = timeMap.get(valuelimt60)
    if(hasLimtValue){
      // 如果已经存在该值，值++
      timeMap.set(valuelimt60,++hasLimtValue)
    }else{
      // 如果不存在，值为1
      timeMap.set(valuelimt60,1)
    }
  }
  return num
};
```



