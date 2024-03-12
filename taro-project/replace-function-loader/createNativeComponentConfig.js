function createNativeComponentConfig(Component, react, reactdom, componentConfig) {
  var _a, _b;
  reactMeta.R = react;
  h = react.createElement;
  ReactDOM = reactdom;
  setReconciler(ReactDOM);
  const { isNewBlended } = componentConfig;
  const configs = {
    weapp: {
      options: componentConfig,
      properties: {
        props: {
          type: null,
          value: null,
          observer(_newVal, oldVal) {
            var _a;
            oldVal && ((_a = this.component) === null || _a === void 0 ? void 0 : _a.forceUpdate());
          }
        }
      },
      created() {
        const app = (isNewBlended ? nativeComponentApp : Current.app);
        if (!app) {
          initNativeComponentEntry({
            R: react,
            ReactDOM,
            isDefaultEntryDom: !isNewBlended
          });
        }
      },
      attached() {
        const compId = this.compId = getNativeCompId();
        setCurrent(compId);
        this.config = componentConfig;
        const app = (isNewBlended ? nativeComponentApp : Current.app);
        app.mount(Component, compId, () => this, () => {
          const instance = getPageInstance(compId);
          if (instance && instance.node) {
            const el = document.getElementById(instance.node.uid);
            if (el) {
              el.ctx = this;
            }
          }
        });
      },
      ready() {
        safeExecute(this.compId, 'onReady');
      },
      detached() {
        resetCurrent();
        const app = (isNewBlended ? nativeComponentApp : Current.app);
        app.unmount(this.compId);
      },
      pageLifetimes: {
        show(options) {
          safeExecute(this.compId, 'onShow', options);
        },
        hide() {
          safeExecute(this.compId, 'onHide');
        }
      },
      methods: {
        eh: eventHandler,
        onLoad(options) {
          safeExecute(this.compId, 'onLoad', options);
        },
        onUnload() {
          safeExecute(this.compId, 'onUnload');
        }
      }
    },
    alipay: {
      options: componentConfig,
      deriveDataFromProps(nextProps) {
        this.setData({ props: nextProps });
      },
      onInit() {
        console.log('onInit...');
      },
      lifetimes: {
        // 在组件实例刚刚被创建时执行。
        created() {
          console.log('created...')
          const app = (isNewBlended ? nativeComponentApp : Current.app);
          if (!app) {
            initNativeComponentEntry({
              R: react,
              ReactDOM,
              isDefaultEntryDom: !isNewBlended
            });
          }
        },
        // 在组件实例进入页面节点树时执行。
        attached() {
          const compId = this.compId = getNativeCompId();
          setCurrent(compId);
          this.config = componentConfig;
          const app = (isNewBlended ? nativeComponentApp : Current.app);
          app.mount(Component, compId, () => this, () => {
            const instance = getPageInstance(compId);
            if (instance && instance.node) {
              const el = document.getElementById(instance.node.uid);
              if (el) {
                el.ctx = this;
              }
            }
          });
        },
        // 在组件在视图层布局完成后执行。
        ready() {
          console.log('ready...', this.data);
          safeExecute(this.compId, 'onReady');
        },
        // 在组件实例被移动到节点树另一个位置时执行。
        moved() { },
        // 在组件实例被从页面节点树移除时执行。
        detached() {
          resetCurrent();
          const app = (isNewBlended ? nativeComponentApp : Current.app);
          app.unmount(this.compId);
        },
      },
      pageLifetimes: {
        show(options) {
          safeExecute(this.compId, 'onShow', options);
        },
        hide() {
          safeExecute(this.compId, 'onHide');
        }
      },
      methods: {
        eh: eventHandler,
        onLoad(options) {
          safeExecute(this.compId, 'onLoad', options);
        },
        onUnload() {
          safeExecute(this.compId, 'onUnload');
        }
      }
    }
  }

  const componentObj = configs[process.env.TARO_ENV];

  if (!componentObj) {
    throw new Error(`${process.env.TARO_ENV}不支持`);
  }

  function resetCurrent() {
    // 小程序插件页面卸载之后返回到宿主页面时，需重置Current页面和路由。否则引发插件组件二次加载异常 fix:#11991
    Current.page = null;
    Current.router = null;
  }
  // onShareAppMessage 和 onShareTimeline 一样，会影响小程序右上方按钮的选项，因此不能默认注册。
  if (Component.onShareAppMessage ||
    ((_a = Component.prototype) === null || _a === void 0 ? void 0 : _a.onShareAppMessage) ||
    Component.enableShareAppMessage) {
    componentObj.methods.onShareAppMessage = function (options) {
      const target = options === null || options === void 0 ? void 0 : options.target;
      if (target) {
        const id = target.id;
        const element = document.getElementById(id);
        if (element) {
          target.dataset = element.dataset;
        }
      }
      return safeExecute(this.compId, 'onShareAppMessage', options);
    };
  }
  if (Component.onShareTimeline ||
    ((_b = Component.prototype) === null || _b === void 0 ? void 0 : _b.onShareTimeline) ||
    Component.enableShareTimeline) {
    componentObj.methods.onShareTimeline = function () {
      return safeExecute(this.compId, 'onShareTimeline');
    };
  }
  return componentObj;
}
