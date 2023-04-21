const bcrypt = require("bcryptjs");

exports.encryptPassword = async (password) => {
  return await bcrypt.hash(password, 10);
};

exports.decryptPassword = async (password, dbPassword) => {
  return await bcrypt.compare(password, dbPassword);
};
