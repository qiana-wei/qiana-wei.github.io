---
title: 手写Promise
date: 2020-11-09 16:32:59
tags: ['JS','Promise']
category: 'JS'
---

理解Promise原理，手写一个MyPromise。

# 核心功能

## 根据Promise，推断MyPromise

```js
new Promise((resolve,reject)=>{
  if(xxx){
    resolve('resolve')
  }else{
    reject('reject')
  }
}).then(res=>{
  //resolve后继续处理
},error=>{
  //上一个Promise  reject或出错后处理
}).catch(error=>{
  //reject或出错后处理
})
```

根据上述代码，我们可以推断

1. Promise是一个类，使用类时需要传递一个执行器，并且执行器立即执行

```js
//MyPromis.js
class MyPromise{
  constructor(exector){
    exector(this.resolve,this.reject)
  }
}
```

2. Promise有三种状态：等待（pending）、成功（fulfilled）、失败（rejected）

   状态变化: pending --> fulfilled.    

   ​				 pending --> rejected

   默认状态为pending

```js
//MyPromise.js
//状态
const  FULFILLED ='fulfilled';
const  REJECTED ='rejected';
const  PENDING ='pending';

//MyPromis.js
class MyPromise{
  constructor(exector){
    exector(this.resolve,this.reject)
  }
  status = PENDING;
}
```

3. resolve,reject是用来更改状态的

   resolve   --> fulfilled

   reject ---> rejected

   状态一旦变化，便不可更改

```js
//MyPromise.js
//状态
const  FULFILLED ='fulfilled';
const  REJECTED ='rejected';
const  PENDING ='pending';

//MyPromis.js
class MyPromise{
  constructor(exector){
    exector(this.resolve,this.reject)
  }
  status = PENDING;
	resolve = (value)=>{
    //如果状态不为pending，阻止向下执行
    if(this.status !== PENDING){
        return;
    }
    //修改状态为成功
    this.status = FULFILLED
  }
  reject = (reason)=>{
    //如果状态不为pending，阻止向下执行
    if(this.status !== PENDING){
        return;
    }
    //修改状态为成功
    this.status = REJECTED
  }
}
```

4. then方法内部判断状态，若状态为成功，调用成功对应的回调函数，若状态为失败，调用失败对应的回调函数。

   then方法应该是被定义在原型对象中的。

```js
//MyPromise.js
//状态
const  FULFILLED ='fulfilled';
const  REJECTED ='rejected';
const  PENDING ='pending';

//MyPromis.js
class MyPromise{
  constructor(exector){
    exector(this.resolve,this.reject)
  }
  status = PENDING;

	resolve = (value)=>{
    //如果状态不为pending，阻止向下执行
    if(this.status !== PENDING){
        return;
    }
    //修改状态为成功
    this.status = FULFILLED
  }
  
  reject = (reason)=>{
    //如果状态不为pending，阻止向下执行
    if(this.status !== PENDING){
        return;
    }
    //修改状态为成功
    this.status = REJECTED
  }
  
  then(successCallback,failCallback){
    //判断状态，执行对应回调
    if(this.status === FULFILLED){
        successCallback(this.value)
    }else if(this.status === REJECTED){
        failCallback(this.reason)
    }else{
      //pending 状态处理
    }
  }
}

```

5. then成功回调有一个参数，表示成功之后值。失败回调有一个参数，表示失败之后的原因。

   在resolve和reject中存储值和原因，便于在then方法中使用，所以要在实例中定义变量。

