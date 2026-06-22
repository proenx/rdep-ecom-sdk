import apiClient from "../core/apiClient.js";
import { setToken, clearToken } from "../core/tokenManager.js";

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
export const addItemToCart = async ({
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
export const updateItemQty = async ({
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
export const refreshCart = async ({
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
export const removeItemFromCart = async ({
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
