import request from "@/utils/request";
//获取机构
export const getlist = (params) =>
  request.post("/api/mid/user/getMedicalExam ", params);
//获取紧急联系人关系