```js
//初步Promise
//MyPromise.js
//状态
const  FULFILLED='fulfilled';
const  REJECTED='rejected';
const  PENDING='pending';

class MyPromise{
  //立即执行执行器
  constructor(executor){
      executor(this.resolve,this.reject)
  }
  //默认状态为pending
  status = PENDING;
  //成功后的值
  value=undefined
  //失败之后的原因
  reason= undefined

  resolve = (value)=>{
    //如果状态不为pending，阻止向下执行
    if(this.status !== PENDING){
        return;
    }
    //修改状态为成功
    this.status = FULFILLED

    //保存成功之后的值，为了在then方法中使用
    this.value = value
  }
  reject = (reason)=>{
    //如果状态不为pending，阻止向下执行
    if(this.status !== PENDING){
        return;
    }
    //修改状态为失败
    this.status = REJECTED

    //保存成功之后的值，为了在then方法中使用
    this.reason = reason
  }

  then(successCallback,failCallback){
    //判断状态，执行对应回调
    if(this.status === FULFILLED){
        successCallback(this.value)
    }else if(this.status === REJECTED){
        failCallback(this.reason)
    }else{
      //pending 状态处理
    }
  }
}

module.exports = MyPromise
```

**测试代码**

```js
//	test.js
const myPromise = require('./myPromise')

new myPromise((resolve,reject)=>{
    resolve('success')
    reject('reason')
}).then(res=>{
    console.log(res)
},error=>{
    console.log(error)
})

//正常打印‘success’
```

## 实现MyPromise异步

Promise中，then方法是在执行器执行完毕之后执行的。但前面我们的基本原理代码，在执行器中有异步函数时，then方法中状态处于pending状态，需要进行特殊处理。

then方法中需要将成功回调和失败回调存储起来，便于状态发生变化时调用。

```js
//MyPromise.js
//状态
const  FULFILLED='fulfilled';
const  REJECTED='rejected';
const  PENDING='pending';

class MyPromise{
  //立即执行执行器
  constructor(executor){
      executor(this.resolve,this.reject)
  }
  //默认状态为pending
  status = PENDING;
  //成功后的值
  value=undefined
  //失败之后的原因
  reason= undefined

  //成功回调
  successCallback = undefined

  //失败回调
  failCallback = undefined

  resolve = (value)=>{
    //如果状态不为pending，阻止向下执行
    if(this.status !== PENDING){
        return;
    }
    //修改状态为成功
    this.status = FULFILLED

    //保存成功之后的值，为了在then方法中使用
    this.value = value

    //处理异步情况，如果成功回调存在，调用成功回调
    this.successCallback && this.successCallback(value)
  }
  reject = (reason)=>{
    //如果状态不为pending，阻止向下执行
    if(this.status !== PENDING){
        return;
    }
    //修改状态为失败
    this.status = REJECTED

    //保存成功之后的值，为了在then方法中使用
    this.reason = reason

    //处理异步情况，如果成功回调存在，调用成功回调
    this.failCallback && this.failCallback(reason)
  }

  then(successCallback,failCallback){
    //判断状态，执行对应回调
    if(this.status === FULFILLED){
        successCallback(this.value)
    }else if(this.status === REJECTED){
        failCallback(this.reason)
    }else{
      //pending状态，将回调函数存储起来，方便在resolve或reject执行后调用
      this.successCallback = successCallback
      this.failCallback = failCallback
    }
  }
}

module.exports = MyPromise
```

**测试代码**

```js
//test.js
const myPromise = require('./myPromise')

new myPromise((resolve,reject)=>{
    setTimeout(()=>{
        resolve('success')
        reject('reason')
    },2000)
}).then(res=>{
    console.log(res)
},error=>{
    console.log(error)
})
//2s后输出‘success’
```

## then方法多次调用

当then方法被多次调用的时候，每个then方法都要分别执行。

**同步时**直接依次盗用then方法中对应的回调函数

**异步时**，依次存储then方法中的回调函数，然后在状态发生变化时调用。

成功回调和失败回调的函数存储在数组中，then方法中，状态为status时，push回调函数到数组中，在resolve和reject执行时，再执行回调函数。

