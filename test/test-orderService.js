import {
  initClient,
  placeOrder,
  recordOrderPayment,
  checkTransactionStatus,
  generatePaymentLink,
  initiateRazorPayPayment,
  initiateHdfcPayment,
  verifyHdfcStatus,
  verifyRazorpayStatus,
  getOrderList,
  getOrderById,
  setToken,
  getToken,
  ecomLogin,
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
      await ecomLogin({
        username: "9886082728",
        password: "123456",
        domainName: "ecom-retail.qa.rdep.io",
      });
    }

    console.log("Token", getToken());

    const orderListResponse = await getOrderList();
    console.log(
      "ORDER LIST RESPONSE:",
      JSON.stringify(orderListResponse, null, 2),
    );

    if (!orderListResponse) {
      throw new Error("getOrderList failed: empty response");
    }

    const placeOrderRequest = {
      cart_id: 98765,
      customerId: 1001,
      customerMobileNo: "9876543210",
      customerEmail: "customer@example.com",
      grossTotal: 550.0,
      netTotal: 500.0,
      shipping_charge: 40.0,
      cartItems: [
        {
          id: "SKU1001",
          taxes: [],
          discounts: [],
          sku: "SKU1001",
          name: "Sample Product",
          deptNmbr: "D01",
          baseAmnt: 500.0,
          price: 500.0,
          MRP: 550.0,
          coin_value: 10.0,
          shipping_charge: 40.0,
          quantity: 1,
          unit: "NOS",
          scantype: "MANUAL",
          pluFlag: "N",
          hsnCode: 1001,
          hsnSlabCutoff: 0,
          hsnSlabRate: 0,
          scflag: 0,
          gstctype: 0,
          sequence: 1,
          vatbit: "N",
          storeCode: "STORE001",
        },
      ],
      shippingAddress: {
        contactPerson: "John",
        contactPhoneNumber: "9876543210",
        email: "john@example.com",
        addressLine1: "Line 1",
        city: "Bengaluru",
        state: "Karnataka",
        country: "India",
        pinCode: "560001",
      },
      billingAddress: {
        contactPerson: "John",
        contactPhoneNumber: "9876543210",
        email: "john@example.com",
        addressLine1: "Line 1",
        city: "Bengaluru",
        state: "Karnataka",
        country: "India",
        pinCode: "560001",
      },
    };

    const placeOrderResponse = await placeOrder(placeOrderRequest);
    // console.log("PLACE ORDER RESPONSE:", placeOrderResponse);

    if (
      !placeOrderResponse ||
      String(placeOrderResponse.statusCode) !== "200"
    ) {
      throw new Error("placeOrder failed: invalid statusCode");
    }

    const orderByIdResponse = await getOrderById(placeOrderResponse.orderId);
    console.log(
      "ORDER BY ID RESPONSE:",
      JSON.stringify(orderByIdResponse, null, 2),
    );

    if (!orderByIdResponse) {
      throw new Error("getOrderById failed: empty response");
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
    // console.log("ORDER PAYMENT RESPONSE:", paymentResponse);

    if (!paymentResponse || String(paymentResponse.statusCode) !== "200") {
      throw new Error("recordOrderPayment failed: invalid statusCode");
    }

    const transactionStatusResponse = await checkTransactionStatus(
      placeOrderResponse.orderId || paymentRequest.orderId,
    );
    console.log(
      "CHECK TRANSACTION STATUS RESPONSE:",
      JSON.stringify(transactionStatusResponse, null, 2),
    );

    const paymentLinkResponse = await generatePaymentLink(
      placeOrderResponse.orderId || paymentRequest.orderId,
    );
    console.log(
      "GENERATE PAYMENT LINK RESPONSE:",
      JSON.stringify(paymentLinkResponse, null, 2),
    );

    const razorPayResponse = await initiateRazorPayPayment(
      placeOrderResponse.orderId || paymentRequest.orderId,
    );
    console.log(
      "INITIATE RAZORPAY PAYMENT RESPONSE:",
      JSON.stringify(razorPayResponse, null, 2),
    );

    const hdfcPaymentInitResponse = await initiateHdfcPayment(
      placeOrderResponse.orderId || paymentRequest.orderId,
    );
    console.log(
      "INITIATE HDFC PAYMENT RESPONSE:",
      JSON.stringify(hdfcPaymentInitResponse, null, 2),
    );

    const resolvedHdfcUid =
      hdfcPaymentInitResponse?.uid ||
      hdfcPaymentInitResponse?.data?.uid ||
      hdfcPaymentInitResponse?.paymentUid ||
      hdfcPaymentInitResponse?.data?.paymentUid ||
      process.env.RDEP_HDFC_UID;

    if (resolvedHdfcUid) {
      const verifyHdfcStatusResponse = await verifyHdfcStatus(resolvedHdfcUid);
      console.log(
        "VERIFY HDFC STATUS RESPONSE:",
        JSON.stringify(verifyHdfcStatusResponse, null, 2),
      );
    } else {
      console.log(
        "VERIFY HDFC STATUS SKIPPED: uid missing in initiate response. Set RDEP_HDFC_UID to test verify API.",
      );
    }

    const verifyRazorpayStatusResponse = await verifyRazorpayStatus({
      orderId: placeOrderResponse.orderId || paymentRequest.orderId,
      razorpayPaymentId: "pay_TDiW5Qet8IvOHN",
      razorpayOrderId: "order_TDiVJqobWni9ns",
      razorpaySignature:
        "50952343c02feb6e94a7981f34d0c44f18ed87c2901c53a7cfbcc1fde01f5dea",
    });
    console.log(
      "VERIFY RAZORPAY STATUS RESPONSE:",
      JSON.stringify(verifyRazorpayStatusResponse, null, 2),
    );
  } catch (e) {
    console.error("ORDER TEST FAILED");
    console.error(e?.response?.data || e.message);
  }
};

run();
