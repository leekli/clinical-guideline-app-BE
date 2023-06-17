const {
  getUsers,
  getUserByUsername,
} = require("../controllers/users.controller");

const usersRouter = require("express").Router();

// HTTP Requests and Routes to /api/users
usersRouter.route("/").get(getUsers);

// HTTP Requests and Routes to /api/users/:username
usersRouter.route("/:username").get(getUserByUsername);

module.exports = usersRouter;