```js
//MyPromise.js
//状态
const  FULFILLED='fulfilled';
const  REJECTED='rejected';
const  PENDING='pending';

class MyPromise{
  //立即执行执行器
  constructor(executor){
      executor(this.resolve,this.reject)
  }
  //默认状态为pending
  status = PENDING;
  //成功后的值
  value=undefined
  //失败之后的原因
  reason= undefined

  //成功回调函数，存储在数组中，方便依次调用
  successCallback = []

  //失败回调函数，存储在数组中，方便依次调用
  failCallback = []

  resolve = (value)=>{
    //如果状态不为pending，阻止向下执行
    if(this.status !== PENDING){
        return;
    }
    //修改状态为成功
    this.status = FULFILLED

    //保存成功之后的值，为了在then方法中使用
    this.value = value

    //处理异步情况，如果成功回调存在，调用成功回调
    while(this.successCallback.length){
      this.successCallback.shift()(value)
    }
  }
  reject = (reason)=>{
    //如果状态不为pending，阻止向下执行
    if(this.status !== PENDING){
        return;
    }
    //修改状态为失败
    this.status = REJECTED

    //保存成功之后的值，为了在then方法中使用
    this.reason = reason

    //处理异步情况，如果成功回调存在，调用成功回调
    while(this.successCallback.length){
      this.successCallback.shift()(reason)
    }
  }

  then(successCallback,failCallback){
    //判断状态，执行对应回调
    if(this.status === FULFILLED){
        successCallback(this.value)
    }else if(this.status === REJECTED){
        failCallback(this.reason)
    }else{
      //pending状态，将回调函数存储起来，方便在resolve或reject执行后调用
      this.successCallback.push(successCallback)
      this.failCallback.push(failCallback)
    }
  }
}

module.exports = MyPromise
```

**测试代码**

```js
//test.js
const myPromise = require('./myPromise')
let promise = new myPromise((resolve,reject)=>{
    setTimeout(()=>{
        resolve('success')
        reject('reason')
    },2000)
})
promise.then(res=>{
    console.log(res)
},error=>{
    console.log(error)
})
promise.then(res=>{
    console.log(res)
},error=>{
    console.log(error)
})
```

## then方法链式调用

then方法链式调用，下一个then会接收上一个then方法的返回值。

而then方法是promise类中的方法，所以，then方法的返回值是Promise。

```js
//MyPromise.js
class MyPromise{
  //...省略前面代码
  then(succcessCallBack,failCallback){
    return new MyPromise((resolve,reject)=>{

    })
  }
  //...省略后面代码
}

```

then方法中，下一个then方法可以拿到上一个then方法中回调函数执行的值，故而，需要在上一个then方法中执行resolve或reject方法，并将回调函数的结果传递给下一个then方法。

```js
//MyPromise.js

class MyPromise{
  //...省略前面代码
  then(successCallback,failCallback){
    //实际下一个then方法执行的是这里的MyPromise的then方法
    return new MyPromise((resolve,reject)=>{
      //前一个promise的状态判断，
      if(this.status == FULFILLED){
        //若状态为fulfilled，执行成功回调，并将返回结果传给后一个then方法的Promise，执行resolve
        let x = successCallback(this.value)
        resolve(x)
      }else if(this.status == REJECTED){
        //若状态为rejected，执行失败回调，并将返回结果传给后一个then方法的Promise，执行rejected
        let reason = failCallback(this.reason)
        reject(reason)
      }else{
        this.successCallback.push(successCallback)
        this.failCallback.push(failCallback)
      }
    })
  }
  //...省略后面代码
}

```

**但是**若回调函数的返回值为Promise对象，则需要拿到promise对象的的返回值。

