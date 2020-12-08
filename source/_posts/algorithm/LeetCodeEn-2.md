---
title: 每日算法-LeetCodeEnWeekChallenge2
date: 2020-12-08 16:11:21
tags: ["算法", "LeetCode", "螺旋矩阵II"]
category: "算法"
---

[算法来源:LeetCode英文版](https://leetcode.com/explore/challenge/card/december-leetcoding-challenge/569/week-1-december-1st-december-7th/3557/)
[在中文版也找到了](https://leetcode-cn.com/problems/spiral-matrix-ii/)

# 题目
![题目](./code.png)

# 解答
```js
/**
 * @param {number} n
 * @return {number[][]}
 */
var generateMatrix = function(n) {
    let result = []
    let num = 1;
    let rowStart = 0;
    let cloumnStart = 0;
    let rowEnd = n-1;
    let cloumnEnd = n-1;
    let power = Math.pow(n,2)
    //创建个矩阵数组
    for(let i =0;i<n;i++){
        result.push([])
    }
    
    while(num <= power){
        //最上面一行,cloumnStart，到cloumnEnd，填充result[rowStart][i]行
        for(let i = cloumnStart;i<=cloumnEnd;i++){
            result[rowStart][i] = num++
        }
        rowStart++
        
        //最右边一列,rowStart，到rowEnd，填充result[i][cloumnEnd]列
        for(let i = rowStart;i<=rowEnd;i++){
            result[i][cloumnEnd] = num++
        }
        cloumnEnd--
        
        //最下面一行，从cloumnStart，到cloumnEnd，填充result[rowEnd][i]行
        for(let i = cloumnEnd;i>=cloumnStart;i--){
            result[rowEnd][i] = num++
        }
        rowEnd--
        //最左边一列,rowStart，到rowEnd，填充result[i][cloumnStart]列
        for(let i = rowEnd;i>=rowStart;i--){
            result[i][cloumnStart] = num++
        }
        cloumnStart++
    }
    return result
};
```