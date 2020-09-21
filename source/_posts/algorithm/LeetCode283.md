---
title: 每日算法-LeetCode283
date: 2020-09-17 21:52:31
tags: ["算法", "LeetCode", "Arrray", "双指针"]
category: "算法"
---

今天做一道**数组** **双指针**的算法题目。(题目来源，[LeetCode283](https://leetcode-cn.com/problems/move-zeroes/))

### 题目

**移动零**

给定一个数组 `nums`，编写一个函数将所有 `0` 移动到数组的末尾，同时保持非零元素的相对顺序。

**示例**

输入：[0,1,0,3,12]

输出：[1,3,12,0,0]

**要求**

1. 必须在原数组上操作，不能额外拷贝数组
2. 尽量减少操作

### 思路

1. 采用双指针，将非零元素逐个赋值到当前数组中
2. 非零元素赋值完成后，将后续元素赋值为 0.

### 解答题目

```js
/**
 * @param {number[]} nums
 * @return {void} Do not return anything, modify nums in-place instead.
 */
var moveZeroes = function (nums) {
  let j = 0;
  for (let i = 0; i < nums.length; i++) {
    if (nums[i] != 0) {
      nums[j] = nums[i];
      j++;
    }
  }
  for (j; j < nums.length; j++) {
    nums[j] = 0;
  }
};
```

动图了解下～
![移动零](./LeetCode283.gif)
