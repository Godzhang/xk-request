import request from "../http";

export const login = (data, config = {}) => {
  return request.post("/login", data, config);
};
