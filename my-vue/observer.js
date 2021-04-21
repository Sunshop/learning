
/**
 * 完整的 oberser
 * 
 * 相关简写及单词说明：
 * Dep dependence 依赖
 */

// 观察者
function observer(data) {
  if (!data || typeof data !== 'object') {
    return;
  }
  Object.keys(data).forEach((key) => {
    oberverFn(data, key, data[key])
  });
};

function oberverFn(data, key, val) {
  observer(val);
  // 新增订阅
  let dep = new Dep();
  Object.defineProperty(data, key, {
    enumerable: true,
    configurable: true,
    get() {
      // 判断是否需要添加订阅
      if (Dep.target) {
        dep.addSub(Dep.target);
      }
      return val;
    },
    set(newVal) {
      if (val === newVal) {
        return;
      }
      val = newVal;
      // console.log(`属性 ==> ${key}，已被监听，现在的值 ==> ${newVal.toString()}`);
      // 如果数据变化，通知所有订阅者
      dep.notify();
    },
  });
}

// 发布-订阅 模式

// 依赖收集
function Dep() {
  // 依赖容器 -- 订阅
  this.subs = [];
}

Dep.prototype = {
  // 收集依赖
  addSub(sub) {
    this.subs.push(sub);
  },

  // 发布通知
  notify() {
    this.subs.forEach((sub) => {
      sub.update();
    });
  },
};