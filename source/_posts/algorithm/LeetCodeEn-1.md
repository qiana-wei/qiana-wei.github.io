---
title: 每日算法-LeetCodeEnWeekChallenge1
date: 2020-12-07 20:24:21
tags: ["算法", "LeetCode", "二叉树"]
category: "算法"
---

说来惭愧，虽说是每日算法，也是好久没做算法了。

今天来一道LeetCode国际版的算法题。[题目来源LeetCode](https://leetcode.com/explore/challenge/card/december-leetcoding-challenge/569/week-1-december-1st-december-7th/3556)
题目如下图
![题目](./code.png)
即给一棵二叉树的每个节点添加next属性，next属性指向同一层级右边的节点，若右边无节点，next值为null
若二叉树为空二叉树，则返回空二叉树

```js
/**
 * // Definition for a Node.
 * function Node(val, left, right, next) {
 *    this.val = val === undefined ? null : val;
 *    this.left = left === undefined ? null : left;
 *    this.right = right === undefined ? null : right;
 *    this.next = next === undefined ? null : next;
 * };
 */

/**
 * @param {Node} root
 * @return {Node}
 */
var connect = function(root) {
  	//root为空，返回空二叉树
    if(!root) return root
    //设定一个队列，将根节点放进去，同时放入null作为层级断点
    let quere = [root,null]
    while(quere.length){
        let node = quere.shift()
        
        if(node.left) quere.push(node.left)
        if(node.right) quere.push(node.right)
        
        if(quere[0]){
          //若不为null，则该层级还没有结束
            node.next = quere[0]
        }else{
          //若为null，则该层级结束，将队列中的null取出，赋值给层级最右边的节点
            node.next = quere.shift()
        }
    }
    
    return root
    
};
```