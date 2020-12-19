class Observer {
  constructor(data) {
    this.walk(data)
  }

  walk(data) {
    //1. 判断data是否是对象
    if (!data || typeof data !== 'object') {
      return
    }
    //2.若data是对象，遍历data中的所有，调用defineReactive
    for (let key in data) {
      // 若属性值为对象，递归调用
      this.walk(data[key])
      this.defineReactive(data, key, data[key])
    }
  }

  defineReactive(obj, key, value) {
    let _this = this

    //为每一个属性创建一个Dep对象, 负责收集依赖，并发送通知
    let dep = new Dep()

    Object.defineProperty(obj, key, {
      configurable: true,
      enumerable: true,
      get() {
        //判断有无观察者，并添加观察者
        Dep.target && dep.addSub(Dep.target)
        //若使用obj[key]会引发死循环，因为使用obj[key]即会触发get方法
        return value
      },
      set(newValue) {
        if (newValue === value) {
          return
        }
       value = newValue
        //若新赋值的值为对象，对象也应该是响应式的。
       _this.walk(newValue)
        //数据变化时，发送通知
        dep.notify()
      }
    })
  }
}