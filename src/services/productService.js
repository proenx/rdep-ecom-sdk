import apiClient from "../core/apiClient.js";
import { setToken, clearToken } from "../core/tokenManager.js";
import { getUserDetails } from "../core/userDetails.js";
import { getTenantId, getTenantIdByDomain } from "./authService.js";

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
export const getCategoriesByTenant = async (tenantId) => {
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
export const getFiltersByTenantAndStore = async ({
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
export const getProductsByTenantAndStore = async ({
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
 * Search products (V2) by tenant and store
 * POST /product-service/ecom/{tenantId}/products/{storeId}
 * Supports optional `authToken` for Authorization header.
 */
export const searchProductsV2 = async ({
  tenantId,
  storeId,
  search = "",
  pageNo = 0,
  limit = 20,
  sortBy = "createdDate",
  sortOrder = "DESC",
  authToken,
} = {}) => {
  try {
    const resolvedTenantId = await resolveTenantId(tenantId);
    const resolvedStoreId =
      storeId !== undefined && storeId !== null && storeId !== ""
        ? String(storeId)
        : null;

    if (!resolvedStoreId) {
      throw new Error("searchProductsV2 requires a storeId");
    }

    const encodedTenantId = encodeURIComponent(String(resolvedTenantId));
    const encodedStoreId = encodeURIComponent(String(resolvedStoreId));
    const endpoint = `/product-service/ecom/${encodedTenantId}/products/${encodedStoreId}`;
    console.log("Search Products V2 API Endpoint:", endpoint);

    const payload = {
      search,
      pageNo,
      limit,
      sortBy,
      sortOrder,
    };

    const config = {};
    if (authToken) {
      config.headers = {
        Authorization: `Bearer ${authToken}`,
        "Content-Type": "application/json",
      };
    }

    const res = Object.keys(config).length
      ? await apiClient.post(endpoint, payload, config)
      : await apiClient.post(endpoint, payload);

    const responseData = res?.data ? res.data : res;

    const token = res?.headers?.authorization || res?.headers?.Authorization;
    if (token) {
      setToken(token);
    }

    return responseData;
  } catch (error) {
    console.error(
      "Search Products V2 API Error:",
      error?.response?.data || error.message,
    );
    throw error;
  }
};

/**
 * Fetch product overview by tenant and product
 */
export const getProductDetailById = async ({ tenantId, productId, variant = false, authToken } = {}) => {
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
    let endpoint = `/product-service/ecom/${encodedTenantId}/product-overview/${encodedProductId}`;
    if (variant) {
      endpoint += "?variant=true";
    }
    console.log("Product Overview API Endpoint:", endpoint);

    const config = {};
    if (authToken) {
      config.headers = {
        Authorization: `Bearer ${authToken}`,
        "Content-Type": "application/json",
      };
    }

    const res = Object.keys(config).length ? await apiClient.get(endpoint, config) : await apiClient.get(endpoint);

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
