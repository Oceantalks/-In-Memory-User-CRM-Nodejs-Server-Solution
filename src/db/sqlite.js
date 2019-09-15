const sqlite = require("sqlite");
const promise = require("bluebird");
const path = require("path");

const dbFile = path.join(__dirname, "..", "database.sqlite");

const connection = sqlite.open(dbFile, { promise }).catch(e => console.log(e));

const createTable = async () => {
  try {
    const db = await connection;
    const res = await db
      .run(
        `create table if not exists user (
        id varchar(250) primary key not null,
        username varchar(46) not null,
        password varchar(250) not null,
        salt varchar(50) not null,
        name varchar(46) not null, 
        address varchar(60) not null,
        birth_year integer not null,
        created_ts integer not null,
        password_last_modified int,
        token varchar(250), 
        token_expiration_date int,
        CONSTRAINT name_unique UNIQUE (username)
        )`
      )
      .catch(e => {
        console.log(e);
      });
    console.log(JSON.stringify(res));
  } catch (error) {
    console.log(error);
    throw error;
  }
};

const createUser = async user => {
  const { username, id, password, salt, name, address, birth_year } = user;
  try {
    const db = await connection;
    await db.run(
      `insert into user (
        id,
        username,
        password,
        salt,
        name,
        address,
        birth_year,
        created_ts,
        password_last_modified
      ) values (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        id,
        username,
        password,
        salt,
        name,
        address,
        birth_year,
        Math.floor(Date.now() / 1000),
        Math.floor(Date.now() / 1000)
      ]
    );

    const res = await findUserById(id);
    console.log(JSON.stringify(res));
    return res;
  } catch (error) {
    console.log(error);
    throw error;
  }
};

const findUserById = async id => {
  try {
    const db = await connection;
    const user = await db.get(`select * from user where id = ?`, [id]);

    console.log(JSON.stringify(user));
    return user;
  } catch (error) {
    console.log(error);
    throw error;
  }
};

const getAllUsers = async timestamp => {
  try {
    const db = await connection;
    const res = await db.all(
      `select * from user where password_last_modified > ?`,
      [timestamp]
    );
    console.log(JSON.stringify(res));
    return res;
  } catch (error) {
    console.log(error);
    throw error;
  }
};

const findUserByUsername = async username => {
  try {
    const db = await connection;
    const res = await db.get(`select * from user where username = ?`, [
      username
    ]);
    console.log(JSON.stringify(res));
    return res;
  } catch (error) {
    console.log(error);
    throw error;
  }
};

const findUserByToken = async token => {
  try {
    const db = await connection;
    const res = await db.get(`select * from user where token = ?`, [token]);
    console.log(JSON.stringify(res));
    return res;
  } catch (error) {
    console.log(error);
    throw error;
  }
};

const updateUser = async user => {
  try {
    const db = await connection;
    await db.run(
      `update user set
      username = ?,
      password = ?,
      salt = ?,
      name = ?,
      address = ?,
      birth_year = ?,
      created_ts = ?,
      password_last_modified = ?,
      token = ?, 
      token_expiration_date = ?
      where id = ?`,
      [
        user.username,
        user.password,
        user.salt,
        user.name,
        user.address,
        user.birth_year,
        user.created_ts,
        user.password_last_modified,
        user.token,
        user.token_expiration_date,
        user.id
      ]
    );
  } catch (error) {
    console.log(error);
    throw error;
  }
};

const dropTable = async () => {
  try {
    const db = await connection;
    await db.run(`drop table if exists user`);
  } catch (error) {
    console.log(error);
    throw error;
  }
};

const closeDB = async () => {
  try {
    const db = await connection;
    await db.close().catch(e => {
      throw e;
    });
  } catch (error) {
    console.log(error);
    throw error;
  }
};

/*const testRunner = async () => {
  // createDB();
  await createTable();
  // await createUser();
  // await getUser(1);
  // await getAllUsers();
  await findUserByName("adonai");
  //await closeDB();
};*/

// testRunner();

const init = async () => {
  await dropTable();
  await createTable();
};

module.exports = {
  init,
  createUser,
  findUserById,
  findUserByUsername,
  getAllUsers,
  updateUser,
  findUserByToken
};
