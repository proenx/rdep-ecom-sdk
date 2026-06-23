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
 * Send OTP for mobile verification during registration
 */
export const sendRegisterVerifyMobileOtp = async ({
  mobileNumber,
  domainName,
}) => {
  const res = await apiClient.post(
    "/auth-service/ecom/register/verify-mobile/send-otp",
    {
      mobileNumber,
      domainName,
    },
  );
  return res;
};

/**
 * Validate OTP for mobile verification during registration
 */
export const validateRegisterVerifyMobileOtp = async ({
  mobileNumber,
  domainName,
  mobileValidationId,
  mobileOtp,
}) => {
  const res = await apiClient.post(
    "/auth-service/ecom/register/verify-mobile/validate-otp",
    {
      mobileNumber,
      domainName,
      mobileValidationId,
      mobileOtp,
    },
  );
  return res;
};

/**
 * Validate referral/reference code during registration
 */
export const validateRegisterReference = async ({
  mobileNumber,
  domainName,
  referenceCode,
}) => {
  const res = await apiClient.post(
    "/auth-service/ecom/register/validate-reference",
    {
      mobileNumber,
      domainName,
      referenceCode,
    },
  );
  return res;
};

/**
 * Save registration details after verification
 */
export const saveRegisterDetails = async ({
  mobileNumber,
  domainName,
  name,
  dateOfBirth,
  email,
  password,
}) => {
  const res = await apiClient.post("/auth-service/ecom/register/save-details", {
    mobileNumber,
    domainName,
    name,
    dateOfBirth,
    email,
    password,
  });
  return res;
};

/**
 * Send OTP for Aadhaar verification during registration
 */
export const sendRegisterVerifyAadhaarOtp = async ({
  mobileNumber,
  domainName,
  aadhaarNumber,
}) => {
  const res = await apiClient.post(
    "/auth-service/ecom/register/verify-aadhaar/send-otp",
    {
      mobileNumber,
      domainName,
      aadhaarNumber,
    },
  );
  return res;
};

/**
 * Validate OTP for Aadhaar verification during registration
 */
export const validateRegisterVerifyAadhaarOtp = async ({
  mobileNumber,
  domainName,
  aadhaarValidationId,
  aadhaarOtp,
}) => {
  const res = await apiClient.post(
    "/auth-service/ecom/register/verify-aadhaar/validate-otp",
    {
      mobileNumber,
      domainName,
      aadhaarValidationId,
      aadhaarOtp,
    },
  );
  return res;
};

/**
 * Save Aadhaar address during registration
 */
export const saveRegisterAadhaarAddress = async ({
  mobileNumber,
  domainName,
  saveAadhaarAddress,
  aadhaarAddress,
}) => {
  const res = await apiClient.post(
    "/auth-service/ecom/register/save-aadhaar-address",
    {
      mobileNumber,
      domainName,
      saveAadhaarAddress,
      aadhaarAddress,
    },
  );
  return res;
};

/**
 * Validate PAN during registration
 */
export const validateRegisterPan = async ({
  mobileNumber,
  domainName,
  panNumber,
}) => {
  const res = await apiClient.post("/auth-service/ecom/register/validate-pan", {
    mobileNumber,
    domainName,
    panNumber,
  });
  return res;
};

/**
 * Validate bank account details during registration
 */
export const validateRegisterBankAccount = async ({
  mobileNumber,
  domainName,
  bankAccountHolderName,
  bankAccountNumber,
  bankIfsc,
}) => {
  const res = await apiClient.post(
    "/auth-service/ecom/register/validate-bank-account",
    {
      mobileNumber,
      domainName,
      bankAccountHolderName,
      bankAccountNumber,
      bankIfsc,
    },
  );
  return res;
};

/**
 * Register distributor/customer for ecom flow
 */
export const registerEcom = async ({ mobileNumber, domainName }) => {
  const res = await apiClient.post("/auth-service/ecom/register", {
    mobileNumber,
    domainName,
  });
  return res;
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
