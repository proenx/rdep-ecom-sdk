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
export const checkTransactionStatus = async (orderId) => {
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
export const generatePaymentLink = async (orderId) => {
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
 * Initiate Razorpay payment
 */
export const initiateRazorPayPayment = async (orderId) => {
  try {
    if (!orderId) {
      throw new Error("initiateRazorPayPayment requires an orderId");
    }

    const encodedOrderId = encodeURIComponent(String(orderId));
    const res = await apiClient.get(
      `/order-service/ws/ecom/order/initiateRazorPayPayment/${encodedOrderId}`,
    );

    // apiClient returns only res.data for non-auth APIs.
    const responseData = res?.data ? res.data : res;

    const token = extractTokenFromResponse(res);
    if (token) {
      setToken(token);
    }

    return responseData;
  } catch (error) {
    console.error(
      "Initiate Razorpay Payment API Error:",
      error?.response?.data || error.message,
    );

    throw error;
  }
};

/**
 * Verify Razorpay payment status
 */
export const verifyRazorpayStatus = async ({
  orderId,
  razorpayPaymentId,
  razorpayOrderId,
  razorpaySignature,
} = {}) => {
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
    const res = await apiClient.post(
      `/order-service/ws/ecom/order/verifyRazorpayStatus/${encodedOrderId}`,
      {
        razorpayPaymentId,
        razorpayOrderId,
        razorpaySignature,
      },
    );

    // apiClient returns only res.data for non-auth APIs.
    const responseData = res?.data ? res.data : res;

    const token = extractTokenFromResponse(res);
    if (token) {
      setToken(token);
    }

    return responseData;
  } catch (error) {
    console.error(
      "Verify Razorpay Status API Error:",
      error?.response?.data || error.message,
    );

    throw error;
  }
};

/**
 * Fetch order list
 */
export const getOrderList = async () => {
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
export const getOrderById = async (orderId) => {
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
