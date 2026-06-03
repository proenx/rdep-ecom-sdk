import apiClient from "../core/apiClient.js";
import { setToken, clearToken } from "../core/tokenManager.js";

/**
 * Add item(s) to cart
 */
export const addItemToCart = async ({
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
export const updateItemQty = async ({
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
export const refreshCart = async ({
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
