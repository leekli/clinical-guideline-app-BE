// Full Integration test end-to-end of the life of a guideline

const request = require("supertest");
const app = require("../app");
const mongoose = require("mongoose");
const seed = require("../data/seed");

beforeAll(async () => {
  await seed();

  console.log(`🌱 Seeding complete on ${process.env.NODE_ENV} Database`);

  await mongoose.connect(process.env.DATABASE_URL);

  console.log("⚡️ Connected to TEST Database");
});

afterAll(async () => {
  await mongoose.connection.close();
});

/* Full integration test plan:
    --> Seed everything
    --> GET all guidelines (check they're all there) - users clicks all guidelines
    --> GET a single guideline (save to variable) - user clicks specific guideline
    --> POST it to a /branch (using GET request above) - user clicks edit guideline
    --> GET branch by ID check it's there - user clicks branches button
    --> PATCH that branch - user clicks edit a section
    --> PATCH that branch with a new user - user clicks add a new approved user
    --> POST it to /approvals (using final PATCH from last request) - user clicks send for approval
    --> PATCH [LOCK] the branch which has been submitted for approval
    --> GET approvals check the new approval is in the list they're there - user clicks all approvals
    --> GET approval by approval name - check its there and brings everything up - user clicks specific approval name
    --> simulate if approved:
        --> PATCH to /guidelines/:id
        --> DELETE that branch
        --> DELETE that approval
    --> Do final GET request to /guidelines/:id and check the changes have been made
*/

