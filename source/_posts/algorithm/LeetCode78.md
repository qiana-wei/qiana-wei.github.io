---
title: 每日算法-LeetCode78
date: 2020-09-20 22:15:14
tags: ['算法','LeetCode','Arrray','递归','回溯']
category: '算法'

---

今天做一道**数组** **递归**的算法题目。（题目来源[LeetCode78](https://leetcode-cn.com/problems/subsets/)）

### 题目

**子集**

给定一组不含重复元素的整数数组 nums，返回该数组所有可能的子集（幂集）。

说明：解集不能包含重复的子集。

**示例**

```
输入: nums = [1,2,3]

输出:
[
  [3],
  [1],
  [2],
  [1,2,3],
  [1,3],
  [2,3],
  [1,2],
  []
]
```

### 思路

每个元素都有*选* 和 *不选* 两种情况

可以根据  选 和 不选 两种情况分别进行递归

!(图解)[./leetcode78.jpg]

所以，递归的最后一层即为我们想要的所有子集

### 题目解答

```js
/**
 * @param {number[]} nums
 * @return {number[][]}
 */
var subsets = function(nums) {
    let res = []
    let def = function(index,list){
        if(index == nums.length){
            res.push([...list])
            return
        }
       
        //选择这个数递归 
        list.push(nums[index])
        def(index+1,list)
      
        //不选择这个数递归
      	list.pop()
       	def(index+1,list)
    }
    def(0,[])
    return res
};
```





ps：leetcode答案解析中有种二进制解法

思路看懂了。但是代码不会写。:(