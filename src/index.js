const express = require("express");
const db = require("./db/sqlite");
const router = express.Router();
const app = express();
const bodyParser = require("body-parser");
const port = "3000";
const { authRoute } = require("./authorization/routes.config");
const { userRoute } = require("./user/routes.config");

db.init();
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Credentials", "true");
  res.header("Access-Control-Allow-Methods", "GET,HEAD,PUT,PATCH,POST,DELETE");
  res.header("Access-Control-Expose-Headers", "Content-Length");
  res.header(
    "Access-Control-Allow-Headers",
    "Accept, Authorization, Content-Type, X-Requested-With, Range"
  );
  if (req.method === "OPTIONS") {
    return res.send(200);
  } else {
    return next();
  }
});

authRoute(router);
userRoute(router);

app.use("/", router);

app.listen(port, function() {
  console.log("app listening at port %s", port);
});