```js
//MyPromise.js
class MyPromise{
  //...省略前面代码
  resove = (value)=>{
    if(this.status !== PENDING){
      return
    }
    this.status = FULFILLED
    this.value = value
    while(this.successCallback.length){
      //调用then方法中存储的，用于处理回调函数的函数
      this.successCallback.shift()()
    }
  }
  
  reject = (reason)=>{
    if(this.status !== PENDING){
      return
    }
    this.status = REJECTED
    this.reason = reason
    while(this.failCallback.length){
      //调用then方法中存储的，用于处理回调函数的函数
      this.failCallback.shift()()
    }
  }
  
  then(successCallback,failCallback){
    //实际下一个then方法执行的是这里的MyPromise的then方法
    return new MyPromise((resolve,reject)=>{
      //前一个promise的状态判断，
      if(this.status == FULFILLED){
        //若状态为fulfilled，执行成功回调，并将返回结果传给后一个then方法的Promise，执行resolve
        let x = successCallback(this.value)
        //若x为普通值，调用reslove(x),返回值
        //若x为Promise对象，需要执行Promise对象内的函数，需要将Promise对象的结果传递给后面的then方法。
        if(x instanceof MyPromise){
          x.then(value=>resolve(value),reason=>reject(reason))
        }else{
          resolve(x)
        }
      }else if(this.status == REJECTED){
        //若状态为rejected，执行失败回调，并将返回结果传给后一个then方法的Promise，执行rejected
        let x = failCallback(this.reason)
        //若x为普通值，调用reject(x),返回值
        //若x为Promise对象，需要执行Promise对象内的函数，需要将Promise对象的结果传递给后面的then方法。
        if(x instanceof MyPromise){
          x.then(value=>resolve(value),reason=>reject(reason))
        }else{
          reject(x)
        }
      }else{
        //pengding状态，需要存储一个函数，函数内处理成功或失败回调，便于在resolve或reject方法中使用
        this.successCallback.push(()=>{
          let x = successCallback(this.value)
          if(x instanceof MyPromise){
            x.then(value=>resolve(value),reason=>reject(reason))
          }else{
            resolve(x)
          }
        })
        this.failCallback.push(()=>{
          let x = failCallback(this.reason)
          if(x instanceof MyPromise){
            x.then(value=>resolve(value),reason=>reject(reason))
          }else{
            reject(x)
          }
        })
      }
    })
	}
  //...省略后面代码
}

```

**进一步优化，提取resolvePromise**

```js
//MyPromise.js
class MyPromise{
  //...省略前面代码
  resove = (value)=>{
    if(this.status !== PENDING){
      return
    }
    this.status = FULFILLED
    this.value = value
    while(this.successCallback.length){
      //调用then方法中存储的，用于处理回调函数的函数
      this.successCallback.shift()()
    }
  }
  
  reject = (reason)=>{
    if(this.status !== PENDING){
      return
    }
    this.status = REJECTED
    this.reason = reason
    while(this.failCallback.length){
      //调用then方法中存储的，用于处理回调函数的函数
      this.failCallback.shift()()
    }
  }
  
  then(successCallback,failCallback){
    //实际下一个then方法执行的是这里的MyPromise的then方法
    return new MyPromise((resolve,reject)=>{
      //前一个promise的状态判断，
      if(this.status == FULFILLED){
        //若状态为fulfilled，执行成功回调，并将返回结果传给后一个then方法的Promise，执行resolve
        let x = successCallback(this.value)
        resolvePromise(x,resolve,reject)
      }else if(this.status == REJECTED){
        //若状态为rejected，执行失败回调，并将返回结果传给后一个then方法的Promise，执行rejected
        let x = failCallback(this.reason)
        resolvePromise(x,resolve,reject)
      }else{
        //pengding状态，需要存储一个函数，函数内处理成功或失败回调，便于在resolve或reject方法中使用
        this.successCallback.push(()=>{
          let x = successCallback(this.value)
          resolvePromise(x,resolve,reject)
        })
        this.failCallback.push(()=>{
          let x = failCallback(this.reason)
          resolvePromise(x,resolve,reject)
        })
      }
    })
	}
  //...省略后面代码
}


function resolvePromise(x,resolve,reject){
  //若x为普通值，调用reslove(x),返回值
  //若x为Promise对象，则需要执行Promise对象内的函数，则需要将Promise对象的结果传递给后面的then方法。
  if(x instanceof MyPromise){
    x.then(value=>resolve(value),reason=>reject(reason))
  }else{
    resolve(x)
  }
}
```

**测试代码**

