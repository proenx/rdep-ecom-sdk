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
  addCustomerAddress: () => addCustomerAddress,
  addItemToCart: () => addItemToCart,
  cancelOrderBySku: () => cancelOrderBySku,
  checkTenant: () => checkTenant,
  clearToken: () => clearToken,
  clearUserDetails: () => clearUserDetails,
  editCustomerAddress: () => editCustomerAddress,
  getCategoriesByTenant: () => getCategoriesByTenant,
  getCustomerAddress: () => getCustomerAddress,
  getFiltersByTenantAndStore: () => getFiltersByTenantAndStore,
  getProductDetailById: () => getProductDetailById,
  getProductsByTenantAndStore: () => getProductsByTenantAndStore,
  getTenantId: () => getTenantId,
  getTenantIdByDomain: () => getTenantIdByDomain,
  getToken: () => getToken,
  getUserDetails: () => getUserDetails,
  initClient: () => initClient,
  login: () => login,
  logout: () => logout,
  placeOrder: () => placeOrder,
  recordOrderPayment: () => recordOrderPayment,
  refreshCart: () => refreshCart,
  register: () => register,
  removeItemFromCart: () => removeItemFromCart,
  setTenantId: () => setTenantId,
  setToken: () => setToken,
  setUserDetails: () => setUserDetails,
  updateItemQty: () => updateItemQty
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
    if (res.config.url.includes("/auth-service/cws/auth") || res.config.url.includes("/auth-service/cws/register")) {
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
var login = async ({ username, password, domainName }) => {
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
var register = async ({
  firstName,
  middleName,
  lastName,
  mobileNumber,
  email,
  password,
  domainName
}) => {
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
  const user = (res == null ? void 0 : res.data) || {};
  if (user) {
    setUserDetails(user);
  }
  return user;
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
  }
};

// src/services/cartService.js
var addItemToCart = async ({
  operation = "AddItem",
  cartItems = []
}) => {
  var _a, _b, _c;
  try {
    const payload = {
      operation,
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
    const addCart = responseData || {};
    console.log("Add To Cart API Response:", addCart);
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
    const payload = {
      operation,
      cartId,
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
    const updateCart = responseData || {};
    console.log("response from sdk", updateCart);
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
    const payload = {
      operation,
      cartId,
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
    const refreshCartResponse = responseData || {};
    console.log("Refresh Cart API Response:", refreshCartResponse);
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
    const payload = {
      operation,
      cartId,
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
    const removeCartResponse = responseData || {};
    console.log("Remove Item API Response:", removeCartResponse);
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
    console.log("Customer Address API Response:", addressResponse);
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
    console.log("Add Customer Address API Response:", addAddressResponse);
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
    console.log("Edit Customer Address API Response:", editAddressResponse);
    return responseData;
  } catch (error) {
    console.error(
      "Edit Customer Address API Error:",
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
      "/order-service/ws/order/place",
      orderRequest
    );
    const responseData = (res == null ? void 0 : res.data) ? res.data : res;
    console.log("Place Order API:", res);
    const token = extractTokenFromResponse2(res);
    if (token) {
      setToken(token);
    }
    const placeOrderResponse = responseData || {};
    console.log("Place Order API Response:", placeOrderResponse);
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
    console.log("Order Payment API Response:", paymentResponse);
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
    console.log("Cancel Order API Response:", cancelOrderResponse);
    return responseData;
  } catch (error) {
    console.error(
      "Cancel Order API Error:",
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
    console.log("Category API Endpoint:", endpoint);
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
    console.log("Filters API Endpoint:", endpoint);
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
    console.log("Products API Endpoint:", endpoint);
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
var getProductDetailById = async ({ tenantId, productId } = {}) => {
  var _a, _b, _c;
  try {
    const resolvedTenantId = await resolveTenantId(tenantId);
    const resolvedProductId = productId !== void 0 && productId !== null && productId !== "" ? String(productId) : null;
    if (!resolvedProductId) {
      throw new Error("getProductDetailById requires a productId");
    }
    const encodedTenantId = encodeURIComponent(String(resolvedTenantId));
    const encodedProductId = encodeURIComponent(String(resolvedProductId));
    const endpoint = `/product-service/ecom/${encodedTenantId}/product-overview/${encodedProductId}`;
    console.log("Product Overview API Endpoint:", endpoint);
    const res = await apiClient_default.get(endpoint);
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
  addCustomerAddress,
  addItemToCart,
  cancelOrderBySku,
  checkTenant,
  clearToken,
  clearUserDetails,
  editCustomerAddress,
  getCategoriesByTenant,
  getCustomerAddress,
  getFiltersByTenantAndStore,
  getProductDetailById,
  getProductsByTenantAndStore,
  getTenantId,
  getTenantIdByDomain,
  getToken,
  getUserDetails,
  initClient,
  login,
  logout,
  placeOrder,
  recordOrderPayment,
  refreshCart,
  register,
  removeItemFromCart,
  setTenantId,
  setToken,
  setUserDetails,
  updateItemQty
});
