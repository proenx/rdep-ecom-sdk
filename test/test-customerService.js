import {
  initClient,
  addCustomerAddress,
  editCustomerAddress,
  getCustomerAddress,
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

    console.log("CUSTOMER TEST PASSED");
  } catch (e) {
    console.error("CUSTOMER TEST FAILED");
    console.error(e?.response?.data || e.message);
  }
};

run();
