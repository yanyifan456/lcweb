import request from "@/utils/request";
//查看
export const getlist = (params) =>
  request.post("/api/mid/param/selectdoctorlist", params);
//增加
export const getaddlist = (params) =>
  request.post("/api/mid/param/adddoctor", params);
//删除
export const getdellist = (params) =>
  request.post("/api/mid/param/deletedoctor", params);
//修改
export const getupdatelist = (params) =>
  request.post("/api/mid/param/updatedoctor", params);
//单位
export const getunitlist = () =>
  request.post("/api/mid/param/selectserviceunit");
export const getyishenglist = () =>
  request.post("/api/mid/param/selectdoctorprofession");
export const asd = (params) =>
  request.post("/api/mid/param/approval/doctorchecktag", params);
