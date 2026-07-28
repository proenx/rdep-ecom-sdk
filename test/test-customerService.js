import {
  initClient,
  getCustomer,
  addCustomerAddress,
  editCustomerAddress,
  getCustomerAddress,
  addBankDetails,
  addCustomerBeneficiary,
  getCustomerBeneficiaries,
  validatePinCode,
  setToken,
  getToken,
  login,
} from "../dist/index.js";

const run = async () => {
  try {
    // Initialize SDK
    initClient("https://app.qa.rdep.io");

    // Option 1: use env token (RDEP_TOKEN) for quick customer API testing.
    // Option 2: login in same process to get and set token.
    const envToken = process.env.RDEP_TOKEN;
    const domainName = process.env.RDEP_DOMAIN_NAME || "ecom-retail.qa.rdep.io";

    if (envToken) {
      setToken(envToken);
    } else {
      await login({
        username: "9886082728",
        password: "123456",
        domainName,
      });
    }

    console.log("AUTH TOKEN FOR CUSTOMER TEST:", getToken());

    const customerResponse = await getCustomer();
    console.log(
      "GET CUSTOMER RESPONSE:\n",
      JSON.stringify(customerResponse || {}, null, 2),
    );

    if (!customerResponse) {
      throw new Error("getCustomer failed: empty response");
    }

    const addAddressRequest = {
      contactPerson: "Shivani B",
      contactPhoneNumber: "9834050349",
      addressLine1: "TSP heights, Savarkar Road",
      addressLine2: "",
      addressLine3: "",
      city: "Dombivli",
      district: "Thane",
      state: "Maharashtra",
      country: "India",
      defaultDeliveryAddress: false,
      tag: "Home",
      landmark: "",
      label: "Other Home",
      locationUrl: "",
      pinCode: "421202",
    };

    const addAddressResponse = await addCustomerAddress(addAddressRequest);
    console.log(
      "ADD CUSTOMER ADDRESS RESPONSE:\n",
      JSON.stringify(addAddressResponse || {}, null, 2),
    );

    if (!addAddressResponse) {
      throw new Error("addCustomerAddress failed: empty response");
    }

    const resolvedAddressId =
      addAddressResponse?.id ||
      addAddressResponse?.addressId ||
      addAddressResponse?.addressID ||
      addAddressResponse?.data?.id ||
      addAddressResponse?.data?.addressId ||
      process.env.RDEP_ADDRESS_ID;

    if (
      resolvedAddressId === undefined ||
      resolvedAddressId === null ||
      resolvedAddressId === ""
    ) {
      throw new Error(
        "addressId is missing. Set RDEP_ADDRESS_ID or ensure addCustomerAddress returns id/addressId",
      );
    }

    const editAddressRequest = {
      contactPerson: "Lekha Shitut Deshpande",
      contactPhoneNumber: "8291339396",
      addressLine1: "Mangalmurti Homes",
      addressLine2: "bb",
      addressLine3: "cc",
      city: "Thane",
      district: "Thane",
      state: "Maharashtra",
      country: "India",
      defaultDeliveryAddress: true,
      tag: "Home",
      landmark: "",
      label: "OG Home",
      locationUrl: "",
      pinCode: "421201",
    };

    const editAddressResponse = await editCustomerAddress({
      addressId: resolvedAddressId,
      addressRequest: editAddressRequest,
    });

    console.log(
      "EDIT CUSTOMER ADDRESS RESPONSE:\n",
      JSON.stringify(editAddressResponse || {}, null, 2),
    );

    if (!editAddressResponse) {
      throw new Error("editCustomerAddress failed: empty response");
    }

    const addressResponse = await getCustomerAddress();

    console.log(
      "Get Customer response :\n",
      JSON.stringify(addressResponse || {}, null, 2),
    );

    if (!addressResponse) {
      throw new Error("getCustomerAddress failed: empty response");
    }

    const bankDetailsRequest = {
      bankAccountNumber: "40100123456781",
      bankIfsc: "SBIN0021745",
    };

    const bankDetailsResponse = await addBankDetails(bankDetailsRequest);

    console.log(
      "ADD BANK DETAILS RESPONSE:\n",
      JSON.stringify(bankDetailsResponse || {}, null, 2),
    );

    if (!bankDetailsResponse) {
      throw new Error("addBankDetails failed: empty response");
    }

    const addBeneficiaryRequest = {
      fullName: "John Doe",
      emailId: "john.doe@test.com",
      mobileNumber: "9876543222",
      relationship: "Brother",
    };

    const addBeneficiaryResponse = await addCustomerBeneficiary(
      addBeneficiaryRequest,
    );

    console.log(
      "ADD CUSTOMER BENEFICIARY RESPONSE:\n",
      JSON.stringify(addBeneficiaryResponse || {}, null, 2),
    );

    if (!addBeneficiaryResponse) {
      throw new Error("addCustomerBeneficiary failed: empty response");
    }

    const beneficiaryListResponse = await getCustomerBeneficiaries();

    console.log(
      "GET CUSTOMER BENEFICIARIES RESPONSE:\n",
      JSON.stringify(beneficiaryListResponse || {}, null, 2),
    );

    if (!beneficiaryListResponse) {
      throw new Error("getCustomerBeneficiaries failed: empty response");
    }

    const pincodeToValidate = process.env.RDEP_PINCODE || "421202";
    const validatePinCodeResponse = await validatePinCode(pincodeToValidate);

    console.log(
      "VALIDATE PINCODE RESPONSE:\n",
      JSON.stringify(validatePinCodeResponse || {}, null, 2),
    );

    if (!validatePinCodeResponse) {
      throw new Error("validatePinCode failed: empty response");
    }

    console.log("CUSTOMER TEST PASSED");
  } catch (e) {
    console.error("CUSTOMER TEST FAILED");
    console.error(e?.response?.data || e.message);
  }
};

run();
