var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
  // If the importer is in node compatibility mode or this is not an ESM
  // file that has been converted to a CommonJS file using a Babel-
  // compatible transform (i.e. "__esModule" has not been set), then set
  // "default" to the CommonJS "module.exports" for node compatibility.
  isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
  mod
));
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

// src/index.js
var index_exports = {};
__export(index_exports, {
  clearToken: () => clearToken,
  clearUserDetails: () => clearUserDetails,
  getToken: () => getToken,
  getUserDetails: () => getUserDetails,
  initClient: () => initClient,
  login: () => login,
  logout: () => logout,
  setToken: () => setToken,
  setUserDetails: () => setUserDetails
});
module.exports = __toCommonJS(index_exports);

// src/core/apiClient.js
var import_axios = __toESM(require("axios"), 1);

// src/core/tokenManager.js
var accessToken = null;
var setToken = (token) => {
  accessToken = token;
  if (typeof window !== "undefined") {
    localStorage.setItem("access_token", token);
  }
};
var getToken = () => {
  if (!accessToken && typeof window !== "undefined") {
    accessToken = localStorage.getItem("access_token");
  }
  return accessToken;
};
var clearToken = () => {
  accessToken = null;
  if (typeof window !== "undefined") {
    localStorage.removeItem("access_token");
  }
};

// src/core/apiClient.js
var apiClient = import_axios.default.create();
var initClient = (baseURL) => {
  apiClient.defaults.baseURL = baseURL;
};
apiClient.interceptors.request.use((config) => {
  const token = getToken();
  if (token) {
    config.headers.Authorization = token.startsWith("Bearer ") ? token : `Bearer ${token}`;
  }
  return config;
});
apiClient.interceptors.response.use(
  (res) => {
    if (res.config.url.includes("/auth-service/ui/auth")) {
      return res;
    }
    return res.data;
  },
  (err) => {
    var _a;
    console.error("API Error:", ((_a = err == null ? void 0 : err.response) == null ? void 0 : _a.data) || err.message);
    return Promise.reject(err);
  }
);
var apiClient_default = apiClient;

// src/core/userDetails.js
var loggedInUser = null;
var setUserDetails = (user) => {
  loggedInUser = user;
  if (typeof window !== "undefined") {
    console.log("Storing user details in localStorage:", user);
    localStorage.setItem("user_details", JSON.stringify(user));
  }
};
var getUserDetails = () => {
  if (!loggedInUser && typeof window !== "undefined") {
    const user = localStorage.getItem("user_details");
    if (user) {
      loggedInUser = JSON.parse(user);
    }
  }
  return loggedInUser;
};
var clearUserDetails = () => {
  loggedInUser = null;
  if (typeof window !== "undefined") {
    localStorage.removeItem("user_details");
  }
};

// src/services/authService.js
var login = async ({ username, password, subDomain }) => {
  var _a, _b;
  const res = await apiClient_default.post("/auth-service/ui/auth", {
    username,
    password,
    tenantSubDomain: subDomain
  });
  const token = ((_a = res == null ? void 0 : res.headers) == null ? void 0 : _a.authorization) || ((_b = res == null ? void 0 : res.headers) == null ? void 0 : _b.Authorization);
  if (token) {
    setToken(token);
  }
  const user = (res == null ? void 0 : res.data) || {};
  if (user) {
    setUserDetails(user);
  }
  return user;
};
var logout = async () => {
  var _a;
  try {
    await apiClient_default.get("/auth-service/ui/logout");
  } catch (err) {
    console.error("Logout Error:", ((_a = err == null ? void 0 : err.response) == null ? void 0 : _a.data) || err.message);
  } finally {
    clearToken();
    clearUserDetails();
  }
};
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  clearToken,
  clearUserDetails,
  getToken,
  getUserDetails,
  initClient,
  login,
  logout,
  setToken,
  setUserDetails
});
