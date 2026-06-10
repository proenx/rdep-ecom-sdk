import apiClient from "../core/apiClient.js";
import { setToken } from "../core/tokenManager.js";

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
export const placeOrder = async (orderRequest = {}) => {
  try {
    if (!orderRequest || typeof orderRequest !== "object") {
      throw new Error("placeOrder requires a valid order request object");
    }

    const res = await apiClient.post(
      "/order-service/ws/order/place",
      orderRequest,
    );

    // apiClient returns only res.data for non-auth APIs.
    const responseData = res?.data ? res.data : res;
    console.log("Place Order API:", res);
    const token = extractTokenFromResponse(res);
    if (token) {
      setToken(token);
    }

    const placeOrderResponse = responseData || {};
    console.log("Place Order API Response:", placeOrderResponse);

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
export const recordOrderPayment = async (paymentRequest = {}) => {
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
    console.log("Order Payment API Response:", paymentResponse);

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

    const token = extractTokenFromResponse(res);
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