```js
//test.js
const MyPromise = require('./myPromise')

let promise = new MyPromise((resolve,reject)=>{
  resolve('success')
  reject('reason')
})

function other(){
    return new MyPromise((resolve,reject)=>{
        resolve('other')
    })
}

promise.then(res=>{
    console.log(res)
    return other();
},error=>{
    console.log(error)
}).then(res=>{
    console.log(res)
},error=>{
    console.log(error)
})
```

## then方法参数为可选参数

在实际使用Promise的时候，会有这种情况

```js
//promise
let promise = new Promise((resolve,reject)=>{
  resolve('成功')
})
promise.then().then().then(res=>{
  console.log(res)
})
```

这个时候，前两then方法中没有回调函数的参数，但是，promise的fulfilled状态是一值保持到有回调函数参数的then方法中执行回调的，所以我们需要将promise的状态一只传递给后面的then方法

相当于

```js
//promise
let promise = new Promise((resolve,reject)=>{
  resolve('成功')
})
promise.then(res=>res)
  			.then(res=>res)
  			.then(res=>{
          console.log(res)
        })
```

因此，我们只需要在then方法中补充一个函数就可以了

```js
//MyPromise.js
class MyPromise{
  //...省略前面代码
  then(successCallback,failCallback){
    successCallback = successCallback ? successCallback : value => value   
    failCallback = failCallback ? failCallback : reason => {throw reason}
    //...
  }
  //...省略后面代码
}
```

## 处理自己返回自己的异常

```js
//异常情况：Promise的then的返回值为 返回Promise本身
//test.js
let promise = new Promise((resolve,reject)=>{
        resolve('success')
        reject('reason')
})
let p1 = promise.then(value=>{
    console.log(value)
    return p1;
})

p1.then(value=>{
    console.log(value)
},reason=>{
    console.log(reason)
})

//success
//TypeError: Chaining cycle detected for promise #<Promise>
```

```js
//MyPromise.js
class MyPromise{
  //...省略前面代码
  then(successCallback,failCallback){
    //实际下一个then方法执行的是这里的MyPromise的then方法
    let promise2 =  new MyPromise((resolve,reject)=>{
      //前一个promise的状态判断，
      if(this.status == FULFILLED){
        //设置异步，确保promise2在使用时已经定义存在
        setTimeout(()=>{
          //若状态为fulfilled，执行成功回调，并将返回结果传给后一个then方法的Promise，执行resolve
          let x = successCallback(this.value)
          resolvePromise(promise2,x,resolve,reject)
        },0)
      }else if(this.status == REJECTED){
        //设置异步，确保promise2在使用时已经定义存在
        setTimeout(()=>{
          //若状态为rejected，执行失败回调，并将返回结果传给后一个then方法的Promise，执行rejected
          let x = failCallback(this.reason)
          resolvePromise(promise2,x,resolve,reject)
        },0)
        
      }else{
        //pengding状态，需要存储一个函数，函数内处理成功或失败回调，便于在resolve或reject方法中使用
        this.successCallback.push(()=>{
          setTimeout(()=>{
            let x = successCallback(this.value)
          	resolvePromise(promise2,x,resolve,reject)
          },0)
        })
        this.failCallback.push(()=>{
          //设置异步，确保promise2在使用时已经定义存在
          setTimeout(()=>{
            let x = failCallback(this.reason)
          	resolvePromise(promise2,x,resolve,reject)
          },0)
        })
      }
    })
    return promise2
	}
  //...省略后面代码
}

function resolvePromise(promise2,x,resolve,reject){
  if(promise2===x){
    return reject(new TypeError('Chaining cycle detected for promise #<Promise>'))
  }
  if(x instanceof MyPromise){
    //x为Promise对象
    x.then(value=>resolve(value),reason=>reject(reason))
  }else{
    //普通值
    resolve(x)
  }
}
```

**测试代码**

```js
//test.js
const MyPromise = require('./myPromise')

let promise = new MyPromise((resolve,reject)=>{
        resolve('success')
        reject('reason')
})
let p1 = promise.then(value=>{
    console.log(value)
    return p1;
})

p1.then(value=>{
    console.log(value)
},reason=>{
    console.log(reason)
})
```

