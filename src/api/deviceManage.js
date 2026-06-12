import request from "@/utils/request";

// 新增设备管理
export const createDeviceManage = (params) =>
  request.post("/api/mid/param/adddevicemanagement", params);

// 删除设备管理
export const deleteDeviceManage = (params) =>
  request.post("/api/mid/param/deletedevicemanagement", params);

// 查看设备管理
export const getDeviceManage = (params) =>
  request.post("/api/mid/param/selectdevicemanagementlist", params);

// 修改设备管理
export const editDeviceManage = (params) =>
  request.post("/api/mid/param/updatedevicemanagement", params);
