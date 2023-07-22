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

describe("/api Tests Requests", () => {
  describe("/api GET Requests", () => {
    test("GET /api: should return 200 and msg", async () => {
      const res = await request(app).get("/api").expect(200);
      expect(res.body.msg).toBe(
        "Welcome to the Clinical Guideline Authoring App: API"
      );
    });
  });
});

describe("/api/guidelines Test Requests", () => {
  describe("/api/guidelines GET Requests", () => {
    test("GET /api/guidelines: should return 200 and all guidelines", async () => {
      const res = await request(app).get("/api/guidelines").expect(200);
      expect(res.body.guidelines).toBeInstanceOf(Array);
      expect(res.body.guidelines).toHaveLength(20);
      res.body.guidelines.forEach((guideline) => {
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
          GuidelineCurrentVersion: expect.any(Number),
          GuidelineChangeHistoryDescriptions: expect.any(Array),
        });
      });
    });
    test("GET /api/guidelines/:guideline_id: should return 200 and guideline", async () => {
      let res = await request(app).get("/api/guidelines/CG104").expect(200);
      expect(res.body.guideline.GuidanceNumber).toBe("CG104");
      expect(res.body.guideline.GuidanceSlug).toBe(
        "metastatic-malignant-disease-of-unknown-primary-origin-in-adults-diagn-cg104"
      );
      expect(res.body.guideline.LongTitle).toBe(
        "Metastatic malignant disease of unknown primary origin in adults: diagnosis and management (CG104)"
      );
      res = await request(app).get("/api/guidelines/CG181").expect(200);
      expect(res.body.guideline.GuidanceNumber).toBe("CG181");
      expect(res.body.guideline.GuidanceSlug).toBe(
        "cardiovascular-disease-risk-assessment-and-reduction-including-lipid-m-cg181"
      );
      expect(res.body.guideline.LongTitle).toBe(
        "Cardiovascular disease: risk assessment and reduction, including lipid modification (CG181)"
      );
    });
    test("Returns status 200 and single relevant guideline when used with a search param on /api/guidelines?search=dia", async () => {
      const res = await request(app)
        .get("/api/guidelines?search=diabetes")
        .expect(200);
      expect(res.body.guidelines).toBeInstanceOf(Array);
      expect(res.body.guidelines).toHaveLength(1);
      expect(res.body.guidelines[0]).toMatchObject({
        GuidanceNumber: "NG18",
        GuidanceSlug:
          "diabetes-type-1-and-type-2-in-children-and-young-people-diagnosis-and-ng18",
        LongTitle:
          "Diabetes (type 1 and type 2) in children and young people: diagnosis and management (NG18)",
        GuidelineCurrentVersion: 1.0,
        GuidelineChangeHistoryDescriptions: [],
      });
    });
    test("Returns status 200 and single relevant guideline when used with a search param on /api/guidelines?search=covid", async () => {
      const res = await request(app)
        .get("/api/guidelines?search=covid")
        .expect(200);
      expect(res.body.guidelines).toBeInstanceOf(Array);
      expect(res.body.guidelines).toHaveLength(1);
      expect(res.body.guidelines[0]).toMatchObject({
        GuidanceNumber: "NG188",
        GuidanceSlug:
          "covid-19-rapid-guideline-managing-the-long-term-effects-of-covid-19-ng188",
        LongTitle:
          "COVID-19 rapid guideline: managing the long-term effects of COVID-19 (NG188)",
        GuidelineCurrentVersion: 1.0,
      });
    });
    test("Returns status 200 and single relevant guideline when used with a search param with a space in between on /api/guidelines?search=multiple+sclerosis", async () => {
      const res = await request(app)
        .get("/api/guidelines?search=multiple+sclerosis")
        .expect(200);
      expect(res.body.guidelines).toBeInstanceOf(Array);
      expect(res.body.guidelines).toHaveLength(1);
      expect(res.body.guidelines[0]).toMatchObject({
        GuidanceNumber: "QS108",
        GuidanceSlug: "multiple-sclerosis-qs108",
        LongTitle: "Multiple sclerosis (QS108)",
        GuidelineCurrentVersion: 1.0,
        GuidelineChangeHistoryDescriptions: [],
      });
    });
    test("Returns status 200 and multiple relevant guidelines when used with a search param on /api/guidelines?search=hypertension", async () => {
      const res = await request(app)
        .get("/api/guidelines?search=hypertension")
        .expect(200);
      expect(res.body.guidelines).toBeInstanceOf(Array);
      expect(res.body.guidelines).toHaveLength(2);
      expect(res.body.guidelines[0].GuidanceNumber).toBe("NG133");
      expect(res.body.guidelines[1].GuidanceNumber).toBe("QS28");
    });
    test("Returns status 200 and an empty array when used with a search param with no matches on /api/guidelines?search=eczema", async () => {
      const res = await request(app)
        .get("/api/guidelines?search=eczema")
        .expect(200);
      expect(res.body.guidelines).toBeInstanceOf(Array);
      expect(res.body.guidelines).toHaveLength(0);
    });
  });
  describe("/api/guidelines POST Requests", () => {
    test("POST /api/guidelines: should return 201 if POST of new Guidelines successful", async () => {
      const newGuideline = {
        GuidanceNumber: "XO723",
        GuidanceSlug: "Slug Name",
        GuidanceType: "Clinical Guideline",
        MetadataApplicationProfile: {
          AlternativeTitle: null,
          Audiences: [],
          Creator: "NICE",
          Description: null,
          Identifier:
            "tag:api.nice.org.uk,2018-09-05:/services/guidance/documents/XO723",
          Language: null,
          Modified: "/Date(1670253569189+0000)/",
          Issued: "/Date(1536102000000+0100)/",
          Publisher: "NICE",
          Title: "Title",
          Types: [],
          Subjects: [],
          Contributors: [],
          Source: "NICE",
          ParentSection: null,
          Breadcrumb: null,
        },
        LongTitle: "This is a Long Title",
        NHSEvidenceAccredited: false,
        InformationStandardAccredited: true,
        Chapters: [
          {
            ChapterId: "overview",
            Title: "Overview",
            Content:
              '<div class="chapter" title="Overview" id="xo723_overview" xmlns="http://www.w3.org/1999/xhtml">\r\n  <h2 class="title">\r\n    <a id="overview"></a>Overview</h2>\r\n  <p>This is a test paragraph</p>\r\n</div>',
            Sections: [
              {
                SectionId: "who-is-it-for",
                Title: "Who is it for?",
                Content:
                  '<div class="section" title="Who is it for?" id=xo723_who-is-it-for" xmlns="http://www.w3.org/1999/xhtml">\r\n  <h3 class="title">\r\n    <a id="who-is-it-for"></a>Who is it for?</h3>\r\n</div>',
              },
            ],
          },
        ],
        LastModified: "Today",
        Uri: "Uri://link.com",
        Title: "Title",
        TitleContent: null,
      };

      const res = await request(app)
        .post("/api/guidelines")
        .send(newGuideline)
        .expect(201);

      expect(res.body.guideline.GuidanceNumber).toBe("XO723");
      expect(res.body.guideline.GuidanceSlug).toBe("Slug Name");
      expect(res.body.guideline.Chapters[0].Sections[0].Title).toBe(
        "Who is it for?"
      );
      expect(res.body.guideline.GuidelineCurrentVersion).toBe(1.0);
      expect(res.body.guideline.GuidelineChangeHistoryDescriptions).toEqual([]);
    });
  });
  describe("/api/guidelines PATCH Requests", () => {
    test("PATCH /api/guidelines/:guideline_id: should return 200 if PATCH successful", async () => {
      const chapterNum = 0;
      const sectionNum = 1;

      const getSingleGuideline = await request(app)
        .get("/api/guidelines/CG181")
        .expect(200);

      const singleGuideline = getSingleGuideline.body.guideline;

      const patchBody = {
        SectionId:
          "12-aspirin-for-primary-prevention-of-cardiovascular-disease",
        Title: "1.2 Aspirin for primary prevention of cardiovascular disease",
        Content:
          '<div class="section" title="1.2 Aspirin for primary prevention of cardiovascular disease" id="cg181_1.2-aspirin-for-primary-prevention-of-cardiovascular-disease" xmlns="http://www.w3.org/1999/xhtml">\r\n  <h3 class="title">\r\n    <a id="aspirin-for-primary-prevention-of-cardiovascular-disease"></a>1.2 Aspirin for primary prevention of cardiovascular disease</h3>\r\n  <div id="cg181_1_2_1" class="recommendation_text">\r\n    <p class="numbered-paragraph">\r\n      <span class="paragraph-number">1.2.1 </span>AMEND Do not routinely offer aspirin for primary prevention of CVD. <strong>[2023]</strong></p>\r\n    <p>THIS IS A FULLY AMENDED SECTION, see <a class="link" href="https://www.nice.org.uk/guidance/ng89" target="_top" data-original-url="https://www.nice.org.uk/guidance/ng89">NICE\'s guideline on venous thromboembolism in over 16s: reducing the risk of hospital-acquired deep vein thrombosis or pulmonary embolism</a>.</p>\r\n    <div class="panel">\r\n      <p>ONE MORE EDIT <a class="link" href="https://www.nice.org.uk/guidance/cg181/resources/2023-exceptional-surveillance-of-cardiovascular-disease-risk-assessment-and-reduction-including-lipid-modification-nice-guideline-cg181-11322671149/chapter/Surveillance-decision?tab=evidence" target="_top">January 2023 exceptional surveillance report</a>. </p>\r\n    </div>\r\n  </div>\r\n</div>',
      };

      singleGuideline.Chapters[chapterNum].Sections[sectionNum] = patchBody;

      const patchedGuideline = singleGuideline;

      const dateNow = Date.now();

      const submissionInfo = {
        ChangeNumber: 0,
        ChangeDescription: "Slight amendment to the quality statement section",
        ChangeOwner: "joebloggs",
        ChangeDatePublished: dateNow,
      };

      const expected =
        '<div class="section" title="1.2 Aspirin for primary prevention of cardiovascular disease" id="cg181_1.2-aspirin-for-primary-prevention-of-cardiovascular-disease" xmlns="http://www.w3.org/1999/xhtml">\r\n  <h3 class="title">\r\n    <a id="aspirin-for-primary-prevention-of-cardiovascular-disease"></a>1.2 Aspirin for primary prevention of cardiovascular disease</h3>\r\n  <div id="cg181_1_2_1" class="recommendation_text">\r\n    <p class="numbered-paragraph">\r\n      <span class="paragraph-number">1.2.1 </span>AMEND Do not routinely offer aspirin for primary prevention of CVD. <strong>[2023]</strong></p>\r\n    <p>THIS IS A FULLY AMENDED SECTION, see <a class="link" href="https://www.nice.org.uk/guidance/ng89" target="_top" data-original-url="https://www.nice.org.uk/guidance/ng89">NICE\'s guideline on venous thromboembolism in over 16s: reducing the risk of hospital-acquired deep vein thrombosis or pulmonary embolism</a>.</p>\r\n    <div class="panel">\r\n      <p>ONE MORE EDIT <a class="link" href="https://www.nice.org.uk/guidance/cg181/resources/2023-exceptional-surveillance-of-cardiovascular-disease-risk-assessment-and-reduction-including-lipid-modification-nice-guideline-cg181-11322671149/chapter/Surveillance-decision?tab=evidence" target="_top">January 2023 exceptional surveillance report</a>. </p>\r\n    </div>\r\n  </div>\r\n</div>';

      const res = await request(app)
        .patch("/api/guidelines/CG181")
        .send({ patchedGuideline, submissionInfo })
        .expect(200);

      expect(
        res.body.guideline.Chapters[chapterNum].Sections[sectionNum].SectionId
      ).toBe("12-aspirin-for-primary-prevention-of-cardiovascular-disease");
      expect(
        res.body.guideline.Chapters[chapterNum].Sections[sectionNum].Title
      ).toBe("1.2 Aspirin for primary prevention of cardiovascular disease");
      expect(
        res.body.guideline.Chapters[chapterNum].Sections[sectionNum].Content
      ).toEqual(expected);
    });
    test("PATCH Status 200: Updates the version number by +1 and adds a new entry into GuidelineChangeHistoryDescriptions property on a successful PATCH", async () => {
      const chapterNum = 1;
      const sectionNum = 0;

      const getSingleGuideline = await request(app)
        .get("/api/guidelines/QS65")
        .expect(200);

      const singleGuideline = getSingleGuideline.body.guideline;

      const patchBody = {
        SectionId: "quality-statement",
        Title: "Quality statement",
        Content:
          '<div class="section" title="Quality statement" id="qs65_quality-statement" xmlns="http://www.w3.org/1999/xhtml">\r\n  <h3 class="title">\r\n    <a id="quality-statement"></a>Quality statement</h3>\r\n  <p>I AM AN AMENDED PARAGRAPH ELEMENT</p>\r\n</div>',
      };

      singleGuideline.Chapters[chapterNum].Sections[sectionNum] = patchBody;

      const patchedGuideline = singleGuideline;

      const dateNow = Date.now();

      const submissionInfo = {
        ChangeNumber: 0,
        ChangeDescription: "Slight amendment to the quality statement section",
        ChangeOwner: "joebloggs",
        ChangeDatePublished: dateNow,
      };

      const res = await request(app)
        .patch("/api/guidelines/QS65")
        .send({ patchedGuideline, submissionInfo })
        .expect(200);

      expect(res.body.guideline.GuidelineCurrentVersion).toBe(2.0);
      expect(res.body.guideline.GuidelineChangeHistoryDescriptions[0]).toEqual({
        ChangeNumber: 0,
        ChangeDescription: "Slight amendment to the quality statement section",
        ChangeOwner: "joebloggs",
        ChangeDatePublished: dateNow,
      });
    });
  });
  describe("/api/guidelines DELETE Requests", () => {
    test("DELETE /api/guidelines/:guideline_id: should return 204 if delete successful", async () => {
      await request(app).delete("/api/guidelines/NG232").expect(204);
    });
    test("DELETE /api/guidelines/:guideline_id: should return 204 if delete successful", async () => {
      await request(app).delete("/api/guidelines/QS143").expect(204);
    });
  });
  describe("/api/guidelines Error Handing", () => {
    describe("/api/guidelines GET Error Handling", () => {
      test("Status 404: Invalid URL /apiz", async () => {
        const res = await request(app).get("/apiz").expect(404);
        expect(res.body.msg).toBe("Invalid URL");
      });
      test("Status 404: Invalid URL /api/guideline", async () => {
        const res = await request(app).get("/api/guideline").expect(404);
        expect(res.body.msg).toBe("Invalid URL");
      });
      test("Status 404: Guideline ID/Number does not exist", async () => {
        let res = await request(app).get("/api/guidelines/AB123").expect(404);
        expect(res.body.msg).toBe("Guideline not found");
        res = await request(app).get("/api/guidelines/999ZZ").expect(404);
        expect(res.body.msg).toBe("Guideline not found");
        res = await request(app).get("/api/guidelines/1").expect(404);
        expect(res.body.msg).toBe("Guideline not found");
        res = await request(app).get("/api/guidelines/a").expect(404);
        expect(res.body.msg).toBe("Guideline not found");
      });
    });
    describe("/api/guidelines POST Error Handling", () => {
      test("Status 400: Malformed body - not content in the new Guideline object", async () => {
        const newGuideline = {};

        const res = await request(app)
          .post("/api/guidelines")
          .send(newGuideline)
          .expect(400);
        expect(res.body.msg).toBe("Bad Request");
      });
    });
    describe("/api/guidelines PATCH Error Handling", () => {
      test("Status 404: Guideline ID/Number does not exist", async () => {
        const patchedGuideline = { keyName: "Test" };

        const dateNow = Date.now();

        const submissionInfo = {
          ChangeNumber: 0,
          ChangeDescription:
            "Slight amendment to the quality statement section",
          ChangeOwner: "joebloggs",
          ChangeDatePublished: dateNow,
        };

        const res = await request(app)
          .patch("/api/guidelines/ZZ999")
          .send({ patchedGuideline, submissionInfo })
          .expect(404);
        expect(res.body.msg).toBe("Guideline not found");
      });
      test("Status 400: Malformed body - nothing submitted for patchBody", async () => {
        const patchedGuideline = {};
        const submissionInfo = {};

        const res = await request(app)
          .patch("/api/guidelines/NG133")
          .send({ patchedGuideline, submissionInfo })
          .expect(400);
        expect(res.body.msg).toBe("Bad Request");
      });
    });

    describe("/api/guidelines DELETE Error Handling", () => {
      test("Status 404: Guideline ID/Number does not exist", async () => {
        let res = await request(app)
          .delete("/api/guidelines/AB123")
          .expect(404);
        expect(res.body.msg).toBe("Guideline not found");
        res = await request(app).delete("/api/guidelines/999ZZ").expect(404);
        expect(res.body.msg).toBe("Guideline not found");
      });
    });
  });
});

