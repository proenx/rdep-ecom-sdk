var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
  // If the importer is in node compatibility mode or this is not an ESM
  // file that has been converted to a CommonJS file using a Babel-
  // compatible transform (i.e. "__esModule" has not been set), then set
  // "default" to the CommonJS "module.exports" for node compatibility.
  isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
  mod
));
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

// src/index.js
var index_exports = {};
__export(index_exports, {
  addBankDetails: () => addBankDetails,
  addCustomerAddress: () => addCustomerAddress,
  addCustomerBeneficiary: () => addCustomerBeneficiary,
  addItemToCart: () => addItemToCart,
  cancelOrderBySku: () => cancelOrderBySku,
  checkRegisterVerifyAadhaarDigilockerSession: () => checkRegisterVerifyAadhaarDigilockerSession,
  checkTenant: () => checkTenant,
  checkTransactionStatus: () => checkTransactionStatus,
  clearToken: () => clearToken,
  clearUserDetails: () => clearUserDetails,
  customerLogin: () => customerLogin,
  ecomLogin: () => ecomLogin,
  editCustomerAddress: () => editCustomerAddress,
  generatePaymentLink: () => generatePaymentLink,
  generateSetNewPasswordOtp: () => generateSetNewPasswordOtp,
  getActiveRegisterConsentRequirements: () => getActiveRegisterConsentRequirements,
  getCategoriesByTenant: () => getCategoriesByTenant,
  getCustomer: () => getCustomer,
  getCustomerAddress: () => getCustomerAddress,
  getCustomerBeneficiaries: () => getCustomerBeneficiaries,
  getFiltersByTenantAndStore: () => getFiltersByTenantAndStore,
  getOrderById: () => getOrderById,
  getOrderList: () => getOrderList,
  getProductDetailById: () => getProductDetailById,
  getProductsByTenantAndStore: () => getProductsByTenantAndStore,
  getRegisterTransactionId: () => getRegisterTransactionId,
  getSetNewPasswordTransactionId: () => getSetNewPasswordTransactionId,
  getTenantId: () => getTenantId,
  getTenantIdByDomain: () => getTenantIdByDomain,
  getToken: () => getToken,
  getUserDetails: () => getUserDetails,
  initClient: () => initClient,
  initiateHdfcPayment: () => initiateHdfcPayment,
  initiateRazorPayPayment: () => initiateRazorPayPayment,
  initiateRegisterVerifyAadhaarDigilockerSession: () => initiateRegisterVerifyAadhaarDigilockerSession,
  login: () => login,
  logout: () => logout,
  placeOrder: () => placeOrder,
  recordOrderPayment: () => recordOrderPayment,
  refreshCart: () => refreshCart,
  refreshToken: () => refreshToken,
  register: () => register,
  registerEcom: () => registerEcom,
  removeItemFromCart: () => removeItemFromCart,
  resendRegisterOtp: () => resendRegisterOtp,
  saveRegisterAadhaarAddress: () => saveRegisterAadhaarAddress,
  saveRegisterDetails: () => saveRegisterDetails,
  searchProductsV2: () => searchProductsV2,
  sendRegisterVerifyAadhaarOtp: () => sendRegisterVerifyAadhaarOtp,
  sendRegisterVerifyEmailOtp: () => sendRegisterVerifyEmailOtp,
  sendRegisterVerifyMobileOtp: () => sendRegisterVerifyMobileOtp,
  setNewPassword: () => setNewPassword,
  setTenantId: () => setTenantId,
  setToken: () => setToken,
  setUserDetails: () => setUserDetails,
  updateItemQty: () => updateItemQty,
  validatePinCode: () => validatePinCode,
  validateRegisterBankAccount: () => validateRegisterBankAccount,
  validateRegisterOtp: () => validateRegisterOtp,
  validateRegisterPan: () => validateRegisterPan,
  validateRegisterReference: () => validateRegisterReference,
  validateRegisterVerifyAadhaarOtp: () => validateRegisterVerifyAadhaarOtp,
  validateRegisterVerifyEmailOtp: () => validateRegisterVerifyEmailOtp,
  validateRegisterVerifyMobileOtp: () => validateRegisterVerifyMobileOtp,
  verifyHdfcStatus: () => verifyHdfcStatus,
  verifyRazorpayStatus: () => verifyRazorpayStatus
});
module.exports = __toCommonJS(index_exports);

// src/core/apiClient.js
var import_axios = __toESM(require("axios"), 1);

// src/core/tokenManager.js
var accessToken = null;
var setToken = (token) => {
  accessToken = token;
  if (typeof window !== "undefined") {
    localStorage.setItem("access_token", token);
  }
};
var getToken = () => {
  if (!accessToken && typeof window !== "undefined") {
    accessToken = localStorage.getItem("access_token");
  }
  return accessToken;
};
var clearToken = () => {
  accessToken = null;
  if (typeof window !== "undefined") {
    localStorage.removeItem("access_token");
  }
};

// src/core/apiClient.js
var apiClient = import_axios.default.create();
var initClient = (baseURL) => {
  apiClient.defaults.baseURL = baseURL;
};
apiClient.interceptors.request.use((config) => {
  const token = getToken();
  if (token) {
    config.headers.Authorization = token.startsWith("Bearer ") ? token : `Bearer ${token}`;
  }
  return config;
});
apiClient.interceptors.response.use(
  (res) => {
    if (res.config.url.includes("/auth-service/ecom/auth") || res.config.url.includes("/auth-service/cws/auth") || res.config.url.includes("/auth-service/cws/register") || res.config.url.includes("/auth-service/ecom/register") || res.config.url.includes("/auth-service/ecom/refresh-token/refresh")) {
      return res;
    }
    return res.data;
  },
  (err) => {
    var _a;
    console.error("API Error:", ((_a = err == null ? void 0 : err.response) == null ? void 0 : _a.data) || err.message);
    return Promise.reject(err);
  }
);
var apiClient_default = apiClient;

// src/core/userDetails.js
var loggedInUser = null;
var setUserDetails = (user) => {
  loggedInUser = user;
  if (typeof window !== "undefined") {
    console.log("Storing user details in localStorage:", user);
    localStorage.setItem("user_details", JSON.stringify(user));
  }
};
var getUserDetails = () => {
  if (!loggedInUser && typeof window !== "undefined") {
    const user = localStorage.getItem("user_details");
    if (user) {
      loggedInUser = JSON.parse(user);
    }
  }
  return loggedInUser;
};
var clearUserDetails = () => {
  loggedInUser = null;
  if (typeof window !== "undefined") {
    localStorage.removeItem("user_details");
  }
};

