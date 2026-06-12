import Vue from "vue";
import DialogComponent from "./DialogComponent.vue";
import Dialogdle from "./Dialogdle.vue";

// 全局注册组件
Vue.component("DialogComponent", DialogComponent);
Vue.component("Dialogdle", Dialogdle);

// 按需注册Element组件（示例）
import { Button, Table } from "element-ui";
Vue.use(Button);
Vue.use(Table);

export default {
  install() {
    // 可选的安装逻辑
  },
};
