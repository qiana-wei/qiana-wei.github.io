class Vue {
  constructor(options) {
    //1.通过属性保存参数数据
    this.$options = options || {}
    this.$data = options.data || {}  //$data中的数据才是真正用来监听，实现响应式的数据
    this.$el = typeof options.el === 'string' ? document.querySelector(options.el) : options.el

    //2.将data数据转换为getter/setter，注入到data实例中,方便调用
    this._proxyData(this.$data)

    //3.调用observe对象，监听数据变化
    new Observer(this.$data)

    //4.调用compiler对象，解析指令和差值表达式
    new Compiler(this)
  }

  //代理数据，代理data中的属性
  _proxyData(data) {
    // 遍历data中的所有属性，将data数据注入到vue实例中
    for (let key in data) {
      Object.defineProperty(this, key, {
        configurable: true,
        enumerable: true,
        get() {
          return data[key]
        },
        set(newValue) {
          if (newValue === data[key]) {
            return
          }
          data[key] = newValue
        }
      })
    }
  }
}