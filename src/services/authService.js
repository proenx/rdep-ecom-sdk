import apiClient from "../core/apiClient.js";
import { setToken, clearToken } from "../core/tokenManager.js";
import { setUserDetails, clearUserDetails } from "../core/userDetails.js";

let currentTenantId = null;

const extractToken = (res) => {
  const headers = res?.headers || {};
  const data = res?.data || {};

  const headerToken =
    headers.authorization ||
    headers.Authorization ||
    headers["x-auth-token"] ||
    headers["X-Auth-Token"] ||
    headers["x-access-token"] ||
    headers["X-Access-Token"];

  if (headerToken) {
    return String(headerToken);
  }

  const bodyToken =
    data.token ||
    data.accessToken ||
    data.access_token ||
    data.jwt ||
    data.authToken ||
    data.authorization;

  return bodyToken ? String(bodyToken) : null;
};

export const setTenantId = (tenantId) => {
  if (tenantId === undefined || tenantId === null || tenantId === "") {
    return;
  }
  currentTenantId = String(tenantId);
};

export const getTenantId = () => {
  if (currentTenantId) {
    return currentTenantId;
  }

  if (typeof process !== "undefined" && process?.env?.RDEP_TENANT_ID) {
    return String(process.env.RDEP_TENANT_ID);
  }

  return null;
};

/**
 * Login
 */
export const login = async ({ username, password, domainName }) => {
  const res = await apiClient.post("/auth-service/cws/auth", {
    username,
    password,
    domainName: domainName,
  });
  const token = extractToken(res);
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
 * Register
 */
export const register = async ({
  firstName,
  middleName,
  lastName,
  mobileNumber,
  email,
  password,
  domainName,
}) => {
  const res = await apiClient.post("/auth-service/cws/register", {
    firstName,
    middleName,
    lastName,
    mobileNumber,
    email,
    password,
    domainName,
  });
  const token = extractToken(res);
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
 * Check Tenant API
 */
export const checkTenant = async (tenantDomain) => {
  try {
    if (!tenantDomain) {
      throw new Error("checkTenant requires a tenantDomain");
    }

    const encodedDomain = encodeURIComponent(String(tenantDomain));
    const uri = `/auth-service/noauth/store/info/${encodedDomain}`;
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
 * Resolve tenantId from tenant domain
 */
export const getTenantIdByDomain = async (tenantDomain) => {
  const storeInfo = await checkTenant(tenantDomain);
  const tenantId =
    storeInfo?.tenantId ??
    storeInfo?.tenantID ??
    storeInfo?.id ??
    storeInfo?.storeId ??
    storeInfo?.storeID ??
    storeInfo?.tenant?.id;

  if (tenantId === undefined || tenantId === null || tenantId === "") {
    throw new Error("Tenant ID not found in store info response");
  }

  setTenantId(tenantId);
  return String(tenantId);
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
    currentTenantId = null;
  }
};