describe("/api/users Test Requests", () => {
  describe("/api/users GET Requests", () => {
    test("GET /api/users: should return 200 and all users", async () => {
      const res = await request(app).get("/api/users").expect(200);
      expect(res.body.users).toBeInstanceOf(Array);
      expect(res.body.users).toHaveLength(13);
      res.body.users.forEach((user) => {
        expect(user).toMatchObject({
          _id: expect.any(String),
          firstName: expect.any(String),
          lastName: expect.any(String),
          preferredName: expect.any(String),
          jobTitle: expect.any(String),
          userName: expect.any(String),
          password: expect.any(String),
          emailAddress: expect.any(String),
          primaryAccessLevel: expect.any(Array),
          secondaryAccessLevel: expect.any(Array),
          dateAccountCreated: expect.any(String),
        });
      });
    });
    test("GET /api/users/:username: should return 200 and the information for that specific username", async () => {
      const res = await request(app).get("/api/users/joebloggs").expect(200);
      expect(res.body.user).toBeInstanceOf(Object);
      expect(res.body.user).toMatchObject({
        firstName: "Joe",
        lastName: "Bloggs",
        preferredName: "Joe",
        jobTitle: "System Administrator",
        userName: "joebloggs",
        password: "",
        emailAddress: "joe.bloggs8@nhs.uk",
        primaryAccessLevel: ["Admin"],
        secondaryAccessLevel: ["Super"],
      });
    });
    test("GET /api/users/:username: should return 200 and the information for that specific username", async () => {
      const res = await request(app).get("/api/users/susancowan").expect(200);
      expect(res.body.user).toBeInstanceOf(Object);
      expect(res.body.user).toMatchObject({
        firstName: "Susan",
        lastName: "Cowan",
        preferredName: "Susan",
        jobTitle: "Nurse",
        userName: "susancowan",
        password: "",
        emailAddress: "susan.cowan3@nhs.uk",
        primaryAccessLevel: ["Clinician"],
        secondaryAccessLevel: ["Viewer"],
      });
    });
  });
  describe("/api/users Error Handling", () => {
    describe("/api/users GET Error Handling", () => {
      test("Status 404: Invalid URL /api/user", async () => {
        const res = await request(app).get("/api/user").expect(404);
        expect(res.body.msg).toBe("Invalid URL");
      });
      test("Status 404: /api/users/:username - Username does not exist", async () => {
        let res = await request(app).get("/api/users/userA").expect(404);
        expect(res.body.msg).toBe("Username not found");
        res = await request(app).get("/api/users/23422").expect(404);
        expect(res.body.msg).toBe("Username not found");
      });
    });
  });
});

