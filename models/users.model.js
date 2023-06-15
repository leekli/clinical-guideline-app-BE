const userSchema = require("../schemas/UserSchema.js");

exports.findAllUsers = async () => {
  const users = await userSchema.find({});

  return users;
};
