const {
  genSalt,
  hashPassword,
  genToken,
  createExpirationdate
} = require("../../utils/encryption");
const {
  getAllUsers,
  findUserByUsername,
  createUser,
  updateUser
} = require("../model/user.model");
const uuid = require("uuid/v4");

const insert = async (req, res) => {
  const newUser = req.body;
  try {
    const generatedSalt = genSalt(16);
    const { passwordHash, salt } = hashPassword(
      newUser.password,
      generatedSalt
    );
    newUser.id = uuid();
    newUser.password = passwordHash;
    newUser.salt = salt;
    await createUser(req.body);
    const user = await findUserByUsername(newUser.username);
    res.status(201).send(filterUser(user));
  } catch (error) {
    console.log(error);
    res.status(400).send("User could not be created.");
  }
};

const fetchAllUsers = async (req, res) => {
  const timestamp = req.params.unix_timestamp || createExpirationdate(1);
  const users = await getAllUsers(timestamp);
  if (users) {
    const userList = [];
    for (user of users) {
      userList.push(filterUser(user));
    }
    res.status(200).send(userList);
  } else {
    res.status(400).send("No users found");
  }
};

const fetchUserByUsername = async (req, res) => {
  const user = await findUserByUsername(req.params.username);
  if (user) {
    res.status(200).send(filterUser(user));
  } else {
    res.status(400).send("User not found");
  }
};

const changeUserPassword = async (req, res) => {
  const { username, newPassword, password } = req.body;
  try {
    const user = await findUserByUsername(username);
    if (!user) {
      res.status(400).send();
    } else {
      storedPass = user.password;
      const { passwordHash } = hashPassword(password, user.salt);
      if (passwordHash === storedPass) {
        const newHash = hashPassword(newPassword, genSalt(16));
        const token = genToken();
        const expDate = createExpirationdate(500);
        const tempUser = {
          ...user,
          password: newHash.passwordHash,
          salt: newHash.salt,
          token,
          token_expiration_date: expDate
        };
        await updateUser(tempUser);
        const updatedUser = await findUserByUsername(username);
        res.status(200).send({
          token: updatedUser.token,
          token_expiration_date: updatedUser.token_expiration_date
        });
      } else {
        res.status(400).send({ errors: ["Invalid e-mail or password"] });
      }
    }
  } catch (error) {
    throw error;
  }
};

const filterUser = user => {
  return {
    username: user.username,
    name: user.name,
    birth_year: user.birth_year,
    password_last_modified: user.password_last_modified
  };
};

module.exports = {
  insert,
  fetchAllUsers,
  fetchUserByUsername,
  changeUserPassword
};