// src/services/authService.js
var currentTenantId = null;
var currentRegisterTransactionId = null;
var currentSetNewPasswordTransactionId = null;
var extractToken = (res) => {
  const headers = (res == null ? void 0 : res.headers) || {};
  const data = (res == null ? void 0 : res.data) || {};
  const headerToken = headers.authorization || headers.Authorization || headers["x-auth-token"] || headers["X-Auth-Token"] || headers["x-access-token"] || headers["X-Access-Token"];
  if (headerToken) {
    return String(headerToken);
  }
  const bodyToken = data.token || data.accessToken || data.access_token || data.jwt || data.authToken || data.authorization;
  return bodyToken ? String(bodyToken) : null;
};
var setTenantId = (tenantId) => {
  if (tenantId === void 0 || tenantId === null || tenantId === "") {
    return;
  }
  currentTenantId = String(tenantId);
};
var getTenantId = () => {
  var _a;
  if (currentTenantId) {
    return currentTenantId;
  }
  if (typeof process !== "undefined" && ((_a = process == null ? void 0 : process.env) == null ? void 0 : _a.RDEP_TENANT_ID)) {
    return String(process.env.RDEP_TENANT_ID);
  }
  return null;
};
var getRegisterTransactionId = () => {
  if (currentRegisterTransactionId) {
    return currentRegisterTransactionId;
  }
  return null;
};
var getSetNewPasswordTransactionId = () => {
  if (currentSetNewPasswordTransactionId) {
    return currentSetNewPasswordTransactionId;
  }
  return null;
};
var ecomLogin = async ({ username, password, domainName }) => {
  const res = await apiClient_default.post("/auth-service/ecom/auth", {
    username,
    password,
    domainName
  });
  const token = extractToken(res);
  if (token) {
    setToken(token);
  }
  const user = (res == null ? void 0 : res.data) || {};
  if (user) {
    setUserDetails(user);
  }
  return user;
};
var customerLogin = async ({ username, password, domainName }) => {
  const res = await apiClient_default.post("/auth-service/cws/auth", {
    username,
    password,
    domainName
  });
  const token = extractToken(res);
  if (token) {
    setToken(token);
  }
  const user = (res == null ? void 0 : res.data) || {};
  if (user) {
    setUserDetails(user);
  }
  return user;
};
var login = ecomLogin;
var refreshToken = async () => {
  const res = await apiClient_default.get("/auth-service/ecom/refresh-token/refresh");
  const token = extractToken(res);
  if (token) {
    setToken(token);
  }
  const user = (res == null ? void 0 : res.data) || {};
  if (user) {
    setUserDetails(user);
  }
  return user;
};
var register = async ({
  firstName,
  middleName,
  lastName,
  mobileNumber,
  email,
  password,
  domainName
}) => {
  var _a, _b, _c;
  const res = await apiClient_default.post("/auth-service/cws/register", {
    firstName,
    middleName,
    lastName,
    mobileNumber,
    email,
    password,
    domainName
  });
  const token = extractToken(res);
  if (token) {
    setToken(token);
  }
  const transactionId = ((_a = res == null ? void 0 : res.data) == null ? void 0 : _a.transactionId) || ((_c = (_b = res == null ? void 0 : res.data) == null ? void 0 : _b.registerResponse) == null ? void 0 : _c.transactionId) || (res == null ? void 0 : res.transactionId);
  if (transactionId) {
    currentRegisterTransactionId = String(transactionId);
  }
  const user = (res == null ? void 0 : res.data) || {};
  if (user) {
    setUserDetails(user);
  }
  return user;
};
var validateRegisterOtp = async ({
  firstName,
  middleName,
  lastName,
  email,
  mobileNumber,
  password,
  domainName,
  transactionId,
  otp
}) => {
  const resolvedTransactionId = transactionId || currentRegisterTransactionId || null;
  if (!resolvedTransactionId) {
    throw new Error(
      "transactionId is required. Call register first or pass transactionId explicitly."
    );
  }
  const res = await apiClient_default.post("/auth-service/cws/register/validateOTP", {
    firstName,
    middleName,
    lastName,
    email,
    mobileNumber,
    password,
    domainName,
    transactionId: resolvedTransactionId,
    otp
  });
  const token = extractToken(res);
  if (token) {
    setToken(token);
  }
  const user = (res == null ? void 0 : res.data) || res || {};
  if (user) {
    setUserDetails(user);
  }
  return user;
};
var resendRegisterOtp = async ({
  email,
  mobileNumber,
  domainName
}) => {
  var _a, _b, _c;
  const res = await apiClient_default.post("/auth-service/cws/register/resendOTP", {
    email,
    mobileNumber,
    domainName
  });
  const transactionId = ((_a = res == null ? void 0 : res.data) == null ? void 0 : _a.transactionId) || ((_c = (_b = res == null ? void 0 : res.data) == null ? void 0 : _b.registerResponse) == null ? void 0 : _c.transactionId) || (res == null ? void 0 : res.transactionId);
  if (transactionId) {
    currentRegisterTransactionId = String(transactionId);
  }
  return (res == null ? void 0 : res.data) || res;
};
var generateSetNewPasswordOtp = async ({
  username,
  tenantSubDomain
}) => {
  var _a, _b;
  const res = await apiClient_default.post(
    "/auth-service/noauth/password/setNewPassword/generateOtp",
    {
      username,
      tenantSubDomain
    }
  );
  const transactionId = (res == null ? void 0 : res.transactionId) || ((_a = res == null ? void 0 : res.data) == null ? void 0 : _a.transactionId) || ((_b = res == null ? void 0 : res.response) == null ? void 0 : _b.transactionId);
  if (transactionId) {
    currentSetNewPasswordTransactionId = String(transactionId);
  }
  return (res == null ? void 0 : res.data) || res;
};
var setNewPassword = async ({
  username,
  transactionId,
  otp,
  newPassword,
  confirmPassword,
  tenantSubDomain
}) => {
  const resolvedTransactionId = transactionId || currentSetNewPasswordTransactionId || null;
  if (!resolvedTransactionId) {
    throw new Error(
      "transactionId is required. Call generateSetNewPasswordOtp first or pass transactionId explicitly."
    );
  }
  const res = await apiClient_default.post(
    "/auth-service/noauth/password/setNewPassword",
    {
      username,
      transactionId: resolvedTransactionId,
      otp,
      newPassword,
      confirmPassword,
      tenantSubDomain
    }
  );
  return (res == null ? void 0 : res.data) || res;
};
var sendRegisterVerifyMobileOtp = async ({
  email,
  mobileNumber,
  domainName
}) => {
  const res = await apiClient_default.post(
    "/auth-service/ecom/register/verify-mobile/send-otp",
    {
      email,
      mobileNumber,
      domainName
    }
  );
  return res;
};
var sendRegisterVerifyEmailOtp = async ({ email, domainName }) => {
  const res = await apiClient_default.post(
    "/auth-service/ecom/register/verify-email/send-otp",
    {
      email,
      domainName
    }
  );
  return res;
};
var validateRegisterVerifyEmailOtp = async ({
  email,
  domainName,
  emailValidationId,
  emailOtp
}) => {
  const res = await apiClient_default.post(
    "/auth-service/ecom/register/verify-email/validate-otp",
    {
      email,
      domainName,
      emailValidationId,
      emailOtp
    }
  );
  return res;
};
var validateRegisterVerifyMobileOtp = async ({
  email,
  mobileNumber,
  domainName,
  mobileValidationId,
  mobileOtp
}) => {
  const res = await apiClient_default.post(
    "/auth-service/ecom/register/verify-mobile/validate-otp",
    {
      email,
      mobileNumber,
      domainName,
      mobileValidationId,
      mobileOtp
    }
  );
  return res;
};
var validateRegisterReference = async ({
  email,
  domainName,
  referenceCode
}) => {
  const res = await apiClient_default.post(
    "/auth-service/ecom/register/validate-reference",
    {
      email,
      domainName,
      referenceCode
    }
  );
  return res;
};
var saveRegisterDetails = async ({
  mobileNumber,
  domainName,
  name,
  dateOfBirth,
  email,
  password
}) => {
  const res = await apiClient_default.post("/auth-service/ecom/register/save-details", {
    mobileNumber,
    domainName,
    name,
    dateOfBirth,
    email,
    password
  });
  return res;
};
var sendRegisterVerifyAadhaarOtp = async ({
  mobileNumber,
  domainName,
  aadhaarNumber
}) => {
  const res = await apiClient_default.post(
    "/auth-service/ecom/register/verify-aadhaar/send-otp",
    {
      mobileNumber,
      domainName,
      aadhaarNumber
    }
  );
  return res;
};
var initiateRegisterVerifyAadhaarDigilockerSession = async ({
  mobileNumber,
  domainName,
  aadhaarNumber,
  digilockerRedirectUrl
}) => {
  const res = await apiClient_default.post(
    "/auth-service/ecom/register/verify-aadhaar/initiate-digilocker-session",
    {
      mobileNumber,
      domainName,
      aadhaarNumber,
      digilockerRedirectUrl
    }
  );
  return res;
};
var checkRegisterVerifyAadhaarDigilockerSession = async ({
  mobileNumber,
  domainName,
  aadhaarNumber
}) => {
  const res = await apiClient_default.post(
    "/auth-service/ecom/register/verify-aadhaar/check-digilocker-session",
    {
      mobileNumber,
      domainName,
      aadhaarNumber
    }
  );
  return res;
};
var validateRegisterVerifyAadhaarOtp = async ({
  mobileNumber,
  domainName,
  aadhaarNumber,
  aadhaarValidationId,
  aadhaarOtp
}) => {
  const res = await apiClient_default.post(
    "/auth-service/ecom/register/verify-aadhaar/validate-otp",
    {
      mobileNumber,
      domainName,
      aadhaarNumber,
      aadhaarValidationId,
      aadhaarOtp
    }
  );
  return res;
};
var saveRegisterAadhaarAddress = async ({
  mobileNumber,
  domainName,
  saveAadhaarAddress,
  aadhaarAddress
}) => {
  const res = await apiClient_default.post(
    "/auth-service/ecom/register/save-aadhaar-address",
    {
      mobileNumber,
      domainName,
      saveAadhaarAddress,
      aadhaarAddress
    }
  );
  return res;
};
var validateRegisterPan = async ({
  mobileNumber,
  domainName,
  aadhaarNumber,
  panNumber
}) => {
  const res = await apiClient_default.post("/auth-service/ecom/register/validate-pan", {
    mobileNumber,
    domainName,
    aadhaarNumber,
    panNumber
  });
  return res;
};
var validateRegisterBankAccount = async ({
  mobileNumber,
  domainName,
  bankAccountHolderName,
  bankAccountNumber,
  bankIfsc
}) => {
  const res = await apiClient_default.post(
    "/auth-service/ecom/register/validate-bank-account",
    {
      mobileNumber,
      domainName,
      bankAccountHolderName,
      bankAccountNumber,
      bankIfsc
    }
  );
  return res;
};
var getActiveRegisterConsentRequirements = async ({
  mobileNumber,
  domainName
}) => {
  const res = await apiClient_default.post(
    "/auth-service/ecom/register/consents/active-requirements",
    {
      mobileNumber,
      domainName
    }
  );
  return res;
};
var registerEcom = async ({ mobileNumber, domainName, consent }) => {
  var _a, _b;
  const res = await apiClient_default.post("/auth-service/ecom/register", {
    mobileNumber,
    domainName,
    consent
  });
  const token = extractToken(res);
  if (token) {
    setToken(token);
  }
  const user = ((_a = res == null ? void 0 : res.data) == null ? void 0 : _a.loginResponse) || {};
  if (user) {
    setUserDetails((_b = res == null ? void 0 : res.data) == null ? void 0 : _b.loginResponse);
  }
  return (res == null ? void 0 : res.data) || res;
};
var checkTenant = async (tenantDomain) => {
  var _a;
  try {
    if (!tenantDomain) {
      throw new Error("checkTenant requires a tenantDomain");
    }
    const encodedDomain = encodeURIComponent(String(tenantDomain));
    const uri = `/auth-service/noauth/store/info/${encodedDomain}`;
    const res = await apiClient_default.get(uri);
    return res;
  } catch (error) {
    console.error(
      "Tenant Check Error:",
      ((_a = error == null ? void 0 : error.response) == null ? void 0 : _a.data) || error.message
    );
    throw error;
  }
  return;
};
var getTenantIdByDomain = async (tenantDomain) => {
  var _a;
  const storeInfo = await checkTenant(tenantDomain);
  const tenantId = (storeInfo == null ? void 0 : storeInfo.tenantId) ?? (storeInfo == null ? void 0 : storeInfo.tenantID) ?? (storeInfo == null ? void 0 : storeInfo.id) ?? (storeInfo == null ? void 0 : storeInfo.storeId) ?? (storeInfo == null ? void 0 : storeInfo.storeID) ?? ((_a = storeInfo == null ? void 0 : storeInfo.tenant) == null ? void 0 : _a.id);
  if (tenantId === void 0 || tenantId === null || tenantId === "") {
    throw new Error("Tenant ID not found in store info response");
  }
  setTenantId(tenantId);
  return String(tenantId);
};
var logout = async () => {
  var _a;
  try {
    await apiClient_default.get("/auth-service/ui/logout");
  } catch (err) {
    console.error("Logout Error:", ((_a = err == null ? void 0 : err.response) == null ? void 0 : _a.data) || err.message);
  } finally {
    clearToken();
    clearUserDetails();
    currentTenantId = null;
    currentRegisterTransactionId = null;
    currentSetNewPasswordTransactionId = null;
  }
};

