class Compiler {
  constructor(vm) {
    this.el = vm.$el
    this.vm = vm
    this.complie(this.el)
  }
  // 编译模板，处理文本节点和元素节点
  complie(el) {
    // this.vm.render(this.el)

    //  获取元素所有子节点(伪数组)
    let childNodes = [...el.childNodes]
    //遍历子节点
    childNodes.forEach(node => {
      //处理节点编译
      if (this.isTextNode(node)) {
        this.compileText(node)
      } else if (this.isElementNode(node)) {
        this.compilElement(node)
      }

      //判断节点是否有子节点，如果有子节点，递归调用节点编译
      if (node.childNodes && node.childNodes.length) {
        this.complie(node)
      }
    })

  }

  //  编译元素节点，处理指令
  compilElement(node) {
    //遍历元素属性
    let attributes = [...node.attributes]
    attributes.forEach(attr => {
      if (this.isDirective(attr.name)) {
        let handleName = attr.name.substr(2)
        let key = attr.value
        this.update(node, key, handleName)
      }

    })
  }

  update(node, key, handleName) {
    let updateFn = this[handleName + 'Updater']
    updateFn && updateFn.call(this,node,this.vm[key],key)

    //创建Watcher对象，当数据改变，更新视图
    new Watcher(this.vm,key,newValue=>{
      updateFn.call(this,node,newValue,key)
    })
  }

  // v-text
  textUpdater(node,value,key) {
    node.textContent = value
  }
  // v-model
  modelUpdater(node, value,key) {
    node.value = value
    //表单元素注册事件，实现数据双向绑定
    node.addEventListener('input',()=>{
      //赋值，触发set，触发响应式机制
      this.vm[key] = node.value
    })
  }

  //编译文本节点，处理差值表达式
  compileText(node) {
    let reg = /\{\{(.+?)\}\}/
    let value = node.textContent
    if (reg.test(value)) {
      let key = RegExp.$1.trim()
      node.textContent = value.replace(reg, this.vm[key])

      //创建Watcher对象，当数据改变，更新视图
      new Watcher(this.vm,key,(newValue)=>{
        //数据变化时，
        node.textContent = newValue
      })
    }
  }

  //判断是否是指令
  isDirective(attrName) {
    return attrName.startsWith('v-') || attrName.startsWith(':')
  }

  //判断是否是元素节点
  isElementNode(node) {
    return node.nodeType === 1
  }

  //判断是否是文本节点
  isTextNode(node) {
    return node.nodeType === 3
  }
}