const {
  getBranches,
  postBranch,
  getBranchByBranchName,
  deleteBranchByBranchName,
  patchBranchByBranchName,
  patchBranchWithNewAllowedUsers,
  patchBranchToLockedOnApprovalSubmission,
  patchBranchToUnlockedOnApprovalDenial,
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

// HTTP Requests and Routes to /api/branches/:branch_name/lockbranch
branchesRouter
  .route("/:branch_name/lockbranch")
  .patch(patchBranchToLockedOnApprovalSubmission);

// HTTP Requests and Routes to /api/branches/:branch_name/unlockbranch
branchesRouter
  .route("/:branch_name/unlockbranch")
  .patch(patchBranchToUnlockedOnApprovalDenial);

module.exports = branchesRouter;
