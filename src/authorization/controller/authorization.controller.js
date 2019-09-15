const { findUserByUsername, updateUser } = require("../../db/sqlite");
const encryption = require("../../utils/encryption");

const authenticate = async (req, res) => {
  try {
    let user = await findUserByUsername(req.body.username);
    if (!user) {
      res.status(400).send({});
    } else {
      storedPass = user.password;
      const { passwordHash } = encryption.hashPassword(
        req.body.password,
        user.salt
      );
      if (passwordHash === storedPass) {
        console.log(user);
        const token = encryption.genToken();
        const expDate = encryption.createExpirationdate(500);
        user = {
          ...user,
          token,
          token_expiration_date: expDate
        };
        await updateUser(user);
        user = findUserByUsername(user.username);
        res.status(201).send({ token, expDate });
      } else {
        res.status(400).send({ errors: ["Invalid e-mail or password"] });
      }
    }
  } catch (error) {
    throw error;
  }
};

module.exports = {
  authenticate
};
