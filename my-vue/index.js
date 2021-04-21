/**
 * my-vue 构造
 */

function myVue(options) {
  let self = this;
  
  this.vm = this;
  this.data = options.data; // 修改
  this.methods = options.methods; // 注册 methods

  // 让访问 myVue 的属性代理为访问 myVue.data的属性
  Object.keys(this.data).forEach(function(key) {
    self.proxyKeys(key);  // 绑定代理属性
  });

  observer(this.data);
  new Compile(options.el, this.vm);
  options.mounted.call(this);
  return this;
}

myVue.prototype = {
  proxyKeys(key) {
    let self = this;
    Object.defineProperty(this, key, {
      enumerable: false,
      configurable: true,
      get: function proxyGetter() {
        return self.data[key];
      },
      set: function proxySetter(newVal) {
          self.data[key] = newVal;
      }
    })
  }
};