## 异常处理

1. Promise执行器中异常捕获抛出

```js
//MyPromise.js
//立即执行执行器,并捕获抛出异常
class MyPromise{
  constructor(executor){
    try{
      executor(this.resolve,this.reject)
    }catch(e){
      //若有异常，直接执行reject，抛出异常原因
      this.reject(e)
    }
  }
  //...省略后面代码
}

```

**测试代码**

```js
//test.js
const MyPromise = require('./myPromise')

let promise = new MyPromise((resolve,reject)=>{
    throw new Error('execuor error')
})
promise.then(value=>{
    console.log(value)
},reason=>{
    console.log(reason.message)
})
//输出'execuor error'
```

2. then方法中的回调函数在执行过程中发生错误，在下一个then方法中要将异常捕获抛出

```js
//MyPromise.js
//MyPromise.js
class MyPromise{
  //...省略前面代码
  then(successCallback,failCallback){
    //实际下一个then方法执行的是这里的MyPromise的then方法
    let promise2 =  new MyPromise((resolve,reject)=>{
      //前一个promise的状态判断，
      if(this.status == FULFILLED){
        //设置异步，确保promise2在使用时已经定义存在
        setTimeout(()=>{
          //捕获抛出异常
          try{
            //若状态为fulfilled，执行成功回调，并将返回结果传给后一个then方法的Promise，执行resolve
            let x = successCallback(this.value)
            resolvePromise(promise2,x,resolve,reject)
          }catch(e){
            reject(e)
          }
          
        },0)
      }else if(this.status == REJECTED){
        //设置异步，确保promise2在使用时已经定义存在
        setTimeout(()=>{
          //捕获抛出异常
          try{
            //若状态为rejected，执行失败回调，并将返回结果传给后一个then方法的Promise，执行rejected
            let x = failCallback(this.reason)
            resolvePromise(promise2,x,resolve,reject)
          }catch(e){
            reject(e)
          }
        },0)
        
      }else{
        //pengding状态，需要存储一个函数，函数内处理成功或失败回调，便于在resolve或reject方法中使用
        this.successCallback.push(()=>{
          setTimeout(()=>{
            //捕获抛出异常
            try{
              let x = successCallback(this.value)
              resolvePromise(promise2,x,resolve,reject)
            }catch(e){
              reject(e)
            }
          },0)
        })
        this.failCallback.push(()=>{
          //设置异步，确保promise2在使用时已经定义存在
          setTimeout(()=>{
            //捕获抛出异常
            try{
              let x = failCallback(this.reason)
              resolvePromise(promise2,x,resolve,reject)
            }catch(e){
              reject(e)
            }
          },0)
        })
      }
    })
    return promise2
	}
  //...省略后面代码
}
```

**测试代码**

```js
//test.js
const MyPromise = require('./myPromise')

let promise = new MyPromise((resolve,reject)=>{
    resolve('成功')
})
promise.then(value=>{
    console.log(value)
    throw new Error('then error')
},reason=>{
    console.log(reason.message)
}).then(value=>{
    console.log(value)
},reason=>{
    console.log(reason.message)
})
//输出'成功'
//输出‘then error’
```

# 核心功能代码汇总

