const {
  getBranches,
  postBranch,
  getBranchByBranchName,
  deleteBranchByBranchName,
} = require("../controllers/branches.controller");

const branchesRouter = require("express").Router();

/* Routes to set up
    --> GET /branches ✅
    --> GET /branches/:branch_name ✅
    --> POST /branches (will eventually take type=new and type=edit) ✅
    --> PATCH /branches/:branch_name
    --> DELETE /branches/:branch_name ✅
*/

// HTTP Requests and Routes to /api/branches
branchesRouter.route("/").get(getBranches).post(postBranch);

// HTTP Requests and Routes to /api/branches/:branch_name
branchesRouter
  .route("/:branch_name")
  .get(getBranchByBranchName)
  .delete(deleteBranchByBranchName);

module.exports = branchesRouter;
