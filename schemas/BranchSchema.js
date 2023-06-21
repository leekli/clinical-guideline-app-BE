const mongoose = require("mongoose");

const branchSchema = new mongoose.Schema({
  type: {
    type: String,
    required: true,
  },
  branchSetupDateTime: {
    type: String,
    required: true,
  },
  branchOwner: {
    type: String,
    required: true,
  },
  branchAllowedUsers: {
    type: [String],
    default: [],
    required: true,
  },
  guideline: {
    type: mongoose.Schema.Types.Mixed,
    required: true,
  },
});

module.exports = mongoose.model("Branch", branchSchema);
