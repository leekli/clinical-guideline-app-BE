const guidelineSchema = require("../schemas/GuidelineSchema.js");

exports.findAllGuidelines = async (search) => {
  let guidelines;

  if (!search || search.length === 0) {
    guidelines = await guidelineSchema.find({});
  } else {
    guidelines = await guidelineSchema.find({
      LongTitle: { $regex: search, $options: "i" },
    });
  }

  return guidelines;
};

exports.findGuidelineByNumber = async (guideline_id) => {
  const guideline = await guidelineSchema.find({
    GuidanceNumber: guideline_id,
  });

  return guideline.length !== 0
    ? guideline[0]
    : Promise.reject({ status: 404, msg: "Guideline not found" });
};

exports.deleteOneGuidelineByNumber = async (guideline_id) => {
  const guideline = await guidelineSchema.find({
    GuidanceNumber: guideline_id,
  });

  return guideline.length !== 0
    ? await guidelineSchema.deleteOne({ GuidanceNumber: guideline_id })
    : Promise.reject({ status: 404, msg: "Guideline not found" });
};

exports.insertNewGuideline = async (postBody) => {
  if (Object.keys(postBody).length === 0) {
    return Promise.reject({ status: 400, msg: "Bad Request" });
  }

  return await guidelineSchema.create(postBody);
};

exports.updateGuidelineByNumber = async (
  guideline_id,
  chapterNum,
  sectionNum,
  patchBody
) => {
  if (Object.keys(patchBody).length === 0) {
    return Promise.reject({ status: 400, msg: "Bad Request" });
  }

  if (typeof chapterNum !== "number" || typeof sectionNum !== "number") {
    return Promise.reject({ status: 400, msg: "Bad Request" });
  }

  const guideline = await guidelineSchema.findOne({
    GuidanceNumber: guideline_id,
  });

  if (!guideline) {
    return Promise.reject({ status: 404, msg: "Guideline not found" });
  } else {
    guideline.Chapters[chapterNum].Sections[sectionNum] = patchBody;

    await guidelineSchema.updateOne(
      {
        GuidanceNumber: guideline_id,
      },
      guideline
    );

    return guideline;
  }
};
