const { getUsers } = require("../controllers/users.controller");

const usersRouter = require("express").Router();

// HTTP Requests and Routes to /api/guidelines
usersRouter.route("/").get(getUsers);

module.exports = usersRouter;
