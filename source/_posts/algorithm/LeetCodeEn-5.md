---
title: 每日算法-LeetCodeEnWeekChallenge5
date: 2020-12-11 23:11:21
tags: ["算法", "LeetCode"]
category: "算法"
---

# 数组去重

[算法来源:LeetCode英文版](https://leetcode.com/explore/challenge/card/december-leetcoding-challenge/570/week-2-december-8th-december-14th/3562/)

# 题目
![题目](./code.png)

# 思路
一个快指针，一个慢指针。快指针比慢指针快2位。
当快指针不等于慢指针时，慢指针前移一位，删除快指针与慢指针之间重复的内容。
更新快指针，使快指针比慢指针快两位。

```js
var removeDuplicates = function(nums) {
    let slow = 0;
    let speed = 2;
    //当删除数组中重复数据时，nums的长度会更新
    while(speed<nums.length){
        
        while(nums[slow]==nums[speed]){
            speed++
            
        }
        slow += 1
        
        nums.splice(slow+1,speed-slow-1) // 删除快指针和慢指针之间的数据
        
        speed = slow+2
        
    }
    return nums.length
};
```