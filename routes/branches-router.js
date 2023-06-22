const {
  getBranches,
  postBranch,
  getBranchByBranchName,
  deleteBranchByBranchName,
  patchBranchByBranchName,
  patchBranchWithNewAllowedUsers,
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

// HTTP Requests and Routes to /api/branches/:branch_name/addusers
branchesRouter
  .route("/:branch_name/addusers")
  .patch(patchBranchWithNewAllowedUsers);

module.exports = branchesRouter;
