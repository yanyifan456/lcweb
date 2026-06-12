import request from "@/utils/request";

/**
 * 获取机构健康报告列表
 * @param {Object} params
 * @param {String} params.mainOrg
 * @param {String} params.startTime
 * @param {String} params.endTime
 * @param {String} params.pageSize
 * @param {String} params.currentPage
 * @param {String} params.detectType
 */
export const getList = (params) => request.post("/api/app/user/getReport/getOrgDayReport", params);

/**
 * 生成cvd日健康报告
 * @param {Object} params
 * @param {String} params.feinggerSourceId
 */
export const generateDayReport = (params) => request.post("/api/apphealth/insert/sourcetasktradedata", params);

/**
 * 生成ecg日健康报告
 * @param {Object} params
 * @param {String} params.feinggerSourceId
 */
export const generateEcgDayReport = (params) => request.post("/api/apphealth/ecg/saveecgdata", params);

/**
 * 下载cvd报告
 */
export const downloadCvdReport = (id) => request.get(`/api/app/user/getReport/downloadCvdReport?id=${id}`);
/**
 * 下载ecg报告
 */
export const downloadEcgReport = (id) => request.get(`/api/apphealth/ecgreport/download?id=${id}`);
