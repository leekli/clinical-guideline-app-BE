const { findAllUsers, findUserByUsername } = require("../models/users.model");

exports.getUsers = async (req, res, next) => {
  try {
    const users = await findAllUsers();

    res.status(200).send({ users });
  } catch (err) {
    next(err);
  }
};

exports.getUserByUsername = async (req, res, next) => {
  try {
    const { username } = req.params;

    const user = await findUserByUsername(username);

    res.status(200).send({ user });
  } catch (err) {
    next(err);
  }
};
