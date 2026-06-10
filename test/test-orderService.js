import {
  initClient,
  placeOrder,
  recordOrderPayment,
  setToken,
  getToken,
  login,
} from "../dist/index.js";

const run = async () => {
  try {
    // Initialize SDK
    initClient("https://app.qa.rdep.io");

    // Option 1: use env token (RDEP_TOKEN) for quick order testing.
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

    console.log("Token", getToken());

    const placeOrderRequest = {
      cartId: 14855,
      task: "PLACE_ORDER",
      docNumber: 2,
      grossTotal: 2000,
      netTotal: 2000,
      roundedValue: 0,
      sessionId: "30071779944274250",
      startTime: "1779944275440",
      discounts: [],
      cartItems: [
        {
          id: "476488",
          sku: "PD001",
          name: "Rose Gold with Diamond Pendant",
          quantity: 2,
          quantityUnit: "PC",
          netPrice: 2000,
          mrp: 2000,
          availableQuantity: 0,
          skucounter: 0,
          taxes: [],
          baseAmount: 2000,
          hsnCode: 6103,
          gstctype: 0,
          scflag: 0,
          storeCode: "0001",
          storeId: 1681,
          status: "success",
          scanType: "Scan",
          price: 2000,
          sequence: 1,
          productGroupNumber: "0",
          vatBit: "0",
          unit: "Pcs",
          actualPrice: 2000,
          priceOverride: false,
          files: [],
          bundle: false,
          isReturnItem: false,
          ruleBased: false,
          priceDisplay: null,
          productCode: "89517",
        },
      ],
      store_code: "0001",
      organization_id: 1681,
      timestamp: "2026-06-04 10:27:54.250",
    };

    const placeOrderResponse = await placeOrder(placeOrderRequest);
    console.log("PLACE ORDER RESPONSE:", placeOrderResponse);

    if (
      !placeOrderResponse ||
      String(placeOrderResponse.statusCode) !== "200"
    ) {
      throw new Error("placeOrder failed: invalid statusCode");
    }

    const paymentRequest = {
      sessionId: "4322511315140210642",
      billAmount: 2000.0,
      orderId: placeOrderResponse.orderId || 13646,
      task: "POS_PAYMENT",
      timestamp: "2026-06-04 10:24:02.043966",
      userType: "SELF_CHECKOUT_USER",
      paymentTransactions: [
        {
          amount: 2000.0,
          paymentChannel: "Cash",
          paymentMode: "Cash",
          transactionId: "0001040620261247420001",
          paymentChannelId: 1,
        },
      ],
    };

    const paymentResponse = await recordOrderPayment(paymentRequest);
    console.log("ORDER PAYMENT RESPONSE:", paymentResponse);

    if (!paymentResponse || String(paymentResponse.statusCode) !== "200") {
      throw new Error("recordOrderPayment failed: invalid statusCode");
    }
  } catch (e) {
    console.error("ORDER TEST FAILED");
    console.error(e?.response?.data || e.message);
  }
};

run();
