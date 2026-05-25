import axios from "axios";
import { getToken } from "./tokenManager.js";

const apiClient = axios.create();

export const initClient = (baseURL) => {
  apiClient.defaults.baseURL = baseURL;
};

// Attach token automatically
apiClient.interceptors.request.use((config) => {
  const token = getToken();
  if (token) {
    config.headers.Authorization = token.startsWith("Bearer ")
      ? token
      : `Bearer ${token}`;
  }
  return config;
});

// Handle responses globally
apiClient.interceptors.response.use(
  (res) => {
    // Login API → return full response
    if (res.config.url.includes("/auth-service/cws/auth")) {
      return res;
    }
    // Other APIs → return only data
    return res.data;
  },
  (err) => {
    console.error("API Error:", err?.response?.data || err.message);
    return Promise.reject(err);
  },
);

export default apiClient;
