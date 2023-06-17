const {
  findGuidelineByNumber,
  deleteOneGuidelineByNumber,
  updateGuidelineByNumber,
  findAllGuidelines,
  insertNewGuideline,
} = require("../models/guidelines.model");

exports.getGuidelines = async (req, res, next) => {
  try {
    const { search } = req.query;

    const guidelines = await findAllGuidelines(search);

    res.status(200).send({ guidelines });
  } catch (err) {
    next(err);
  }
};

exports.getGuidelineById = async (req, res, next) => {
  try {
    const { guideline_id } = req.params;

    const guideline = await findGuidelineByNumber(guideline_id);

    res.status(200).send({ guideline });
  } catch (err) {
    next(err);
  }
};

exports.postGuideline = async (req, res, next) => {
  try {
    const postBody = req.body;

    const guideline = await insertNewGuideline(postBody);

    res.status(201).send({ guideline });
  } catch (err) {
    next(err);
  }
};

exports.deleteGuidelineById = async (req, res, next) => {
  try {
    const { guideline_id } = req.params;

    await deleteOneGuidelineByNumber(guideline_id);

    res.sendStatus(204);
  } catch (err) {
    next(err);
  }
};

exports.patchGuidelineById = async (req, res, next) => {
  try {
    const { guideline_id } = req.params;
    const { chapterNum, sectionNum, patchBody } = req.body;

    const guideline = await updateGuidelineByNumber(
      guideline_id,
      chapterNum,
      sectionNum,
      patchBody
    );

    res.status(200).send({ guideline });
  } catch (err) {
    next(err);
  }
};
