require("dotenv").config();
const express = require("express");
const cors = require("cors");
const apiRouter = require("./routes/api-router");

const {
  handleCustomErrors,
  handleServerErrors,
  handle404s,
  handleMdbErrors,
} = require("./errors/errors.js");

// Initalise Express server
const app = express();

// Middleware
app.use(cors());
app.use(
  express.json({
    verify: (req, res, buf) => {
      req.rawBody = buf.toString();
    },
    limit: "50mb",
  })
);
app.use(express.urlencoded({ extended: true, limit: "50mb" }));

// Routes
app.use("/api", apiRouter);

// Error handling
app.all("*", handle404s);
app.use(handleCustomErrors);
app.use(handleMdbErrors);
app.use(handleServerErrors);

module.exports = app;
