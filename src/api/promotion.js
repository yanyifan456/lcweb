import request from "@/utils/request";
//查看
export const getlist = (params) =>
  request.post("/api/app/promotion/selectPromotion", params);
//增加
export const getaddlist = (params) =>
  request.post("/api/app/promotion/addPromotion", params);
//删除
export const getdellist = (params) =>
  request.post("/api/app/promotion/delPromotion", params);
//修改
export const getupdatelist = (params) =>
  request.post("/api/app/promotion/updatePromotion", params);
//单位
export const getunitlist = () =>
  request.post("/api/mid/param/selectserviceunit");
