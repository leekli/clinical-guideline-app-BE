const userSchema = require('../schemas/UserSchema.js');

exports.findAllUsers = async () => {
  const users = await userSchema.find({});

  return users;
};

exports.findUserByUsername = async (username) => {
  const user = await userSchema.find({
    userName: username,
  });

  return user.length !== 0 ?
    user[0] :
    Promise.reject({status: 404, msg: 'Username not found'});
};
