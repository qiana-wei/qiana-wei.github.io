// 模板
// 查找目标值
function searchTarget(nums,target){
    if(!nums || nums.length == 0){
        return -1
    }

    let left = 0;
    let right = nums.length - 1;
    let mid = -1;

    while(left <= right){
        mid = Math.floor(left + (right-left)/2)  //mid向下取整
        if(nums[mid] == target){
            //终止执行while
            break;
        }else if(nums[mid] < target){
            //target在(mid,right],取left = mid+1,在[left,right]之间查找target
            left = mid +1
        }else if(nums[mid]>target){
            //target在[left,mid),取right = mid-1,在[left,right]之间查找target
            right = mid - 1
        }
    }
    return mid
}

//查找重复数组，第一个目标元素

function searchLeftTarget(nums,target){
    if(!nums || nums.length == 0){
        return -1
    }

    let left = 0;
    let right = nums.length - 1;
    let mid = -1;

    while(left < right){
        mid = Math.floor(left + (right-left)/2)  //mid向下取整
        if(nums[mid]==target){
            //第一个target在[left,mid],取right = mid,继续在[left,right]中查找
            right = mid 
        }
        else if(nums[mid] < target){
            //第一个target 在(mid,right],取 left = mid +1,继续在[left,right]中查找
            left = mid + 1
        }else if(nums[mid] > target){
            //第一个target 在[left,mid),取right = mid-1,继续在[left,right]中查找
            right = mid -1
        }
    }
    //当  left == right 时，循环终止
    return mid
}