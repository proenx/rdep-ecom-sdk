import {
  initClient,
  login,
  register,
  registerEcom,
  sendRegisterVerifyMobileOtp,
  validateRegisterVerifyMobileOtp,
  validateRegisterReference,
  saveRegisterDetails,
  sendRegisterVerifyAadhaarOtp,
  validateRegisterVerifyAadhaarOtp,
  saveRegisterAadhaarAddress,
  validateRegisterPan,
  validateRegisterBankAccount,
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

  await safeCall("login", () =>
    login({
      username: "9886082728",
      password: "123456",
      domainName: tenantDomain,
    }),
  );

  console.log("getUserDetails", getUserDetails());
  console.log("getToken", getToken());

  await safeCall("sendRegisterVerifyMobileOtp", () =>
    sendRegisterVerifyMobileOtp({
      mobileNumber,
      domainName: tenantDomain,
    }),
  );

  await safeCall("validateRegisterVerifyMobileOtp", () =>
    validateRegisterVerifyMobileOtp({
      mobileNumber,
      domainName: tenantDomain,
      aadhaarValidationId: "56abf345-43bc-4609-bb82-c6c4d31dd933",
      mobileOtp: "1949",
      aadhaarNumber: "123456789012",
    }),
  );

  await safeCall("validateRegisterReference", () =>
    validateRegisterReference({
      mobileNumber,
      domainName: tenantDomain,
      referenceCode: "IBA0002",
    }),
  );

  await safeCall("saveRegisterDetails", () =>
    saveRegisterDetails({
      mobileNumber,
      domainName: tenantDomain,
      name: "Pallab",
      dateOfBirth: "01/01/1990",
      email: "pallab.s@proenx.com",
      password: "123456",
    }),
  );

  await safeCall("sendRegisterVerifyAadhaarOtp", () =>
    sendRegisterVerifyAadhaarOtp({
      mobileNumber,
      domainName: tenantDomain,
      aadhaarNumber: "123456789012",
    }),
  );

  await safeCall("validateRegisterVerifyAadhaarOtp", () =>
    validateRegisterVerifyAadhaarOtp({
      mobileNumber,
      domainName: tenantDomain,
      aadhaarValidationId: "44c43ac9-7429-44b1-a2c6-fb5d76f3fc50",
      aadhaarOtp: "121212",
    }),
  );

  await safeCall("saveRegisterAadhaarAddress", () =>
    saveRegisterAadhaarAddress({
      mobileNumber,
      domainName: tenantDomain,
      saveAadhaarAddress: true,
      aadhaarAddress: {
        addressLine1: "address line 1",
        addressLine2: "address line 2",
        addressLine3: "address line 3",
        city: "Bengaluru",
        state: "Karnataka",
        country: "India",
        pinCode: "560001",
      },
    }),
  );

  await safeCall("validateRegisterPan", () =>
    validateRegisterPan({
      mobileNumber,
      domainName: tenantDomain,
      aadhaarNumber: "123456789012",
      panNumber: "XXXPX1234A",
    }),
  );

  await safeCall("validateRegisterBankAccount", () =>
    validateRegisterBankAccount({
      mobileNumber,
      domainName: tenantDomain,
      bankAccountHolderName: "Jhon Deo",
      bankAccountNumber: "1234567890",
      bankIfsc: "ABCD00012345",
    }),
  );

  await safeCall("registerEcom", () =>
    registerEcom({
      mobileNumber,
      domainName: tenantDomain,
    }),
  );

  await safeCall("register", () =>
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

  await safeCall("logout", () => logout());
  console.log("getToken after logout", getToken());
  console.log("getUserDetails after logout", getUserDetails());
};

run();
