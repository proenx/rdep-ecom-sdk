import {
  initClient,
  addItemToCart,
  updateItemQty,
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
  } catch (e) {
    console.error("CART TEST FAILED");
    console.error(e?.response?.data || e.message);
  }
};

run();
