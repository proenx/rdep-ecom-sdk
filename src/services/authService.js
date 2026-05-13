import apiClient from "../core/apiClient.js";
import { setToken, clearToken } from "../core/tokenManager.js";
import { setUserDetails, clearUserDetails } from "../core/userDetails.js";

/**
 * Subdomain State
 */
let currentSubDomain = null;

export const setSubDomain = (subDomain) => {
  currentSubDomain = subDomain;
};

export const getSubDomain = () => {
  return currentSubDomain;
};

/**
 * Login
 */
export const login = async ({ username, password, subDomain }) => {
  // save subdomain state
  setSubDomain(subDomain);
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
export const logout = async () => {
  try {
    await apiClient.get("/auth-service/ui/logout");
  } catch (err) {
    console.error("Logout Error:", err?.response?.data || err.message);
  } finally {
    clearToken();
    clearUserDetails();

    // clear subdomain
    currentSubDomain = null;
  }
};
