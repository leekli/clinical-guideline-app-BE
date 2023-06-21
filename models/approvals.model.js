const approvalSchema = require("../schemas/ApprovalSchema");

exports.findAllApprovals = async () => {
  return await approvalSchema.find({});
};

exports.findApprovalByApprovalName = async (approval_name) => {
  const approval = await approvalSchema.find({
    approvalRequestName: approval_name,
  });

  return approval.length !== 0
    ? approval[0]
    : Promise.reject({ status: 404, msg: "Approval Name not found" });
};

exports.createNewEditApproval = async (body) => {
  if (Object.keys(body).length === 0) {
    return Promise.reject({ status: 400, msg: "Bad Request" });
  }

  return await approvalSchema.create(body);
};

exports.deleteOneApprovalByApprovalName = async (approval_name) => {
  const approval = await approvalSchema.find({
    approvalRequestName: approval_name,
  });

  return approval.length !== 0
    ? await approvalSchema.deleteOne({ approvalRequestName: approval_name })
    : Promise.reject({ status: 404, msg: "Approval Name not found" });
};
