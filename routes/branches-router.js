const {
  getBranches,
  postBranch,
} = require("../controllers/branches.controller");

const branchesRouter = require("express").Router();

/* Routes to set up
    --> GET /branches
    --> GET /branches/:branch_id
    --> POST /branches (will eventually take type=new and type=edit)
    --> PATCH /branches/:branch_id
    --> DELETE /branches/:branch_id
*/

// HTTP Requests and Routes to /api/branches
branchesRouter.route("/").get(getBranches).post(postBranch);

module.exports = branchesRouter;
