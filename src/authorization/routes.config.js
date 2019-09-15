const { validateFields } = require("./middlewares/verify.user.middleware");
const { authenticate } = require("./controller/authorization.controller");

const authRoute = routes => {
  routes.post("/auth", [validateFields, authenticate]);
};

module.exports = {
  authRoute
};
