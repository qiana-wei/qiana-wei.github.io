---
title: 每日算法-LeetCode1038
date: 2020-09-21 11:24:21
tags: ["算法", "LeetCode", "二叉树", "反向遍历"]
category: "算法"
---

今天做一道**二叉树** **反向遍历**的算法题目。(题目来源，[LeetCode1038](https://leetcode-cn.com/problems/binary-search-tree-to-greater-sum-tree/)与[LeetCode538](https://leetcode-cn.com/problems/convert-bst-to-greater-tree/)相同)

### 题目

**把二叉搜索树转换为累加树**

给定一个二叉搜索树（Binary Search Tree），把它转换成为累加树（Greater Tree)，使得每个节点的值是原来的节点值加上所有大于它的节点值之和。

二叉搜索树：根节点大于左节点，小于右节点

### 思路

1. 采用‘右中左’的反中序遍历，将右子树的值与根节点相加，赋值给根节点
2. 将根节点的值与左节点相加，赋值给左节点

### 题目解答

```js
/**
 * Definition for a binary tree node.
 * function TreeNode(val) {
 *     this.val = val;
 *     this.left = this.right = null;
 * }
 */
/**
 * @param {TreeNode} root
 * @return {TreeNode}
 */

var bstToGst = function (root) {
  let sum = 0;
  travse(root); //递归遍历
  return root; //返回树

  function travse(node) {
    if (!node) {
      //结束递归
      return;
    }

    travse(node.right);

    //将节点与sum值相加，并将sum赋值给节点
    sum = sum + node.val;
    node.val = sum;

    travse(node.left);
  }
};
```

### 动图了解一下

递归过程

![递归过程](./LeetCode1038.gif)
