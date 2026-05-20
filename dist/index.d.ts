import axios from 'axios';

let accessToken = null;

const setToken = (token) => {
  accessToken = token;
  if (typeof window !== "undefined") {
    localStorage.setItem("access_token", token);
  }
};

const getToken = () => {
  if (!accessToken && typeof window !== "undefined") {
    accessToken = localStorage.getItem("access_token");
  }
  return accessToken;
};

const clearToken = () => {
  accessToken = null;
  if (typeof window !== "undefined") {
    localStorage.removeItem("access_token");
  }
};

const apiClient = axios.create();

const initClient = (baseURL) => {
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
    if (res.config.url.includes("/auth-service/ui/auth")) {
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

let loggedInUser = null;

const setUserDetails = (user) => {
  loggedInUser = user;
  if (typeof window !== "undefined") {
    console.log("Storing user details in localStorage:", user);
    localStorage.setItem("user_details", JSON.stringify(user));
  }
};

const getUserDetails = () => {
  if (!loggedInUser && typeof window !== "undefined") {
    const user = localStorage.getItem("user_details");
    if (user) {
      loggedInUser = JSON.parse(user);
    }
  }
  return loggedInUser;
};

const clearUserDetails = () => {
  loggedInUser = null;
  if (typeof window !== "undefined") {
    localStorage.removeItem("user_details");
  }
};

/**
 * Check Tenant API
 */
const checkTenant = async (tenantSubDomain) => {
  // save globally
  try {
    const uri = `/auth-service/noauth/tenant/check/${tenantSubDomain}`;
    // const uri = `/auth-service/noauth/tenant/check/px`;
    const res = await apiClient.get(uri);
    return res;
  } catch (error) {
    console.error(
      "Tenant Check Error:",
      error?.response?.data || error.message,
    );
    throw error;
  }
  return;
};

/**
 * Login
 */
const login = async ({ username, password, subDomain }) => {
  const res = await apiClient.post("/auth-service/ui/auth", {
    username,
    password,
    tenantSubDomain: subDomain,
  });

  const token = res?.headers?.authorization || res?.headers?.Authorization;

  if (token) {
    setToken(token);
  }

  const user = res?.data || {};

  if (user) {
    setUserDetails(user);
  }

  return user;
};

/**
 * Logout
 */
const logout = async () => {
  try {
    await apiClient.get("/auth-service/ui/logout");
  } catch (err) {
    console.error("Logout Error:", err?.response?.data || err.message);
  } finally {
    clearToken();
    clearUserDetails();
  }
};

export { checkTenant, clearToken, clearUserDetails, getToken, getUserDetails, initClient, login, logout, setToken, setUserDetails };
