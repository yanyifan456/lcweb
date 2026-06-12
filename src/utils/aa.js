// src/utils/request.js
import axios from "axios";
import { Message } from "element-ui";

const service = axios.create({
  baseURL: "/api", // ✅ 关键：走 vite proxy
  timeout: 20000,
});

// 请求拦截器
service.interceptors.request.use(
  (config) => {
    const userName = sessionStorage.getItem("userName");
    const token = sessionStorage.getItem("token");

    if (token) {
      config.headers["Authorization"] = "Bearer " + token;
    }
    if (userName) {
      config.headers["X-User-Name"] = userName;
    }

    return config;
  },
  (error) => Promise.reject(error)
);

// 响应拦截器
service.interceptors.response.use(
  (response) => {
    const res = response.data;

    // 这里统一处理业务码
    if (res.code !== 200 && res.code !== "200") {
      Message.error(res.message || res.msg || "请求失败");
      return Promise.reject(res);
    }

    return res; // ✅ 一定要 return
  },
  (error) => {
    console.error("响应错误:", error);
    Message.error("网络异常");
    return Promise.reject(error);
  }
);

export default service;
