const crypto = require("crypto");

const genSalt = length => {
  return crypto
    .randomBytes(Math.ceil(length / 2))
    .toString("hex") /** convert to hexadecimal format */
    .slice(0, length); /** return required number of characters */
};

const hashPassword = (password, salt) => {
  const hash = crypto.createHmac(
    "sha512",
    salt
  ); /** Hashing algorithm sha512 */
  hash.update(password);
  const value = hash.digest("hex");
  return {
    salt,
    passwordHash: value
  };
};

const genToken = () => {
  return crypto.randomBytes(64).toString("hex");
};

const createExpirationdate = seconds => {
  return Math.floor(Date.now() / 1000) + (seconds || 500);
};

module.exports = { genSalt, hashPassword, genToken, createExpirationdate };