describe("Full Integration test", () => {
  test("All requests should return the corresponding successful status code and content checks", async () => {
    // 1. GET all Guidelines (GET /api/guidelines)
    const allGuidelinesResponse = await request(app)
      .get("/api/guidelines")
      .expect(200);

    const allGuidelines = allGuidelinesResponse.body.guidelines;

    expect(allGuidelines).toBeInstanceOf(Array);
    expect(allGuidelines).toHaveLength(20);
    allGuidelines.forEach((guideline) => {
      expect(guideline).toMatchObject({
        GuidanceNumber: expect.any(String),
        GuidanceSlug: expect.any(String),
        GuidanceType: expect.any(String),
        LongTitle: expect.any(String),
        NHSEvidenceAccredited: expect.any(Boolean),
        InformationStandardAccredited: expect.any(Boolean),
        Chapters: expect.any(Array),
        LastModified: expect.any(String),
        Uri: expect.any(String),
        Title: expect.any(String),
      });
    });

    // 2. GET a Single Guideline (GET /api/guidelines/:guideline_name)
    const singleGuidelineResponse = await request(app)
      .get("/api/guidelines/CG104")
      .expect(200);

    const singleGuideline = singleGuidelineResponse.body.guideline;

    expect(singleGuideline.GuidanceNumber).toBe("CG104");
    expect(singleGuideline.GuidanceSlug).toBe(
      "metastatic-malignant-disease-of-unknown-primary-origin-in-adults-diagn-cg104"
    );
    expect(singleGuideline.LongTitle).toBe(
      "Metastatic malignant disease of unknown primary origin in adults: diagnosis and management (CG104)"
    );

    // 3. POST the above Single Guideline to a new branch (POST /api/branches)
    const currentBranchDateTime = String(Date.now());
    const branchToSetup = {
      type: "edit",
      branchName: "cg104-chapter-0-edits",
      branchSetupDateTime: currentBranchDateTime,
      branchOwner: "joebloggs",
      guideline: singleGuideline,
    };

    const postBranchResponse = await request(app)
      .post("/api/branches?type=edit")
      .send(branchToSetup)
      .expect(201);

    const postBranch = postBranchResponse.body.branch;

    expect(postBranch.branchSetupDateTime).toBe(currentBranchDateTime);
    expect(postBranch).toHaveProperty("_id");
    expect(postBranch).toMatchObject({
      type: "edit",
      branchName: "cg104-chapter-0-edits",
      branchSetupDateTime: currentBranchDateTime,
      branchOwner: "joebloggs",
      branchAllowedUsers: [],
      guideline: {
        GuidanceNumber: "CG104",
        GuidanceSlug:
          "metastatic-malignant-disease-of-unknown-primary-origin-in-adults-diagn-cg104",
        GuidanceType: "Clinical guideline",
        LongTitle:
          "Metastatic malignant disease of unknown primary origin in adults: diagnosis and management (CG104)",
        MetadataApplicationProfile: expect.any(Object),
        NHSEvidenceAccredited: true,
        InformationStandardAccredited: false,
        Chapters: expect.any(Array),
        LastModified: expect.any(String),
        Uri: expect.any(String),
        Title:
          "Metastatic malignant disease of unknown primary origin in adults: diagnosis and management",
        TitleContent: null,
      },
    });

    // 4. GET all branches and ensure new branch exists (GET /api/branches)
    const allBranchesResponse = await request(app)
      .get("/api/branches")
      .expect(200);

    const allBranches = allBranchesResponse.body.branches;

    expect(allBranches).toBeInstanceOf(Array);
    expect(allBranches).toHaveLength(1);
    expect(allBranches[0].branchName).toBe("cg104-chapter-0-edits");

    // 5. GET Single branch, new one created (GET /api/branches/:branch_name)
    const singleBranchResponse = await request(app)
      .get("/api/branches/cg104-chapter-0-edits")
      .expect(200);

    const singleBranch = singleBranchResponse.body.branch;

    expect(singleBranch).toBeInstanceOf(Object);
    expect(singleBranch).toMatchObject({
      _id: expect.any(String),
      type: "edit",
      branchName: "cg104-chapter-0-edits",
      branchSetupDateTime: currentBranchDateTime,
      branchOwner: "joebloggs",
      branchAllowedUsers: [],
      guideline: {
        GuidanceNumber: "CG104",
        GuidanceSlug:
          "metastatic-malignant-disease-of-unknown-primary-origin-in-adults-diagn-cg104",
        GuidanceType: "Clinical guideline",
        LongTitle:
          "Metastatic malignant disease of unknown primary origin in adults: diagnosis and management (CG104)",
        MetadataApplicationProfile: expect.any(Object),
        NHSEvidenceAccredited: true,
        InformationStandardAccredited: false,
        Chapters: expect.any(Array),
        LastModified: expect.any(String),
        Uri: expect.any(String),
        Title:
          "Metastatic malignant disease of unknown primary origin in adults: diagnosis and management",
        TitleContent: null,
      },
    });

    // 6. PATCH specific branch, edit a specific section (PATCH /api/branches/:branch_name)
    const chapterNum = 1;
    const sectionNum = 2;

    const patchBody = {
      SectionId: "13-factors-influencing-management-decisions",
      Title: "1.3 Factors influencing management decisions",
      Content:
        '<div class="section" title="1.3 Factors influencing management decisions" id="cg104_1.3-factors-influencing-management-decisions" xmlns="http://www.w3.org/1999/xhtml">\r\n' +
        '  <h3 class="title">\r\n' +
        '    <a id="factors-influencing-management-decisions"></a>1.3 Factors influencing management decisions</h3>\r\n' +
        '  <div class="section" title="1.3.1 When to stop investigations" id="cg104_1.3.1-when-to-stop-investigations">\r\n' +
        '    <h4 class="title">\r\n' +
        '      <a id="when-to-stop-investigations"></a>1.3.1 When to stop investigations</h4>\r\n' +
        '    <div id="cg104_1_3_1_1" class="recommendation_text">\r\n' +
        '      <p class="numbered-paragraph">\r\n' +
        '        <span class="paragraph-number">1.3.1.1 </span>Do not offer further investigations to identify the primary site of origin of the malignancy to patients who are unfit for treatment.</p>\r\n' +
        "    </div>\r\n" +
        '    <div id="cg104_1_3_1_2" class="recommendation_text">\r\n' +
        '      <p class="numbered-paragraph">\r\n' +
        '        <span class="paragraph-number">1.3.1.2 </span>Perform investigations only if:</p>\r\n' +
        '      <div class="itemizedlist indented">\r\n' +
        '        <ul class="itemizedlist">\r\n' +
        '          <li class="listitem">\r\n' +
        "            <p>the results are likely to affect a treatment decision</p>\r\n" +
        "          </li>\r\n" +
        '          <li class="listitem">\r\n' +
        "            <p>the patient understands why the investigations are being carried out </p>\r\n" +
        "          </li>\r\n" +
        '          <li class="listitem">\r\n' +
        "            <p>the patient understands the potential benefits and risks of investigation and treatment <strong>and</strong></p>\r\n" +
        "          </li>\r\n" +
        '          <li class="listitem">\r\n' +
        "            <p>the patient is prepared to accept treatment.</p>\r\n" +
        "          </li>\r\n" +
        "        </ul>\r\n" +
        "      </div>\r\n" +
        "    </div>\r\n" +
        '    <div id="cg104_1_3_1_3" class="recommendation_text">\r\n' +
        '      <p class="numbered-paragraph">\r\n' +
        '        <span class="paragraph-number">1.3.1.3 </span>THIS IS A RANDOMLY EDITED SECTION OF THE GUIDELINE</p>\r\n' +
        "    </div>\r\n" +
        "  </div>\r\n" +
        '  <div class="section" title="1.3.2 Selecting optimal treatment" id="cg104_1.3.2-selecting-optimal-treatment">\r\n' +
        '    <h4 class="title">\r\n' +
        '      <a id="selecting-optimal-treatment"></a>1.3.2 Selecting optimal treatment</h4>\r\n' +
        '    <div id="cg104_1_3_2_1" class="recommendation_text">\r\n' +
        '      <p class="numbered-paragraph">\r\n' +
        '        <span class="paragraph-number">1.3.2.1 </span>THIS IS ANOTHER SECTION OF THE GUIDELINE EDITIED</p>\r\n' +
        "    </div>\r\n" +
        '    <div id="cg104_1_3_2_2" class="recommendation_text">\r\n' +
        '      <p class="numbered-paragraph">\r\n' +
        `        <span class="paragraph-number">1.3.2.2 </span>Discuss the patient's prognostic factors with the patient and their relatives or carers, if appropriate, to help them make informed decisions about treatment.</p>\r\n` +
        "    </div>\r\n" +
        '    <div id="cg104_1_3_2_3" class="recommendation_text">\r\n' +
        '      <p class="numbered-paragraph">\r\n' +
        `        <span class="paragraph-number">1.3.2.3 </span>Include the patient's prognostic factors in decision aids and other information for patients and their relatives or carers about treatment options.</p>\r\n` +
        "    </div>\r\n" +
        '    <div id="cg104_1_3_2_4" class="recommendation_text">\r\n' +
        '      <p class="numbered-paragraph">\r\n' +
        '        <span class="paragraph-number">1.3.2.4 </span>This recommendation has been withdrawn.</p>\r\n' +
        "    </div>\r\n" +
        "  </div>\r\n" +
        "</div>",
    };

    const expected =
      '<div class="section" title="1.3 Factors influencing management decisions" id="cg104_1.3-factors-influencing-management-decisions" xmlns="http://www.w3.org/1999/xhtml">\r\n' +
      '  <h3 class="title">\r\n' +
      '    <a id="factors-influencing-management-decisions"></a>1.3 Factors influencing management decisions</h3>\r\n' +
      '  <div class="section" title="1.3.1 When to stop investigations" id="cg104_1.3.1-when-to-stop-investigations">\r\n' +
      '    <h4 class="title">\r\n' +
      '      <a id="when-to-stop-investigations"></a>1.3.1 When to stop investigations</h4>\r\n' +
      '    <div id="cg104_1_3_1_1" class="recommendation_text">\r\n' +
      '      <p class="numbered-paragraph">\r\n' +
      '        <span class="paragraph-number">1.3.1.1 </span>Do not offer further investigations to identify the primary site of origin of the malignancy to patients who are unfit for treatment.</p>\r\n' +
      "    </div>\r\n" +
      '    <div id="cg104_1_3_1_2" class="recommendation_text">\r\n' +
      '      <p class="numbered-paragraph">\r\n' +
      '        <span class="paragraph-number">1.3.1.2 </span>Perform investigations only if:</p>\r\n' +
      '      <div class="itemizedlist indented">\r\n' +
      '        <ul class="itemizedlist">\r\n' +
      '          <li class="listitem">\r\n' +
      "            <p>the results are likely to affect a treatment decision</p>\r\n" +
      "          </li>\r\n" +
      '          <li class="listitem">\r\n' +
      "            <p>the patient understands why the investigations are being carried out </p>\r\n" +
      "          </li>\r\n" +
      '          <li class="listitem">\r\n' +
      "            <p>the patient understands the potential benefits and risks of investigation and treatment <strong>and</strong></p>\r\n" +
      "          </li>\r\n" +
      '          <li class="listitem">\r\n' +
      "            <p>the patient is prepared to accept treatment.</p>\r\n" +
      "          </li>\r\n" +
      "        </ul>\r\n" +
      "      </div>\r\n" +
      "    </div>\r\n" +
      '    <div id="cg104_1_3_1_3" class="recommendation_text">\r\n' +
      '      <p class="numbered-paragraph">\r\n' +
      '        <span class="paragraph-number">1.3.1.3 </span>THIS IS A RANDOMLY EDITED SECTION OF THE GUIDELINE</p>\r\n' +
      "    </div>\r\n" +
      "  </div>\r\n" +
      '  <div class="section" title="1.3.2 Selecting optimal treatment" id="cg104_1.3.2-selecting-optimal-treatment">\r\n' +
      '    <h4 class="title">\r\n' +
      '      <a id="selecting-optimal-treatment"></a>1.3.2 Selecting optimal treatment</h4>\r\n' +
      '    <div id="cg104_1_3_2_1" class="recommendation_text">\r\n' +
      '      <p class="numbered-paragraph">\r\n' +
      '        <span class="paragraph-number">1.3.2.1 </span>THIS IS ANOTHER SECTION OF THE GUIDELINE EDITIED</p>\r\n' +
      "    </div>\r\n" +
      '    <div id="cg104_1_3_2_2" class="recommendation_text">\r\n' +
      '      <p class="numbered-paragraph">\r\n' +
      `        <span class="paragraph-number">1.3.2.2 </span>Discuss the patient's prognostic factors with the patient and their relatives or carers, if appropriate, to help them make informed decisions about treatment.</p>\r\n` +
      "    </div>\r\n" +
      '    <div id="cg104_1_3_2_3" class="recommendation_text">\r\n' +
      '      <p class="numbered-paragraph">\r\n' +
      `        <span class="paragraph-number">1.3.2.3 </span>Include the patient's prognostic factors in decision aids and other information for patients and their relatives or carers about treatment options.</p>\r\n` +
      "    </div>\r\n" +
      '    <div id="cg104_1_3_2_4" class="recommendation_text">\r\n' +
      '      <p class="numbered-paragraph">\r\n' +
      '        <span class="paragraph-number">1.3.2.4 </span>This recommendation has been withdrawn.</p>\r\n' +
      "    </div>\r\n" +
      "  </div>\r\n" +
      "</div>";

    const patchBranchBodyResponse = await request(app)
      .patch("/api/branches/cg104-chapter-0-edits")
      .send({ chapterNum, sectionNum, patchBody })
      .expect(200);

    const patchBranchBody = patchBranchBodyResponse.body.branch;

    const currentYear = String(new Date().getFullYear());
    const currentHour = String(new Date().getHours());

    expect(
      patchBranchBody.guideline.Chapters[chapterNum].Sections[sectionNum]
        .SectionId
    ).toBe("13-factors-influencing-management-decisions");
    expect(
      patchBranchBody.guideline.Chapters[chapterNum].Sections[sectionNum].Title
    ).toBe("1.3 Factors influencing management decisions");
    expect(
      patchBranchBody.guideline.Chapters[chapterNum].Sections[sectionNum]
        .Content
    ).toEqual(expected);
    expect(typeof patchBranchBody.branchLastModified).toBe("string");
    expect(/^\d+$/.test(patchBranchBody.branchLastModified)).toBe(true);
    expect(
      String(new Date(Number(patchBranchBody.branchLastModified)))
    ).toContain(currentYear);
    expect(
      String(new Date(Number(patchBranchBody.branchLastModified)))
    ).toContain(currentHour);

    // 7. PATCH specific branch and add a new user to the approved list who can edit this branch (PATCH /api/branches/:branch_name/adduser)
    const userToAdd = "janedoe";

    const patchBranchBodyUserAddedResponse = await request(app)
      .patch("/api/branches/cg104-chapter-0-edits/addusers")
      .send({ userToAdd })
      .expect(200);

    const patchBranchBodyUserAdded =
      patchBranchBodyUserAddedResponse.body.branch;

    expect(patchBranchBodyUserAdded.branchOwner).toBe("joebloggs");
    expect(patchBranchBodyUserAdded.branchAllowedUsers).toEqual(["janedoe"]);

    expect(typeof patchBranchBodyUserAdded.branchLastModified).toBe("string");
    expect(/^\d+$/.test(patchBranchBodyUserAdded.branchLastModified)).toBe(
      true
    );
    expect(
      String(new Date(Number(patchBranchBodyUserAdded.branchLastModified)))
    ).toContain(currentYear);
    expect(
      String(new Date(Number(patchBranchBodyUserAdded.branchLastModified)))
    ).toContain(currentHour);

    // 8. POST the newly updated branch to approvals endpoint (POST /api/approvals)
    const currentApprovalDateTime = String(Date.now());
    const approvalToSetup = {
      type: patchBranchBodyUserAddedResponse.body.branch.type,
      approvalRequestName: "cg104-chapter-0-approval-request",
      approvalSetupDateTime: currentApprovalDateTime,
      branchOwner: patchBranchBodyUserAddedResponse.body.branch.branchOwner,
      guideline: patchBranchBodyUserAddedResponse.body.branch.guideline,
    };

    const postApprovalResponse = await request(app)
      .post("/api/approvals?type=edit")
      .send(approvalToSetup)
      .expect(201);

    const postApproval = postApprovalResponse.body.approval;

    expect(postApproval).toHaveProperty("_id");
    expect(postApproval).toMatchObject({
      type: "edit",
      approvalRequestName: "cg104-chapter-0-approval-request",
      approvalSetupDateTime: currentApprovalDateTime,
      branchOwner: "joebloggs",
      guideline: patchBranchBodyUserAddedResponse.body.branch.guideline,
    });

    // 9. Lock the current branch while it's pending approval to stop any further branch edits (PATCH /api/branches/:branch_name/lockbranch)
    const patchBranchToLocked = await request(app)
      .patch("/api/branches/cg104-chapter-0-edits/lockbranch")
      .expect(200);

    expect(patchBranchToLocked.body.branch.branchLockedForApproval).toBe(true);

    // 10. GET all Approvals and ensure new approval is there (GET /api/approvals)
    const allApprovalsResponse = await request(app)
      .get("/api/approvals")
      .expect(200);

    const allApprovals = allApprovalsResponse.body.approvals;

    expect(allApprovals).toBeInstanceOf(Array);
    expect(allApprovals).toHaveLength(1);
    expect(allApprovals[0].approvalRequestName).toBe(
      "cg104-chapter-0-approval-request"
    );

    // 11. GET Single Approval, new one created (GET /api/approval/:approval_name)
    const singleApprovalResponse = await request(app)
      .get("/api/approvals/cg104-chapter-0-approval-request")
      .expect(200);

    const singleApproval = singleApprovalResponse.body.approval;

    expect(singleApproval).toBeInstanceOf(Object);
    expect(singleApproval).toMatchObject({
      _id: expect.any(String),
      type: "edit",
      approvalRequestName: "cg104-chapter-0-approval-request",
      approvalSetupDateTime: expect.any(String),
      branchOwner: "joebloggs",
      guideline: patchBranchBodyUserAddedResponse.body.branch.guideline,
    });

    // 12. Assume the Approval is DENIED, first the approval would be deleted (test is below), and unlocks the branch for further edits (PATCH /api/branches/:branch_name)
    // --> would have a test here to delete the approval but done below and test proved so skipping it
    const patchBranchToUnlocked = await request(app)
      .patch("/api/branches/cg104-chapter-0-edits/unlockbranch")
      .expect(200);

    expect(patchBranchToUnlocked.body.branch.branchLockedForApproval).toBe(
      false
    );

    // 13. Now, assume the Approval request is APPROVED, first PATCH this finalised edited guideline to the main Guidelines endpoint AND that the Version number has incremented by +1 (PATCH /guidelines/:guideline_id)
    const patchedGuideline = structuredClone(
      patchBranchBodyUserAddedResponse.body.branch.guideline
    );

    const patchGuidelineResponse = await request(app)
      .patch("/api/guidelines/CG104")
      .send({ patchedGuideline })
      .expect(200);

    const patchGuidelineInfo = patchGuidelineResponse.body.guideline;

    expect(
      patchGuidelineInfo.Chapters[chapterNum].Sections[sectionNum].SectionId
    ).toBe("13-factors-influencing-management-decisions");
    expect(
      patchGuidelineInfo.Chapters[chapterNum].Sections[sectionNum].Title
    ).toBe("1.3 Factors influencing management decisions");
    expect(
      patchGuidelineInfo.Chapters[chapterNum].Sections[sectionNum].Content
    ).toEqual(expected);
    expect(patchGuidelineInfo.GuidelineCurrentVersion).toEqual(2.0);

    // 14. Now delete the relevant branch as approval is successful (DELETE /api/branches/:branch_name)
    await request(app)
      .delete("/api/branches/cg104-chapter-0-edits")
      .expect(204);

    // 15. Now delete the approval as approval is successful and previous 2 requests were successful (DELETE /api/approvals/:approval_name)
    await request(app)
      .delete("/api/approvals/cg104-chapter-0-approval-request")
      .expect(204);

    // 16. Now do a final GET Single Guideline and check the edits have been made, and that they are now part of the new main version which users would see (GET /api/guidelines/:guideline_id)
    const finalSingleGuidelineResponse = await request(app)
      .get("/api/guidelines/CG104")
      .expect(200);

    const finalSingleGuideline = finalSingleGuidelineResponse.body.guideline;

    expect(finalSingleGuideline).toBeInstanceOf(Object);
    expect(finalSingleGuideline).toMatchObject({
      _id: expect.any(String),
      GuidanceNumber: "CG104",
      GuidanceSlug:
        "metastatic-malignant-disease-of-unknown-primary-origin-in-adults-diagn-cg104",
      GuidanceType: "Clinical guideline",
      LongTitle:
        "Metastatic malignant disease of unknown primary origin in adults: diagnosis and management (CG104)",
      MetadataApplicationProfile: expect.any(Object),
      NHSEvidenceAccredited: true,
      InformationStandardAccredited: false,
      Chapters: expect.any(Array),
      LastModified: "/Date(1682502323341+0100)/",
      Uri: "https://api.nice.org.uk/services/guidance/structured-documents/CG104",
      Title:
        "Metastatic malignant disease of unknown primary origin in adults: diagnosis and management",
      TitleContent: null,
      GuidelineCurrentVersion: 2,
    });
    expect(
      finalSingleGuideline.Chapters[chapterNum].Sections[sectionNum].Content
    ).toEqual(expected);
  });
});