// src/services/cartService.js
var CART_ID_STORAGE_KEY = "cart_id";
var currentCartId = null;
var toCartIdPayloadValue = (cartId) => {
  if (cartId === void 0 || cartId === null || cartId === "") {
    return null;
  }
  const normalized = String(cartId).trim();
  if (!normalized) {
    return null;
  }
  const parsed = Number(normalized);
  if (Number.isFinite(parsed) && parsed > 0) {
    return parsed;
  }
  return normalized;
};
var setCartId = (cartId) => {
  if (cartId === void 0 || cartId === null || cartId === "") {
    return;
  }
  currentCartId = String(cartId);
  if (typeof window !== "undefined") {
    localStorage.setItem(CART_ID_STORAGE_KEY, currentCartId);
  }
};
var getCartId = () => {
  if (currentCartId) {
    return currentCartId;
  }
  if (typeof window !== "undefined") {
    const storedCartId = localStorage.getItem(CART_ID_STORAGE_KEY);
    if (storedCartId) {
      currentCartId = storedCartId;
      return currentCartId;
    }
  }
  return null;
};
var resolveCartId = (incomingCartId) => {
  if (incomingCartId !== void 0 && incomingCartId !== null && incomingCartId !== "") {
    setCartId(incomingCartId);
    return toCartIdPayloadValue(incomingCartId);
  } else {
    currentCartId = "";
  }
  return toCartIdPayloadValue(getCartId());
};
var extractCartId = (responseData) => {
  var _a, _b, _c, _d;
  return (responseData == null ? void 0 : responseData.cartId) ?? (responseData == null ? void 0 : responseData.cartID) ?? ((_a = responseData == null ? void 0 : responseData.data) == null ? void 0 : _a.cartId) ?? ((_b = responseData == null ? void 0 : responseData.data) == null ? void 0 : _b.cartID) ?? ((_c = responseData == null ? void 0 : responseData.cart) == null ? void 0 : _c.cartId) ?? ((_d = responseData == null ? void 0 : responseData.cart) == null ? void 0 : _d.cartID);
};
var saveCartIdFromResponse = (responseData) => {
  const responseCartId = extractCartId(responseData);
  if (responseCartId !== void 0 && responseCartId !== null && responseCartId !== "") {
    setCartId(responseCartId);
  }
};
var addItemToCart = async ({
  operation = "AddItem",
  cartId,
  cartItems = []
}) => {
  var _a, _b, _c;
  try {
    const resolvedCartId = resolveCartId(cartId);
    const payload = {
      operation,
      ...resolvedCartId ? { cartId: resolvedCartId } : {},
      cartItems
    };
    const res = await apiClient_default.post(
      "/cart-service/ws/cart/addItemtoCart",
      payload
    );
    const responseData = (res == null ? void 0 : res.data) ? res.data : res;
    const token = ((_a = res == null ? void 0 : res.headers) == null ? void 0 : _a.authorization) || ((_b = res == null ? void 0 : res.headers) == null ? void 0 : _b.Authorization);
    if (token) {
      setToken(token);
    }
    saveCartIdFromResponse(responseData);
    const addCart = responseData || {};
    return responseData;
  } catch (error) {
    console.error(
      "Add To Cart API Error:",
      ((_c = error == null ? void 0 : error.response) == null ? void 0 : _c.data) || error.message
    );
    throw error;
  }
};
var updateItemQty = async ({
  operation = "UpdateItemQuantity",
  cartId,
  cartItems = []
}) => {
  var _a, _b, _c;
  try {
    const resolvedCartId = resolveCartId(cartId);
    const payload = {
      operation,
      cartId: resolvedCartId,
      cartItems
    };
    const res = await apiClient_default.post(
      "/cart-service/ws/cart/updateItemQty",
      payload
    );
    const responseData = (res == null ? void 0 : res.data) ? res.data : res;
    const token = ((_a = res == null ? void 0 : res.headers) == null ? void 0 : _a.authorization) || ((_b = res == null ? void 0 : res.headers) == null ? void 0 : _b.Authorization);
    if (token) {
      setToken(token);
    }
    saveCartIdFromResponse(responseData);
    const updateCart = responseData || {};
    return responseData;
  } catch (error) {
    console.error(
      "Update Item Qty API Error:",
      ((_c = error == null ? void 0 : error.response) == null ? void 0 : _c.data) || error.message
    );
    throw error;
  }
};
var refreshCart = async ({
  operation = "Refresh cart",
  cartId,
  customerMobileNumber,
  customerName = "",
  customerEmail = ""
}) => {
  var _a, _b, _c;
  try {
    const resolvedCartId = resolveCartId(cartId);
    const payload = {
      operation,
      cartId: resolvedCartId,
      customerMobileNumber,
      customerName,
      customerEmail
    };
    const res = await apiClient_default.post(
      "/cart-service/ws/cart/refreshCart",
      payload
    );
    const responseData = (res == null ? void 0 : res.data) ? res.data : res;
    const token = ((_a = res == null ? void 0 : res.headers) == null ? void 0 : _a.authorization) || ((_b = res == null ? void 0 : res.headers) == null ? void 0 : _b.Authorization);
    if (token) {
      setToken(token);
    }
    saveCartIdFromResponse(responseData);
    const refreshCartResponse = responseData || {};
    return responseData;
  } catch (error) {
    console.error(
      "Refresh Cart API Error:",
      ((_c = error == null ? void 0 : error.response) == null ? void 0 : _c.data) || error.message
    );
    throw error;
  }
};
var removeItemFromCart = async ({
  operation = "RemoveItem",
  cartId,
  cartItems = []
}) => {
  var _a, _b, _c;
  try {
    const resolvedCartId = resolveCartId(cartId);
    const payload = {
      operation,
      cartId: resolvedCartId,
      cartItems
    };
    const res = await apiClient_default.post(
      "/cart-service/ws/cart/removeItem",
      payload
    );
    const responseData = (res == null ? void 0 : res.data) ? res.data : res;
    const token = ((_a = res == null ? void 0 : res.headers) == null ? void 0 : _a.authorization) || ((_b = res == null ? void 0 : res.headers) == null ? void 0 : _b.Authorization);
    if (token) {
      setToken(token);
    }
    saveCartIdFromResponse(responseData);
    const removeCartResponse = responseData || {};
    return responseData;
  } catch (error) {
    console.error(
      "Remove Item API Error:",
      ((_c = error == null ? void 0 : error.response) == null ? void 0 : _c.data) || error.message
    );
    throw error;
  }
};

