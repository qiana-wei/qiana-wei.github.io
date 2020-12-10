---
title: 每日算法-LeetCodeEnWeekChallenge4
date: 2020-12-10 23:11:21
tags: ["算法", "LeetCode"]
category: "算法"
---

# 山形数组

[算法来源:LeetCode英文版](https://leetcode.com/explore/challenge/card/december-leetcoding-challenge/570/week-2-december-8th-december-14th/3561/)

# 题目
![题目](./code.png)

# 硬思路解答

```js
var validMountainArray = function(arr) {
  let len = arr.length
  //数组长度小于3，直接返回
  if(len<3)  return false
  let isRease = false  //标记是否有升的过程
  let isReduce = false  // 标记是否有降的过程
  let isIncreaseOver = false; //标记升的过程是否结束

  for(let i = 0;i<len-1;i++){
    //有相等的值，直接结束
    if(arr[i+1] == arr[i]) {  return false}
    if(!isIncreaseOver){
      if(arr[i+1] > arr[i]){
        isRease = true
      }else{
        //在升的过程中，出现降落，标记升的过程结束
        isIncreaseOver =true
        isReduce =true
      }
    }else{
      //在降的过程中出现升的情况，直接返回false
      if(arr[i+1] > arr[i]){
        return false
      }
    }
  }
  return isRease && isReduce && isIncreaseOver
};
```

# 从两端向中间查找

```js
var validMountainArray = function(arr) {
  let len = arr.length
  if(len<3)  return false
  let begin = 0
  let end = len-1

  while(arr[begin+1] > arr[begin]){
    begin++
  }

  while(arr[end-1] > arr[end]){
    end --
  }
  
  return begin == end && begin!==0 && end!==len-1
};
```
