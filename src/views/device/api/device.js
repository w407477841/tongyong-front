import http from '@/axios'
//列表

//萤石云视频
export const getYSCameraListApi = params => {
    return http.get('/device/cameraInfo/getYSCameraInfo', {
        params: params
    }).then(res => res);
};
//获取乐橙视频列表
export const getLCCameraListApi = params => {
    return http.get(`/camera/cameraInfo/getCameraInfo`, {
        params: params
    }).then(res => res);
};