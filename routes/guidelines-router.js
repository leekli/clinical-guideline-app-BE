const {
  getGuidelineById,
  deleteGuidelineById,
  patchGuidelineById,
  getGuidelines,
  postGuideline,
} = require('../controllers/guidelines.controller');

const guidelinesRouter = require('express').Router();

// HTTP Requests and Routes to /api/guidelines
guidelinesRouter.route('/').get(getGuidelines).post(postGuideline);

// HTTP Requests and Routes to /api/guidelines/:guideline_id
guidelinesRouter
    .route('/:guideline_id')
    .get(getGuidelineById)
    .delete(deleteGuidelineById)
    .patch(patchGuidelineById);

module.exports = guidelinesRouter;
