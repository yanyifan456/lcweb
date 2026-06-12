import request from "@/utils/request";
//设备入库列表
export const getList = (params) =>
  request.post("/api/devicestock/search", params);
//设备入库获取联动选项
export const getLinkage = (params) =>
  request.post("/api/devicestock/device/linked", params);
//shbeiruku设备入库xinzeng
export const addgetlist = (params) =>
  request.post("/api/devicestock/insertstock", params);
//shbeiruku设备入库詳情
export const getdetail = (params) =>
  request.post("/api/devicestock/stocklist/detail", params);
//下载模版
export const getxaizai = (params) =>
  request.get("/api/devicestock/stock/template/download", { params });
//设备入库导入
// 封装设备导入的API方法
export const importStockExcel = (formData) => {
  return request.post("/devicestock/importstockexcel", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
};
//设备编辑数据回显
export const getlistb = (params) =>
  request.post("/api/devicestock/stock/detail", params);
//设备编辑修改
export const getlistbj = (params) =>
  request.post("/api/devicestock/stock/edit", params);
//设备入库删除
export const getdelets = (params) =>
  request.post("/api/devicestock/stock/edit/delete", params);
//设备型号

export const selectdevicetype = (params) =>
  request.post("/api/mid/param/selectdevicetype", params);
