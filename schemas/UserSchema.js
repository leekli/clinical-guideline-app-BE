const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  firstName: {
    type: String,
    required: true,
  },
  lastName: {
    type: String,
    required: true,
  },
  preferredName: {
    type: String,
  },
  jobTitle: {
    type: String,
  },
  userName: {
    type: String,
    required: true,
  },
  password: {
    type: String,
  },
  emailAddress: {
    type: String,
    required: true,
  },
  primaryAccessLevel: {
    type: Array,
    required: true,
  },
  secondaryAccessLevel: {
    type: Array,
  },
  dateAccountCreated: {
    type: Date,
    default: Date.now,
    required: true,
  },
});

module.exports = mongoose.model("User", userSchema);
