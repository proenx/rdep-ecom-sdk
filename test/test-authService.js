import {
  initClient,
  login,
  register,
  logout,
  getToken,
  getUserDetails,
  checkTenant,
} from "../dist/index.js";

const run = async () => {
  try {
    initClient("https://app.qa.rdep.io");
    // check tenant
    const tenantCheckResponse = await checkTenant("www.rdepretail.com");
    // Login
    const loginResponse = await login({
      username: "9886082728",
      password: "123456",
      // tennantSubDomain: "px",
      domainName: "www.rdepretail.com",
    });

    console.log("checkTenant", checkTenant, tenantCheckResponse);

    // Get user details
    const userDetails = getUserDetails();
    console.log("User Details:", userDetails);
    // Validate token
    const token = getToken();
    console.log("Stored Token:", token);

    // const registerResponse = await register({
    //   firstName: "Shiv",
    //   middleName: "",
    //   lastName: "B",
    //   mobileNumber: "9988776655",
    //   email: "shivani123@gmail.com",
    //   password: "123456",
    //   domainName: "www.rdepretail.com",
    // });
    // console.log("registerResponse", registerResponse);

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
