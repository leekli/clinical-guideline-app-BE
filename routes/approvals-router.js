const {
  postApproval,
  getAllApprovals,
} = require("../controllers/approvals.controller");

const approvalsRouter = require("express").Router();

/* Routes to set up
    --> GET /approvals ✅
    --> GET /approvals/:approval_id
    --> POST /approvals ✅
    --> DELETE /approvals/:approval_id
*/

// HTTP Requests and Routes to /api/approvals
approvalsRouter.route("/").get(getAllApprovals).post(postApproval);

module.exports = approvalsRouter;
