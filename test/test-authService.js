import {
  initClient,
  login,
  logout,
  getToken,
  getUserDetails,
  checkTenant,
} from "../dist/index.js";

const run = async () => {
  try {
    initClient("https://app.qa.rdep.io");
    // check tenant
    const tenantCheckResponse = await checkTenant("px");
    // Login
    const loginResponse = await login({
      username: "9886082728",
      password: "123456",
      tennantSubDomain: "px",
      // domainName: "www.rdepretail.com",
    });

    console.log("checkTenant", checkTenant, tenantCheckResponse);

    // Validate token
    const token = getToken();
    console.log("Stored Token:", token);

    // Get user details
    const userDetails = getUserDetails();
    console.log("User Details:", userDetails);

    // Logout
    await logout();
    console.log("Logout successful", getToken(), getUserDetails());
    console.log("Logged out successfully");
  } catch (e) {
    console.error("Login TEST FAILED");
    console.error(e?.response?.data || e.message);
  }
};

run();
