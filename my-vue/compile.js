/**
 * 模版简单解析
 */

function Compile(el, vm) {
  this.vm = vm;
  this.el = document.querySelector(el);
  this.fragment = null; // 代码片段及方法
  this.init();
}

Compile.prototype = {
  init() {
    if (this.el) {
      this.fragment = this.nodeToFragment(this.el);
      this.compileElement(this.fragment);
      this.el.appendChild(this.fragment);
    } else {
      console.log('dom元素不存在！');
    }
  },
  nodeToFragment(el) {
    // createdocumentfragment() 方法创建了一虚拟的节点对象，节点对象包含所有属性和方法。
    let fragment = document.createDocumentFragment();
    let child = el.firstChild;
    while (child) {
      // 将Dom元素移入fragment中
      fragment.appendChild(child);
      child = el.firstChild
    }
    return fragment;
  },
  // 解析 模块中的 变量
  compileElement(el) {
    let childNodes = el.childNodes;
    let self = this;
    [...childNodes].forEach((node) => {
      let reg = /\{\{\s*(.*?)\s*\}\}/
      let text = node.textContent;
      if (self.isElementNode(node)) {
        self.compile(node);
      } else if (self.isTextNode(node) && reg.test(text)) {
        // 判断是否符合这种{{}}形式的指令
        self.compileText(node, reg.exec(text)[1])
      }
      // 继续递归便利子节点
      if (node.childNodes && node.childNodes.length) {
        self.compileElement(node);
      }
    });
  },
  // 指令
  compile(node) {
    let nodeAttrs = node.attributes;
    let self = this;
    Array.from(nodeAttrs).forEach(function(attr) {
      let attrName = attr.name;
      if (self.isDirective(attrName)) {
        let exp = attr.value;
        let dir = attrName.substring(2);
        if (self.isEventDirective(dir)) {
          // 事件指令
          self.compileEvent(node, self.vm, exp, dir);
        } else {
          // v-model 指令
          self.compileModel(node, self.vm, exp, dir);
        }
        node.removeAttribute(attrName);
      }
    });
  },
  // 收集模版参数 并 订阅
  compileText(node, exp) {
    let self = this;
    let initText = this.vm[exp];
    this.updataText(node, initText); // 将初始化的数据初始化到视图中
    new Watcher(this.vm, exp, function(value) {
      self.updataText(node, value)
    })
  },
  // 事件指令
  compileEvent(node, vm, exp, dir) {
    let eventType = dir.split(':')[1];
    let cb = vm.methods && vm.methods[exp];

    if (eventType && cb) {
      node.addEventListener(eventType, cb.bind(vm), false);
    }
  },
  // v-model
  compileModel(node, vm, exp, dir) {
    let self = this;
    let val = this.vm[exp];
    this.modelUpdater(node, val);
    new Watcher(this.vm, exp, function (value) {
      self.modelUpdater(node, value);
    });
    node.addEventListener('input', function(e) {
      let newValue = e.target.value;
        if (val === newValue) return;
        self.vm[exp] = newValue;
        val = newValue;
    });
  },
  // 更新视图
  updataText(node, value) {
    node.textContent = typeof value == 'undefined' ? '' : value;
  },
  // v-model 更新
  modelUpdater: function(node, value, oldValue) {
    node.value = typeof value == 'undefined' ? '' : value;
  },
  // 是否为指令
  isDirective: function(attr) {
    return attr.indexOf('v-') == 0;
  },
  // 绑定监听方法
  isEventDirective: function(dir) {
    return dir.indexOf('on:') === 0;
  },
  isElementNode: function (node) {
    return node.nodeType == 1;
  },
  isTextNode(node) {
    return node.nodeType == 3;
  },
};
