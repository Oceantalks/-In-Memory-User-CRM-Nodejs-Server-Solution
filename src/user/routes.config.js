const {
  insert,
  fetchAllUsers,
  fetchUserByUsername,
  changeUserPassword
} = require("./controller/user.controller");
const {
  verfiyAndRefreshToken
} = require("../authorization/middlewares/verify.user.middleware");

const userRoute = router => {
  router.post("/users", [insert]);

  router.get("/users/:unix_timestamp", [verfiyAndRefreshToken, fetchAllUsers]);

  // router.get("/users/:username", [verfiyAndRefreshToken, fetchUserByUsername]);

  router.post("/users/change-password", [
    verfiyAndRefreshToken,
    changeUserPassword
  ]);
};

module.exports = {
  userRoute
};
