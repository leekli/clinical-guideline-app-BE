const { getApiHome } = require("../controllers/api.controller");
const approvalsRouter = require("./approvals-router");
const branchesRouter = require("./branches-router");
const guidelinesRouter = require("./guidelines-router");
const usersRouter = require("./users-router");

const apiRouter = require("express").Router();

// Routes for /api
apiRouter.get("/", getApiHome);

// Routes for /api/guidelines
apiRouter.use("/guidelines", guidelinesRouter);

// Routes for /api/users
apiRouter.use("/users", usersRouter);

// Routes for /api/branches
apiRouter.use("/branches", branchesRouter);

// Routes for /api/approvals
apiRouter.use("/approvals", approvalsRouter);

module.exports = apiRouter;
