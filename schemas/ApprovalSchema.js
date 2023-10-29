const mongoose = require('mongoose');

const approvalSchema = new mongoose.Schema({
  type: {
    type: String,
    required: true,
  },
  approvalRequestName: {
    type: String,
    required: true,
  },
  approvalSetupDateTime: {
    type: String,
    required: true,
  },
  approvalPurposeDescription: {
    type: String,
    required: true,
  },
  branchName: {
    type: String,
    required: true,
  },
  branchOwner: {
    type: String,
    required: true,
  },
  guideline: {
    type: mongoose.Schema.Types.Mixed,
    required: true,
  },
});

module.exports = mongoose.model('Approval', approvalSchema);
