const approvalSchema = require("../schemas/ApprovalSchema");

exports.createNewEditApproval = async (body) => {
  if (Object.keys(body).length === 0) {
    return Promise.reject({ status: 400, msg: "Bad Request" });
  }

  return await approvalSchema.create(body);
};