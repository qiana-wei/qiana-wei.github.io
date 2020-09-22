---
title: 每日算法-LeetCode94
date: 2020-09-22 11:11:28
tags: ["算法", "LeetCode", "二叉树", "中序遍历"]
category: "算法"
---

今天做一道**二叉树** **中序遍历**的算法题目。(题目来源，[LeetCode94](https://leetcode-cn.com/problems/binary-tree-inorder-traversal/)

ps：[每日算法-LeetCode1038-反向遍历](/2020/09/21/algorithm/LeetCode1038/)

### 题目

**二叉树的中序遍历**

给定一个二叉树，返回它的中序 遍历。

### 思路

1. 二叉树中序遍历： 左中右
2. 递归算法：递归二叉树，先递归左节点,中间节点 push 进 result,在递归右节点
3. 迭代法

### 题目解答

**递归算法**

> 隐性的维护一个栈

```js
/**
 * Definition for a binary tree node.
 * function TreeNode(val, left, right) {
 *     this.val = (val===undefined ? 0 : val)
 *     this.left = (left===undefined ? null : left)
 *     this.right = (right===undefined ? null : right)
 * }
 */
/**
 * @param {TreeNode} root
 * @return {number[]}
 */
var inorderTraversal = function (root) {
  let result = [];
  travse(root);
  return result;

  function travse(node) {
    if (!node) {
      //递归结束
      return;
    }

    travse(node.left); //递归左节点
    result.push(node.val); //存储根节点
    travse(node.right); //递归右节点
  }
};
```

**迭代算法**

> 显性的维护一个栈

```js
var inorderTraversal = function (root) {
  let static = []; //栈
  let result = []; //结果
  while (root || static.length) {
    while (root) {
      //将当前根节点的所有左节点推入栈
      static.push(root);
      root = root.left;
    }
    let node = static.pop();
    result.push(node.val);
    if (node.right) {
      root = node.right;
    }
  }
  return result;
};
```

### 栈解法动图了解下~

![栈解法动图](./LeetCode94-2.gif)
