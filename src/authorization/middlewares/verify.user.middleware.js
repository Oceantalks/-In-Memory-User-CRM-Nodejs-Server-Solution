const {
  findUserByUsername,
  findUserById,
  updateUser,
  findUserByToken
} = require("../../db/sqlite");
const encryption = require("../../utils/encryption");

const validateFields = (req, res, next) => {
  const errors = [];
  if (req.body) {
    if (!req.body.username) {
      errors.push("Missing username field");
    }
    if (!req.body.password) {
      errors.push("Missing password field");
    }

    if (errors.length) {
      return res.status(400).send({ errors: errors.join(",") });
    } else {
      return next();
    }
  } else {
    return res.status(400).send({ errors: "Missing name and password fields" });
  }
};

const verfiyAndRefreshToken = async (req, res, next) => {
  try {
    const bearerHeader = req.headers["authorization"];
    if (typeof bearerHeader !== undefined) {
      const bearerArray = bearerHeader.split(" ");
      // redo this
      const user = await findUserByToken(bearerArray[1]);
      console.log(user);
      if (user.token_expiration_date > Math.floor(Date.now() / 1000)) {
        const tmpUser = {
          ...user,
          token_expiration_date: encryption.createExpirationdate(500)
        };
        await updateUser(tmpUser);
        next();
      } else {
        res.sendStatus(403);
      }
    } else {
      res.sendStatus(403);
    }
  } catch (error) {
    console.log(error);
    throw error;
  }
};

module.exports = {
  validateFields,
  verfiyAndRefreshToken
};
