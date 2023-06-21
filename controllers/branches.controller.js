const {
  createNewEditBranch,
  findAllBranches,
  findBranchByBranchName,
} = require("../models/branches.model");

exports.getBranches = async (req, res, next) => {
  try {
    const branches = await findAllBranches();

    res.status(200).send({ branches });
  } catch (err) {
    next(err);
  }
};

exports.getBranchByBranchName = async (req, res, next) => {
  try {
    const { branch_name } = req.params;

    const branch = await findBranchByBranchName(branch_name);

    res.status(200).send({ branch });
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
      branch = await createNewEditBranch(branchBody);
    }

    res.status(201).send({ branch });
  } catch (err) {
    next(err);
  }
};
