import {
  initClient,
  checkTenant,
  getCategoriesByTenant,
  getFiltersByTenantAndStore,
  getProductDetailById,
  getProductsByTenantAndStore,
  getTenantIdByDomain,
  setToken,
  getToken,
  login,
} from "../dist/index.js";

const run = async () => {
  try {
    // Initialize SDK
    initClient("https://app.qa.rdep.io");

    // Option 1: use env token (RDEP_TOKEN) for quick product testing.
    // Option 2: login in same process to get and set token.
    const envToken = process.env.RDEP_TOKEN;
    const domainName = process.env.RDEP_DOMAIN_NAME || "www.rdepretail.com";

    if (envToken) {
      setToken(envToken);
    } else {
      await login({
        username: "9886082728",
        password: "123456",
        domainName,
      });
    }

    const tenantResponse = await checkTenant(domainName);
    console.log(
      "TENANT RESPONSE:\n",
      JSON.stringify(tenantResponse || {}, null, 2),
    );

    const tenantIdFromResponse =
      tenantResponse?.tenantId ??
      tenantResponse?.tenantID ??
      tenantResponse?.id ??
      tenantResponse?.tenant?.id;

    const storeId =
      tenantResponse?.storeId ??
      tenantResponse?.storeID ??
      tenantResponse?.store?.id ??
      process.env.RDEP_STORE_ID;

    const tenantId = tenantIdFromResponse
      ? String(tenantIdFromResponse)
      : await getTenantIdByDomain(domainName);

    if (storeId === undefined || storeId === null || storeId === "") {
      throw new Error(
        "storeId is missing in tenant response and RDEP_STORE_ID",
      );
    }

    console.log("RESOLVED TENANT ID:", tenantId);
    console.log("RESOLVED STORE ID:", String(storeId));

    const categoriesResponse = await getCategoriesByTenant(tenantId);
    console.log(
      "CATEGORIES RESPONSE:\n",
      JSON.stringify(categoriesResponse || {}, null, 2),
    );

    if (!categoriesResponse) {
      throw new Error("getCategoriesByTenant failed: empty response");
    }

    const categoryIds = ["8638"];

    for (const categoryId of categoryIds) {
      console.log("RESOLVED CATEGORY ID:", categoryId);

      const filtersResponse = await getFiltersByTenantAndStore({
        tenantId,
        categoryId,
      });
      console.log(
        `FILTERS RESPONSE for ${categoryId}:\n`,
        JSON.stringify(filtersResponse || {}, null, 2),
      );

      if (!filtersResponse || filtersResponse.status_code !== "200") {
        throw new Error(
          `getFiltersByTenantAndStore failed for ${categoryId}: invalid status_code`,
        );
      }

      if (!Array.isArray(filtersResponse.filters)) {
        throw new Error(
          `getFiltersByTenantAndStore failed for ${categoryId}: filters is not an array`,
        );
      }

      const productsResponse = await getProductsByTenantAndStore({
        tenantId,
        storeId: String(storeId),
        filters: [
          {
            key: "gross_weight",
            values: ["0.308"],
          },
        ],
        pageSize: 10,
        pageNumber: 1,
      });
      console.log(
        `PRODUCTS RESPONSE for store ${storeId}:\n`,
        JSON.stringify(productsResponse || {}, null, 2),
      );

      if (!productsResponse) {
        throw new Error("getProductsByTenantAndStore failed: empty response");
      }

      const productsList =
        productsResponse?.products ||
        productsResponse?.items ||
        productsResponse?.data?.products ||
        productsResponse?.data?.items ||
        [];

      const productIdFromProductsResponse = Array.isArray(productsList)
        ? productsList[0]?.id ||
          productsList[0]?.productId ||
          productsList[0]?.productID
        : null;

      const productId = String(productIdFromProductsResponse || "476453");
      console.log("RESOLVED PRODUCT ID:", productId);

      const productOverviewResponse = await getProductDetailById({
        tenantId,
        productId,
      });

      console.log(
        `PRODUCT OVERVIEW RESPONSE for ${productId}:\n`,
        JSON.stringify(productOverviewResponse || {}, null, 2),
      );

      if (!productOverviewResponse) {
        throw new Error("getProductDetailById failed: empty response");
      }
    }
  } catch (e) {
    console.error("PRODUCT TEST FAILED");
    console.error(e?.response?.data || e.message);
  }
};

run();