// src/services/customerService.js
var extractTokenFromResponse = (res) => {
  const headers = (res == null ? void 0 : res.headers) || {};
  return headers.authorization || headers.Authorization || headers["x-auth-token"] || headers["X-Auth-Token"] || headers["x-access-token"] || headers["X-Access-Token"] || null;
};
var getCustomer = async () => {
  var _a;
  try {
    const endpoint = "/customer-service/cws/customer";
    const res = await apiClient_default.get(endpoint);
    const responseData = (res == null ? void 0 : res.data) ? res.data : res;
    const token = extractTokenFromResponse(res);
    if (token) {
      setToken(token);
    }
    const customerResponse = responseData || {};
    return responseData;
  } catch (error) {
    console.error(
      "Customer API Error:",
      ((_a = error == null ? void 0 : error.response) == null ? void 0 : _a.data) || error.message
    );
    throw error;
  }
};
var getCustomerAddress = async () => {
  var _a;
  try {
    const endpoint = "/customer-service/cws/address";
    const res = await apiClient_default.get(endpoint);
    const responseData = (res == null ? void 0 : res.data) ? res.data : res;
    const token = extractTokenFromResponse(res);
    if (token) {
      setToken(token);
    }
    const addressResponse = responseData || {};
    return responseData;
  } catch (error) {
    console.error(
      "Customer Address API Error:",
      ((_a = error == null ? void 0 : error.response) == null ? void 0 : _a.data) || error.message
    );
    throw error;
  }
};
var addCustomerAddress = async (addressRequest = {}) => {
  var _a;
  try {
    if (!addressRequest || typeof addressRequest !== "object") {
      throw new Error("addCustomerAddress requires a valid request object");
    }
    const endpoint = "/customer-service/cws/address";
    const res = await apiClient_default.post(endpoint, addressRequest);
    const responseData = (res == null ? void 0 : res.data) ? res.data : res;
    const token = extractTokenFromResponse(res);
    if (token) {
      setToken(token);
    }
    const addAddressResponse = responseData || {};
    return responseData;
  } catch (error) {
    console.error(
      "Add Customer Address API Error:",
      ((_a = error == null ? void 0 : error.response) == null ? void 0 : _a.data) || error.message
    );
    throw error;
  }
};
var editCustomerAddress = async ({
  addressId,
  addressRequest = {}
} = {}) => {
  var _a;
  try {
    if (addressId === void 0 || addressId === null || addressId === "") {
      throw new Error("editCustomerAddress requires a valid addressId");
    }
    if (!addressRequest || typeof addressRequest !== "object") {
      throw new Error("editCustomerAddress requires a valid request object");
    }
    const encodedAddressId = encodeURIComponent(String(addressId));
    const endpoint = `/customer-service/cws/address/${encodedAddressId}`;
    const res = await apiClient_default.patch(endpoint, addressRequest);
    const responseData = (res == null ? void 0 : res.data) ? res.data : res;
    const token = extractTokenFromResponse(res);
    if (token) {
      setToken(token);
    }
    const editAddressResponse = responseData || {};
    return responseData;
  } catch (error) {
    console.error(
      "Edit Customer Address API Error:",
      ((_a = error == null ? void 0 : error.response) == null ? void 0 : _a.data) || error.message
    );
    throw error;
  }
};
var addBankDetails = async (bankDetailsRequest = {}) => {
  var _a;
  try {
    if (!bankDetailsRequest || typeof bankDetailsRequest !== "object") {
      throw new Error("addBankDetails requires a valid request object");
    }
    const { bankAccountNumber, bankIfsc } = bankDetailsRequest;
    if (!bankAccountNumber || String(bankAccountNumber).trim() === "") {
      throw new Error("addBankDetails requires bankAccountNumber");
    }
    if (!bankIfsc || String(bankIfsc).trim() === "") {
      throw new Error("addBankDetails requires bankIfsc");
    }
    const endpoint = "/customer-service/cws/customer/addBankDetails";
    const res = await apiClient_default.post(endpoint, bankDetailsRequest);
    const responseData = (res == null ? void 0 : res.data) ? res.data : res;
    const token = extractTokenFromResponse(res);
    if (token) {
      setToken(token);
    }
    const addBankDetailsResponse = responseData || {};
    return responseData;
  } catch (error) {
    console.error(
      "Add Bank Details API Error:",
      ((_a = error == null ? void 0 : error.response) == null ? void 0 : _a.data) || error.message
    );
    throw error;
  }
};
var addCustomerBeneficiary = async (beneficiaryRequest = {}) => {
  var _a;
  try {
    if (!beneficiaryRequest || typeof beneficiaryRequest !== "object") {
      throw new Error("addCustomerBeneficiary requires a valid request object");
    }
    const { fullName, emailId, mobileNumber, relationship } = beneficiaryRequest;
    if (!fullName || String(fullName).trim() === "") {
      throw new Error("addCustomerBeneficiary requires fullName");
    }
    if (!emailId || String(emailId).trim() === "") {
      throw new Error("addCustomerBeneficiary requires emailId");
    }
    if (!mobileNumber || String(mobileNumber).trim() === "") {
      throw new Error("addCustomerBeneficiary requires mobileNumber");
    }
    if (!relationship || String(relationship).trim() === "") {
      throw new Error("addCustomerBeneficiary requires relationship");
    }
    const endpoint = "/customer-service/ui/customer/beneficiary";
    const res = await apiClient_default.post(endpoint, beneficiaryRequest);
    const responseData = (res == null ? void 0 : res.data) ? res.data : res;
    const token = extractTokenFromResponse(res);
    if (token) {
      setToken(token);
    }
    return responseData;
  } catch (error) {
    console.error(
      "Add Customer Beneficiary API Error:",
      ((_a = error == null ? void 0 : error.response) == null ? void 0 : _a.data) || error.message
    );
    throw error;
  }
};
var getCustomerBeneficiaries = async () => {
  var _a;
  try {
    const endpoint = "/customer-service/ui/customer/beneficiary";
    const res = await apiClient_default.get(endpoint);
    const responseData = (res == null ? void 0 : res.data) ? res.data : res;
    const token = extractTokenFromResponse(res);
    if (token) {
      setToken(token);
    }
    return responseData;
  } catch (error) {
    console.error(
      "Get Customer Beneficiaries API Error:",
      ((_a = error == null ? void 0 : error.response) == null ? void 0 : _a.data) || error.message
    );
    throw error;
  }
};
var validatePinCode = async (pincode) => {
  var _a;
  try {
    if (pincode === void 0 || pincode === null || String(pincode).trim() === "") {
      throw new Error("validatePinCode requires a valid pincode");
    }
    const encodedPincode = encodeURIComponent(String(pincode).trim());
    const endpoint = `/customer-service/ui/customer/1/address/validate/pinCode/${encodedPincode}`;
    const res = await apiClient_default.get(endpoint);
    const responseData = (res == null ? void 0 : res.data) ? res.data : res;
    const token = extractTokenFromResponse(res);
    if (token) {
      setToken(token);
    }
    return responseData;
  } catch (error) {
    console.error(
      "Validate Pin Code API Error:",
      ((_a = error == null ? void 0 : error.response) == null ? void 0 : _a.data) || error.message
    );
    throw error;
  }
};

