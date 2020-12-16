---
title: 每日算法-LeetCode136-只出现一次的数字
date: 2020-11-11 11:11:11
tags: ["算法", "LeetCode", "位运算"]
category: "算法"
---
题目来源：[LeetCode136](https://leetcode-cn.com/problems/single-number/)

# 题目
![LeetCode136](./code.jpg)

# 解题方法
不考虑时间、空间复杂度的情况下
1. 暴力破解，两次for循环解决
2. 将集合中所有的数字到一个新的数组，使用数字和的两倍减去集合中所有数字的和，余数即为没有重复的数字。
3. 使用Map存储数据
4. 排序后再进行循环
5. 位运算----这个真的是想不到

*Map方法*
```js
/**
 * @param {number[]} nums
 * @return {number}
 */
var singleNumber = function(nums) {
  let map = new Map()
  for(let i = 0;i<nums.length;i++){
    if(map.get(nums[i]) == undefined){
      map.set(nums[i],nums[i])
      continue
    }
    map.delete(nums[i])
  }
  return map.keys().next().value
};
```

*位运算*

**异或运算**

1. 任何数与0做异或运算，值为原来的数。*a*⊕0=*a*。
2. 任何数与其自身做异或运算，值为0。*a*⊕*a*=0
3. 异或运算满足交换律和结合律。*a*⊕*b*⊕*a*=*b*⊕*a*⊕*a*=*b*⊕(*a*⊕*a*)=*b*⊕0=*b*

**异或运算符`^`**

```js
/**
 * @param {number[]} nums
 * @return {number}
 */
var singleNumber = function(nums) {
    let result = 0
    for(let i=0;i<nums.length;i++){
        result ^= nums[i]
    }
    return result
};
```

