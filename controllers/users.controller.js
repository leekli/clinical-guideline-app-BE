const { findAllUsers } = require("../models/users.model");

exports.getUsers = async (req, res, next) => {
  try {
    const users = await findAllUsers();

    res.status(200).send({ users });
  } catch (err) {
    next(err);
  }
};
