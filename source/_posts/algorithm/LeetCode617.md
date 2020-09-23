---
title: 每日算法-LeetCode617
date: 2020-09-23 18:25:32
tags: ["算法", "LeetCode", "二叉树", "合并二叉树"]
category: "算法"
---

今天做一道**二叉树** **合并二叉树**的算法题目。(题目来源，[LeetCode617](https://leetcode-cn.com/problems/merge-two-binary-trees/)

### 题目

**合并二叉树**

给定两个二叉树，想象当你将它们中的一个覆盖到另一个上时，两个二叉树的一些节点便会重叠。

你需要将他们合并为一个新的二叉树。合并的规则是如果两个节点重叠，那么将他们的值相加作为节点合并后的新值，否则不为  NULL 的节点将直接作为新二叉树的节点

**示例**

```
输入:
	Tree 1                     Tree 2
          1                         2
         / \                       / \
        3   2                     1   3
       /                           \   \
      5                             4   7
输出:
合并后的树:
	     3
	    / \
	   4   5
	  / \   \
	 5   4   7
```

**注意**: 合并必须从两个树的根节点开始。

### 思路

1. 从根节点开始合并---二叉树前序遍历
2. 一棵树为空时，直接返回另一棵树
3. 返回其中一颗树，可以减少再创造一棵树的空间

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
 * @param {TreeNode} root1
 * @param {TreeNode} root2
 * @return {TreeNode}
 */
var mergeTrees = function (root1, root2) {
  if (root1 == null) {
    return root2;
  }
  if (root2 == null) {
    return root1;
  }

  trval(root1, root2);
  return root1;

  function trval(node1, node2) {
    //递归结束条件
    if (!node1 && !node2) {
      return;
    }

    if (node1 && node2) {
      node1.val = node1.val + node2.val; // 计算根节点的和
      if (!node1.left) {
        //如果node1没有左节点，将node2的左节点给node1
        node1.left = node2.left;
        node2.left = null;
      }
      if (!node1.right) {
        //如果node1没有右节点，将node2的右节点给node1
        node1.right = node2.right;
        node2.right = null;
      }
      trval(node1.left, node2.left); //递归左节点
      trval(node1.right, node2.right); //递归右节点
    } else if (!node1) {
      //如果没有node，node2赋值给node1
      node1 = node2;
      trval(node1.left);
      trval(node1.right);
    }
  }
};
```
