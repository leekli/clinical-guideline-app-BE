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

exports.deleteOneBranchByBranchName = async (branch_name) => {
  await branchSchema.find({
    branchName: branch_name,
  });

  return await branchSchema.deleteOne({ branchName: branch_name });
};
