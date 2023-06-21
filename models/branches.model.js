const branchSchema = require("../schemas/BranchSchema");

exports.getAllBranches = async () => {
  return await branchSchema.find({});
};

exports.insertNewEditBranch = async (body) => {
  return await branchSchema.create(body);
};
