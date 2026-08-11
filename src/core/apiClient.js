import axios from "axios";
import {
  configureAuthRedirect,
  ensureAuthenticatedOnLoad,
  getToken,
  isTokenExpired,
  redirectToLogin,
} from "./tokenManager.js";

const apiClient = axios.create();

const isGuestAllowedCartRoute = (url = "") => {
  return String(url).includes("/cart-service/ws/cart/");
};

export const initClient = (baseURL, options = {}) => {
  apiClient.defaults.baseURL = baseURL;

  const shouldEnableAuthRedirect = options?.authRedirect?.enabled !== false;
  if (shouldEnableAuthRedirect) {
    configureAuthRedirect({ enabled: true, ...(options?.authRedirect || {}) });
  }

  if (options?.checkAuthOnLoad !== false) {
    ensureAuthenticatedOnLoad({
      redirectOnMissingToken:
        options?.authRedirect?.redirectOnMissingToken === true,
    });
  }
};

// Attach token automatically
apiClient.interceptors.request.use((config) => {
  const token = getToken();

  if (token && isTokenExpired(token)) {
    redirectToLogin("token-expired");
    return Promise.reject(new Error("Access token expired"));
  }

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
      res.config.url.includes("/auth-service/cws/register") ||
      res.config.url.includes("/auth-service/ecom/register") ||
      res.config.url.includes("/auth-service/ecom/refresh-token/refresh")
    ) {
      return res;
    }
    // Other APIs → return only data
    return res.data;
  },
  (err) => {
    const status = err?.response?.status;
    const requestUrl = err?.config?.url || err?.response?.config?.url || "";

    if (
      (status === 401 || status === 403) &&
      !isGuestAllowedCartRoute(requestUrl)
    ) {
      redirectToLogin("unauthorized");
    }

    console.error("API Error:", err?.response?.data || err.message);
    return Promise.reject(err);
  },
);

export default apiClient;
