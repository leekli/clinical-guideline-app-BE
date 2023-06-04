const { getApiHome } = require("../controllers/api.controller");
const guidelinesRouter = require("./guidelines-router");

const apiRouter = require("express").Router();

// Routes for /api
apiRouter.get("/", getApiHome);

// Routes for /api/guidelines
apiRouter.use("/guidelines", guidelinesRouter);

module.exports = apiRouter;
