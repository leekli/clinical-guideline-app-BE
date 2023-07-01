const branchSchema = require("../schemas/BranchSchema");

exports.findAllBranches = async () => {
  return await branchSchema.find({});
};

exports.findBranchByBranchName = async (branch_name) => {
  const branch = await branchSchema.find({
    branchName: branch_name,
  });

  return branch.length !== 0
    ? branch[0]
    : Promise.reject({ status: 404, msg: "Branch not found" });
};

exports.createNewEditBranch = async (body) => {
  if (Object.keys(body).length === 0) {
    return Promise.reject({ status: 400, msg: "Bad Request" });
  }

  return await branchSchema.create(body);
};

exports.createNewCreateBranch = async (body) => {
  if (Object.keys(body).length === 0) {
    return Promise.reject({ status: 400, msg: "Bad Request" });
  }

  const guidelineTemplate = {
    GuidanceNumber: "AA00",
    GuidanceSlug: "template-guideline-slug-to-edit",
    GuidanceType: "Clinical guideline",
    LongTitle: "Long Title To Edit",
    NHSEvidenceAccredited: false,
    InformationStandardAccredited: false,
    Chapters: [
      {
        ChapterId: "title-1",
        Title: "Title 1",
        Content: "Content To Edit",
        Sections: [
          {
            SectionId: "section-1-1",
            Title: "Section 1.1",
            Content: "Content To Edit",
          },
          {
            SectionId: "section-1-2",
            Title: "Section 1.2",
            Content: "Content To Edit",
          },
          {
            SectionId: "section-1-3",
            Title: "Section 1.3",
            Content: "Content To Edit",
          },
        ],
      },
      {
        ChapterId: "title-2",
        Title: "Title 2",
        Content: "Content To Edit",
        Sections: [
          {
            SectionId: "section-2-1",
            Title: "Section 2.1",
            Content: "Content To Edit",
          },
          {
            SectionId: "section-2-2",
            Title: "Section 2.2",
            Content: "Content To Edit",
          },
          {
            SectionId: "section-2-3",
            Title: "Section 2.3",
            Content: "Content To Edit",
          },
        ],
      },
      {
        ChapterId: "title-3",
        Title: "Title 3",
        Content: "Content To Edit",
        Sections: [
          {
            SectionId: "section-3-1",
            Title: "Section 3.1",
            Content: "Content To Edit",
          },
          {
            SectionId: "section-3-2",
            Title: "Section 3.2",
            Content: "Content To Edit",
          },
          {
            SectionId: "section-3-3",
            Title: "Section 3.3",
            Content: "Content To Edit",
          },
        ],
      },
    ],
    LastModified: "",
    Uri: "URL To Edit",
    Title: "Short Title To Edit",
  };

  body.guideline = guidelineTemplate;

  return await branchSchema.create(body);
};

exports.updateBranchByBranchName = async (
  branch_name,
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

  const branch = await branchSchema.findOne({
    branchName: branch_name,
  });

  if (!branch) {
    return Promise.reject({ status: 404, msg: "Branch not found" });
  } else {
    branch.branchLastModified = Date.now();

    if (sectionNum === null) {
      branch.guideline.Chapters[chapterNum].Content = patchBody;
    } else {
      branch.guideline.Chapters[chapterNum].Sections[sectionNum].Content =
        patchBody;
    }

    await branchSchema.updateOne(
      {
        branchName: branch_name,
      },
      branch
    );

    return branch;
  }
};

exports.deleteOneBranchByBranchName = async (branch_name) => {
  const branch = await branchSchema.find({
    branchName: branch_name,
  });

  return branch.length !== 0
    ? await branchSchema.deleteOne({ branchName: branch_name })
    : Promise.reject({ status: 404, msg: "Branch not found" });
};

exports.updateOneBranchWithNewAllowedUser = async (branch_name, userToAdd) => {
  if (!userToAdd || userToAdd.length === 0) {
    return Promise.reject({
      status: 400,
      msg: "Bad Request: No user provided",
    });
  }

  const branch = await branchSchema.findOne({
    branchName: branch_name,
  });

  branch.branchLastModified = Date.now();
  branch.branchAllowedUsers.push(userToAdd);

  await branchSchema.updateOne(
    {
      branchName: branch_name,
    },
    branch
  );

  return branch;
};

exports.updateOneBranchToLocked = async (branch_name) => {
  const branch = await branchSchema.findOne({
    branchName: branch_name,
  });

  branch.branchLockedForApproval = true;

  await branchSchema.updateOne(
    {
      branchName: branch_name,
    },
    branch
  );

  return branch;
};

exports.updateOneBranchToUnLocked = async (branch_name) => {
  const branch = await branchSchema.findOne({
    branchName: branch_name,
  });

  branch.branchLockedForApproval = false;

  await branchSchema.updateOne(
    {
      branchName: branch_name,
    },
    branch
  );

  return branch;
};

exports.findAllBranchComments = async (branch_name) => {
  const branch = await branchSchema.findOne({
    branchName: branch_name,
  });

  const allComments = branch.comments;

  return allComments;
};

exports.updateOneBranchWithNewComment = async (branch_name, newComment) => {
  const { author, body } = newComment;

  if (!author || !body) {
    return Promise.reject({ status: 400, msg: "Bad Request" });
  }

  const branch = await branchSchema.findOne({
    branchName: branch_name,
  });

  if (!branch) {
    return Promise.reject({ status: 404, msg: "Branch not found" });
  }

  branch.comments.push(newComment);

  const commentToRespondWith = branch.comments[branch.comments.length - 1];

  await branchSchema.updateOne(
    {
      branchName: branch_name,
    },
    branch
  );

  return commentToRespondWith;
};
