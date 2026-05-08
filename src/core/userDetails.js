let loggedInUser = null;

export const setUserDetails = (user) => {
  loggedInUser = user;
  if (typeof window !== "undefined") {
    console.log("Storing user details in localStorage:", user);
    localStorage.setItem("user_details", JSON.stringify(user));
  }
};

export const getUserDetails = () => {
  if (!loggedInUser && typeof window !== "undefined") {
    const user = localStorage.getItem("user_details");
    if (user) {
      loggedInUser = JSON.parse(user);
    }
  }
  return loggedInUser;
};

export const clearUserDetails = () => {
  loggedInUser = null;
  if (typeof window !== "undefined") {
    localStorage.removeItem("user_details");
  }
};
