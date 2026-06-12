import request from "@/utils/request";
//健康报告列表，查询
export const addgetlist = (params) =>
  request.post("/api/mid/user/gethealthreport", params);
//健康报告详情
export const getlistb = (params) =>
  request.post("/api/app/userDevice/selectfinggersourcedetail", params);
//医生签名
export const getdoctor = (params) =>
  request.post("/api/mid/param/doctorservice", params);
export const getdoctorlist = (params) =>
  request.post("/api/mid/param/doctoradvice", params);
export const getdoctorlists = (params) =>
  request.post("/api/app/user/selectuserlist", params);
//护士下发
export const getnurselist = (params) =>
  request.post("/api/mid/param/doctoradvice", params);
//服务类型
export const deluserlongadvice = (params) =>
  request.post("/api/mid/param/deluserlongadvice", params);
// 删除个人医嘱