// src/services/orderService.js
var extractTokenFromResponse2 = (res) => {
  const headers = (res == null ? void 0 : res.headers) || {};
  return headers.authorization || headers.Authorization || headers["x-auth-token"] || headers["X-Auth-Token"] || headers["x-access-token"] || headers["X-Access-Token"] || null;
};
var placeOrder = async (orderRequest = {}) => {
  var _a;
  try {
    if (!orderRequest || typeof orderRequest !== "object") {
      throw new Error("placeOrder requires a valid order request object");
    }
    const res = await apiClient_default.post(
      "/order-service/ws/ecom/order/place",
      orderRequest
    );
    const responseData = (res == null ? void 0 : res.data) ? res.data : res;
    const token = extractTokenFromResponse2(res);
    if (token) {
      setToken(token);
    }
    const placeOrderResponse = responseData || {};
    return responseData;
  } catch (error) {
    console.error(
      "Place Order API Error:",
      ((_a = error == null ? void 0 : error.response) == null ? void 0 : _a.data) || error.message
    );
    throw error;
  }
};
var recordOrderPayment = async (paymentRequest = {}) => {
  var _a;
  try {
    if (!paymentRequest || typeof paymentRequest !== "object") {
      throw new Error(
        "recordOrderPayment requires a valid payment request object"
      );
    }
    const res = await apiClient_default.post(
      "/order-service/ws/order/payment",
      paymentRequest
    );
    const responseData = (res == null ? void 0 : res.data) ? res.data : res;
    const token = extractTokenFromResponse2(res);
    if (token) {
      setToken(token);
    }
    const paymentResponse = responseData || {};
    return responseData;
  } catch (error) {
    console.error(
      "Order Payment API Error:",
      ((_a = error == null ? void 0 : error.response) == null ? void 0 : _a.data) || error.message
    );
    throw error;
  }
};
var cancelOrderBySku = async (sku) => {
  var _a;
  try {
    if (!sku) {
      throw new Error("cancelOrderBySku requires a sku");
    }
    const encodedSku = encodeURIComponent(String(sku));
    const res = await apiClient_default.get(
      `/order-service/ws/order/cancel/${encodedSku}`
    );
    const responseData = (res == null ? void 0 : res.data) ? res.data : res;
    const token = extractTokenFromResponse2(res);
    if (token) {
      setToken(token);
    }
    const cancelOrderResponse = responseData || {};
    return responseData;
  } catch (error) {
    console.error(
      "Cancel Order API Error:",
      ((_a = error == null ? void 0 : error.response) == null ? void 0 : _a.data) || error.message
    );
    throw error;
  }
};
var checkTransactionStatus = async (orderId) => {
  var _a;
  try {
    if (!orderId) {
      throw new Error("checkTransactionStatus requires an orderId");
    }
    const encodedOrderId = encodeURIComponent(String(orderId));
    const res = await apiClient_default.get(
      `/order-service/ws/ecom/order/checkTransactionStatus/${encodedOrderId}`
    );
    const responseData = (res == null ? void 0 : res.data) ? res.data : res;
    const token = extractTokenFromResponse2(res);
    if (token) {
      setToken(token);
    }
    const transactionStatusResponse = responseData || {};
    return responseData;
  } catch (error) {
    console.error(
      "Check Transaction Status API Error:",
      ((_a = error == null ? void 0 : error.response) == null ? void 0 : _a.data) || error.message
    );
    throw error;
  }
};
var generatePaymentLink = async (orderId) => {
  var _a;
  try {
    if (!orderId) {
      throw new Error("generatePaymentLink requires an orderId");
    }
    const encodedOrderId = encodeURIComponent(String(orderId));
    const res = await apiClient_default.get(
      `/order-service/ws/ecom/order/generatePaymentLink/${encodedOrderId}`
    );
    const responseData = (res == null ? void 0 : res.data) ? res.data : res;
    const token = extractTokenFromResponse2(res);
    if (token) {
      setToken(token);
    }
    const paymentLinkResponse = responseData || {};
    return responseData;
  } catch (error) {
    console.error(
      "Generate Payment Link API Error:",
      ((_a = error == null ? void 0 : error.response) == null ? void 0 : _a.data) || error.message
    );
    throw error;
  }
};
var initiateRazorPayPayment = async (orderId) => {
  var _a;
  try {
    if (!orderId) {
      throw new Error("initiateRazorPayPayment requires an orderId");
    }
    const encodedOrderId = encodeURIComponent(String(orderId));
    const res = await apiClient_default.get(
      `/order-service/ws/ecom/order/initiateRazorPayPayment/${encodedOrderId}`
    );
    const responseData = (res == null ? void 0 : res.data) ? res.data : res;
    const token = extractTokenFromResponse2(res);
    if (token) {
      setToken(token);
    }
    return responseData;
  } catch (error) {
    console.error(
      "Initiate Razorpay Payment API Error:",
      ((_a = error == null ? void 0 : error.response) == null ? void 0 : _a.data) || error.message
    );
    throw error;
  }
};
var initiateHdfcPayment = async (orderId) => {
  var _a;
  try {
    if (!orderId) {
      throw new Error("initiateHdfcPayment requires an orderId");
    }
    const encodedOrderId = encodeURIComponent(String(orderId));
    const res = await apiClient_default.get(
      `/order-service/ws/ecom/order/initiateHdfcPayment/${encodedOrderId}`
    );
    const responseData = (res == null ? void 0 : res.data) ? res.data : res;
    const token = extractTokenFromResponse2(res);
    if (token) {
      setToken(token);
    }
    return responseData;
  } catch (error) {
    console.error(
      "Initiate HDFC Payment API Error:",
      ((_a = error == null ? void 0 : error.response) == null ? void 0 : _a.data) || error.message
    );
    throw error;
  }
};
var verifyHdfcStatus = async (uid) => {
  var _a;
  try {
    if (!uid || String(uid).trim() === "") {
      throw new Error("verifyHdfcStatus requires a uid");
    }
    const encodedUid = encodeURIComponent(String(uid));
    const res = await apiClient_default.get(
      `/order-service/ws/ecom/order/verifyHdfcStatus/${encodedUid}`
    );
    const responseData = (res == null ? void 0 : res.data) ? res.data : res;
    const token = extractTokenFromResponse2(res);
    if (token) {
      setToken(token);
    }
    return responseData;
  } catch (error) {
    console.error(
      "Verify HDFC Status API Error:",
      ((_a = error == null ? void 0 : error.response) == null ? void 0 : _a.data) || error.message
    );
    throw error;
  }
};
var verifyRazorpayStatus = async ({
  orderId,
  razorpayPaymentId,
  razorpayOrderId,
  razorpaySignature
} = {}) => {
  var _a;
  try {
    if (!orderId) {
      throw new Error("verifyRazorpayStatus requires an orderId");
    }
    if (!razorpayPaymentId || String(razorpayPaymentId).trim() === "") {
      throw new Error("verifyRazorpayStatus requires razorpayPaymentId");
    }
    if (!razorpayOrderId || String(razorpayOrderId).trim() === "") {
      throw new Error("verifyRazorpayStatus requires razorpayOrderId");
    }
    if (!razorpaySignature || String(razorpaySignature).trim() === "") {
      throw new Error("verifyRazorpayStatus requires razorpaySignature");
    }
    const encodedOrderId = encodeURIComponent(String(orderId));
    const res = await apiClient_default.post(
      `/order-service/ws/ecom/order/verifyRazorpayStatus/${encodedOrderId}`,
      {
        razorpayPaymentId,
        razorpayOrderId,
        razorpaySignature
      }
    );
    const responseData = (res == null ? void 0 : res.data) ? res.data : res;
    const token = extractTokenFromResponse2(res);
    if (token) {
      setToken(token);
    }
    return responseData;
  } catch (error) {
    console.error(
      "Verify Razorpay Status API Error:",
      ((_a = error == null ? void 0 : error.response) == null ? void 0 : _a.data) || error.message
    );
    throw error;
  }
};
var getOrderList = async () => {
  var _a;
  try {
    const endpoint = "/order-service/cws/order/list";
    const res = await apiClient_default.get(endpoint);
    const responseData = (res == null ? void 0 : res.data) ? res.data : res;
    const token = extractTokenFromResponse2(res);
    if (token) {
      setToken(token);
    }
    const orderListResponse = responseData || {};
    return responseData;
  } catch (error) {
    console.error(
      "Order List API Error:",
      ((_a = error == null ? void 0 : error.response) == null ? void 0 : _a.data) || error.message
    );
    throw error;
  }
};
var getOrderById = async (orderId) => {
  var _a;
  try {
    if (!orderId) {
      throw new Error("getOrderById requires an orderId");
    }
    const encodedOrderId = encodeURIComponent(String(orderId));
    const endpoint = `/order-service/cws/order/${encodedOrderId}`;
    const res = await apiClient_default.get(endpoint);
    const responseData = (res == null ? void 0 : res.data) ? res.data : res;
    const token = extractTokenFromResponse2(res);
    if (token) {
      setToken(token);
    }
    const orderByIdResponse = responseData || {};
    return responseData;
  } catch (error) {
    console.error(
      "Order By Id API Error:",
      ((_a = error == null ? void 0 : error.response) == null ? void 0 : _a.data) || error.message
    );
    throw error;
  }
};