```js
//状态
const FULFILLED = 'fulfilled';
const REJECTED = 'rejected';
const PENDING = 'pending';

class MyPromise{
  //立即执行器
  constructor(executor){
    //异常捕获抛出
    try{
      executor(this.resolve,this.reject)
    }catch(e){
      this.reject(e)
    }
  }
  //默认状态
  status = PENDING;
  //记录value及reason便于在then方法中使用
	value = undefined;
	reason = undefined;
  //成功、失败回调函数记录，数组是为了then方法的链式连续调用
	successCallback = [];
	failCallback = [];
/**
 * resolve函数
 * 1. 状态只能有pending转变为fulfilled
 * 2.修改状态为fulfilled
 * 3.记录value值
 * 4.异步代码调用resolve时，执行存储起来的then方法中的成功回调函数
*/
	resolve = (value)=>{
    if(this.status !== PENDING){
      return
    }
    this.status = FULFILLED;
    this.value = value;
    
    while(this.successCallback.length){
      this.successCallback.shift()()
    }
  }
/**
 * reject
 * 1. 状态只能有pending转变为rejected
 * 2.修改状态为rejected
 * 3.记录reason值
 * 4.异步代码调用reject时，执行存储起来的then方法中的失败回调函数
*/
  reject = (reason)=>{
    if(this.status !== PENDING){
      return
    }
    this.status = REJECTED;
    this.reason = reason;
    
    while(this.failCallback.length){
      this.failCallback.shift()()
    }
  }

/**
 * then方法
 * 1.为了then链式调用，返回Promise对象
 * 2.根据status的状态值，处理成功回调函数及失败回调函数
 *   若状态值为pending，则存储处理成功回调的函数及处理失败回调的函数
 * 3.若回调函数返回的值为普通值，则执行resolve，将返回值传递够后续then方法
 *  若回调函数的返回值为Promise，则进一步执行改Promise的then方法，并执行then方法中的成功或失败回调函数，得到普通值，返回给续后then方法使用
 * 4.若回调函数执行过程中出现异常，则抛出异常
 * 5.为了避免then方法返回其Promise本身，即then方法回调函数的返回值即then方法的返回值，需采用异步方法，判断回调函数返回值是否与then方法返回的Promise相等。
 * 6.then方法没有传递成功回调或失败回调的时候，将Promise的状态原样传递
 * @param {*} successCallback 成功回调
 * @param {*} failCallback 失败回调
 */
  
  then(successCallback,failCallback){
    //若存在回调函数，则使用原有函数，否则补一个函数
    successCallback  =  successCallback ? successCallback : value=>value
    failCallback  =  failCallback ? failCallback : reason=>{throw reason}
    let promise2 = new MyPromise((resolve,reject)=>{
      if(this.status == FULFILLED){
        //成功
        setTimeout(()=>{
          try{
            let x= successCallback(this.value)
            resolvePromise(promise2,x,resolve,reject)
          }catch(e){
            reject(e)
          }
        },0)
        
      }else if(this.status == REJECTED){
        //失败
        setTimeout(()=>{
          try{
            let x= failCallback(this.reason)
            resolvePromise(promise2,x,resolve,reject)
          }catch(e){
            reject(e)
          }
        },0)
      }else{
        //successCallback push 函数，函数内处理成功回调
        this.successCallback.push(()=>{
          setTimeout(()=>{
            try{
							let x= successCallback(this.value)
            	resolvePromise(promise2,x,resolve,reject)
            }catch(e){
              reject(e)
            }
          },0)
        })
      //failCallback push 函数，函数内处理失败回调
      this.failCallback.push(()=>{
          setTimeout(()=>{
            try{
							let x= failCallback(this.reason)
            	resolvePromise(promise2,x,resolve,reject)
            }catch(e){
              reject(e)
            }
          },0)
        })
      }
    })
    return promise2
  }
}

/**
 * 
 * @param {*} promise2 then方法返回的promise对象
 * @param {*} x 回调函数返回值
 * @param {*} resolve promise2的resolve方法
 * @param {*} reject promise2的reject方法
 */
function resolvePromise(promise2,x,resolve,reject){
  if(promise2 === x){
   return reject(new TypeError('Chaining cycle detected for promise #<Promise>'))
  }
  
  if(x instanceof MyPromise){
    x.then((value)=>resolve(value),(reason)=>reject(reason))
  }else{
    resolve(x)
  }
}

module.exports = MyPromise
```

**测试代码**

