import request from "@/utils/request";
//获取机构
export const getjigou = (params) =>
  request.post("/api/mid/param/getmidtree", params);
//获取紧急联系人关系
export const getrelationship = (params) =>
  request.post("/api/health/data/getcommpara", params);
//新建用户
export const adduser = (params) =>
  request.post("/api/app/user/insertuser", params);
//获取用户列表信息
export const getuserlist = (params) =>
  request.post("/api/app/user/selectuserlist", params);
//获取用户详情信息
export const getuserinfo = (params) =>
  request.post("/api/mid/userinfo/getuserdetail ", params);
//编辑用户信息
export const edituser = (params) =>
  request.post("/api/app/user/userInfoUpdate", params);

export const getbinddevice = (params) =>
  request.post("/api/mid/user/binddevice", params);
//手表绑定
export const getdevicebind = (params) =>
  request.post("/api/app/userDevice/bindDevice", params);

//手表解绑
export const getdeviceun = (params) =>
  request.post("/api/app/userDevice/unbinduserdevice", params);
export const selectbinddeviceuser = (params) =>
  request.post("/api/mid/param/org/selectbinddeviceuser", params);
export const userdeviceunbind = (params) =>
  request.post("/api/mid/param/userdeviceunbind", params);
