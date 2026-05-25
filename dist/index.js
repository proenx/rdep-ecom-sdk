// src/core/apiClient.js
import axios from "axios";

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
var apiClient = axios.create();
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
    if (res.config.url.includes("/auth-service/cws/auth")) {
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
var login = async ({ username, password, domainName }) => {
  var _a, _b;
  const res = await apiClient_default.post("/auth-service/cws/auth", {
    username,
    password,
    domainName
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
var checkTenant = async (tenantSubDomain) => {
  var _a;
  try {
    const uri = `/auth-service/noauth/tenant/check/${tenantSubDomain}`;
    const res = await apiClient_default.get(uri);
    return res;
  } catch (error) {
    console.error(
      "Tenant Check Error:",
      ((_a = error == null ? void 0 : error.response) == null ? void 0 : _a.data) || error.message
    );
    throw error;
  }
  return;
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
export {
  checkTenant,
  clearToken,
  clearUserDetails,
  getToken,
  getUserDetails,
  initClient,
  login,
  logout,
  setToken,
  setUserDetails
};
