exports.getApiHome = async (req, res, next) => {
  try {
    res
        .status(200)
        .send({msg: 'Welcome to the Clinical Guideline Authoring App: API'});
  } catch (err) {
    next(err);
  }
};
