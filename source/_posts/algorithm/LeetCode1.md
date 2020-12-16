---
title: 每日算法-LeetCode1-两数之和
date: 2020-11-09 21:32:52
tags: ['算法','LeetCode','Array']
category: "算法"
---

许久没做算法了，刘小凡同学天天督促我也木有效果了。。。

今天做下LeetCode第一题，我看解题评论，有好多说是：“梦开始的地方”。

题目来源[LeetCode1](https://leetcode-cn.com/problems/two-sum)

### 题目

**两数之和**

给定一个整数数组` nums` 和一个目标值` target`，请你在该数组中找出和为目标值的那 两个 整数，并返回他们的数组下标。

你可以假设每种输入只会对应一个答案。但是，数组中同一个元素不能使用两遍。

 

示例:

```
给定 nums = [2, 7, 11, 15], target = 9

因为 nums[0] + nums[1] = 2 + 7 = 9
所以返回 [0, 1]
```

### 思路

1. 暴力解法：两次for循环，逐个计算，返回下标
2. 使用哈希表（Map），记录某些数据，空间换时间

### 解法1.暴力解法

```js
/**
 * @param {number[]} nums
 * @param {number} target
 * @return {number[]}
 */
var twoSum = function(nums, target) {
  for(let i = 0; i<nums.length-1;i++){
    for(let j = i+1;j<nums.length;j++){
      if(nums[i]+nums[j] == target){
        return [i,j]
      }
    }
  }
};
```

### 解法2:通过哈希表存储部分数据及下标

**首先**，将数组第一个数据存入Map中，key为数值，value为下标。

**然后**，for循环数组，计算target与该数据的值的差值，若差值在Map中，则返回当前值下标与Map中数据下标。

否则将数据存入Map，继续查找下一个数据

```js
/**
 * @param {number[]} nums
 * @param {number} target
 * @return {number[]}
 */
var twoSum = function(nums, target) {
  let mapData = new Map()
  mapData.set(nums[0],0) // 存入第一个数值与下标
  for(let i = 1; i<nums.length;i++){
    let difference = target - nums[i]
    if(mapData.get(difference) || mapData.get(difference)==0){// 谨慎值为0的情况
      return [mapData.get(difference),i]
    }else{
      mapData.set(nums[i],i)
    }
  }
};
```

防御式编程，优化一下

```js
var twoSum = function(nums, target) {
  let numMap = new Map()
  for(let i =0;i<nums.length;i++){
    let found = target-nums[i]
    if(numMap.get(found) == undefined){
        numMap.set(nums[i],i)
        continue
    }
    return [numMap.get(found),i]
  }
};
```

