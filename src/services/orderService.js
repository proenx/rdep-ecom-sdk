import apiClient from "../core/apiClient.js";
import { setToken } from "../core/tokenManager.js";

/**
 * Cancel order by SKU
 */
export const cancelOrderBySku = async (sku) => {
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
