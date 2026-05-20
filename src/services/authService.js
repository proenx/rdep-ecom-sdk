import apiClient from "../core/apiClient.js";
import { setToken, clearToken } from "../core/tokenManager.js";
import { setUserDetails, clearUserDetails } from "../core/userDetails.js";

/**
 * Check Tenant API
 */
export const checkTenant = async (tenantSubDomain) => {
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
export const login = async ({ username, password, subDomain }) => {
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
  }
};
