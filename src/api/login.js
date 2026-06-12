import request from "@/utils/request";
// 登录接口
export const login = (params) =>
  request.post("/api/health/bigscreenuserinfo", params, {
    headers: {
      "X-User-Name": sessionStorage.getItem("loginuserName"), // 直接硬编码值为 1
    },
  });

export const getdeviceun = (params) =>
  request.post("/api/devicestock/device/statistics ", params);
export const getddd = (params) =>
  request.post("/api/mid/param/getpastmedicalhistorycount", params);
