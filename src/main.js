(function fixPassiveEvents() {
  // 检测浏览器是否支持 passive 选项
  let supportsPassive = false;
  try {
    const opts = Object.defineProperty({}, "passive", {
      get() {
        supportsPassive = true;
      },
    });
    window.addEventListener("testPassive", null, opts);
    window.removeEventListener("testPassive", null, opts);
  } catch (e) {}

  // 重写 addEventListener 方法
  const originalAddEventListener = EventTarget.prototype.addEventListener;

  EventTarget.prototype.addEventListener = function (type, listener, options) {
    const passiveEvents = [
      "touchstart",
      "touchmove",
      "touchend",
      "wheel",
      "mousewheel",
    ];

    if (passiveEvents.includes(type)) {
      const newOptions = supportsPassive
        ? typeof options === "object"
          ? { ...options, passive: true }
          : { passive: true }
        : options;

      return originalAddEventListener.call(this, type, listener, newOptions);
    }

    return originalAddEventListener.call(this, type, listener, options);
  };
})();
import Vue from "vue";
import ElementUI from "element-ui";
import "element-ui/lib/theme-chalk/index.css";
import router from "./router";
import App from "./App.vue";
import "../src/views/Home/components/System/conmpoents/global.js";
Vue.use(ElementUI);

// 检测浏览器是否支持 passive 选项
let supportsPassive = false;
try {
  const opts = Object.defineProperty({}, "passive", {
    get() {
      supportsPassive = true;
    },
  });
  window.addEventListener("testPassive", null, opts);
  window.removeEventListener("testPassive", null, opts);
} catch (e) {}

// 重写 addEventListener 方法
const _addEventListener = EventTarget.prototype.addEventListener;
EventTarget.prototype.addEventListener = function (type, listener, options) {
  if (type === "mousewheel" || type === "wheel") {
    let newOptions = options;
    if (supportsPassive) {
      newOptions =
        typeof options === "object"
          ? { ...options, passive: true }
          : { passive: true };
    }
    _addEventListener.call(this, type, listener, newOptions);
  } else {
    _addEventListener.call(this, type, listener, options);
  }
};

new Vue({
  router,

  render: (h) => h(App),
}).$mount("#app");
