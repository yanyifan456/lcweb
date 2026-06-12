// src/utils/request.js
import axios from "axios";
import { Message, MessageBox } from "element-ui";
const service = axios.create({
  // timeout: 5000000, // 超时时间
  // baseURL: "",
});

// 请求拦截器
service.interceptors.request.use(
  (config) => {
    // 从 localStorage 获取用户名并添加到请求头
    const userName = sessionStorage.getItem("userName");
    const token = sessionStorage.getItem("token");
    config.headers["Authorization"] = "Bearer " + token;
    if (userName) {
      config.headers["X-User-Name"] = userName;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// 响应拦截器
service.interceptors.response.use(
  (response) => {
    const res = response.data;
    if (res.code === 401) {
      MessageBox.alert("登录已过期，请重新登录", "提示", {
        confirmButtonText: "重新登录",
        callback: () => {
          sessionStorage.clear(); // 清空 token/userName 等信息
          router.push("/login"); // 跳转登录页
        },
      });
      return Promise.reject(new Error("登录过期"));
    }
    if (res.code != 200) {
      Message.error(res.message || res.msg);
    } else {
      return res;
    }
  },
  (error) => {
    console.error("响应错误:", error);
    return Promise.reject(error);
  }
);

export default service;
