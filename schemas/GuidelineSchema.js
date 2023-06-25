const mongoose = require("mongoose");

const guidelineSchema = new mongoose.Schema({
  GuidanceNumber: {
    type: String,
  },
  GuidanceSlug: {
    type: String,
  },
  GuidanceType: {
    type: String,
  },
  LongTitle: {
    type: String,
  },
  MetadataApplicationProfile: {
    type: mongoose.Schema.Types.Mixed,
  },
  NHSEvidenceAccredited: {
    type: Boolean,
  },
  InformationStandardAccredited: {
    type: Boolean,
  },
  Chapters: {
    type: [mongoose.Schema.Types.Mixed],
  },
  LastModified: {
    type: String,
  },
  Uri: {
    type: String,
  },
  Title: {
    type: String,
  },
  TitleContent: {
    type: String,
  },
  GuidelineCurrentVersion: {
    type: Number,
    default: 1.0,
  },
});

module.exports = mongoose.model("Guideline", guidelineSchema);
