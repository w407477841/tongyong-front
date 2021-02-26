/*
 * @Author: pangyu 
 * @CreateTime: 2018-08-27 16:44:08 
 * @Desc:  axios配置
*/
import axios from "axios";
import { Loading, Message } from 'element-ui';
import {url} from './base.js'

//创建http
let loading = null;
let needLoadingRequestCount = 0;
let startLoading = (config) => {
    if (config.loading) {
        if (needLoadingRequestCount == 0) {
            // console.log('startLoading =============')
            loading = Loading.service({
                lock: true,
                text: '加载中……',
                background: 'rgba(0, 0, 0, 0.7)'
            })
        }
        needLoadingRequestCount++;
    }
}

let endLoading = (config) => {
    if (config && config.loading) {
        needLoadingRequestCount--;
        if (needLoadingRequestCount <= 0) {
            needLoadingRequestCount = 0;
            // console.log('endLoading==========')
            loading.close()
        }
    }
}

let http = axios.create({
    baseURL: url,
    headers: {
        get: {
            'Content-Type': 'application/x-www-form-urlencoded',
        },
        post: {
            'Content-Type': 'application/json'
            
        }
    },
    withCredentials: true
});
//取消操作 请求队列
let pending = [];
let cancelToken = axios.CancelToken;
let removePending = (config) => {
    for (let p in pending) {
        if (pending[p].u === config.url + '&' + config.method) { //当当前请求在数组中存在时执行函数体
            pending[p].f('操作取消'); //执行取消操作       
            pending.splice(p, 1); //把这条记录从数组中移除
            endLoading(config);
        }
    }
}

//请求 拦截器
http.interceptors.request.use(
    config => {
        config.headers.Authorization = sessionStorage.getItem('auth'); //token
        startLoading(config);
        removePending(config); //在一个ajax发送前执行一下取消操作
        config.cancelToken = new cancelToken((c) => {
            if (config.removePending) {
                pending.push({ u: config.url + '&' + config.method, f: c });
            }
        });

        return config;
    },
    error => {
        endLoading(error.config);
        Message.error({
            message: '请求超时!'
        });
        return Promise.reject(error);
    });

//响应 拦截器
http.interceptors.response.use(
    response => {
        removePending(response.config);  //在一个ajax响应后再执行一下取消操作，把已经完成的请求从pending中移除   
        endLoading(response.config);
        if(response.config.hasInterceptors){
            if (response.data.code == '200') {
                if(response.config.url.match(/\/toGroup/)){
                    return response.data;
                }
                if (response.config.method == 'post') {
                    if (response.config.hasMsg) {
                        Message.success({ message: response.data.message });
                    }
                    return response.data;
                }
                return response.data.data;
            } else {
                if (response.data.code == '400') {
                    sessionStorage.removeItem('user');
                    sessionStorage.removeItem('userOperations');
                    sessionStorage.removeItem("auth");
                    location.reload();
                }   
                Message.error({message: response.data.message || '无返回!'});     
                if (response.config.noError) {
                    
                    return new Promise(() => { });
                } else {
                	if(response.config.url.match(/\/login/)){
                		return response.data
                	}
                    return response.data.data
                }
            }
        }else{
            return response.data
        }
        
    },
    error => {
        endLoading(error.config);
        if (error.response) {
            //switch (error.response.status) { }
        }
        return Promise.reject(error)
    });

const defaultConfig = {
    hasInterceptors:true, //默认拦截返回
    removePending: true, //默认开启取消重复请求
    loading: true, //默认开启全局loading
    noError: true, //默认开启错误处理
    hasMsg: false //默认开启弹框提示
}

export default {
    get: (url, config) => http.get(url, { ...defaultConfig, ...config }),
    put: (url, data, config) => http.put(url, data, { ...defaultConfig, ...config }),
    post: (url, data, config) => http.post(url, data, { ...defaultConfig, ...config }),
    patch: (url, data, config) => http.patch(url, data, { ...defaultConfig, ...config }),
    delete: (url, data, config) => http.delete(url, { ...defaultConfig, ...config })
}