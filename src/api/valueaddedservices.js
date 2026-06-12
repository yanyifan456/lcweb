import request from "@/utils/request";
//查看
export const getlist = (params) =>
  request.post("/api/mid/param/selectdoctorservice", params);
//增加
export const getaddlist = (params) =>
  request.post("/api/mid/param/adddoctorservice", params);
//删除
export const getdellist = (params) =>
  request.post("/api/mid/param/deletedoctorservice", params);
//修改
export const getupdatelist = (params) =>
  request.post("/api/mid/param/updatedoctorservice", params);
//单位
export const getunitlist = (params) =>
  request.post("/api/mid/param/selectserviceunit", params);
//增加单位

export const getdanwei = (params) =>
  request.post("/api/mid/param/addserviceunit", params);
export const getservicetype = (params) =>
  request.post("/api/mid/param/selectservicetype", params);
