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
        domainName: "ecom-retail.qa.rdep.io",
      });
    }
    console.log("Token", login, getToken());
    // Call cart API
    const cartResponse = await addItemToCart({
      operation: "AddItem",
      cartItems: [
        {
          storeId: 1681,
          quantity: 1,
          sku: "GR001",
          storeCode: "0001",
          sequence: 3,
        },
      ],
    });

    console.log("Added Item:", cartResponse.data || cartResponse);

    const updateResponse = await updateItemQty({
      operation: "UpdateItemQuantity",
      cartId: 14859,
      cartItems: [
        {
          storeId: 1681,
          newQuantity: 3,
          storeCode: "0001",
          sku: "GR001",
        },
      ],
    });

    console.log("Update Item", updateResponse);

    if (!updateResponse || updateResponse.statusCode !== 200) {
      throw new Error("updateItemQty failed: invalid statusCode");
    }

    if (!Array.isArray(updateResponse.itemResult)) {
      throw new Error("updateItemQty failed: itemResult is not an array");
    }

    const refreshResponse = await refreshCart({
      operation: "Refresh cart",
      cartId: 14859,
      customerMobileNumber: "+918291339396",
      customerName: "",
      customerEmail: "",
    });

    console.log("REFRESH CART RESPONSE:", refreshResponse);

    if (!refreshResponse || refreshResponse.statusCode !== 200) {
      throw new Error("refreshCart failed: invalid statusCode");
    }

    const removeItemRequest = {
      operation: "RemoveItem",
      cartId: 14857,
      cartItems: [
        {
          storeId: 1681,
          sku: "GR001",
          storeCode: "0001",
        },
      ],
    };

    const removeItemResponse = await removeItemFromCart(removeItemRequest);

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
