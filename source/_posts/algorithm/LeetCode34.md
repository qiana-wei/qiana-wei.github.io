---
title: 每日算法-LeetCode34
date: 2020-09-15 22:14:59
tags: ['算法','LeetCode','Array','二分查找']
category: "算法"
---

今天做一道**数组** **二分查找**的算法题。（题目来源，[LeetCode34](https://leetcode-cn.com/problems/find-first-and-last-position-of-element-in-sorted-array/)）

### 题目

**在排序数组中查找元素的第一个和最后一个位置**

给定一个按照升序排列的整数数组`nums`,和一个目标值`target`。找出给定目标值在数组中的开始位置和结束位置。

算法的时间复杂度必须是O(logn)级别。

如果数组中不存在目标值，返回[-1,-1]。

### 思路

1. 升序整数数组，且要求时间复杂度为O(logn),则采用**二分法**对数组进行目标值查找
2. 采用防御式编程，数组中不存在时，返回[-1,-1],，若数组长度为0，直接返回[-1,-1];  
3. 若寻找第一个目标值，没有找到，则表明数组中没有目标值，返回[-1,-1]

### 二分法写法

写二分法，

**首先**要明确  **数据查找的范围**  ---  **[left,right]**,包含左右边界。

**然后**要明确，什么时候  **终止查找**   ---   **left== right**时终止查找(当left == right时，要么left对应的值为目标值，要么木有目标值) 或 **找到了目标值**终止查找

**最后**要确定，**中间值**采用向上取整还是向下取整方式选取值，于目标值进行比较 

​	 ---  查找单个值时，采用向下取整或向上取整都可以，只要整个过程都采用这种取整方式既可以。

​			当查找值有重复时，**查找第一个目标值，采用向下取整**，取靠近left的那个。

​										   	**查找最后一个目标值，采用向上取整**，取靠近right的那个。

### 代码示例

```js
// 查找单个目标值
function searchTarget(nums,target){
    if(!nums || nums.length == 0){
        return -1
    }
    let left = 0;
    let right = nums.length - 1;
  
    //当 left == right时，要么找到了，要么没找到，所以，在left == right 时，要终止循环
    while(left < right){
        let mid = Math.floor(left + (right-left)/2)  //mid向下取整(查找单个值，向上取整也可以)
        if(nums[mid] == target){
            //找到目标值，将下标赋值给left，并终止循环
            left = mid
            break;
        }else if(nums[mid] < target){
            //target在(mid,right],取left = mid+1,在[left,right]之间查找target
            left = mid +1
        }else if(nums[mid]>target){
            //target在[left,mid),取right = mid-1,在[left,right]之间查找target
            right = mid - 1
        }
    }
    if(nums[left]== target){
      //若找到目标值，返回下标
        return left
    }else{
      //否则返回 -1
        return -1
    }
}

//查找重复数组，第一个目标元素
function searchLeftTarget(nums,target){
    if(!nums || nums.length == 0){
        return -1
    }
    let left = 0;
    let right = nums.length - 1;

    ///当 left == right时，要么 找到了，要么没找到，所以，left == right 时，要终止循环
    while(left < right){
        let mid = Math.floor(left + (right-left)/2)  //mid向下取整(优先取前面的值)
        if(nums[mid]==target){
            //第一个target在[left,mid],取right = mid,继续在[left,right]中查找
            right = mid 
        }else if(nums[mid] < target){
            //第一个target 在(mid,right],取 left = mid +1,继续在[left,right]中查找
            left = mid + 1
        }else if(nums[mid] > target){
            //第一个target 在[left,mid),取right = mid-1,继续在[left,right]中查找
            right = mid -1
        }
    }
    if(nums[left] == target){
      //找到目标值，返回下标
        return left
    }else{
      //否则，返回-1
        return -1
    }
}


//查找最后一个target
function searchRightTarget(nums,target){
    if(!nums  || nums.length == 0){
        return -1
    }
    let left = 0
    let right = nums.length-1

    //当 left == right时，要么 找到了，要么没找到，所以，left == right 时，要终止循环
    while(left < right){
        let mid = Math.ceil(left + (right-left)/2)  //mid向上取整(优先取后面的值)
        if(nums[mid] == target){
            //最后一个target在[mid,right],取left = mid，继续在[left,right]中查找
            left = mid
        }
        else if(nums[mid] < target){
            //最后一个target在(mid,right]，取left = mid +1,继续在[left,right]中查找
            left = mid + 1
        }
        else if(nums[mid] > target){
            //最后一个target在[left,mid),取right = mid -1,继续在[left,right]中查找
            right = mid - 1
        }
    }
    if(nums[right] == target){
      //找到目标值，返回下标
        return right
    }else{
      //否则返回-1
        return -1
    }
}
```

### 解答题目

```javascript
/**
 * @param {number[]} nums
 * @param {number} target
 * @return {number[]}
 */
var searchRange = function(nums, target) {
    let left = searchLeftTarget(nums,target) //上面代码中，查找第一个目标值的函数
    if(left !== -1){
        let right = searchRightTarget(nums,target)//上面代码中，查找最后一个目标值的函数
        return [left,right]
    }else{
        return [-1,-1]
    }
};
```



​			


