const {
  insertNewEditBranch,
  getAllBranches,
} = require("../models/branches.model");

exports.getBranches = async (req, res, next) => {
  try {
    const branches = await getAllBranches();

    res.status(200).send({ branches });
  } catch (err) {
    next(err);
  }
};

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
