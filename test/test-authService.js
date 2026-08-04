import {
  initClient,
  ecomLogin,
  customerLogin,
  refreshToken,
  register,
  registerEcom,
  sendRegisterVerifyMobileOtp,
  sendRegisterVerifyEmailOtp,
  validateRegisterVerifyEmailOtp,
  validateRegisterVerifyMobileOtp,
  validateRegisterReference,
  saveRegisterDetails,
  sendRegisterVerifyAadhaarOtp,
  initiateRegisterVerifyAadhaarDigilockerSession,
  checkRegisterVerifyAadhaarDigilockerSession,
  validateRegisterVerifyAadhaarOtp,
  saveRegisterAadhaarAddress,
  validateRegisterPan,
  validateRegisterBankAccount,
  getActiveRegisterConsentRequirements,
  validateRegisterOtp,
  resendRegisterOtp,
  getRegisterTransactionId,
  generateSetNewPasswordOtp,
  setNewPassword,
  getSetNewPasswordTransactionId,
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

  await safeCall("refreshToken", () => refreshToken());

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

  // await safeCall("initiateRegisterVerifyAadhaarDigilockerSession", () =>
  //   initiateRegisterVerifyAadhaarDigilockerSession({
  //     mobileNumber,
  //     domainName: tenantDomain,
  //     aadhaarNumber: "123456789012",
  //     digilockerRedirectUrl:
  //       "https://ecom-retail.qa.rdep.io/digilocker/complete",
  //   }),
  // );

  // await safeCall("checkRegisterVerifyAadhaarDigilockerSession", () =>
  //   checkRegisterVerifyAadhaarDigilockerSession({
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
  //     huf: true,
  //     panNumber: "XXXPX1234A",
  //     hufName: "The HUF",
  //     hufDateOfIncorporation: "20/12/2020",
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

  await safeCall("getActiveRegisterConsentRequirements", () =>
    getActiveRegisterConsentRequirements({
      mobileNumber,
      domainName: tenantDomain,
    }),
  );

  await safeCall("registerEcom", () =>
    registerEcom({
      mobileNumber,
      domainName: tenantDomain,
      consent: {
        handshakeToken: "{{handshake-token}}",
        appVersion: "1",
        acceptances: [
          {
            consentMasterId: 3,
            echoedHash:
              "e3ee5588a961e166043a7f3ce71f5fd204f67098d22de2708ec95b1ebdcccdbf",
            acceptedValue: "CHECKED",
          },
          {
            consentMasterId: 4,
            echoedHash:
              "183f15a3003bc8c9cd5bf243cfac96310d107a3468363fc4b24ea64b73c68781",
            acceptedValue: "CHECKED",
          },
          {
            consentMasterId: 5,
            echoedHash:
              "94b9a639409ee13e28cc441eda4b46cae3702a0eda0b2c0f043fae032720c7ae",
            acceptedValue: "CHECKED",
          },
          {
            consentMasterId: 6,
            echoedHash:
              "847c4c2446021996cb8e5002ad4649fca92bbf19f3e3fe4563732aa4ba0b55ce",
            acceptedValue: "CHECKED",
          },
          {
            consentMasterId: 7,
            echoedHash:
              "5a43b21f166382bf86ff17fe3f238e3e3a90d899d39234965dcafa6e861798fe",
            acceptedValue: "CHECKED",
          },
          {
            consentMasterId: 8,
            echoedHash:
              "073dc3eb7ecbbae7ccbffc41875e6dbf891305fb3a01d0514f48c271a66c1c96",
            acceptedValue: "ACCEPTED",
          },
          {
            consentMasterId: 9,
            echoedHash:
              "2c76ed8608ff09805d53426791731a1c9e6270e5f29eed8ad455416943c38f08",
            acceptedValue:
              "I AGREE TO BE BOUND BY THE INDIEKONNECT DISTRIBUTOR AGREEMENT OF MY OWN FREE WILL.",
          },
          {
            consentMasterId: 10,
            echoedHash:
              "652320c5eeac9cd941961a3cc1cabe0088ec98936dd3a2ba3a46769c25c5b8a3",
            acceptedValue: "John Ronald Doe | XXXPX1234A",
          },
        ],
      },
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

  const setPasswordUsername = process.env.RDEP_RESET_USERNAME || "TENANT";
  const setPasswordTenantSubDomain =
    process.env.RDEP_RESET_TENANT_SUBDOMAIN || "px";

  await safeCall("generateSetNewPasswordOtp", () =>
    generateSetNewPasswordOtp({
      username: setPasswordUsername,
      tenantSubDomain: setPasswordTenantSubDomain,
    }),
  );

  console.log(
    "setNewPassword transactionId from sdk memory",
    getSetNewPasswordTransactionId(),
  );

  // Update OTP/password via env vars before running:
  // RDEP_RESET_OTP, RDEP_RESET_NEW_PASSWORD, RDEP_RESET_CONFIRM_PASSWORD
  if (
    process.env.RDEP_RESET_OTP &&
    process.env.RDEP_RESET_NEW_PASSWORD &&
    process.env.RDEP_RESET_CONFIRM_PASSWORD
  ) {
    await safeCall("setNewPassword", () =>
      setNewPassword({
        username: setPasswordUsername,
        transactionId: process.env.RDEP_RESET_TRANSACTION_ID,
        otp: process.env.RDEP_RESET_OTP,
        newPassword: process.env.RDEP_RESET_NEW_PASSWORD,
        confirmPassword: process.env.RDEP_RESET_CONFIRM_PASSWORD,
        tenantSubDomain: setPasswordTenantSubDomain,
      }),
    );
  }

  await safeCall("logout", () => logout());
  console.log("getToken after logout", getToken());
  console.log("getUserDetails after logout", getUserDetails());
};

run();
