const {
  postApproval,
  getAllApprovals,
  getApprovalByApprovalName,
  deleteApprovalByApprovalName,
} = require("../controllers/approvals.controller");

const approvalsRouter = require("express").Router();

// HTTP Requests and Routes to /api/approvals
approvalsRouter.route("/").get(getAllApprovals).post(postApproval);

// HTTP Requests and Routes to /api/approvals/:approval_name
approvalsRouter
  .route("/:approval_name")
  .get(getApprovalByApprovalName)
  .delete(deleteApprovalByApprovalName);

module.exports = approvalsRouter;
