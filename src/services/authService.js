import apiClient from "../core/apiClient.js";
import { setToken, clearToken } from "../core/tokenManager.js";
import { setUserDetails, clearUserDetails } from "../core/userDetails.js";

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
