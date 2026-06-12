import request from "@/utils/request";
export const list = (params) =>
  request.post("/api/mid/param/org/alarm/event/list", params);
export const update = (params) =>
  request.post("/api/mid/param/org/alarm/event/update", params);
export const detail = (params) =>
  request.post("/api/mid/param/org/alarm/event/detail", params);
