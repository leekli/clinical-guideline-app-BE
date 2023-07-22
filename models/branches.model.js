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

  const guidelineSlugFormatting = body.guidelineTitle
    .split(" ")
    .map((char) => char.toLowerCase())
    .join("-");

  const guidelineTemplate = {
    GuidanceNumber: body.guidelineNumberProposed,
    GuidanceSlug: guidelineSlugFormatting,
    GuidanceType: "Clinical guideline",
    LongTitle: `${body.guidelineTitle} (${body.guidelineNumberProposed})`,
    MetadataApplicationProfile: {
      AlternativeTitle: null,
      Audiences: [],
      Creator: "NICE",
      Description: null,
      Identifier: "",
      Language: null,
      Modified: String(Date.now()),
      Issued: String(Date.now()),
      Publisher: "NICE",
      Title: body.guidelineTitle,
      Types: [],
      Subjects: [],
      Contributors: [],
      Source: "NICE",
      ParentSection: null,
      Breadcrumb: null,
    },
    NHSEvidenceAccredited: false,
    InformationStandardAccredited: false,
    Chapters: [
      {
        ChapterId: "overview",
        Title: "Overview",
        Content:
          '<div class="chapter" title="Overview" xmlns="http://www.w3.org/1999/xhtml">\r\n  <h2 class="title">\r\n    Overview</h2>\r\n  <p>Content to edit.</p>\r\n</div>',
        Sections: [
          {
            SectionId: "section-1-title",
            Title: "Section 1 Title",
            Content:
              '<div class="section" title="Section 1 Title" xmlns="http://www.w3.org/1999/xhtml">\r\n  <h3 class="title">\r\n    Title to edit</h3>\r\n <p>Content to edit.</p>\r\n</div>',
          },
        ],
      },
      {
        ChapterId: "chapter-2-title",
        Title: "Chapter 2 Title",
        Content:
          '<div class="chapter" title="Chapter 2 Title" xmlns="http://www.w3.org/1999/xhtml">\r\n  <h2 class="title">\r\n    Title to edit</h2>\r\n  <p>Content to edit.</p>\r\n</div>',
        Sections: [
          {
            SectionId: "section-1-title",
            Title: "Section 1 Title",
            Content:
              '<div class="section" title="Section 1 Title" xmlns="http://www.w3.org/1999/xhtml">\r\n  <h3 class="title">\r\n    Title to edit</h3>\r\n <p>Content to edit.</p>\r\n</div>',
          },
        ],
      },
      {
        ChapterId: "chapter-3-title",
        Title: "Chapter 3 Title",
        Content:
          '<div class="chapter" title="Chapter 3 Title" xmlns="http://www.w3.org/1999/xhtml">\r\n  <h2 class="title">\r\n    Title to edit</h2>\r\n  <p>Content to edit.</p>\r\n</div>',
        Sections: [
          {
            SectionId: "section-1-title",
            Title: "Section 1 Title",
            Content:
              '<div class="section" title="Section 1 Title" xmlns="http://www.w3.org/1999/xhtml">\r\n  <h3 class="title">\r\n    Title to edit</h3>\r\n <p>Content to edit.</p>\r\n</div>',
          },
        ],
      },
    ],
    LastModified: "",
    Uri: "URL To Edit",
    Title: body.guidelineTitle,
    TitleContent: null,
  };

  body.guideline = guidelineTemplate;

  return await branchSchema.create(body);
};

exports.updateBranchByBranchName = async (
  branch_name,
  chapterNum,
  sectionNum,
  patchBody,
  newTitle
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

    if (sectionNum === 999) {
      const newChapterTitleToSet =
        newTitle || branch.guideline.Chapters[chapterNum].Title;

      const newChpaterIdToSet = newChapterTitleToSet
        .split(" ")
        .map((char) => {
          const replacedChar = char.replace(/[^a-zA-Z0-9]/g, "");
          return replacedChar.toLowerCase();
        })
        .join("-");

      branch.guideline.Chapters[chapterNum].Content = patchBody;
      branch.guideline.Chapters[chapterNum].Title = newChapterTitleToSet;
      branch.guideline.Chapters[chapterNum].ChapterId = newChpaterIdToSet;
    } else {
      const newSectionTitleToSet =
        newTitle ||
        branch.guideline.Chapters[chapterNum].Sections[sectionNum].Title;

      const newSectionIdToSet = newSectionTitleToSet
        .split(" ")
        .map((char) => {
          const replacedChar = char.replace(/[^a-zA-Z0-9]/g, "");
          return replacedChar.toLowerCase();
        })
        .join("-");

      branch.guideline.Chapters[chapterNum].Sections[sectionNum].Content =
        patchBody;
      branch.guideline.Chapters[chapterNum].Sections[sectionNum].Title =
        newSectionTitleToSet;
      branch.guideline.Chapters[chapterNum].Sections[sectionNum].SectionId =
        newSectionIdToSet;
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
