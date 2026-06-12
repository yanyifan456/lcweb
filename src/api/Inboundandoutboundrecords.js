import request from "@/utils/request";
//日志简述
export const Logdescription = (params) =>
  request.post(
    "/api/devicestock/device/stock/inandoutlog/search/title",
    params
  );
//日志列表
export const Loglist = (params) =>
  request.post("/api/devicestock/device/stock/inandoutlog/search", params);
//日志详情
export const Logdetails = (params) =>
  request.post(
    "/api/devicestock/device/stock/inandoutlog/search/detail",
    params
  );
