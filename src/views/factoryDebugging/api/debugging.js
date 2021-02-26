import http from "@/axios";

//列表
export const getListApi = params => {
  return http.post("/device/projectCrane/selectPageList", params).then(res => {
    return res;
  });
};
