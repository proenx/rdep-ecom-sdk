// src/core/apiClient.js
import axios from "axios";

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
var apiClient = axios.create();
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
  var _a, _b;
  const res = await apiClient_default.post("/auth-service/cws/auth", {
    username,
    password,
    domainName
  });
  const token = ((_a = res == null ? void 0 : res.headers) == null ? void 0 : _a.authorization) || ((_b = res == null ? void 0 : res.headers) == null ? void 0 : _b.Authorization);
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
  var _a, _b;
  const res = await apiClient_default.post("/auth-service/cws/register", {
    firstName,
    middleName,
    lastName,
    mobileNumber,
    email,
    password,
    domainName
  });
  const token = ((_a = res == null ? void 0 : res.headers) == null ? void 0 : _a.authorization) || ((_b = res == null ? void 0 : res.headers) == null ? void 0 : _b.Authorization);
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

// src/services/orderService.js
var cancelOrderBySku = async (sku) => {
  var _a, _b, _c;
  try {
    if (!sku) {
      throw new Error("cancelOrderBySku requires a sku");
    }
    const encodedSku = encodeURIComponent(String(sku));
    const res = await apiClient_default.get(
      `/order-service/ws/order/cancel/${encodedSku}`
    );
    const responseData = (res == null ? void 0 : res.data) ? res.data : res;
    const token = ((_a = res == null ? void 0 : res.headers) == null ? void 0 : _a.authorization) || ((_b = res == null ? void 0 : res.headers) == null ? void 0 : _b.Authorization);
    if (token) {
      setToken(token);
    }
    const cancelOrderResponse = responseData || {};
    console.log("Cancel Order API Response:", cancelOrderResponse);
    return responseData;
  } catch (error) {
    console.error(
      "Cancel Order API Error:",
      ((_c = error == null ? void 0 : error.response) == null ? void 0 : _c.data) || error.message
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
export {
  addItemToCart,
  cancelOrderBySku,
  checkTenant,
  clearToken,
  clearUserDetails,
  getCategoriesByTenant,
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
  refreshCart,
  register,
  setTenantId,
  setToken,
  setUserDetails,
  updateItemQty
};