describe("/api/branches Test Requests", () => {
  describe("/api/branches POST Requests", () => {
    test("Status 201: Should setup a new branch with relevant properties when POST request made with a type of 'edit'", async () => {
      const currentDateTime = String(Date.now());
      const branchToSetup = {
        type: "edit",
        branchName: "test-edit-branch",
        branchSetupDateTime: currentDateTime,
        branchOwner: "joebloggs",
        guideline: {
          GuidanceNumber: "AB01",
          GuidanceSlug: "test-guideline-slug",
          GuidanceType: "Clinical guideline",
          LongTitle: "Test guideline Long Title",
          NHSEvidenceAccredited: false,
          InformationStandardAccredited: false,
          Chapters: [
            {
              ChapterId: "overview",
              Title: "Overview",
              Content:
                '<div class="chapter" title="Overview" id="ng232_overview" xmlns="http://www.w3.org/1999/xhtml">\r\n  <h2 class="title">\r\n    <a id="overview"></a>Overview</h2>\r\n  <p>XXX.</p>\r\n  <p>See <a class="link" href="https://www.nice.org.uk/guidance/ng40" target="_top" data-original-url="https://www.nice.org.uk/guidance/ng40">XXX.</p>\r\n</div>',
              Sections: [
                {
                  SectionId: "who-is-it-for",
                  Title: "Who is it for?",
                  Content:
                    '<div class="section" title="Who is it for?" id="ng232_who-is-it-for" xmlns="http://www.w3.org/1999/xhtml">\r\n  <h3 class="title">\r\n    <a id="who-is-it-for"></a>Who is it for?</h3>\r\n  <div class="itemizedlist">\r\n    <ul class="itemizedlist">\r\n      <li class="listitem">\r\n        <p>Healthcare professionals</p>\r\n      </li>\r\n      <li class="listitem">\r\n        <p>People with a head injury, their families and carers</p>\r\n      </li>\r\n      <li class="listitem">\r\n        <p>Commissioners and providers</p>\r\n      </li>\r\n    </ul>\r\n  </div>\r\n</div>',
                },
              ],
            },
          ],
          LastModified: "/Date(1682502323341+0100)/",
          Uri: "http://www.test-guideline.com/a/b/s",
          Title: "This is a short title",
        },
      };

      const res = await request(app)
        .post("/api/branches?type=edit")
        .send(branchToSetup)
        .expect(201);

      expect(res.body.branch.branchSetupDateTime).toBe(currentDateTime);
      expect(res.body.branch).toHaveProperty("_id");
      expect(res.body.branch).toMatchObject({
        type: "edit",
        branchName: "test-edit-branch",
        branchSetupDateTime: currentDateTime,
        branchOwner: "joebloggs",
        branchAllowedUsers: [],
        branchLockedForApproval: false,
        guideline: {
          GuidanceNumber: "AB01",
          GuidanceSlug: "test-guideline-slug",
          GuidanceType: "Clinical guideline",
          LongTitle: "Test guideline Long Title",
          NHSEvidenceAccredited: false,
          InformationStandardAccredited: false,
          Chapters: [
            {
              ChapterId: "overview",
              Title: "Overview",
              Content:
                '<div class="chapter" title="Overview" id="ng232_overview" xmlns="http://www.w3.org/1999/xhtml">\r\n  <h2 class="title">\r\n    <a id="overview"></a>Overview</h2>\r\n  <p>XXX.</p>\r\n  <p>See <a class="link" href="https://www.nice.org.uk/guidance/ng40" target="_top" data-original-url="https://www.nice.org.uk/guidance/ng40">XXX.</p>\r\n</div>',
              Sections: [
                {
                  SectionId: "who-is-it-for",
                  Title: "Who is it for?",
                  Content:
                    '<div class="section" title="Who is it for?" id="ng232_who-is-it-for" xmlns="http://www.w3.org/1999/xhtml">\r\n  <h3 class="title">\r\n    <a id="who-is-it-for"></a>Who is it for?</h3>\r\n  <div class="itemizedlist">\r\n    <ul class="itemizedlist">\r\n      <li class="listitem">\r\n        <p>Healthcare professionals</p>\r\n      </li>\r\n      <li class="listitem">\r\n        <p>People with a head injury, their families and carers</p>\r\n      </li>\r\n      <li class="listitem">\r\n        <p>Commissioners and providers</p>\r\n      </li>\r\n    </ul>\r\n  </div>\r\n</div>',
                },
              ],
            },
          ],
          LastModified: "/Date(1682502323341+0100)/",
          Uri: "http://www.test-guideline.com/a/b/s",
          Title: "This is a short title",
        },
      });
    });
    test("Status 201: Should setup a new branch with relevant properties when POST request made with a type of 'create', generates a basic guideline template", async () => {
      const currentDateTime = String(Date.now());
      const branchToSetup = {
        type: "create",
        branchName: "test-create-branch",
        branchSetupDateTime: currentDateTime,
        branchOwner: "joebloggs",
        guidelineTitle: "Disease A",
        guidelineNumberProposed: "DA1",
      };

      const res = await request(app)
        .post("/api/branches?type=create")
        .send(branchToSetup)
        .expect(201);

      expect(res.body.branch.branchSetupDateTime).toBe(currentDateTime);
      expect(res.body.branch).toHaveProperty("_id");
      expect(res.body.branch).toMatchObject({
        type: "create",
        branchName: "test-create-branch",
        branchSetupDateTime: currentDateTime,
        branchOwner: "joebloggs",
        branchAllowedUsers: [],
        branchLockedForApproval: false,
        comments: [],
        guideline: {
          GuidanceNumber: branchToSetup.guidelineNumberProposed,
          GuidanceSlug: "disease-a",
          GuidanceType: "Clinical guideline",
          LongTitle: `${branchToSetup.guidelineTitle} (${branchToSetup.guidelineNumberProposed})`,
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
          Title: branchToSetup.guidelineTitle,
        },
      });
    });
  });
  describe("/api/branches GET Requests", () => {
    test("Status 200: Should respond with all branches for GET request to /api/branches", async () => {
      const res = await request(app).get("/api/branches").expect(200);
      expect(res.body.branches).toBeInstanceOf(Array);
      expect(res.body.branches).toHaveLength(2);
      res.body.branches.forEach((branch) => {
        expect(branch).toMatchObject({
          _id: expect.any(String),
          type: expect.any(String),
          branchName: expect.any(String),
          branchOwner: expect.any(String),
          branchAllowedUsers: expect.any(Array),
          branchLockedForApproval: expect.any(Boolean),
          guideline: {
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
          },
        });
      });
    });
    test("Status 200: Should respond with a specific branch by branch_name for GET request to /api/branches/:branch_name", async () => {
      const res = await request(app)
        .get("/api/branches/test-edit-branch")
        .expect(200);
      expect(res.body.branch).toBeInstanceOf(Object);
      expect(res.body.branch).toMatchObject({
        _id: expect.any(String),
        type: "edit",
        branchName: "test-edit-branch",
        branchSetupDateTime: expect.any(String),
        branchOwner: "joebloggs",
        branchAllowedUsers: [],
        branchLockedForApproval: false,
        guideline: {
          GuidanceNumber: "AB01",
          GuidanceSlug: "test-guideline-slug",
          GuidanceType: "Clinical guideline",
          LongTitle: "Test guideline Long Title",
          NHSEvidenceAccredited: false,
          InformationStandardAccredited: false,
          Chapters: [
            {
              ChapterId: "overview",
              Title: "Overview",
              Content:
                '<div class="chapter" title="Overview" id="ng232_overview" xmlns="http://www.w3.org/1999/xhtml">\r\n  <h2 class="title">\r\n    <a id="overview"></a>Overview</h2>\r\n  <p>XXX.</p>\r\n  <p>See <a class="link" href="https://www.nice.org.uk/guidance/ng40" target="_top" data-original-url="https://www.nice.org.uk/guidance/ng40">XXX.</p>\r\n</div>',
              Sections: [
                {
                  SectionId: "who-is-it-for",
                  Title: "Who is it for?",
                  Content:
                    '<div class="section" title="Who is it for?" id="ng232_who-is-it-for" xmlns="http://www.w3.org/1999/xhtml">\r\n  <h3 class="title">\r\n    <a id="who-is-it-for"></a>Who is it for?</h3>\r\n  <div class="itemizedlist">\r\n    <ul class="itemizedlist">\r\n      <li class="listitem">\r\n        <p>Healthcare professionals</p>\r\n      </li>\r\n      <li class="listitem">\r\n        <p>People with a head injury, their families and carers</p>\r\n      </li>\r\n      <li class="listitem">\r\n        <p>Commissioners and providers</p>\r\n      </li>\r\n    </ul>\r\n  </div>\r\n</div>',
                },
              ],
            },
          ],
          LastModified: "/Date(1682502323341+0100)/",
          Uri: "http://www.test-guideline.com/a/b/s",
          Title: "This is a short title",
        },
      });
    });
  });
  describe("/api/branches PATCH Requests", () => {
    test("Status 200: Should respond with updated branch information with a status 200 when a successful PATCH request is made to /api/branches/:branch_name and only the 'content' property changed on a section within a chapter", async () => {
      const chapterNum = 0;
      const sectionNum = 0;

      const patchBody =
        '<div class="section" title="Who is it for?" id="ng232_who-is-it-for" xmlns="http://www.w3.org/1999/xhtml">\r\n  <h3 class="title">\r\n    <a id="who-is-it-for"></a>Who is it for?</h3>\r\n  <div class="itemizedlist">\r\n    <ul class="itemizedlist">\r\n      <li class="listitem">\r\n        <p>Healthcare professionals</p>\r\n      </li>\r\n      <li class="listitem">\r\n        <p>People with a head injury, their families and carers</p>\r\n      </li>\r\n      <li class="listitem">\r\n        <p>Commissioners and providers YYY XXX ZZZ</p>\r\n      </li>\r\n    </ul>\r\n  </div>\r\n</div>';

      const expected =
        '<div class="section" title="Who is it for?" id="ng232_who-is-it-for" xmlns="http://www.w3.org/1999/xhtml">\r\n  <h3 class="title">\r\n    <a id="who-is-it-for"></a>Who is it for?</h3>\r\n  <div class="itemizedlist">\r\n    <ul class="itemizedlist">\r\n      <li class="listitem">\r\n        <p>Healthcare professionals</p>\r\n      </li>\r\n      <li class="listitem">\r\n        <p>People with a head injury, their families and carers</p>\r\n      </li>\r\n      <li class="listitem">\r\n        <p>Commissioners and providers YYY XXX ZZZ</p>\r\n      </li>\r\n    </ul>\r\n  </div>\r\n</div>';

      const res = await request(app)
        .patch("/api/branches/test-edit-branch")
        .send({ chapterNum, sectionNum, patchBody })
        .expect(200);

      expect(
        res.body.branch.guideline.Chapters[chapterNum].Sections[sectionNum]
          .SectionId
      ).toBe("who-is-it-for");
      expect(
        res.body.branch.guideline.Chapters[chapterNum].Sections[sectionNum]
          .Title
      ).toBe("Who is it for?");
      expect(
        res.body.branch.guideline.Chapters[chapterNum].Sections[sectionNum]
          .Content
      ).toEqual(expected);
    });
    test("Status 200: Should respond with updated branch information with a status 200 when a successful PATCH request is made to /api/branches/:branch_name and only the 'content' property changed on a chapter (ignores section, uses '999' as the signifier to ignore sectionNum)", async () => {
      const chapterNum = 0;
      const sectionNum = 999;

      const patchBody =
        '<div class="chapter" title="Overview" id="ng232_overview" xmlns="http://www.w3.org/1999/xhtml">\r\n  <h2 class="title">\r\n    <a id="overview"></a>Overview EDITED!</h2>\r\n  <p>XXX.</p>\r\n  <p>See <a class="link" href="https://www.nice.org.uk/guidance/ng40" target="_top" data-original-url="https://www.nice.org.uk/guidance/ng40">XXX.</p>\r\n</div>';

      const expected =
        '<div class="chapter" title="Overview" id="ng232_overview" xmlns="http://www.w3.org/1999/xhtml">\r\n  <h2 class="title">\r\n    <a id="overview"></a>Overview EDITED!</h2>\r\n  <p>XXX.</p>\r\n  <p>See <a class="link" href="https://www.nice.org.uk/guidance/ng40" target="_top" data-original-url="https://www.nice.org.uk/guidance/ng40">XXX.</p>\r\n</div>';

      const res = await request(app)
        .patch("/api/branches/test-edit-branch")
        .send({ chapterNum, sectionNum, patchBody })
        .expect(200);

      expect(res.body.branch.guideline.Chapters[chapterNum].ChapterId).toBe(
        "overview"
      );
      expect(res.body.branch.guideline.Chapters[chapterNum].Title).toBe(
        "Overview"
      );
      expect(res.body.branch.guideline.Chapters[chapterNum].Content).toEqual(
        expected
      );
    });
    test("Status 200: Should update the Chapter Title and ChapterId for the current chapter being edited", async () => {
      const chapterNum = 0;
      const sectionNum = 999;

      const newTitle = "Overview Change Test";

      const patchBody =
        '<div class="chapter" title="Overview" id="xo723_overview" xmlns="http://www.w3.org/1999/xhtml">\r\n  <h2 class="title">\r\n    <a id="overview"></a>Overview</h2>\r\n  <p>This is a test paragraph</p>\r\n</div>';

      const res = await request(app)
        .patch("/api/branches/test-edit-branch")
        .send({ chapterNum, sectionNum, patchBody, newTitle })
        .expect(200);

      expect(res.body.branch.guideline.Chapters[chapterNum].ChapterId).toBe(
        "overview-change-test"
      );
      expect(res.body.branch.guideline.Chapters[chapterNum].Title).toBe(
        "Overview Change Test"
      );
    });
    test("Status 200: Should update the branchLastModified property with the latest date once a successful PATCH request on /api/branches/:branch_name is complete", async () => {
      const chapterNum = 0;
      const sectionNum = 0;

      const patchBody = {
        SectionId: "who-is-it-for",
        Title: "Who is it for?",
        Content:
          '<div class="section" title="Who is it for?" id="ng232_who-is-it-for" xmlns="http://www.w3.org/1999/xhtml">\r\n  <h3 class="title">\r\n    <a id="who-is-it-for"></a>I AM ANOTHER EDIT Who is it for?</h3>\r\n  <div class="itemizedlist">\r\n    <ul class="itemizedlist">\r\n      <li class="listitem">\r\n        <p>Healthcare professionals</p>\r\n      </li>\r\n      <li class="listitem">\r\n        <p>People with a head injury, their families and carers</p>\r\n      </li>\r\n      <li class="listitem">\r\n        <p>Commissioners and providers YYY XXX ZZZ</p>\r\n      </li>\r\n    </ul>\r\n  </div>\r\n</div>',
      };

      const res = await request(app)
        .patch("/api/branches/test-edit-branch")
        .send({ chapterNum, sectionNum, patchBody })
        .expect(200);

      const currentYear = String(new Date().getFullYear());
      const currentHour = String(new Date().getHours());

      expect(typeof res.body.branch.branchLastModified).toBe("string");
      expect(/^\d+$/.test(res.body.branch.branchLastModified)).toBe(true);
      expect(
        String(new Date(Number(res.body.branch.branchLastModified)))
      ).toContain(currentYear);
      expect(
        String(new Date(Number(res.body.branch.branchLastModified)))
      ).toContain(currentHour);
    });
    test("Status 200: Should update the Section Title and ChapterId for the current chapter being edited", async () => {
      const chapterNum = 0;
      const sectionNum = 0;

      const newTitle = "Who is it for test?";

      const patchBody =
        '<div class="section" title="Who is it for?" id="ng232_who-is-it-for" xmlns="http://www.w3.org/1999/xhtml">\r\n  <h3 class="title">\r\n    <a id="who-is-it-for"></a>Who is it for?</h3>\r\n  <div class="itemizedlist">\r\n    <ul class="itemizedlist">\r\n      <li class="listitem">\r\n        <p>Healthcare professionals</p>\r\n      </li>\r\n      <li class="listitem">\r\n        <p>People with a head injury, their families and carers</p>\r\n      </li>\r\n      <li class="listitem">\r\n        <p>Commissioners and providers</p>\r\n      </li>\r\n    </ul>\r\n  </div>\r\n</div>"';

      const res = await request(app)
        .patch("/api/branches/test-edit-branch")
        .send({ chapterNum, sectionNum, patchBody, newTitle })
        .expect(200);

      expect(
        res.body.branch.guideline.Chapters[chapterNum].Sections[sectionNum]
          .SectionId
      ).toBe("who-is-it-for-test");
      expect(
        res.body.branch.guideline.Chapters[chapterNum].Sections[sectionNum]
          .Title
      ).toBe("Who is it for test?");
    });
    test("Status 200: Should respond with the updated branch when a new user is added to the branchAllowedUsers array on /api/branches/:branch_name/addusers", async () => {
      const userToAdd = "janedoe";

      const res = await request(app)
        .patch("/api/branches/test-edit-branch/addusers")
        .send({ userToAdd })
        .expect(200);

      expect(res.body.branch.branchOwner).toBe("joebloggs");
      expect(res.body.branch.branchAllowedUsers).toEqual(["janedoe"]);
    });
    test("Status 200: Should update the branchLastModified property with the latest date once a successful PATCH request on /api/branches/:branch_name/addusers is complete", async () => {
      const userToAdd = "bosnow";

      const res = await request(app)
        .patch("/api/branches/test-edit-branch/addusers")
        .send({ userToAdd })
        .expect(200);

      const currentYear = String(new Date().getFullYear());
      const currentHour = String(new Date().getHours());

      expect(typeof res.body.branch.branchLastModified).toBe("string");
      expect(/^\d+$/.test(res.body.branch.branchLastModified)).toBe(true);
      expect(
        String(new Date(Number(res.body.branch.branchLastModified)))
      ).toContain(currentYear);
      expect(
        String(new Date(Number(res.body.branch.branchLastModified)))
      ).toContain(currentHour);
    });
    test("Status 200: Should update the branchLockedForApproval to true (locked) when the endpoint is invoked", async () => {
      const res = await request(app)
        .patch("/api/branches/test-edit-branch/lockbranch")
        .expect(200);

      expect(res.body.branch.branchLockedForApproval).toBe(true);
    });
    test("Status 200: Should update the branchLockedForApproval to false (un-locked) when the endpoint is invoked", async () => {
      const res = await request(app)
        .patch("/api/branches/test-edit-branch/unlockbranch")
        .expect(200);

      expect(res.body.branch.branchLockedForApproval).toBe(false);
    });
    test("Status 200: Should add a new section to an existing chapter when the endpoint is invoked using the passed in section title from the user", async () => {
      const chapterNum = 0;

      const expectedSectionContent =
        '<div class="section" title="Section Title" xmlns="http://www.w3.org/1999/xhtml">\r\n  <h3 class="title">\r\n    Title to edit</h3>\r\n <p>Content to edit.</p>\r\n</div>';

      const res = await request(app)
        .patch("/api/branches/test-edit-branch/addsection")
        .send({ chapterNum })
        .expect(200);

      expect(
        res.body.branch.guideline.Chapters[chapterNum].Sections[
          res.body.branch.guideline.Chapters[chapterNum].Sections.length - 1
        ].SectionId
      ).toBe("section-title");
      expect(
        res.body.branch.guideline.Chapters[chapterNum].Sections[
          res.body.branch.guideline.Chapters[chapterNum].Sections.length - 1
        ].Title
      ).toBe("Section Title");
      expect(
        res.body.branch.guideline.Chapters[chapterNum].Sections[
          res.body.branch.guideline.Chapters[chapterNum].Sections.length - 1
        ].Content
      ).toBe(expectedSectionContent);
    });
  });
  describe("/api/branches/:branch_name/comments Requests", () => {
    describe("/api/branches/:branch_name/comments POST Requests", () => {
      test("Status 200: Should respond with 200 when a new comment is successfully added to the branch", async () => {
        const dateNow = Date.now();

        const newComment = {
          author: "katedillon",
          body: "You need to re-review the evidence and references for chapter 2 section 3",
          commentDate: dateNow,
        };

        const res = await request(app)
          .post("/api/branches/test-edit-branch/comments")
          .send({ newComment })
          .expect(200);

        expect(res.body.comment).toEqual({
          _id: expect.any(String),
          author: "katedillon",
          body: "You need to re-review the evidence and references for chapter 2 section 3",
          commentDate: expect.any(String),
        });
      });
      test("Status 200: Should respond with 200 and add a 2nd new comment to the same branch", async () => {
        const dateNow = Date.now();

        const newComment = {
          author: "jasonparker",
          body: "To follow up on Kate's point, the reference to xxx is 1 year out of date to standard",
          commentDate: dateNow,
        };

        const res = await request(app)
          .post("/api/branches/test-edit-branch/comments")
          .send({ newComment })
          .expect(200);

        expect(res.body.comment).toEqual({
          _id: expect.any(String),
          author: "jasonparker",
          body: "To follow up on Kate's point, the reference to xxx is 1 year out of date to standard",
          commentDate: expect.any(String),
        });
      });
    });
    describe("/api/branches/:branch_name/comments GET Requests", () => {
      test("Status 200: Should respond with 200 and all comments for a branch with has existing comments on a successful GET Request", async () => {
        const res = await request(app)
          .get("/api/branches/test-edit-branch/comments")
          .expect(200);

        expect(res.body.comments).toBeInstanceOf(Array);
        expect(res.body.comments).toHaveLength(2);
        res.body.comments.forEach((comment) => {
          expect(comment).toMatchObject({
            author: expect.any(String),
            body: expect.any(String),
            commentDate: expect.any(String),
            _id: expect.any(String),
          });
        });
        expect(res.body.comments[0]).toEqual({
          author: "katedillon",
          body: "You need to re-review the evidence and references for chapter 2 section 3",
          commentDate: expect.any(String),
          _id: expect.any(String),
        });
      });
      test("Status 200: Should respond with 200 and all comments for a branch with has no comments on a successful GET Request", async () => {
        const currentDateTime = String(Date.now());
        const branchToSetup = {
          type: "edit",
          branchName: "another-test-branch",
          branchSetupDateTime: currentDateTime,
          branchOwner: "janedoe",
          guideline: {
            GuidanceNumber: "ZZ99",
            GuidanceSlug: "test-guideline-slug",
            GuidanceType: "Clinical guideline",
            LongTitle: "Test guideline Long Title",
            NHSEvidenceAccredited: false,
            InformationStandardAccredited: false,
            Chapters: [
              {
                ChapterId: "overview",
                Title: "Overview",
                Content:
                  '<div class="chapter" title="Overview" id="ng232_overview" xmlns="http://www.w3.org/1999/xhtml">\r\n  <h2 class="title">\r\n    <a id="overview"></a>Overview</h2>\r\n  <p>XXX.</p>\r\n  <p>See <a class="link" href="https://www.nice.org.uk/guidance/ng40" target="_top" data-original-url="https://www.nice.org.uk/guidance/ng40">XXX.</p>\r\n</div>',
                Sections: [
                  {
                    SectionId: "who-is-it-for",
                    Title: "Who is it for?",
                    Content:
                      '<div class="section" title="Who is it for?" id="ng232_who-is-it-for" xmlns="http://www.w3.org/1999/xhtml">\r\n  <h3 class="title">\r\n    <a id="who-is-it-for"></a>Who is it for?</h3>\r\n  <div class="itemizedlist">\r\n    <ul class="itemizedlist">\r\n      <li class="listitem">\r\n        <p>Healthcare professionals</p>\r\n      </li>\r\n      <li class="listitem">\r\n        <p>People with a head injury, their families and carers</p>\r\n      </li>\r\n      <li class="listitem">\r\n        <p>Commissioners and providers</p>\r\n      </li>\r\n    </ul>\r\n  </div>\r\n</div>',
                  },
                ],
              },
            ],
            LastModified: "/Date(1682502323341+0100)/",
            Uri: "http://www.test-guideline.com/a/b/s",
            Title: "This is a short title",
          },
        };

        await request(app)
          .post("/api/branches?type=edit")
          .send(branchToSetup)
          .expect(201);

        const getComments = await request(app)
          .get("/api/branches/another-test-branch/comments")
          .expect(200);

        expect(getComments.body.comments).toBeInstanceOf(Array);
        expect(getComments.body.comments).toEqual([]);
        expect(getComments.body.comments).toHaveLength(0);
      });
    });
  });
  describe("/api/branches DELETE Requests", () => {
    test("Status 204: Should respond with a status 204 and no content when a branch is successfully deleted by branch_name", async () => {
      await request(app).delete("/api/branches/test-edit-branch").expect(204);
      await request(app)
        .delete("/api/branches/another-test-branch")
        .expect(204);
    });
  });
  describe("/api/branches Error Handing", () => {
    describe("/api/branches GET Error Handling", () => {
      test("Status 404: Invalid URL /api/branch & /api/branchz", async () => {
        let res = await request(app).get("/api/branch").expect(404);
        expect(res.body.msg).toBe("Invalid URL");
        res = await request(app).get("/api/branchz").expect(404);
        expect(res.body.msg).toBe("Invalid URL");
      });
      test("Status 404: Branch Name does not exist", async () => {
        let res = await request(app).get("/api/branches/AB123-ss").expect(404);
        expect(res.body.msg).toBe("Branch not found");
        res = await request(app).get("/api/branches/test-branch").expect(404);
        expect(res.body.msg).toBe("Branch not found");
        res = await request(app).get("/api/branches/1").expect(404);
        expect(res.body.msg).toBe("Branch not found");
        res = await request(app).get("/api/branches/a").expect(404);
        expect(res.body.msg).toBe("Branch not found");
      });
    });
    describe("/api/branches POST Error Handling", () => {
      test("Status 400: Incorrect POST request when missing the 'type' parameter", async () => {
        const currentDateTime = String(Date.now());
        const branchToSetup = {
          type: "edit",
          branchName: "another-test-branch",
          branchSetupDateTime: currentDateTime,
          branchOwner: "janedoe",
          guideline: {
            GuidanceNumber: "ZZ99",
            GuidanceSlug: "test-guideline-slug-2",
            GuidanceType: "Clinical guideline",
            LongTitle: "Test guideline Long Title 2",
            NHSEvidenceAccredited: false,
            InformationStandardAccredited: false,
            Chapters: [],
            LastModified: "/Date(1682502323341+0100)/",
            Uri: "http://www.test-guideline.com/a/b/z",
            Title: "This is a short title 2",
          },
        };

        const res = await request(app)
          .post("/api/branches")
          .send(branchToSetup)
          .expect(400);

        expect(res.body.msg).toBe("Bad Request: Specficy type parameter");
      });
      test("Status 400: Malformed body - no content in the new Branch object", async () => {
        const branchToSetup = {};

        const res = await request(app)
          .post("/api/branches?type=edit")
          .send(branchToSetup)
          .expect(400);
        expect(res.body.msg).toBe("Bad Request");
      });
    });
    describe("/api/branches PATCH Error Handling", () => {
      test("Status 404: Branch Name does not exist", async () => {
        const chapterNum = 1;
        const sectionNum = 4;
        const patchBody = { keyName: "Test" };

        const res = await request(app)
          .patch("/api/branches/ZZ999")
          .send({ chapterNum, sectionNum, patchBody })
          .expect(404);
        expect(res.body.msg).toBe("Branch not found");
      });
      test("Should set up a test-branch branch for the next 4 tests", async () => {
        const currentDateTime = String(Date.now());
        const branchToSetup = {
          type: "edit",
          branchName: "test-branch",
          branchSetupDateTime: currentDateTime,
          branchOwner: "joebloggs",
          guideline: {
            GuidanceNumber: "AB01",
            GuidanceSlug: "test-guideline-slug",
            GuidanceType: "Clinical guideline",
            LongTitle: "Test guideline Long Title",
            NHSEvidenceAccredited: false,
            InformationStandardAccredited: false,
            Chapters: [],
            LastModified: "/Date(1682502323341+0100)/",
            Uri: "http://www.test-guideline.com/a/b/s",
            Title: "This is a short title",
          },
        };

        await request(app)
          .post("/api/branches?type=edit")
          .send(branchToSetup)
          .expect(201);
      });
      test("Status 400: Malformed body - chapterNum missing/not a number", async () => {
        const chapterNum = null;
        const sectionNum = 4;
        const patchBody = { keyName: "Test" };

        const res = await request(app)
          .patch("/api/branches/test-branch")
          .send({ chapterNum, sectionNum, patchBody })
          .expect(400);
        expect(res.body.msg).toBe("Bad Request");
      });
      test("Status 400: Malformed body - sectionNum missing/not a number", async () => {
        const chapterNum = 0;
        const sectionNum = null;
        const patchBody = { keyName: "Test" };

        const res = await request(app)
          .patch("/api/branches/test-branch")
          .send({ chapterNum, sectionNum, patchBody })
          .expect(400);
        expect(res.body.msg).toBe("Bad Request");
      });
      test("Status 400: Malformed body - nothing submitted for patchBody", async () => {
        const chapterNum = 0;
        const sectionNum = 1;
        const patchBody = {};

        const res = await request(app)
          .patch("/api/branches/test-branch")
          .send({ chapterNum, sectionNum, patchBody })
          .expect(400);
        expect(res.body.msg).toBe("Bad Request");
      });
      test("Status 400: Bad Request, malformed body - reponds with error when trying to add a new approved user to a branch when the user provided is empty", async () => {
        const userToAdd = "";

        const res = await request(app)
          .patch("/api/branches/test-branch/addusers")
          .send({ userToAdd })
          .expect(400);

        expect(res.body.msg).toBe("Bad Request: No user provided");
      });
      test("Status 400: Bad Request, malformed body - reponds with error when trying to add a new approved user to a branch when the user provided is missing", async () => {
        let userToAdd;

        const res = await request(app)
          .patch("/api/branches/test-branch/addusers")
          .send({ userToAdd })
          .expect(400);

        expect(res.body.msg).toBe("Bad Request: No user provided");
      });
      test("Should delete the test-branch branch for the last 4 tests ", async () => {
        await request(app).delete("/api/branches/test-branch").expect(204);
      });
    });
    describe("/api/branches/:branch_name/comments POST Error Handling", () => {
      test("Status 400: Missing selected required properties/Malformed body", async () => {
        const currentDateTime = String(Date.now());
        const branchToSetup = {
          type: "edit",
          branchName: "yet-another-test-branch",
          branchSetupDateTime: currentDateTime,
          branchOwner: "janedoe",
          guideline: {
            GuidanceNumber: "ZZ99",
            GuidanceSlug: "test-guideline-slug",
            GuidanceType: "Clinical guideline",
            LongTitle: "Test guideline Long Title",
            NHSEvidenceAccredited: false,
            InformationStandardAccredited: false,
            Chapters: [
              {
                ChapterId: "overview",
                Title: "Overview",
                Content:
                  '<div class="chapter" title="Overview" id="ng232_overview" xmlns="http://www.w3.org/1999/xhtml">\r\n  <h2 class="title">\r\n    <a id="overview"></a>Overview</h2>\r\n  <p>XXX.</p>\r\n  <p>See <a class="link" href="https://www.nice.org.uk/guidance/ng40" target="_top" data-original-url="https://www.nice.org.uk/guidance/ng40">XXX.</p>\r\n</div>',
                Sections: [
                  {
                    SectionId: "who-is-it-for",
                    Title: "Who is it for?",
                    Content:
                      '<div class="section" title="Who is it for?" id="ng232_who-is-it-for" xmlns="http://www.w3.org/1999/xhtml">\r\n  <h3 class="title">\r\n    <a id="who-is-it-for"></a>Who is it for?</h3>\r\n  <div class="itemizedlist">\r\n    <ul class="itemizedlist">\r\n      <li class="listitem">\r\n        <p>Healthcare professionals</p>\r\n      </li>\r\n      <li class="listitem">\r\n        <p>People with a head injury, their families and carers</p>\r\n      </li>\r\n      <li class="listitem">\r\n        <p>Commissioners and providers</p>\r\n      </li>\r\n    </ul>\r\n  </div>\r\n</div>',
                  },
                ],
              },
            ],
            LastModified: "/Date(1682502323341+0100)/",
            Uri: "http://www.test-guideline.com/a/b/s",
            Title: "This is a short title",
          },
        };

        await request(app)
          .post("/api/branches?type=edit")
          .send(branchToSetup)
          .expect(201);

        const dateNow = Date.now();

        const newComment = {
          body: "You need to re-review the evidence and references for chapter 2 section 3",
          commentDate: dateNow,
        };

        const res = await request(app)
          .post("/api/branches/yet-another-test-branch/comments")
          .send({ newComment })
          .expect(400);

        expect(res.body.msg).toBe("Bad Request");
      });
      test("Status 400: Missing selected required properties/Malformed body", async () => {
        const dateNow = Date.now();

        const newComment = {
          author: "janedoe",
          commentDate: dateNow,
        };

        const res = await request(app)
          .post("/api/branches/yet-another-test-branch/comments")
          .send({ newComment })
          .expect(400);

        expect(res.body.msg).toBe("Bad Request");
      });
      test("Status 400: Missing all properties/Malformed body", async () => {
        const newComment = {};

        const res = await request(app)
          .post("/api/branches/yet-another-test-branch/comments")
          .send({ newComment })
          .expect(400);

        expect(res.body.msg).toBe("Bad Request");
      });
      test("Status 404: Branch name does not exist", async () => {
        const dateNow = Date.now();

        const newComment = {
          author: "janedoe",
          body: "You need to re-review the evidence and references for chapter 2 section 3",
          commentDate: dateNow,
        };

        let res = await request(app)
          .post("/api/branches/not-a-branch/comments")
          .send({ newComment })
          .expect(404);

        expect(res.body.msg).toBe("Branch not found");

        await request(app)
          .delete("/api/branches/yet-another-test-branch")
          .expect(204);

        res = await request(app)
          .post("/api/branches/not-a-branch/comments")
          .send({ newComment })
          .expect(404);

        expect(res.body.msg).toBe("Branch not found");
      });
    });
    describe("/api/branches DELETE Error Handling", () => {
      test("Status 404: Branch Name does not exist", async () => {
        let res = await request(app).delete("/api/branches/AB123").expect(404);
        expect(res.body.msg).toBe("Branch not found");
        res = await request(app).delete("/api/branches/999ZZ").expect(404);
        expect(res.body.msg).toBe("Branch not found");
      });
      test("Status 404: Branch name which used to exist, no longer does and has been properly deleted", async () => {
        const res = await request(app)
          .delete("/api/branches/test-edit-branch")
          .expect(404);
        expect(res.body.msg).toBe("Branch not found");
      });
    });
  });
});

