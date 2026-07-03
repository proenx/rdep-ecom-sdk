import {
  initClient,
  ecomLogin,
  customerLogin,
  register,
  registerEcom,
  sendRegisterVerifyMobileOtp,
  sendRegisterVerifyEmailOtp,
  validateRegisterVerifyEmailOtp,
  validateRegisterVerifyMobileOtp,
  validateRegisterReference,
  saveRegisterDetails,
  sendRegisterVerifyAadhaarOtp,
  validateRegisterVerifyAadhaarOtp,
  saveRegisterAadhaarAddress,
  validateRegisterPan,
  validateRegisterBankAccount,
  validateRegisterOtp,
  resendRegisterOtp,
  getRegisterTransactionId,
  setTenantId,
  getTenantId,
  getTenantIdByDomain,
  logout,
  getToken,
  getUserDetails,
  checkTenant,
} from "../dist/index.js";

const run = async () => {
  const safeCall = async (label, fn) => {
    try {
      const result = await fn();
      console.log(label, result);
      return result;
    } catch (error) {
      console.error(`${label} FAILED`, error?.response?.data || error.message);
      return null;
    }
  };

  initClient("https://app.qa.rdep.io");

  const tenantDomain = "ecom-retail.qa.rdep.io";
  const mobileNumber = "8249587202";

  await safeCall("checkTenant", () => checkTenant(tenantDomain));
  await safeCall("getTenantIdByDomain", () =>
    getTenantIdByDomain(tenantDomain),
  );
  console.log("getTenantId", getTenantId());

  setTenantId("420");
  console.log("getTenantId after setTenantId", getTenantId());

  await safeCall("ecomLogin", () =>
    ecomLogin({
      username: "BA001757",
      password: "123456",
      domainName: tenantDomain,
    }),
  );

  await safeCall("customerLogin", () =>
    customerLogin({
      username: "9886082728",
      password: "123456",
      domainName: tenantDomain,
    }),
  );

  console.log("getUserDetails", getUserDetails());
  console.log("getToken", getToken());

  // await safeCall("sendRegisterVerifyMobileOtp", () =>
  //   sendRegisterVerifyMobileOtp({
  //     email: "pallab.s@proenx.com",
  //     mobileNumber,
  //     domainName: tenantDomain,
  //   }),
  // );

  // await safeCall("sendRegisterVerifyEmailOtp", () =>
  //   sendRegisterVerifyEmailOtp({
  //     email: "pallab.s@proenx.com",
  //     domainName: tenantDomain,
  //   }),
  // );

  // await safeCall("validateRegisterVerifyEmailOtp", () =>
  //   validateRegisterVerifyEmailOtp({
  //     email: "pallab.s@proenx.com",
  //     domainName: tenantDomain,
  //     emailValidationId: "db05c79d-c543-4c64-a3f1-5d1ab7c9fbb6",
  //     emailOtp: "8600",
  //   }),
  // );

  // await safeCall("validateRegisterVerifyMobileOtp", () =>
  //   validateRegisterVerifyMobileOtp({
  //     email: "pallab.s@proenx.com",
  //     mobileNumber,
  //     domainName: tenantDomain,
  //     mobileValidationId: "edeb3952-a1a0-4dc0-842b-c069be5da0e8",
  //     mobileOtp: "1046",
  //   }),
  // );

  // await safeCall("validateRegisterReference", () =>
  //   validateRegisterReference({
  //     email: "pallab.s@proenx.com",
  //     domainName: tenantDomain,
  //     referenceCode: "BA001757",
  //   }),
  // );

  // await safeCall("saveRegisterDetails", () =>
  //   saveRegisterDetails({
  //     mobileNumber,
  //     domainName: tenantDomain,
  //     name: "Pallab",
  //     dateOfBirth: "01/01/1990",
  //     email: "pallab.s@proenx.com",
  //     password: "123456",
  //   }),
  // );

  // await safeCall("sendRegisterVerifyAadhaarOtp", () =>
  //   sendRegisterVerifyAadhaarOtp({
  //     mobileNumber,
  //     domainName: tenantDomain,
  //     aadhaarNumber: "123456789012",
  //   }),
  // );

  // await safeCall("validateRegisterVerifyAadhaarOtp", () =>
  //   validateRegisterVerifyAadhaarOtp({
  //     mobileNumber,
  //     domainName: tenantDomain,
  //     aadhaarNumber: "123456789012",
  //     aadhaarValidationId: "1234567",
  //     aadhaarOtp: "121212",
  //   }),
  // );

  // await safeCall("saveRegisterAadhaarAddress", () =>
  //   saveRegisterAadhaarAddress({
  //     mobileNumber,
  //     domainName: tenantDomain,
  //     saveAadhaarAddress: true,
  //     aadhaarAddress: {
  //       addressLine1: "address line 1",
  //       addressLine2: "address line 2",
  //       addressLine3: "address line 3",
  //       city: "Bengaluru",
  //       state: "Karnataka",
  //       country: "India",
  //       pinCode: "560001",
  //     },
  //   }),
  // );

  // await safeCall("validateRegisterPan", () =>
  //   validateRegisterPan({
  //     mobileNumber,
  //     domainName: tenantDomain,
  //     aadhaarNumber: "123456789012",
  //     panNumber: "XXXPX1234A",
  //   }),
  // );

  // await safeCall("validateRegisterBankAccount", () =>
  //   validateRegisterBankAccount({
  //     mobileNumber,
  //     domainName: tenantDomain,
  //     bankAccountHolderName: "Jhon Deo",
  //     bankAccountNumber: "1234567890",
  //     bankIfsc: "ABCD00012345",
  //   }),
  // );

  await safeCall("registerEcom", () =>
    registerEcom({
      mobileNumber,
      domainName: tenantDomain,
    }),
  );

  const registerResponse = await safeCall("register", () =>
    register({
      firstName: "Pallab",
      middleName: "",
      lastName: "S",
      mobileNumber,
      email: "pallab.s@proenx.com",
      password: "123456",
      domainName: tenantDomain,
    }),
  );

  console.log(
    "register transactionId from response",
    registerResponse?.transactionId ||
      registerResponse?.registerResponse?.transactionId,
  );
  console.log(
    "register transactionId from sdk memory",
    getRegisterTransactionId(),
  );

  await safeCall("validateRegisterOtp", () =>
    validateRegisterOtp({
      firstName: "Shivani",
      middleName: "",
      lastName: "B",
      email: "shivani.b@proenx.com",
      mobileNumber: "9834050349",
      password: "Shivani@123",
      domainName: "ecom-retail.qa.rdep.io",
      transactionId: "d01dfad3-30c5-4bdc-aa75-7332c3cafd9f",
      otp: "2068",
    }),
  );

  await safeCall("resendRegisterOtp", () =>
    resendRegisterOtp({
      email: "shivani.b@proenx.com",
      mobileNumber: "9834050349",
      domainName: "ecom-retail.qa.rdep.io",
    }),
  );

  await safeCall("logout", () => logout());
  console.log("getToken after logout", getToken());
  console.log("getUserDetails after logout", getUserDetails());
};

run();
