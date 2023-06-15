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
  userName: {
    type: String,
    required: true,
  },
  emailAddress: {
    type: String,
    required: true,
  },
  primaryAccessLevel: {
    type: String,
    required: true,
  },
  secondaryAccessLevel: {
    type: String,
  },
  dateAccountCreated: {
    type: Date,
    default: Date.now,
    required: true,
  },
});

module.exports = mongoose.model("User", userSchema);
