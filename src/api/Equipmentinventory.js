import request from "@/utils/request";

//库存列表
export const getlist = (params) =>
  request.post("/api/devicestock/device/stock/fuzzy/search", params);
//获取机构
export const getjigou = (params) =>
  request.post("/api/mid/param/getmidtree", params);
//设备出库
export const outstock = (params) =>
  request.post("/api/devicestock/device/stock/out", params);
