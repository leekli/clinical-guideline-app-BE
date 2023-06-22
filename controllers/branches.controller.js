const {
  createNewEditBranch,
  findAllBranches,
  findBranchByBranchName,
  deleteOneBranchByBranchName,
  updateBranchByBranchName,
  updateOneBranchWithNewAllowedUser,
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

    if (!type) {
      res.status(400).send({ msg: "Bad Request: Specficy type parameter" });
    }

    if (type === "edit") {
      branch = await createNewEditBranch(branchBody);
      res.status(201).send({ branch });
    }
  } catch (err) {
    next(err);
  }
};

exports.patchBranchByBranchName = async (req, res, next) => {
  try {
    const { branch_name } = req.params;
    const { chapterNum, sectionNum, patchBody } = req.body;

    const branch = await updateBranchByBranchName(
      branch_name,
      chapterNum,
      sectionNum,
      patchBody
    );

    res.status(200).send({ branch });
  } catch (err) {
    next(err);
  }
};

exports.deleteBranchByBranchName = async (req, res, next) => {
  try {
    const { branch_name } = req.params;

    const deletedBranch = await deleteOneBranchByBranchName(branch_name);

    if (deletedBranch.deletedCount > 0) {
      res.sendStatus(204);
    } else {
      next(err);
    }
  } catch (err) {
    next(err);
  }
};

exports.patchBranchWithNewAllowedUsers = async (req, res, next) => {
  try {
    const { userToAdd } = req.body;
    const { branch_name } = req.params;

    const branch = await updateOneBranchWithNewAllowedUser(
      branch_name,
      userToAdd
    );

    res.status(200).send({ branch });
  } catch (err) {
    next(err);
  }
};
