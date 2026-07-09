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
    // Auth APIs need full response to access auth headers
    if (
      res.config.url.includes("/auth-service/ecom/auth") ||
      res.config.url.includes("/auth-service/cws/auth") ||
      res.config.url.includes("/auth-service/cws/register") ||
      res.config.url.includes("/auth-service/ecom/register")
    ) {
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

let currentTenantId = null;
let currentRegisterTransactionId = null;

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

const setTenantId = (tenantId) => {
  if (tenantId === undefined || tenantId === null || tenantId === "") {
    return;
  }
  currentTenantId = String(tenantId);
};

const getTenantId = () => {
  if (currentTenantId) {
    return currentTenantId;
  }

  if (typeof process !== "undefined" && process?.env?.RDEP_TENANT_ID) {
    return String(process.env.RDEP_TENANT_ID);
  }

  return null;
};

const getRegisterTransactionId = () => {
  if (currentRegisterTransactionId) {
    return currentRegisterTransactionId;
  }

  return null;
};

/**
 * Login
 */
const ecomLogin = async ({ username, password, domainName }) => {
  const res = await apiClient.post("/auth-service/ecom/auth", {
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
 * Customer Login
 */
const customerLogin = async ({ username, password, domainName }) => {
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
const register = async ({
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

  const transactionId =
    res?.data?.transactionId ||
    res?.data?.registerResponse?.transactionId ||
    res?.transactionId;

  if (transactionId) {
    currentRegisterTransactionId = String(transactionId);
  }

  const user = res?.data || {};
  if (user) {
    setUserDetails(user);
  }
  return user;
};

/**
 * Validate OTP for CWS registration
 */
const validateRegisterOtp = async ({
  firstName,
  middleName,
  lastName,
  email,
  mobileNumber,
  password,
  domainName,
  transactionId,
  otp,
}) => {
  const resolvedTransactionId =
    transactionId || currentRegisterTransactionId || null;

  if (!resolvedTransactionId) {
    throw new Error(
      "transactionId is required. Call register first or pass transactionId explicitly.",
    );
  }

  const res = await apiClient.post("/auth-service/cws/register/validateOTP", {
    firstName,
    middleName,
    lastName,
    email,
    mobileNumber,
    password,
    domainName,
    transactionId: resolvedTransactionId,
    otp,
  });

  const token = extractToken(res);
  if (token) {
    setToken(token);
  }

  const user = res?.data || res || {};
  if (user) {
    setUserDetails(user);
  }

  return user;
};

/**
 * Resend OTP for CWS registration
 */
const resendRegisterOtp = async ({
  email,
  mobileNumber,
  domainName,
}) => {
  const res = await apiClient.post("/auth-service/cws/register/resendOTP", {
    email,
    mobileNumber,
    domainName,
  });

  const transactionId =
    res?.data?.transactionId ||
    res?.data?.registerResponse?.transactionId ||
    res?.transactionId;

  if (transactionId) {
    currentRegisterTransactionId = String(transactionId);
  }

  return res?.data || res;
};

/**
 * Send OTP for mobile verification during registration
 */
const sendRegisterVerifyMobileOtp = async ({
  email,
  mobileNumber,
  domainName,
}) => {
  const res = await apiClient.post(
    "/auth-service/ecom/register/verify-mobile/send-otp",
    {
      email,
      mobileNumber,
      domainName,
    },
  );
  return res;
};

/**
 * Send OTP for email verification during registration
 */
const sendRegisterVerifyEmailOtp = async ({ email, domainName }) => {
  const res = await apiClient.post(
    "/auth-service/ecom/register/verify-email/send-otp",
    {
      email,
      domainName,
    },
  );
  return res;
};

/**
 * Validate OTP for email verification during registration
 */
const validateRegisterVerifyEmailOtp = async ({
  email,
  domainName,
  emailValidationId,
  emailOtp,
}) => {
  const res = await apiClient.post(
    "/auth-service/ecom/register/verify-email/validate-otp",
    {
      email,
      domainName,
      emailValidationId,
      emailOtp,
    },
  );
  return res;
};

/**
 * Validate OTP for mobile verification during registration
 */
const validateRegisterVerifyMobileOtp = async ({
  email,
  mobileNumber,
  domainName,
  mobileValidationId,
  mobileOtp,
}) => {
  const res = await apiClient.post(
    "/auth-service/ecom/register/verify-mobile/validate-otp",
    {
      email,
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
const validateRegisterReference = async ({
  email,
  domainName,
  referenceCode,
}) => {
  const res = await apiClient.post(
    "/auth-service/ecom/register/validate-reference",
    {
      email,
      domainName,
      referenceCode,
    },
  );
  return res;
};

/**
 * Save registration details after verification
 */
const saveRegisterDetails = async ({
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
const sendRegisterVerifyAadhaarOtp = async ({
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
const validateRegisterVerifyAadhaarOtp = async ({
  mobileNumber,
  domainName,
  aadhaarNumber,
  aadhaarValidationId,
  aadhaarOtp,
}) => {
  const res = await apiClient.post(
    "/auth-service/ecom/register/verify-aadhaar/validate-otp",
    {
      mobileNumber,
      domainName,
      aadhaarNumber,
      aadhaarValidationId,
      aadhaarOtp,
    },
  );
  return res;
};

/**
 * Save Aadhaar address during registration
 */
const saveRegisterAadhaarAddress = async ({
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
const validateRegisterPan = async ({
  mobileNumber,
  domainName,
  aadhaarNumber,
  panNumber,
}) => {
  const res = await apiClient.post("/auth-service/ecom/register/validate-pan", {
    mobileNumber,
    domainName,
    aadhaarNumber,
    panNumber,
  });
  return res;
};

/**
 * Validate bank account details during registration
 */
const validateRegisterBankAccount = async ({
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
const registerEcom = async ({ mobileNumber, domainName }) => {
  const res = await apiClient.post("/auth-service/ecom/register", {
    mobileNumber,
    domainName,
  });
  const token = extractToken(res);
  if (token) {
    setToken(token);
  }
  const user = res?.data?.loginResponse || {};
  if (user) {
    setUserDetails(res?.data?.loginResponse);
  }

  return res?.data || res;
};

/**
 * Check Tenant API
 */
const checkTenant = async (tenantDomain) => {
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
const getTenantIdByDomain = async (tenantDomain) => {
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
const logout = async () => {
  try {
    await apiClient.get("/auth-service/ui/logout");
  } catch (err) {
    console.error("Logout Error:", err?.response?.data || err.message);
  } finally {
    clearToken();
    clearUserDetails();
    currentTenantId = null;
    currentRegisterTransactionId = null;
  }
};

const CART_ID_STORAGE_KEY = "cart_id";
let currentCartId = null;

const toCartIdPayloadValue = (cartId) => {
  if (cartId === undefined || cartId === null || cartId === "") {
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

const setCartId = (cartId) => {
  if (cartId === undefined || cartId === null || cartId === "") {
    return;
  }

  currentCartId = String(cartId);
  if (typeof window !== "undefined") {
    localStorage.setItem(CART_ID_STORAGE_KEY, currentCartId);
  }
};

const getCartId = () => {
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

const resolveCartId = (incomingCartId) => {
  if (
    incomingCartId !== undefined &&
    incomingCartId !== null &&
    incomingCartId !== ""
  ) {
    setCartId(incomingCartId);
    return toCartIdPayloadValue(incomingCartId);
  }
  return toCartIdPayloadValue(getCartId());
};

const extractCartId = (responseData) => {
  return (
    responseData?.cartId ??
    responseData?.cartID ??
    responseData?.data?.cartId ??
    responseData?.data?.cartID ??
    responseData?.cart?.cartId ??
    responseData?.cart?.cartID
  );
};

const saveCartIdFromResponse = (responseData) => {
  const responseCartId = extractCartId(responseData);
  if (
    responseCartId !== undefined &&
    responseCartId !== null &&
    responseCartId !== ""
  ) {
    setCartId(responseCartId);
  }
};

/**
 * Add item(s) to cart
 */
const addItemToCart = async ({
  operation = "AddItem",
  cartId,
  cartItems = [],
}) => {
  try {
    const resolvedCartId = resolveCartId(cartId);
    const payload = {
      operation,
      ...(resolvedCartId ? { cartId: resolvedCartId } : {}),
      cartItems,
    };

    const res = await apiClient.post(
      "/cart-service/ws/cart/addItemtoCart",
      payload,
    );

    // apiClient returns only res.data for non-auth APIs.
    const responseData = res?.data ? res.data : res;

    // Token refresh headers are only available when full axios response is returned.
    const token = res?.headers?.authorization || res?.headers?.Authorization;
    if (token) {
      setToken(token);
    }
    saveCartIdFromResponse(responseData);
    const addCart = responseData || {};
    console.log("Add To Cart API Response:", addCart);

    return responseData;
  } catch (error) {
    console.error(
      "Add To Cart API Error:",
      error?.response?.data || error.message,
    );

    throw error;
  }
};

/**
 * Update quantity for item(s) in cart
 */
const updateItemQty = async ({
  operation = "UpdateItemQuantity",
  cartId,
  cartItems = [],
}) => {
  try {
    const resolvedCartId = resolveCartId(cartId);
    const payload = {
      operation,
      cartId: resolvedCartId,
      cartItems,
    };

    const res = await apiClient.post(
      "/cart-service/ws/cart/updateItemQty",
      payload,
    );

    // apiClient returns only res.data for non-auth APIs.
    const responseData = res?.data ? res.data : res;

    const token = res?.headers?.authorization || res?.headers?.Authorization;
    if (token) {
      setToken(token);
    }
    saveCartIdFromResponse(responseData);
    const updateCart = responseData || {};
    console.log("response from sdk", updateCart);

    return responseData;
  } catch (error) {
    console.error(
      "Update Item Qty API Error:",
      error?.response?.data || error.message,
    );

    throw error;
  }
};

/**
 * Refresh existing cart details
 */
const refreshCart = async ({
  operation = "Refresh cart",
  cartId,
  customerMobileNumber,
  customerName = "",
  customerEmail = "",
}) => {
  try {
    const resolvedCartId = resolveCartId(cartId);
    const payload = {
      operation,
      cartId: resolvedCartId,
      customerMobileNumber,
      customerName,
      customerEmail,
    };

    const res = await apiClient.post(
      "/cart-service/ws/cart/refreshCart",
      payload,
    );

    // apiClient returns only res.data for non-auth APIs.
    const responseData = res?.data ? res.data : res;

    const token = res?.headers?.authorization || res?.headers?.Authorization;
    if (token) {
      setToken(token);
    }
    saveCartIdFromResponse(responseData);
    const refreshCartResponse = responseData || {};
    console.log("Refresh Cart API Response:", refreshCartResponse);

    return responseData;
  } catch (error) {
    console.error(
      "Refresh Cart API Error:",
      error?.response?.data || error.message,
    );

    throw error;
  }
};

/**
 * Remove item(s) from cart
 */
const removeItemFromCart = async ({
  operation = "RemoveItem",
  cartId,
  cartItems = [],
}) => {
  try {
    const resolvedCartId = resolveCartId(cartId);
    const payload = {
      operation,
      cartId: resolvedCartId,
      cartItems,
    };

    const res = await apiClient.post(
      "/cart-service/ws/cart/removeItem",
      payload,
    );

    // apiClient returns only res.data for non-auth APIs.
    const responseData = res?.data ? res.data : res;

    const token = res?.headers?.authorization || res?.headers?.Authorization;
    if (token) {
      setToken(token);
    }
    saveCartIdFromResponse(responseData);
    const removeCartResponse = responseData || {};
    console.log("Remove Item API Response:", removeCartResponse);

    return responseData;
  } catch (error) {
    console.error(
      "Remove Item API Error:",
      error?.response?.data || error.message,
    );

    throw error;
  }
};

const extractTokenFromResponse$1 = (res) => {
  const headers = res?.headers || {};
  return (
    headers.authorization ||
    headers.Authorization ||
    headers["x-auth-token"] ||
    headers["X-Auth-Token"] ||
    headers["x-access-token"] ||
    headers["X-Access-Token"] ||
    null
  );
};

/**
 * Fetch customer details
 */
const getCustomer = async () => {
  try {
    const endpoint = "/customer-service/cws/customer";
    const res = await apiClient.get(endpoint);

    // apiClient returns only res.data for non-auth APIs.
    const responseData = res?.data ? res.data : res;

    const token = extractTokenFromResponse$1(res);
    if (token) {
      setToken(token);
    }

    const customerResponse = responseData || {};
    console.log("Customer API Response:", customerResponse);

    return responseData;
  } catch (error) {
    console.error(
      "Customer API Error:",
      error?.response?.data || error.message,
    );
    throw error;
  }
};

/**
 * Fetch customer address list
 */
const getCustomerAddress = async () => {
  try {
    const endpoint = "/customer-service/cws/address";
    const res = await apiClient.get(endpoint);

    // apiClient returns only res.data for non-auth APIs.
    const responseData = res?.data ? res.data : res;

    const token = extractTokenFromResponse$1(res);
    if (token) {
      setToken(token);
    }

    const addressResponse = responseData || {};
    console.log("Customer Address API Response:", addressResponse);

    return responseData;
  } catch (error) {
    console.error(
      "Customer Address API Error:",
      error?.response?.data || error.message,
    );
    throw error;
  }
};

/**
 * Add customer address
 */
const addCustomerAddress = async (addressRequest = {}) => {
  try {
    if (!addressRequest || typeof addressRequest !== "object") {
      throw new Error("addCustomerAddress requires a valid request object");
    }

    const endpoint = "/customer-service/cws/address";
    const res = await apiClient.post(endpoint, addressRequest);

    // apiClient returns only res.data for non-auth APIs.
    const responseData = res?.data ? res.data : res;

    const token = extractTokenFromResponse$1(res);
    if (token) {
      setToken(token);
    }

    const addAddressResponse = responseData || {};
    console.log("Add Customer Address API Response:", addAddressResponse);

    return responseData;
  } catch (error) {
    console.error(
      "Add Customer Address API Error:",
      error?.response?.data || error.message,
    );
    throw error;
  }
};

/**
 * Edit customer address by addressId
 */
const editCustomerAddress = async ({
  addressId,
  addressRequest = {},
} = {}) => {
  try {
    if (addressId === undefined || addressId === null || addressId === "") {
      throw new Error("editCustomerAddress requires a valid addressId");
    }

    if (!addressRequest || typeof addressRequest !== "object") {
      throw new Error("editCustomerAddress requires a valid request object");
    }

    const encodedAddressId = encodeURIComponent(String(addressId));
    const endpoint = `/customer-service/cws/address/${encodedAddressId}`;
    const res = await apiClient.patch(endpoint, addressRequest);

    // apiClient returns only res.data for non-auth APIs.
    const responseData = res?.data ? res.data : res;

    const token = extractTokenFromResponse$1(res);
    if (token) {
      setToken(token);
    }

    const editAddressResponse = responseData || {};
    console.log("Edit Customer Address API Response:", editAddressResponse);

    return responseData;
  } catch (error) {
    console.error(
      "Edit Customer Address API Error:",
      error?.response?.data || error.message,
    );
    throw error;
  }
};

const extractTokenFromResponse = (res) => {
  const headers = res?.headers || {};
  return (
    headers.authorization ||
    headers.Authorization ||
    headers["x-auth-token"] ||
    headers["X-Auth-Token"] ||
    headers["x-access-token"] ||
    headers["X-Access-Token"] ||
    null
  );
};

/**
 * Place order
 */
const placeOrder = async (orderRequest = {}) => {
  try {
    if (!orderRequest || typeof orderRequest !== "object") {
      throw new Error("placeOrder requires a valid order request object");
    }

    const res = await apiClient.post(
      "/order-service/ws/ecom/order/place",
      orderRequest,
    );

    // apiClient returns only res.data for non-auth APIs.
    const responseData = res?.data ? res.data : res;
    // console.log("Place Order API:", res);
    const token = extractTokenFromResponse(res);
    if (token) {
      setToken(token);
    }

    const placeOrderResponse = responseData || {};
    // console.log("Place Order API Response:", placeOrderResponse);

    return responseData;
  } catch (error) {
    console.error(
      "Place Order API Error:",
      error?.response?.data || error.message,
    );

    throw error;
  }
};

/**
 * Record order payment
 */
const recordOrderPayment = async (paymentRequest = {}) => {
  try {
    if (!paymentRequest || typeof paymentRequest !== "object") {
      throw new Error(
        "recordOrderPayment requires a valid payment request object",
      );
    }

    const res = await apiClient.post(
      "/order-service/ws/order/payment",
      paymentRequest,
    );

    // apiClient returns only res.data for non-auth APIs.
    const responseData = res?.data ? res.data : res;

    const token = extractTokenFromResponse(res);
    if (token) {
      setToken(token);
    }

    const paymentResponse = responseData || {};
    // console.log("Order Payment API Response:", paymentResponse);

    return responseData;
  } catch (error) {
    console.error(
      "Order Payment API Error:",
      error?.response?.data || error.message,
    );

    throw error;
  }
};

/**
 * Cancel order by SKU
 */
const cancelOrderBySku = async (sku) => {
  try {
    if (!sku) {
      throw new Error("cancelOrderBySku requires a sku");
    }

    const encodedSku = encodeURIComponent(String(sku));
    const res = await apiClient.get(
      `/order-service/ws/order/cancel/${encodedSku}`,
    );

    // apiClient returns only res.data for non-auth APIs.
    const responseData = res?.data ? res.data : res;

    const token = extractTokenFromResponse(res);
    if (token) {
      setToken(token);
    }
    const cancelOrderResponse = responseData || {};
    // console.log("Cancel Order API Response:", cancelOrderResponse);

    return responseData;
  } catch (error) {
    console.error(
      "Cancel Order API Error:",
      error?.response?.data || error.message,
    );

    throw error;
  }
};

/**
 * Check transaction status
 */
const checkTransactionStatus = async (orderId) => {
  try {
    if (!orderId) {
      throw new Error("checkTransactionStatus requires an orderId");
    }

    const encodedOrderId = encodeURIComponent(String(orderId));
    const res = await apiClient.get(
      `/order-service/ws/ecom/order/checkTransactionStatus/${encodedOrderId}`,
    );

    // apiClient returns only res.data for non-auth APIs.
    const responseData = res?.data ? res.data : res;

    const token = extractTokenFromResponse(res);
    if (token) {
      setToken(token);
    }

    const transactionStatusResponse = responseData || {};
    // console.log(
    //   "Check Transaction Status API Response:",
    //   JSON.stringify(transactionStatusResponse, null, 2),
    // );

    return responseData;
  } catch (error) {
    console.error(
      "Check Transaction Status API Error:",
      error?.response?.data || error.message,
    );

    throw error;
  }
};

/**
 * Generate payment link
 */
const generatePaymentLink = async (orderId) => {
  try {
    if (!orderId) {
      throw new Error("generatePaymentLink requires an orderId");
    }

    const encodedOrderId = encodeURIComponent(String(orderId));
    const res = await apiClient.get(
      `/order-service/ws/ecom/order/generatePaymentLink/${encodedOrderId}`,
    );

    // apiClient returns only res.data for non-auth APIs.
    const responseData = res?.data ? res.data : res;
    console.log(
      "Generate Payment Link API Response:",
      JSON.stringify(responseData || {}, null, 2),
    );

    const token = extractTokenFromResponse(res);
    if (token) {
      setToken(token);
    }

    const paymentLinkResponse = responseData || {};
    console.log("Generate Payment Link API Response:", paymentLinkResponse);

    return responseData;
  } catch (error) {
    console.error(
      "Generate Payment Link API Error:",
      error?.response?.data || error.message,
    );

    throw error;
  }
};

/**
 * Fetch order list
 */
const getOrderList = async () => {
  try {
    const endpoint = "/order-service/cws/order/list";
    const res = await apiClient.get(endpoint);

    // apiClient returns only res.data for non-auth APIs.
    const responseData = res?.data ? res.data : res;

    const token = extractTokenFromResponse(res);
    if (token) {
      setToken(token);
    }

    const orderListResponse = responseData || {};
    console.log("Order List API Response:", orderListResponse);

    return responseData;
  } catch (error) {
    console.error(
      "Order List API Error:",
      error?.response?.data || error.message,
    );

    throw error;
  }
};

/**
 * Fetch order details by orderId
 */
const getOrderById = async (orderId) => {
  try {
    if (!orderId) {
      throw new Error("getOrderById requires an orderId");
    }

    const encodedOrderId = encodeURIComponent(String(orderId));
    const endpoint = `/order-service/cws/order/${encodedOrderId}`;
    const res = await apiClient.get(endpoint);

    // apiClient returns only res.data for non-auth APIs.
    const responseData = res?.data ? res.data : res;

    const token = extractTokenFromResponse(res);
    if (token) {
      setToken(token);
    }

    const orderByIdResponse = responseData || {};
    console.log("Order By Id API Response:", orderByIdResponse);

    return responseData;
  } catch (error) {
    console.error(
      "Order By Id API Error:",
      error?.response?.data || error.message,
    );

    throw error;
  }
};

const resolveTenantId = async (tenantId) => {
  if (tenantId !== undefined && tenantId !== null && tenantId !== "") {
    return String(tenantId);
  }

  const cachedTenantId = getTenantId();
  if (cachedTenantId) {
    return String(cachedTenantId);
  }

  const user = getUserDetails() || {};
  const tenantDomain =
    user?.domainName ||
    user?.domain ||
    user?.tenantDomain ||
    user?.tenantSubDomain ||
    user?.storeDomain ||
    (typeof process !== "undefined" ? process?.env?.RDEP_DOMAIN_NAME : null);

  if (!tenantDomain) {
    throw new Error(
      "Tenant ID is missing. Pass tenantId or set RDEP_TENANT_ID/RDEP_DOMAIN_NAME.",
    );
  }

  return await getTenantIdByDomain(tenantDomain);
};

/**
 * Fetch product categories by tenant
 */
const getCategoriesByTenant = async (tenantId) => {
  try {
    const resolvedTenantId = await resolveTenantId(tenantId);
    const encodedTenantId = encodeURIComponent(String(resolvedTenantId));
    const endpoint = `/product-service/ecom/${encodedTenantId}/category`;
    console.log("Category API Endpoint:", endpoint);

    const res = await apiClient.get(endpoint);

    // apiClient returns only res.data for non-auth APIs.
    const responseData = res?.data ? res.data : res;

    const token = res?.headers?.authorization || res?.headers?.Authorization;
    if (token) {
      setToken(token);
    }

    return responseData;
  } catch (error) {
    console.error(
      "Get Categories API Error:",
      error?.response?.data || error.message,
    );
    throw error;
  }
};

/**
 * Fetch product filters by tenant and category
 */
const getFiltersByTenantAndStore = async ({
  tenantId,
  categoryId,
} = {}) => {
  try {
    const resolvedTenantId = await resolveTenantId(tenantId);
    const resolvedCategoryId =
      categoryId !== undefined && categoryId !== null && categoryId !== ""
        ? String(categoryId)
        : null;

    if (!resolvedCategoryId) {
      throw new Error("getFiltersByTenantAndStore requires a categoryId");
    }

    const encodedTenantId = encodeURIComponent(String(resolvedTenantId));
    const encodedCategoryId = encodeURIComponent(String(resolvedCategoryId));
    const endpoint = `/product-service/ecom/${encodedTenantId}/filters/${encodedCategoryId}`;
    console.log("Filters API Endpoint:", endpoint);

    const res = await apiClient.get(endpoint);

    // apiClient returns only res.data for non-auth APIs.
    const responseData = res?.data ? res.data : res;

    const token = res?.headers?.authorization || res?.headers?.Authorization;
    if (token) {
      setToken(token);
    }

    return responseData;
  } catch (error) {
    console.error(
      "Get Filters API Error:",
      error?.response?.data || error.message,
    );
    throw error;
  }
};

/**
 * Fetch products by tenant and store with filters
 */
const getProductsByTenantAndStore = async ({
  tenantId,
  storeId,
  filters = [],
  pageSize = 10,
  pageNumber = 1,
} = {}) => {
  try {
    const resolvedTenantId = await resolveTenantId(tenantId);
    const resolvedStoreId =
      storeId !== undefined && storeId !== null && storeId !== ""
        ? String(storeId)
        : null;

    if (!resolvedStoreId) {
      throw new Error("getProductsByTenantAndStore requires a storeId");
    }

    const encodedTenantId = encodeURIComponent(String(resolvedTenantId));
    const encodedStoreId = encodeURIComponent(String(resolvedStoreId));
    const endpoint = `/product-service/ecom/${encodedTenantId}/products/${encodedStoreId}`;
    console.log("Products API Endpoint:", endpoint);

    const payload = {
      filters,
      page_size: pageSize,
      page_number: pageNumber,
    };

    const res = await apiClient.post(endpoint, payload);

    // apiClient returns only res.data for non-auth APIs.
    const responseData = res?.data ? res.data : res;

    const token = res?.headers?.authorization || res?.headers?.Authorization;
    if (token) {
      setToken(token);
    }

    return responseData;
  } catch (error) {
    console.error(
      "Get Products By Store API Error:",
      error?.response?.data || error.message,
    );
    throw error;
  }
};

/**
 * Fetch product overview by tenant and product
 */
const getProductDetailById = async ({ tenantId, productId } = {}) => {
  try {
    const resolvedTenantId = await resolveTenantId(tenantId);
    const resolvedProductId =
      productId !== undefined && productId !== null && productId !== ""
        ? String(productId)
        : null;

    if (!resolvedProductId) {
      throw new Error("getProductDetailById requires a productId");
    }

    const encodedTenantId = encodeURIComponent(String(resolvedTenantId));
    const encodedProductId = encodeURIComponent(String(resolvedProductId));
    const endpoint = `/product-service/ecom/${encodedTenantId}/product-overview/${encodedProductId}`;
    console.log("Product Overview API Endpoint:", endpoint);

    const res = await apiClient.get(endpoint);

    // apiClient returns only res.data for non-auth APIs.
    const responseData = res?.data ? res.data : res;

    const token = res?.headers?.authorization || res?.headers?.Authorization;
    if (token) {
      setToken(token);
    }

    return responseData;
  } catch (error) {
    console.error(
      "Get Product Overview API Error:",
      error?.response?.data || error.message,
    );
    throw error;
  }
};

export { addCustomerAddress, addItemToCart, cancelOrderBySku, checkTenant, checkTransactionStatus, clearToken, clearUserDetails, customerLogin, ecomLogin, editCustomerAddress, generatePaymentLink, getCategoriesByTenant, getCustomer, getCustomerAddress, getFiltersByTenantAndStore, getOrderById, getOrderList, getProductDetailById, getProductsByTenantAndStore, getRegisterTransactionId, getTenantId, getTenantIdByDomain, getToken, getUserDetails, initClient, logout, placeOrder, recordOrderPayment, refreshCart, register, registerEcom, removeItemFromCart, resendRegisterOtp, saveRegisterAadhaarAddress, saveRegisterDetails, sendRegisterVerifyAadhaarOtp, sendRegisterVerifyEmailOtp, sendRegisterVerifyMobileOtp, setTenantId, setToken, setUserDetails, updateItemQty, validateRegisterBankAccount, validateRegisterOtp, validateRegisterPan, validateRegisterReference, validateRegisterVerifyAadhaarOtp, validateRegisterVerifyEmailOtp, validateRegisterVerifyMobileOtp };
