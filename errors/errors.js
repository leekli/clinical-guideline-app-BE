// Error handling

exports.handle404s = (req, res) => {
  res.status(404).send({ msg: "Invalid URL" });
};

exports.handleCustomErrors = (err, req, res, next) => {
  if (err.status && err.msg) {
    res.status(err.status).send({ msg: err.msg });
  } else {
    next(err);
  }
};

exports.handleMdbErrors = (err, req, res, next) => {
  if (
    err.name === "CastError" ||
    err.name === "ValidationError" ||
    err.name === "DocumentNotFoundError" ||
    err.name === "ValidatorError" ||
    err.name === "MissingSchemaError" ||
    err.name === "ValidationError"
  ) {
    res.status(400).json({ msg: "Bad request" });
  } else {
    next(err);
  }
};

exports.handleServerErrors = (err, req, res, next) => {
  console.log(err);
  res.status(500).send({ msg: "Internal server error" });
};