```js
//test.js
const MyPromise = require('./myPromise')

let promise = new MyPromise((resolve,reject)=>{
    setTimeout(()=>{
        // resolve('success')
        reject('fail')
    },2000)
})
promise.then().then().then(value=>{
    console.log(value)
    return new MyPromise((resolve,reject)=>{
        reject('resolve')
    })
},reason=>{
    console.log(reason)
    return new MyPromise((resolve,reject)=>{
        reject('reject')
    })
}).then(value=>{
    console.log(value)
},reason=>{
    console.log(reason)
})
```

# 其他方法

## all方法

all方法是用来解决异步并发问题的，它允许我们按照异步代码调用的顺序得到异步代码执行的结果。

接收一个数组作为参数，数组中可以是普通值和Promise对象，数组中值得顺序即为得到的结果的顺序。

返回值是一个Promise对象，可以链式调用then方法。

若all的参数中，所有Promise对象的结果都是成功的，则all结果也是成功的。

若all的参数中，有Promise对象的结果是失败的，则all结果也是失败的。

```js
//例子
function p1(){
  return new Promise((resolve,reject)=>{
    setTimeout(()=>{
      resolve('p1')
    },2000)
  })
}
function p2(){
  return new Promise((resolve,reject)=>{
    resolve('p2')
  })
}
Promise.all(['a','b',p1(),p2(),'c'])
	.then(res=>{
  console.log(res)
})
//['a','b','p1','p2','c']
```

```js
//MyPromise.js
class MyPromise{
  //...省略前面代码
  static all(array){
    //结果数组
    let result = []
    //用于标记所有参数执行完成
    let index = 0
    return new MyPromise((resolve,reject)=>{
      //存储result
      function addData(key,value){
        result[key] = value
        //每处理完一个参数，index++
        index++;
        //所有参数处理完成后，index的数值与数组长度一致
        if(index === array.length){
          resolve(result)
        }
      }
      for(let i = 0; i<array.length;i++){
        let current = array[i]
        if(current instanceof MyPromise){
          //promise 对象
          current.then(value=>{
            addData(i,value)
          },reason=>{
            //有一个失败即失败
            reject(reason)
          })
        }else{
          //普通值
          addData(i,current)
        }
      }
    })
  }
  //...省略后面代码
}
```

**测试代码**

```js
//test.js
const MyPromise = require('./myPromise')

function p1(){
return new MyPromise((resolve,reject)=>{
    setTimeout(()=>{
    resolve('p1')
    },2000)
})
}
function p2(){
return new MyPromise((resolve,reject)=>{
    resolve('p2')
})
}
MyPromise.all(['a','b',p1(),p2(),'c'])
    .then(res=>{
        console.log(res)
    })
//['a','b','p1','p2','c']
```

## resolve方法

将给定的值转换为Promise对象。所以，resolve方法的返回值是一个Promise对象。

```js
//例子
function p1(){
  return new Promise((resolve,reject)=>{
    resolve('hello')
  })
}
Promise.resolve(10).then(res=>{
  console.log(res)
})
Promise.resolve(p1()).then(res=>{
  console.log(res)
})
```

```js
//MyPromise.js
class MyPromise{
  //...省略前面代码
  static resolve(value){
    if(value instanceof MyPromise){
      return value
    }else{
      return new MyPromise(resolve=>{
        resolve(value)
      })
    }
  }
  //...省略后面代码
}
```

## finally方法

无论当前Promise对象最终的状态是成功的还是失败的，finally方法中的函数都会被执行一次。

```js
//MyPromise.js
class MyPromise{
  //...省略前面代码
  finally(callback){
    //then 方法中的成功或失败都要执行回调函数
    return this.then((value)=>{
      //处理callback中有异步的情况，将callback的返回值处理为Promise
      //等待Promise执行完成之后，才处理then方法中的内容
      return MyPromise.resolve(callback()).then(()=>value)
    },(reason)=>{
      return MyPromise.resolve(callback()).then(()=>{throw reason})
    })
  }
  //...省略后面代码
}
```

## catch方法

用来处理Promise对象失败的情况

```js
//MyPromise.js
class MyPromise{
  //...省略前面代码
  catch(failCallback){
    return this.then(undefined,failCallback)
  }
  //...省略后面代码
}
```

