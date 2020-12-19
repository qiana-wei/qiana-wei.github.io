class Watcher {
  constructor(vm, key, callback) {
    this.vm = vm;
    this.key = key;
    this.callback = callback;

    //将Watcher类添加到Dep类的target属性中
    //触发get方法，将Watcher添加到Dep中
    Dep.target = this
    // 获取之前的值，触发了get方法
    this.oldValue = vm[key];
    // 防止后面重复添加
    Dep.target = null 
  }

  update() {
    let newValue = this.vm[this.key]
    if (newValue == this.oldValue) {
      return
    }
    this.callback(newValue)
  }
}