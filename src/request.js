import axios from "axios";
import md5 from "md5";
import requestConfig from "./config.js";

let request = axios.create({
  // 基础配置
  baseURL: "http://localhost:8000/",
  timeout: 30 * 1000,
  responseType: "json",
  headers: {},
});

request.interceptors.request.use(
  (config) => {
    // token,密钥的设置
    let whiteListApi = requestConfig.whiteListApi;
    let url = config.url;
    let token = localStorage.getItem("token");
    // 不在白名单并且有token，则携带token
    if (whiteListApi.indexOf(url) === -1 && token) {
      config.headers.token = token;
    }
    // 有些项目需要传密钥 secretId + 特殊算法
    config.headers.secret = md5(requestConfig.secretId + new Date().toString());

    return config;
  },
  (error) => {
    return Promise.reject(new Error(error));
  }
);

request.interceptors.response.use(
  (res) => {
    // 响应的统一处理
    const code = res.data.code || 200;
    const message = res.data.msg || "未知错误";
  },
  (error) => {
    // 此处会捕获 status 4xx、5xx 的错误
    // 建议用组件库的消息提示组件
    // message.error(error.message)
    return Promise.reject(new Error(error));
  }
);
