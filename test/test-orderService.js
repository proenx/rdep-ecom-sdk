import {
  initClient,
  cancelOrderBySku,
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
        domainName: "www.rdepretail.com",
      });
    }

    console.log("Token", getToken());

    const cancelOrderResponse = await cancelOrderBySku("212326");
    console.log("CANCEL ORDER RESPONSE:", cancelOrderResponse);

    if (!cancelOrderResponse || cancelOrderResponse.statusCode !== 200) {
      throw new Error("cancelOrderBySku failed: invalid statusCode");
    }
  } catch (e) {
    console.error("ORDER TEST FAILED");
    console.error(e?.response?.data || e.message);
  }
};

run();