// src/services/productService.js
var resolveTenantId = async (tenantId) => {
  var _a;
  if (tenantId !== void 0 && tenantId !== null && tenantId !== "") {
    return String(tenantId);
  }
  const cachedTenantId = getTenantId();
  if (cachedTenantId) {
    return String(cachedTenantId);
  }
  const user = getUserDetails() || {};
  const tenantDomain = (user == null ? void 0 : user.domainName) || (user == null ? void 0 : user.domain) || (user == null ? void 0 : user.tenantDomain) || (user == null ? void 0 : user.tenantSubDomain) || (user == null ? void 0 : user.storeDomain) || (typeof process !== "undefined" ? (_a = process == null ? void 0 : process.env) == null ? void 0 : _a.RDEP_DOMAIN_NAME : null);
  if (!tenantDomain) {
    throw new Error(
      "Tenant ID is missing. Pass tenantId or set RDEP_TENANT_ID/RDEP_DOMAIN_NAME."
    );
  }
  return await getTenantIdByDomain(tenantDomain);
};
var getCategoriesByTenant = async (tenantId) => {
  var _a, _b, _c;
  try {
    const resolvedTenantId = await resolveTenantId(tenantId);
    const encodedTenantId = encodeURIComponent(String(resolvedTenantId));
    const endpoint = `/product-service/ecom/${encodedTenantId}/category`;
    const res = await apiClient_default.get(endpoint);
    const responseData = (res == null ? void 0 : res.data) ? res.data : res;
    const token = ((_a = res == null ? void 0 : res.headers) == null ? void 0 : _a.authorization) || ((_b = res == null ? void 0 : res.headers) == null ? void 0 : _b.Authorization);
    if (token) {
      setToken(token);
    }
    return responseData;
  } catch (error) {
    console.error(
      "Get Categories API Error:",
      ((_c = error == null ? void 0 : error.response) == null ? void 0 : _c.data) || error.message
    );
    throw error;
  }
};
var getFiltersByTenantAndStore = async ({
  tenantId,
  categoryId
} = {}) => {
  var _a, _b, _c;
  try {
    const resolvedTenantId = await resolveTenantId(tenantId);
    const resolvedCategoryId = categoryId !== void 0 && categoryId !== null && categoryId !== "" ? String(categoryId) : null;
    if (!resolvedCategoryId) {
      throw new Error("getFiltersByTenantAndStore requires a categoryId");
    }
    const encodedTenantId = encodeURIComponent(String(resolvedTenantId));
    const encodedCategoryId = encodeURIComponent(String(resolvedCategoryId));
    const endpoint = `/product-service/ecom/${encodedTenantId}/filters/${encodedCategoryId}`;
    const res = await apiClient_default.get(endpoint);
    const responseData = (res == null ? void 0 : res.data) ? res.data : res;
    const token = ((_a = res == null ? void 0 : res.headers) == null ? void 0 : _a.authorization) || ((_b = res == null ? void 0 : res.headers) == null ? void 0 : _b.Authorization);
    if (token) {
      setToken(token);
    }
    return responseData;
  } catch (error) {
    console.error(
      "Get Filters API Error:",
      ((_c = error == null ? void 0 : error.response) == null ? void 0 : _c.data) || error.message
    );
    throw error;
  }
};
var getProductsByTenantAndStore = async ({
  tenantId,
  storeId,
  filters = [],
  pageSize = 10,
  pageNumber = 1
} = {}) => {
  var _a, _b, _c;
  try {
    const resolvedTenantId = await resolveTenantId(tenantId);
    const resolvedStoreId = storeId !== void 0 && storeId !== null && storeId !== "" ? String(storeId) : null;
    if (!resolvedStoreId) {
      throw new Error("getProductsByTenantAndStore requires a storeId");
    }
    const encodedTenantId = encodeURIComponent(String(resolvedTenantId));
    const encodedStoreId = encodeURIComponent(String(resolvedStoreId));
    const endpoint = `/product-service/ecom/${encodedTenantId}/products/${encodedStoreId}`;
    const payload = {
      filters,
      page_size: pageSize,
      page_number: pageNumber
    };
    const res = await apiClient_default.post(endpoint, payload);
    const responseData = (res == null ? void 0 : res.data) ? res.data : res;
    const token = ((_a = res == null ? void 0 : res.headers) == null ? void 0 : _a.authorization) || ((_b = res == null ? void 0 : res.headers) == null ? void 0 : _b.Authorization);
    if (token) {
      setToken(token);
    }
    return responseData;
  } catch (error) {
    console.error(
      "Get Products By Store API Error:",
      ((_c = error == null ? void 0 : error.response) == null ? void 0 : _c.data) || error.message
    );
    throw error;
  }
};
var searchProductsV2 = async ({
  tenantId,
  storeId,
  search = "",
  pageNo = 0,
  limit = 20,
  sortBy = "createdDate",
  sortOrder = "DESC",
  authToken
} = {}) => {
  var _a, _b, _c;
  try {
    const resolvedTenantId = await resolveTenantId(tenantId);
    const resolvedStoreId = storeId !== void 0 && storeId !== null && storeId !== "" ? String(storeId) : null;
    if (!resolvedStoreId) {
      throw new Error("searchProductsV2 requires a storeId");
    }
    const encodedTenantId = encodeURIComponent(String(resolvedTenantId));
    const encodedStoreId = encodeURIComponent(String(resolvedStoreId));
    const endpoint = `/product-service/ecom/${encodedTenantId}/products/${encodedStoreId}`;
    const payload = {
      search,
      pageNo,
      limit,
      sortBy,
      sortOrder
    };
    const config = {};
    if (authToken) {
      config.headers = {
        Authorization: `Bearer ${authToken}`,
        "Content-Type": "application/json"
      };
    }
    const res = Object.keys(config).length ? await apiClient_default.post(endpoint, payload, config) : await apiClient_default.post(endpoint, payload);
    const responseData = (res == null ? void 0 : res.data) ? res.data : res;
    const token = ((_a = res == null ? void 0 : res.headers) == null ? void 0 : _a.authorization) || ((_b = res == null ? void 0 : res.headers) == null ? void 0 : _b.Authorization);
    if (token) {
      setToken(token);
    }
    return responseData;
  } catch (error) {
    console.error(
      "Search Products V2 API Error:",
      ((_c = error == null ? void 0 : error.response) == null ? void 0 : _c.data) || error.message
    );
    throw error;
  }
};
var getProductDetailById = async ({
  tenantId,
  productId,
  variant = false,
  authToken
} = {}) => {
  var _a, _b, _c;
  try {
    const resolvedTenantId = await resolveTenantId(tenantId);
    const resolvedProductId = productId !== void 0 && productId !== null && productId !== "" ? String(productId) : null;
    if (!resolvedProductId) {
      throw new Error("getProductDetailById requires a productId");
    }
    const encodedTenantId = encodeURIComponent(String(resolvedTenantId));
    const encodedProductId = encodeURIComponent(String(resolvedProductId));
    let endpoint = `/product-service/ecom/${encodedTenantId}/product-overview/${encodedProductId}`;
    if (variant) {
      endpoint += "?variant=true";
    }
    const config = {};
    if (authToken) {
      config.headers = {
        Authorization: `Bearer ${authToken}`,
        "Content-Type": "application/json"
      };
    }
    const res = Object.keys(config).length ? await apiClient_default.get(endpoint, config) : await apiClient_default.get(endpoint);
    const responseData = (res == null ? void 0 : res.data) ? res.data : res;
    const token = ((_a = res == null ? void 0 : res.headers) == null ? void 0 : _a.authorization) || ((_b = res == null ? void 0 : res.headers) == null ? void 0 : _b.Authorization);
    if (token) {
      setToken(token);
    }
    return responseData;
  } catch (error) {
    console.error(
      "Get Product Overview API Error:",
      ((_c = error == null ? void 0 : error.response) == null ? void 0 : _c.data) || error.message
    );
    throw error;
  }
};
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  addBankDetails,
  addCustomerAddress,
  addCustomerBeneficiary,
  addItemToCart,
  cancelOrderBySku,
  checkRegisterVerifyAadhaarDigilockerSession,
  checkTenant,
  checkTransactionStatus,
  clearToken,
  clearUserDetails,
  customerLogin,
  ecomLogin,
  editCustomerAddress,
  generatePaymentLink,
  generateSetNewPasswordOtp,
  getActiveRegisterConsentRequirements,
  getCategoriesByTenant,
  getCustomer,
  getCustomerAddress,
  getCustomerBeneficiaries,
  getFiltersByTenantAndStore,
  getOrderById,
  getOrderList,
  getProductDetailById,
  getProductsByTenantAndStore,
  getRegisterTransactionId,
  getSetNewPasswordTransactionId,
  getTenantId,
  getTenantIdByDomain,
  getToken,
  getUserDetails,
  initClient,
  initiateHdfcPayment,
  initiateRazorPayPayment,
  initiateRegisterVerifyAadhaarDigilockerSession,
  login,
  logout,
  placeOrder,
  recordOrderPayment,
  refreshCart,
  refreshToken,
  register,
  registerEcom,
  removeItemFromCart,
  resendRegisterOtp,
  saveRegisterAadhaarAddress,
  saveRegisterDetails,
  searchProductsV2,
  sendRegisterVerifyAadhaarOtp,
  sendRegisterVerifyEmailOtp,
  sendRegisterVerifyMobileOtp,
  setNewPassword,
  setTenantId,
  setToken,
  setUserDetails,
  updateItemQty,
  validatePinCode,
  validateRegisterBankAccount,
  validateRegisterOtp,
  validateRegisterPan,
  validateRegisterReference,
  validateRegisterVerifyAadhaarOtp,
  validateRegisterVerifyEmailOtp,
  validateRegisterVerifyMobileOtp,
  verifyHdfcStatus,
  verifyRazorpayStatus
});
