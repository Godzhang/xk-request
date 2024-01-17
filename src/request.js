import request from "./http";

// 防止频繁提交，多次触发只请求一次，只有请求结束之后才可以下一次请求
// 不是固定间隔的节流
const throttleRequest = (function () {
  let requestCache = [];
  let dataCache = new Map(); // 缓存结果
  return function (config) {
    const url = config.url;
    if (dataCache.has(url)) {
      return dataCache.get(url);
    } else {
      if (requestCache.indexOf(url) !== -1) {
        return Promise.reject({ message: "请求已提交" });
      }
      requestCache.push(url);
      return request(config).then((res) => {
        requestCache = requestCache.filter((item) => {
          return item !== url;
        });
        dataCache.set(url, res);
        return res;
      });
    }
  };
})();

export { throttleRequest as request, request as initRequest };
