import request from "@/utils/request";

// 查看设备类型
export const getList = (params) =>
  request.post("/api/mid/param/selectdevicetype", params);

// 新增设备类型
export const addDeviceType = (params) =>
  request.post("/api/mid/param/adddevicetype", params);

// 修改设备类型
export const editDeviceType = (params) =>
  request.post("/api/mid/param/updatedevicetype", params);

// 删除设备类型
export const deleteDeviceType = (params) =>
  request.post("/api/mid/param/deletedevicetype", params);

// 查看设备检测项目
export const getDeviceProject = (params) =>
  request.post("/api/mid/param/selectdeviceitem", params);
