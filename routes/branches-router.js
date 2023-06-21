const {
  getBranches,
  postBranch,
  getBranchByBranchName,
  deleteBranchByBranchName,
  patchBranchByBranchName,
} = require("../controllers/branches.controller");

const branchesRouter = require("express").Router();

// HTTP Requests and Routes to /api/branches
branchesRouter.route("/").get(getBranches).post(postBranch);

// HTTP Requests and Routes to /api/branches/:branch_name
branchesRouter
  .route("/:branch_name")
  .get(getBranchByBranchName)
  .patch(patchBranchByBranchName)
  .delete(deleteBranchByBranchName);

module.exports = branchesRouter;