describe("/api/approvals Test Requests", () => {
  describe("/api/approvals POST Requests", () => {
    test("Status 201: Should setup a new approval with relevant properties when POST request made with a type of 'edit'", async () => {
      const currentDateTime = String(Date.now());
      const approvalToSetup = {
        type: "edit",
        approvalRequestName: "test-approval-request",
        approvalSetupDateTime: currentDateTime,
        approvalPurposeDescription:
          "A number of edits have been made to Chapter 1 Section 1 to streamline the text",
        branchName: "test-branch-name",
        branchOwner: "joebloggs",
        guideline: {
          GuidanceNumber: "AB01",
          GuidanceSlug: "test-guideline-slug",
          GuidanceType: "Clinical guideline",
          LongTitle: "Test guideline Long Title",
          NHSEvidenceAccredited: false,
          InformationStandardAccredited: false,
          Chapters: [
            {
              ChapterId: "overview",
              Title: "Overview",
              Content:
                '<div class="chapter" title="Overview" id="ng232_overview" xmlns="http://www.w3.org/1999/xhtml">\r\n  <h2 class="title">\r\n    <a id="overview"></a>Overview</h2>\r\n  <p>XXX.</p>\r\n  <p>See <a class="link" href="https://www.nice.org.uk/guidance/ng40" target="_top" data-original-url="https://www.nice.org.uk/guidance/ng40">XXX.</p>\r\n</div>',
              Sections: [
                {
                  SectionId: "who-is-it-for",
                  Title: "Who is it for?",
                  Content:
                    '<div class="section" title="Who is it for?" id="ng232_who-is-it-for" xmlns="http://www.w3.org/1999/xhtml">\r\n  <h3 class="title">\r\n    <a id="who-is-it-for"></a>Who is it for?</h3>\r\n  <div class="itemizedlist">\r\n    <ul class="itemizedlist">\r\n      <li class="listitem">\r\n        <p>Healthcare professionals</p>\r\n      </li>\r\n      <li class="listitem">\r\n        <p>People with a head injury, their families and carers</p>\r\n      </li>\r\n      <li class="listitem">\r\n        <p>Commissioners and providers</p>\r\n      </li>\r\n    </ul>\r\n  </div>\r\n</div>',
                },
              ],
            },
          ],
          LastModified: "/Date(1682502323341+0100)/",
          Uri: "http://www.test-guideline.com/a/b/s",
          Title: "This is a short title",
        },
      };

      const res = await request(app)
        .post("/api/approvals?type=edit")
        .send(approvalToSetup)
        .expect(201);

      expect(res.body.approval.approvalSetupDateTime).toBe(currentDateTime);
      expect(res.body.approval).toHaveProperty("_id");
      expect(res.body.approval).toMatchObject({
        type: "edit",
        approvalRequestName: "test-approval-request",
        approvalSetupDateTime: currentDateTime,
        approvalPurposeDescription:
          "A number of edits have been made to Chapter 1 Section 1 to streamline the text",
        branchOwner: "joebloggs",
        branchName: "test-branch-name",
        guideline: {
          GuidanceNumber: "AB01",
          GuidanceSlug: "test-guideline-slug",
          GuidanceType: "Clinical guideline",
          LongTitle: "Test guideline Long Title",
          NHSEvidenceAccredited: false,
          InformationStandardAccredited: false,
          Chapters: [
            {
              ChapterId: "overview",
              Title: "Overview",
              Content:
                '<div class="chapter" title="Overview" id="ng232_overview" xmlns="http://www.w3.org/1999/xhtml">\r\n  <h2 class="title">\r\n    <a id="overview"></a>Overview</h2>\r\n  <p>XXX.</p>\r\n  <p>See <a class="link" href="https://www.nice.org.uk/guidance/ng40" target="_top" data-original-url="https://www.nice.org.uk/guidance/ng40">XXX.</p>\r\n</div>',
              Sections: [
                {
                  SectionId: "who-is-it-for",
                  Title: "Who is it for?",
                  Content:
                    '<div class="section" title="Who is it for?" id="ng232_who-is-it-for" xmlns="http://www.w3.org/1999/xhtml">\r\n  <h3 class="title">\r\n    <a id="who-is-it-for"></a>Who is it for?</h3>\r\n  <div class="itemizedlist">\r\n    <ul class="itemizedlist">\r\n      <li class="listitem">\r\n        <p>Healthcare professionals</p>\r\n      </li>\r\n      <li class="listitem">\r\n        <p>People with a head injury, their families and carers</p>\r\n      </li>\r\n      <li class="listitem">\r\n        <p>Commissioners and providers</p>\r\n      </li>\r\n    </ul>\r\n  </div>\r\n</div>',
                },
              ],
            },
          ],
          LastModified: "/Date(1682502323341+0100)/",
          Uri: "http://www.test-guideline.com/a/b/s",
          Title: "This is a short title",
        },
      });
    });
    test("Status 200: Should respond with a specific approval by approval_name for GET request to /api/approval/:approval_name", async () => {
      const res = await request(app)
        .get("/api/approvals/test-approval-request")
        .expect(200);
      expect(res.body.approval).toBeInstanceOf(Object);
      expect(res.body.approval).toMatchObject({
        _id: expect.any(String),
        type: "edit",
        approvalRequestName: "test-approval-request",
        approvalSetupDateTime: expect.any(String),
        approvalPurposeDescription:
          "A number of edits have been made to Chapter 1 Section 1 to streamline the text",
        branchOwner: "joebloggs",
        branchName: "test-branch-name",
        guideline: {
          GuidanceNumber: "AB01",
          GuidanceSlug: "test-guideline-slug",
          GuidanceType: "Clinical guideline",
          LongTitle: "Test guideline Long Title",
          NHSEvidenceAccredited: false,
          InformationStandardAccredited: false,
          Chapters: [
            {
              ChapterId: "overview",
              Title: "Overview",
              Content:
                '<div class="chapter" title="Overview" id="ng232_overview" xmlns="http://www.w3.org/1999/xhtml">\r\n  <h2 class="title">\r\n    <a id="overview"></a>Overview</h2>\r\n  <p>XXX.</p>\r\n  <p>See <a class="link" href="https://www.nice.org.uk/guidance/ng40" target="_top" data-original-url="https://www.nice.org.uk/guidance/ng40">XXX.</p>\r\n</div>',
              Sections: [
                {
                  SectionId: "who-is-it-for",
                  Title: "Who is it for?",
                  Content:
                    '<div class="section" title="Who is it for?" id="ng232_who-is-it-for" xmlns="http://www.w3.org/1999/xhtml">\r\n  <h3 class="title">\r\n    <a id="who-is-it-for"></a>Who is it for?</h3>\r\n  <div class="itemizedlist">\r\n    <ul class="itemizedlist">\r\n      <li class="listitem">\r\n        <p>Healthcare professionals</p>\r\n      </li>\r\n      <li class="listitem">\r\n        <p>People with a head injury, their families and carers</p>\r\n      </li>\r\n      <li class="listitem">\r\n        <p>Commissioners and providers</p>\r\n      </li>\r\n    </ul>\r\n  </div>\r\n</div>',
                },
              ],
            },
          ],
          LastModified: "/Date(1682502323341+0100)/",
          Uri: "http://www.test-guideline.com/a/b/s",
          Title: "This is a short title",
        },
      });
    });
  });
  describe("/api/approvals GET Requests", () => {
    test("Status 200: Should respond with all pending approvals for GET request to /api/approvals", async () => {
      const res = await request(app).get("/api/approvals").expect(200);
      expect(res.body.approvals).toBeInstanceOf(Array);
      expect(res.body.approvals).toHaveLength(1);
      res.body.approvals.forEach((approval) => {
        expect(approval).toMatchObject({
          _id: expect.any(String),
          type: expect.any(String),
          approvalRequestName: expect.any(String),
          approvalSetupDateTime: expect.any(String),
          approvalPurposeDescription: expect.any(String),
          branchName: expect.any(String),
          branchOwner: expect.any(String),
          guideline: {
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
          },
        });
      });
    });
  });
  describe("/api/approvals DELETE Requests", () => {
    test("Status 204: Should respond with a status 204 and no content when a approval is successfully deleted by approval_name", async () => {
      await request(app)
        .delete("/api/approvals/test-approval-request")
        .expect(204);
    });
  });
  describe("/api/approvals Error Handing", () => {
    describe("/api/approvals GET Error Handling", () => {
      test("Status 404: Invalid URL /api/approval & /api/approvalz", async () => {
        let res = await request(app).get("/api/approval").expect(404);
        expect(res.body.msg).toBe("Invalid URL");
        res = await request(app).get("/api/approvalz").expect(404);
        expect(res.body.msg).toBe("Invalid URL");
      });
      test("Status 404: Approval Name does not exist", async () => {
        let res = await request(app)
          .get("/api/approvals/test-approval")
          .expect(404);
        expect(res.body.msg).toBe("Approval Name not found");
        res = await request(app).get("/api/approvals/approval").expect(404);
        expect(res.body.msg).toBe("Approval Name not found");
        res = await request(app).get("/api/approvals/aas33").expect(404);
        expect(res.body.msg).toBe("Approval Name not found");
        res = await request(app).get("/api/approvals/zzzz").expect(404);
        expect(res.body.msg).toBe("Approval Name not found");
      });
    });
    describe("/api/approvals POST Error Handling", () => {
      test("Status 400: Incorrect POST request when missing the 'type' parameter", async () => {
        const currentDateTime = String(Date.now());
        const approvalToSetup = {
          type: "edit",
          approvalRequestName: "another-test-request",
          approvalSetupDateTime: currentDateTime,
          branchOwner: "janedoe",
          guideline: {
            GuidanceNumber: "ZZ99",
            GuidanceSlug: "test-guideline-slug-2",
            GuidanceType: "Clinical guideline",
            LongTitle: "Test guideline Long Title 2",
            NHSEvidenceAccredited: false,
            InformationStandardAccredited: false,
            Chapters: [],
            LastModified: "/Date(1682502323341+0100)/",
            Uri: "http://www.test-guideline.com/a/b/z",
            Title: "This is a short title 2",
          },
        };

        const res = await request(app)
          .post("/api/approvals")
          .send(approvalToSetup)
          .expect(400);

        expect(res.body.msg).toBe("Bad Request: Specficy type parameter");
      });
      test("Status 400: Malformed body - no content in the new Branch object", async () => {
        const approvalToSetup = {};

        const res = await request(app)
          .post("/api/approvals?type=edit")
          .send(approvalToSetup)
          .expect(400);
        expect(res.body.msg).toBe("Bad Request");
      });
      test("Status 400: One required property missing in the body", async () => {
        const currentDateTime = String(Date.now());
        const approvalToSetup = {
          type: "edit",
          approvalRequestName: "test-approval-request",
          approvalSetupDateTime: currentDateTime,
          branchOwner: "joebloggs",
          guideline: {
            GuidanceNumber: "AB01",
            GuidanceSlug: "test-guideline-slug",
            GuidanceType: "Clinical guideline",
            LongTitle: "Test guideline Long Title",
            NHSEvidenceAccredited: false,
            InformationStandardAccredited: false,
            Chapters: [
              {
                ChapterId: "overview",
                Title: "Overview",
                Content:
                  '<div class="chapter" title="Overview" id="ng232_overview" xmlns="http://www.w3.org/1999/xhtml">\r\n  <h2 class="title">\r\n    <a id="overview"></a>Overview</h2>\r\n  <p>XXX.</p>\r\n  <p>See <a class="link" href="https://www.nice.org.uk/guidance/ng40" target="_top" data-original-url="https://www.nice.org.uk/guidance/ng40">XXX.</p>\r\n</div>',
                Sections: [
                  {
                    SectionId: "who-is-it-for",
                    Title: "Who is it for?",
                    Content:
                      '<div class="section" title="Who is it for?" id="ng232_who-is-it-for" xmlns="http://www.w3.org/1999/xhtml">\r\n  <h3 class="title">\r\n    <a id="who-is-it-for"></a>Who is it for?</h3>\r\n  <div class="itemizedlist">\r\n    <ul class="itemizedlist">\r\n      <li class="listitem">\r\n        <p>Healthcare professionals</p>\r\n      </li>\r\n      <li class="listitem">\r\n        <p>People with a head injury, their families and carers</p>\r\n      </li>\r\n      <li class="listitem">\r\n        <p>Commissioners and providers</p>\r\n      </li>\r\n    </ul>\r\n  </div>\r\n</div>',
                  },
                ],
              },
            ],
            LastModified: "/Date(1682502323341+0100)/",
            Uri: "http://www.test-guideline.com/a/b/s",
            Title: "This is a short title",
          },
        };

        const res = await request(app)
          .post("/api/approvals?type=edit")
          .send(approvalToSetup)
          .expect(400);

        expect(res.body.msg).toBe("Bad Request");
      });
    });
    describe("/api/approvals DELETE Error Handling", () => {
      test("Status 404: Approval Name does not exist", async () => {
        let res = await request(app).delete("/api/approvals/AB123").expect(404);
        expect(res.body.msg).toBe("Approval Name not found");
        res = await request(app).delete("/api/approvals/999ZZ").expect(404);
        expect(res.body.msg).toBe("Approval Name not found");
      });
    });
  });
});
