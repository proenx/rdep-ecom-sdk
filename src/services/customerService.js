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
 * Fetch customer details
 */
export const getCustomer = async () => {
  try {
    const endpoint = "/customer-service/cws/customer";
    const res = await apiClient.get(endpoint);

    // apiClient returns only res.data for non-auth APIs.
    const responseData = res?.data ? res.data : res;

    const token = extractTokenFromResponse(res);
    if (token) {
      setToken(token);
    }

    const customerResponse = responseData || {};
    console.log("Customer API Response:", customerResponse);

    return responseData;
  } catch (error) {
    console.error(
      "Customer API Error:",
      error?.response?.data || error.message,
    );
    throw error;
  }
};

/**
 * Fetch customer address list
 */
export const getCustomerAddress = async () => {
  try {
    const endpoint = "/customer-service/cws/address";
    const res = await apiClient.get(endpoint);

    // apiClient returns only res.data for non-auth APIs.
    const responseData = res?.data ? res.data : res;

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
      error?.response?.data || error.message,
    );
    throw error;
  }
};

/**
 * Add customer address
 */
export const addCustomerAddress = async (addressRequest = {}) => {
  try {
    if (!addressRequest || typeof addressRequest !== "object") {
      throw new Error("addCustomerAddress requires a valid request object");
    }

    const endpoint = "/customer-service/cws/address";
    const res = await apiClient.post(endpoint, addressRequest);

    // apiClient returns only res.data for non-auth APIs.
    const responseData = res?.data ? res.data : res;

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
      error?.response?.data || error.message,
    );
    throw error;
  }
};

/**
 * Edit customer address by addressId
 */
export const editCustomerAddress = async ({
  addressId,
  addressRequest = {},
} = {}) => {
  try {
    if (addressId === undefined || addressId === null || addressId === "") {
      throw new Error("editCustomerAddress requires a valid addressId");
    }

    if (!addressRequest || typeof addressRequest !== "object") {
      throw new Error("editCustomerAddress requires a valid request object");
    }

    const encodedAddressId = encodeURIComponent(String(addressId));
    const endpoint = `/customer-service/cws/address/${encodedAddressId}`;
    const res = await apiClient.patch(endpoint, addressRequest);

    // apiClient returns only res.data for non-auth APIs.
    const responseData = res?.data ? res.data : res;

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
      error?.response?.data || error.message,
    );
    throw error;
  }
};

/**
 * Add customer bank details
 */
export const addBankDetails = async (bankDetailsRequest = {}) => {
  try {
    if (!bankDetailsRequest || typeof bankDetailsRequest !== "object") {
      throw new Error("addBankDetails requires a valid request object");
    }

    const { bankAccountNumber, bankIfsc } = bankDetailsRequest;

    if (!bankAccountNumber || String(bankAccountNumber).trim() === "") {
      throw new Error("addBankDetails requires bankAccountNumber");
    }

    if (!bankIfsc || String(bankIfsc).trim() === "") {
      throw new Error("addBankDetails requires bankIfsc");
    }

    const endpoint = "/customer-service/cws/customer/addBankDetails";
    const res = await apiClient.post(endpoint, bankDetailsRequest);

    // apiClient returns only res.data for non-auth APIs.
    const responseData = res?.data ? res.data : res;

    const token = extractTokenFromResponse(res);
    if (token) {
      setToken(token);
    }

    const addBankDetailsResponse = responseData || {};
    console.log("Add Bank Details API Response:", addBankDetailsResponse);

    return responseData;
  } catch (error) {
    console.error(
      "Add Bank Details API Error:",
      error?.response?.data || error.message,
    );
    throw error;
  }
};
