import {
  initClient,
  login,
  logout,
  getToken,
  getUserDetails,
} from "../dist/index.js";

const run = async () => {
  try {
    initClient("https://app.qa.rdep.io");
    console.log("SDK Initialized");

    // Login
    const loginResponse = await login({
      username: "TENANT",
      password: "Were@123",
      subDomain: "px",
    });

    console.log("Login Response:", loginResponse);

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
