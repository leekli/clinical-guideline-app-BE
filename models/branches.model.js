const branchSchema = require("../schemas/BranchSchema");

exports.findAllBranches = async () => {
  return await branchSchema.find({});
};

exports.findBranchByBranchName = async (branch_name) => {
  const branch = await branchSchema.find({
    branchName: branch_name,
  });

  return branch[0];
};

exports.createNewEditBranch = async (body) => {
  return await branchSchema.create(body);
};

exports.updateBranchByBranchName = async (
  branch_name,
  chapterNum,
  sectionNum,
  patchBody
) => {
  if (Object.keys(patchBody).length === 0) {
    return Promise.reject({ status: 400, msg: "Bad Request" });
  }

  if (typeof chapterNum !== "number" || typeof sectionNum !== "number") {
    return Promise.reject({ status: 400, msg: "Bad Request" });
  }

  const branch = await branchSchema.findOne({
    branchName: branch_name,
  });

  if (!branch) {
    return Promise.reject({ status: 404, msg: "Branch not found" });
  } else {
    branch.guideline.Chapters[chapterNum].Sections[sectionNum] = patchBody;

    await branchSchema.updateOne(
      {
        branchName: branch_name,
      },
      branch
    );

    return branch;
  }
};

exports.deleteOneBranchByBranchName = async (branch_name) => {
  await branchSchema.find({
    branchName: branch_name,
  });

  return await branchSchema.deleteOne({ branchName: branch_name });
};
