/**
 * 订阅者
 */

function Watcher(vm, exp, cb) {
  this.cb = cb;
  this.vm = vm;
  this.exp = exp;
  this.value = this.get(); // 将自己添加到订阅期的操作
}

Watcher.prototype = {
  // 更新函数
  update() {
    this.run();
  },
  run() {
    let value = this.vm.data[this.exp];
    let oldVal = this.value;
    if (value !== oldVal) {
      this.value = value;
      this.cb.call(this.vm, value, oldVal)
    }
  },
  get() {
    Dep.target = this; // 缓存自己
    let value = this.vm.data[this.exp]; // 强制执行监听器里的 get 函数
    Dep.target = null; // 释放自己
    return value;
  },
};