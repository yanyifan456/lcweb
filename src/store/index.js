import Vue from "vue";
import Vuex from "vuex";

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    breadcrumbHistory: [],
  },
  mutations: {
    ADD_BREADCRUMB(state, route) {
      // 去重逻辑
      const exists = state.breadcrumbHistory.some(
        (item) => item.path === route.path
      );

      if (!exists) {
        state.breadcrumbHistory.push({
          path: route.path,
          fullPath: route.fullPath,
          title: route.meta.title || "未命名页面",
        });
      }
    },
  },
});
