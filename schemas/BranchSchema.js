const mongoose = require("mongoose");

const commentsSchema = mongoose.Schema({
  author: {
    type: String,
    required: true,
  },
  body: {
    type: String,
    required: true,
  },
  commentDate: {
    type: Date,
    default: Date.now,
  },
});

const branchSchema = new mongoose.Schema({
  type: {
    type: String,
    required: true,
  },
  branchName: {
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
  branchLastModified: {
    type: String,
  },
  branchLockedForApproval: {
    type: Boolean,
    default: false,
  },
  guideline: {
    type: mongoose.Schema.Types.Mixed,
    required: true,
  },
  comments: [commentsSchema],
});

module.exports = mongoose.model("Branch", branchSchema);
