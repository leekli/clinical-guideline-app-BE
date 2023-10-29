const {
  createNewEditApproval,
  findAllApprovals,
  findApprovalByApprovalName,
  deleteOneApprovalByApprovalName,
} = require('../models/approvals.model');

exports.getAllApprovals = async (req, res, next) => {
  try {
    const approvals = await findAllApprovals();

    res.status(200).send({approvals});
  } catch (err) {
    next(err);
  }
};

exports.getApprovalByApprovalName = async (req, res, next) => {
  try {
    const {approval_name} = req.params;

    const approval = await findApprovalByApprovalName(approval_name);

    res.status(200).send({approval});
  } catch (err) {
    next(err);
  }
};

exports.postApproval = async (req, res, next) => {
  try {
    const approvalBody = req.body;
    const {type} = req.query;
    let approval;

    if (!type) {
      res.status(400).send({msg: 'Bad Request: Specficy type parameter'});
    }

    if (type === 'edit') {
      approval = await createNewEditApproval(approvalBody);
      res.status(201).send({approval});
    }
  } catch (err) {
    next(err);
  }
};

exports.deleteApprovalByApprovalName = async (req, res, next) => {
  try {
    const {approval_name} = req.params;

    const deletedApproval = await deleteOneApprovalByApprovalName(
        approval_name,
    );

    if (deletedApproval.deletedCount > 0) {
      res.sendStatus(204);
    } else {
      next(err);
    }
  } catch (err) {
    next(err);
  }
};
