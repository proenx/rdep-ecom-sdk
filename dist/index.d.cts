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
      res.config.url.includes("/auth-service/cws/auth") ||
      res.config.url.includes("/auth-service/cws/register")
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

/**
 * Login
 */
const login = async ({ username, password, domainName }) => {
  const res = await apiClient.post("/auth-service/cws/auth", {
    username,
    password,
    domainName: domainName,
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
  }
};

/**
 * Add item(s) to cart
 */
const addItemToCart = async ({
  operation = "AddItem",
  cartItems = [],
}) => {
  try {
    const payload = {
      operation,
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
    const payload = {
      operation,
      cartId,
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
    const payload = {
      operation,
      cartId,
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
    const payload = {
      operation,
      cartId,
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

    const token = res?.headers?.authorization || res?.headers?.Authorization;
    if (token) {
      setToken(token);
    }
    const cancelOrderResponse = responseData || {};
    console.log("Cancel Order API Response:", cancelOrderResponse);

    return responseData;
  } catch (error) {
    console.error(
      "Cancel Order API Error:",
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

export { addItemToCart, cancelOrderBySku, checkTenant, clearToken, clearUserDetails, getCategoriesByTenant, getFiltersByTenantAndStore, getProductDetailById, getProductsByTenantAndStore, getTenantId, getTenantIdByDomain, getToken, getUserDetails, initClient, login, logout, refreshCart, register, removeItemFromCart, setTenantId, setToken, setUserDetails, updateItemQty };
