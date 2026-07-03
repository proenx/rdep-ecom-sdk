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
    // Auth APIs need full response to access auth headers
    if (
      res.config.url.includes("/auth-service/ecom/auth") ||
      res.config.url.includes("/auth-service/cws/auth") ||
      res.config.url.includes("/auth-service/cws/register")
    ) {
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
