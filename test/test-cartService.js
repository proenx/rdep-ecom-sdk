import {
  initClient,
  addItemToCart,
  removeItemFromCart,
  updateItemQty,
  refreshCart,
  setToken,
  getToken,
  login,
} from "../dist/index.js";

const run = async () => {
  try {
    // Initialize SDK
    initClient("https://app.qa.rdep.io");

    // Option 1: use env token (RDEP_TOKEN) for quick cart testing.
    // Option 2: login in same process to get and set token.
    const envToken = process.env.RDEP_TOKEN;

    if (envToken) {
      setToken(envToken);
    } else {
      await login({
        username: "9886082728",
        password: "123456",
        domainName: "www.rdepretail.com",
      });
    }
    console.log("Token", login, getToken());
    // Call cart API
    const cartResponse = await addItemToCart({
      operation: "AddItem",
      cartItems: [
        {
          storeId: 265,
          quantity: 1,
          sku: "212326",
          storeCode: "0265",
          sequence: 1,
        },
      ],
    });

    console.log("CART API RESPONSE:", cartResponse.data || cartResponse);

    const updateResponse = await updateItemQty({
      operation: "UpdateItemQuantity",
      cartId: 14773,
      cartItems: [
        {
          storeId: 265,
          newQuantity: 2,
          sku: "89517",
          storeCode: "0265",
        },
      ],
    });

    console.log("UPDATE ITEM QTY RESPONSE:", updateResponse);

    if (!updateResponse || updateResponse.statusCode !== 200) {
      throw new Error("updateItemQty failed: invalid statusCode");
    }

    if (!Array.isArray(updateResponse.itemResult)) {
      throw new Error("updateItemQty failed: itemResult is not an array");
    }

    const refreshResponse = await refreshCart({
      operation: "Refresh cart",
      cartId: 14771,
      customerMobileNumber: "+918291339396",
      customerName: "",
      customerEmail: "",
    });

    console.log("REFRESH CART RESPONSE:", refreshResponse);

    if (!refreshResponse || refreshResponse.statusCode !== 200) {
      throw new Error("refreshCart failed: invalid statusCode");
    }

    const removeItemResponse = await removeItemFromCart({
      operation: "RemoveItem",
      cartId: 7360,
      cartItems: [
        {
          storeId: 734,
          sku: "13456845",
          storeCode: "3002",
        },
      ],
    });

    console.log("REMOVE ITEM RESPONSE:", removeItemResponse);

    if (!removeItemResponse || removeItemResponse.statusCode !== 200) {
      throw new Error("removeItemFromCart failed: invalid statusCode");
    }

    if (!Array.isArray(removeItemResponse.itemResult)) {
      throw new Error("removeItemFromCart failed: itemResult is not an array");
    }
  } catch (e) {
    console.error("CART TEST FAILED");
    console.error(e?.response?.data || e.message);
  }
};

run();
