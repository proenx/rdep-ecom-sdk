let accessToken = null;
const AUTH_REDIRECT_MESSAGE_KEY = "auth_redirect_message";
let authRedirectConfig = {
  enabled: false,
  loginPath: "/login",
  onRedirect: null,
};

const isBrowser = () => typeof window !== "undefined";

const getBareToken = (token) => {
  if (!token) {
    return "";
  }
  return String(token)
    .replace(/^Bearer\s+/i, "")
    .trim();
};

const decodeJwtPayload = (token) => {
  const bareToken = getBareToken(token);
  const tokenParts = bareToken.split(".");

  if (tokenParts.length !== 3) {
    return null;
  }

  try {
    const base64 = tokenParts[1].replace(/-/g, "+").replace(/_/g, "/");
    const paddedBase64 = base64 + "=".repeat((4 - (base64.length % 4)) % 4);
    const decoded = atob(paddedBase64);
    return JSON.parse(decoded);
  } catch {
    return null;
  }
};

const getRedirectMessageByReason = (reason) => {
  if (reason === "token-expired" || reason === "unauthorized") {
    return "Your session has expired. Please log in again.";
  }

  return "";
};

export const setToken = (token) => {
  accessToken = token;
  if (isBrowser()) {
    localStorage.setItem("access_token", token);
  }
};

export const getToken = () => {
  if (!accessToken && isBrowser()) {
    accessToken = localStorage.getItem("access_token");
  }
  return accessToken;
};

export const clearToken = () => {
  accessToken = null;
  if (isBrowser()) {
    localStorage.removeItem("access_token");
  }
};

export const isTokenExpired = (token = getToken()) => {
  if (!token) {
    return true;
  }

  const payload = decodeJwtPayload(token);
  if (!payload || typeof payload.exp !== "number") {
    return false;
  }

  return Date.now() >= payload.exp * 1000;
};

export const configureAuthRedirect = ({
  enabled = true,
  loginPath = "/login",
  onRedirect = null,
} = {}) => {
  authRedirectConfig = {
    enabled: Boolean(enabled),
    loginPath: loginPath || "/login",
    onRedirect: typeof onRedirect === "function" ? onRedirect : null,
  };

  return authRedirectConfig;
};

export const getAuthRedirectMessage = () => {
  if (!isBrowser()) {
    return "";
  }

  return sessionStorage.getItem(AUTH_REDIRECT_MESSAGE_KEY) || "";
};

export const consumeAuthRedirectMessage = () => {
  const message = getAuthRedirectMessage();

  if (isBrowser()) {
    sessionStorage.removeItem(AUTH_REDIRECT_MESSAGE_KEY);
  }

  return message;
};

export const redirectToLogin = (reason = "unauthenticated") => {
  clearToken();

  if (!isBrowser() || !authRedirectConfig.enabled) {
    return false;
  }

  const message = getRedirectMessageByReason(reason);
  if (message) {
    sessionStorage.setItem(AUTH_REDIRECT_MESSAGE_KEY, message);
  } else {
    sessionStorage.removeItem(AUTH_REDIRECT_MESSAGE_KEY);
  }

  if (authRedirectConfig.onRedirect) {
    authRedirectConfig.onRedirect({
      reason,
      loginPath: authRedirectConfig.loginPath,
      message,
    });
    return true;
  }

  if (window.location.pathname !== authRedirectConfig.loginPath) {
    window.location.assign(authRedirectConfig.loginPath);
  }

  return true;
};

export const ensureAuthenticatedOnLoad = ({
  redirectOnMissingToken = false,
} = {}) => {
  const token = getToken();

  if (!token) {
    if (redirectOnMissingToken) {
      redirectToLogin("missing-token");
    }
    return false;
  }

  if (isTokenExpired(token)) {
    redirectToLogin("token-expired");
    return false;
  }

  return true;
};
