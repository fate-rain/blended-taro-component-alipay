function createNativeComponentConfig(Component, react, reactdom, componentConfig) {
  function compareVersion(v1, v2) {
    var s1 = v1.split(".");
    var s2 = v2.split(".");
    var len = Math.max(s1.length, s2.length);

    for (let i = 0; i < len; i++) {
      var num1 = parseInt(s1[i] || "0");
      var num2 = parseInt(s2[i] || "0");

      if (num1 > num2) {
        return 1;
      } else if (num1 < num2) {
        return -1;
      }
    }

    return 0;
  }

  var _a, _b;
  reactMeta.R = react;
  h = react.createElement;
  ReactDOM = reactdom;
  setReconciler(ReactDOM);
  const { isNewBlended } = componentConfig;

  function weappConfig() {
    return {
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
    }
  }

  function alipayConfig() {
    // https://opendocs.alipay.com/mini/framework/component-lifecycle?pathHash=9b628e01#%E8%8A%82%E7%82%B9%E6%A0%91%E7%BB%B4%E5%BA%A6%E7%94%9F%E5%91%BD%E5%91%A8%E6%9C%9F%20lifetimes
    const supportLifetimes = compareVersion(my.SDKVersion,'2.8.5') >= 0;

    if (supportLifetimes) {
      return {
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

    return {
      options: componentConfig,
      deriveDataFromProps(nextProps) {
        this.setData({ props: nextProps });
      },
      onInit() {
        console.log('onInit...');
        const app = (isNewBlended ? nativeComponentApp : Current.app);
        if (!app) {
          initNativeComponentEntry({
            R: react,
            ReactDOM,
            isDefaultEntryDom: !isNewBlended
          });
        }
      },
      didMount() {
        console.log('didMount...');

        // attached
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

        // ready
        safeExecute(this.compId, 'onReady');
      },
      didUnmount() {
        console.log('didUnmount...');

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
    }
  }

  const configs = {
    weapp: weappConfig,
    alipay: alipayConfig
  }

  const componentObjFn = configs[process.env.TARO_ENV];

  if (!componentObjFn) {
    throw new Error(`${process.env.TARO_ENV}不支持`);
  }

  const componentObj = configs[process.env.TARO_ENV]();

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
