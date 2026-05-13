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
 * Get Tenant Subdomain
 */
export const getTenantSubDomain = () => {
  const host = window.location.host;

  const parts = host.split(".");

  const domainLength = 3;

  return parts.length >= domainLength && parts[0] !== "www"
    ? parts[0]
    : import.meta.env.NUXT_PUBLIC_SUB_DOMAIN;
};

/**
 * Check Tenant API
 */
export const checkTenant = async () => {
  const tenantSubDomain = getTenantSubDomain();

  // save globally
  setSubDomain(tenantSubDomain);

  try {
    const uri = `/auth-service/noauth/tenant/check/px`;

    const res = await apiClient.get(uri);

    return res?.data || {};
  } catch (error) {
    console.error(
      "Tenant Check Error:",
      error?.response?.data || error.message,
    );

    throw error;
  }

  return {};
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
