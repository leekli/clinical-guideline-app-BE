const {
  createNewEditApproval,
  findAllApprovals,
} = require("../models/approvals.model");

exports.getAllApprovals = async (req, res, next) => {
  try {
    const approvals = await findAllApprovals();

    res.status(200).send({ approvals });
  } catch (err) {
    next(err);
  }
};

exports.postApproval = async (req, res, next) => {
  try {
    const approvalBody = req.body;
    const { type } = req.query;
    let approval;

    if (!type) {
      res.status(400).send({ msg: "Bad Request: Specficy type parameter" });
    }

    if (type === "edit") {
      approval = await createNewEditApproval(approvalBody);
      res.status(201).send({ approval });
    }
  } catch (err) {
    next(err);
  }
};
