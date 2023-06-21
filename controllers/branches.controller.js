const { insertNewEditBranch } = require("../models/branches.model");

exports.getBranches = async (req, res, next) => {};

exports.postBranch = async (req, res, next) => {
  try {
    const branchBody = req.body;
    const { type } = req.query;
    let branch;

    if (type === "edit") {
      branch = await insertNewEditBranch(branchBody);
    }

    res.status(201).send({ branch });
  } catch (err) {
    next(err);
  }
};
