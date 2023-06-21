const branchSchema = require("../schemas/BranchSchema");

exports.insertNewEditBranch = async (body) => {
  return await branchSchema.create(body);
};

exports.getAllBranches = async () => {
  return await branchSchema.find({});
};
