const request = require("supertest");
const mongoose = require("mongoose");
const app = require("../app");
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

describe("Clinical Guideline API tests for /guidelines", () => {
  describe("GET Requests", () => {
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
  describe("POST Requests", () => {
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
    });
  });
  describe("PATCH Requests", () => {
    test("PATCH /api/guidelines/:guideline_id: should return 200 if PATCH successful", async () => {
      const chapterNum = 0;
      const sectionNum = 1;

      const patchBody = {
        SectionId:
          "12-aspirin-for-primary-prevention-of-cardiovascular-disease",
        Title: "1.2 Aspirin for primary prevention of cardiovascular disease",
        Content:
          '<div class="section" title="1.2 Aspirin for primary prevention of cardiovascular disease" id="cg181_1.2-aspirin-for-primary-prevention-of-cardiovascular-disease" xmlns="http://www.w3.org/1999/xhtml">\r\n  <h3 class="title">\r\n    <a id="aspirin-for-primary-prevention-of-cardiovascular-disease"></a>1.2 Aspirin for primary prevention of cardiovascular disease</h3>\r\n  <div id="cg181_1_2_1" class="recommendation_text">\r\n    <p class="numbered-paragraph">\r\n      <span class="paragraph-number">1.2.1 </span>AMEND Do not routinely offer aspirin for primary prevention of CVD. <strong>[2023]</strong></p>\r\n    <p>AMEND For guidance on using aspirin to prevent venous thromboembolism in over 16s in hospital, see <a class="link" href="https://www.nice.org.uk/guidance/ng89" target="_top" data-original-url="https://www.nice.org.uk/guidance/ng89">NICE\'s guideline on venous thromboembolism in over 16s: reducing the risk of hospital-acquired deep vein thrombosis or pulmonary embolism</a>.</p>\r\n    <div class="panel">\r\n      <p>AMEND NICE\'s surveillance team reviewed the evidence about aspirin for the primary prevention of CVD. Based on the review, NICE decided to add a do not routinely offer recommendation about this. For full details see the <a class="link" href="https://www.nice.org.uk/guidance/cg181/resources/2023-exceptional-surveillance-of-cardiovascular-disease-risk-assessment-and-reduction-including-lipid-modification-nice-guideline-cg181-11322671149/chapter/Surveillance-decision?tab=evidence" target="_top">January 2023 exceptional surveillance report</a>. </p>\r\n    </div>\r\n  </div>\r\n</div>',
      };

      const expected =
        '<div class="section" title="1.2 Aspirin for primary prevention of cardiovascular disease" id="cg181_1.2-aspirin-for-primary-prevention-of-cardiovascular-disease" xmlns="http://www.w3.org/1999/xhtml">\r\n  <h3 class="title">\r\n    <a id="aspirin-for-primary-prevention-of-cardiovascular-disease"></a>1.2 Aspirin for primary prevention of cardiovascular disease</h3>\r\n  <div id="cg181_1_2_1" class="recommendation_text">\r\n    <p class="numbered-paragraph">\r\n      <span class="paragraph-number">1.2.1 </span>AMEND Do not routinely offer aspirin for primary prevention of CVD. <strong>[2023]</strong></p>\r\n    <p>AMEND For guidance on using aspirin to prevent venous thromboembolism in over 16s in hospital, see <a class="link" href="https://www.nice.org.uk/guidance/ng89" target="_top" data-original-url="https://www.nice.org.uk/guidance/ng89">NICE\'s guideline on venous thromboembolism in over 16s: reducing the risk of hospital-acquired deep vein thrombosis or pulmonary embolism</a>.</p>\r\n    <div class="panel">\r\n      <p>AMEND NICE\'s surveillance team reviewed the evidence about aspirin for the primary prevention of CVD. Based on the review, NICE decided to add a do not routinely offer recommendation about this. For full details see the <a class="link" href="https://www.nice.org.uk/guidance/cg181/resources/2023-exceptional-surveillance-of-cardiovascular-disease-risk-assessment-and-reduction-including-lipid-modification-nice-guideline-cg181-11322671149/chapter/Surveillance-decision?tab=evidence" target="_top">January 2023 exceptional surveillance report</a>. </p>\r\n    </div>\r\n  </div>\r\n</div>';

      const res = await request(app)
        .patch("/api/guidelines/CG181")
        .send({ chapterNum, sectionNum, patchBody })
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
  });
  test("PATCH /api/guidelines/:guideline_id: should return 200 if PATCH successful", async () => {
    const chapterNum = 3;
    const sectionNum = 1;

    const patchBody = {
      SectionId: "chronic-pancreatitis",
      Title: "Chronic pancreatitis",
      Content:
        '<div class="section" title="Chronic pancreatitis" id="ng104_chronic-pancreatitis" xmlns="http://www.w3.org/1999/xhtml">\r\n  <h3 class="title">\r\n    <a id="chronic-pancreatitis-2"></a>Chronic pancreatitis</h3>\r\n  <p>AMENDMENT Chronic pancreatitis is a continuous prolonged inflammatory process of the pancreas that results in fibrosis, cyst formation and stricturing of the pancreatic duct. It usually presents with chronic abdominal pain but it can sometimes be painless. The clinical course is variable but most people with chronic pancreatitis have had 1 or more attacks of acute pancreatitis that has resulted in inflammatory change and fibrosis. In some people, however, chronic pancreatitis has a more insidious onset. The intensity of pain can range from mild to severe, even in people with little evidence of pancreatic disease on imaging.</p>\r\n  <p>The annual incidence of chronic pancreatitis in western Europe is about 5 new cases per 100,000 people, although this is probably an underestimate. The male to female ratio is 7:1 and the average age of onset is between 36 and 55 years. Alcohol is responsible for 70-80% of cases of chronic pancreatitis. Although cigarette smoking is not thought to be a primary cause in itself, it is strongly associated with chronic pancreatitis and is thought to exacerbate the condition. Chronic pancreatitis may be idiopathic or, in about 5% of cases, caused by hereditary factors (in these cases there is usually a positive family history). Other causes include hypercalcaemia, hyperlipidaemia or autoimmune disease. </p>\r\n  <p>Chronic pancreatitis causes a significant reduction in pancreatic function and the majority of people have reduced exocrine (digestive) function and reduced endocrine function (diabetes). They usually need expert dietary advice and medication. Chronic pancreatitis can also give rise to specific complications including painful inflammatory mass and obstructed pancreatic duct, biliary or duodenal obstruction, haemorrhage, or accumulation of fluid in the abdomen (ascites) or chest (pleural effusion). Managing these complications may be difficult because of ongoing comorbidities and social problems such as alcohol or opiate dependence. Chronic pancreatitis significantly increases the risk of pancreatic cancer. This risk is much higher in people with hereditary pancreatitis. AMENDMENT</p>\r\n</div>',
    };

    const expected =
      '<div class="section" title="Chronic pancreatitis" id="ng104_chronic-pancreatitis" xmlns="http://www.w3.org/1999/xhtml">\r\n  <h3 class="title">\r\n    <a id="chronic-pancreatitis-2"></a>Chronic pancreatitis</h3>\r\n  <p>AMENDMENT Chronic pancreatitis is a continuous prolonged inflammatory process of the pancreas that results in fibrosis, cyst formation and stricturing of the pancreatic duct. It usually presents with chronic abdominal pain but it can sometimes be painless. The clinical course is variable but most people with chronic pancreatitis have had 1 or more attacks of acute pancreatitis that has resulted in inflammatory change and fibrosis. In some people, however, chronic pancreatitis has a more insidious onset. The intensity of pain can range from mild to severe, even in people with little evidence of pancreatic disease on imaging.</p>\r\n  <p>The annual incidence of chronic pancreatitis in western Europe is about 5 new cases per 100,000 people, although this is probably an underestimate. The male to female ratio is 7:1 and the average age of onset is between 36 and 55 years. Alcohol is responsible for 70-80% of cases of chronic pancreatitis. Although cigarette smoking is not thought to be a primary cause in itself, it is strongly associated with chronic pancreatitis and is thought to exacerbate the condition. Chronic pancreatitis may be idiopathic or, in about 5% of cases, caused by hereditary factors (in these cases there is usually a positive family history). Other causes include hypercalcaemia, hyperlipidaemia or autoimmune disease. </p>\r\n  <p>Chronic pancreatitis causes a significant reduction in pancreatic function and the majority of people have reduced exocrine (digestive) function and reduced endocrine function (diabetes). They usually need expert dietary advice and medication. Chronic pancreatitis can also give rise to specific complications including painful inflammatory mass and obstructed pancreatic duct, biliary or duodenal obstruction, haemorrhage, or accumulation of fluid in the abdomen (ascites) or chest (pleural effusion). Managing these complications may be difficult because of ongoing comorbidities and social problems such as alcohol or opiate dependence. Chronic pancreatitis significantly increases the risk of pancreatic cancer. This risk is much higher in people with hereditary pancreatitis. AMENDMENT</p>\r\n</div>';

    const res = await request(app)
      .patch("/api/guidelines/NG104")
      .send({ chapterNum, sectionNum, patchBody })
      .expect(200);

    expect(
      res.body.guideline.Chapters[chapterNum].Sections[sectionNum].SectionId
    ).toBe("chronic-pancreatitis");
    expect(
      res.body.guideline.Chapters[chapterNum].Sections[sectionNum].Title
    ).toBe("Chronic pancreatitis");
    expect(
      res.body.guideline.Chapters[chapterNum].Sections[sectionNum].Content
    ).toEqual(expected);
  });
  describe("DELETE Requests", () => {
    test("DELETE /api/guidelines/:guideline_id: should return 204 if delete successful", async () => {
      await request(app).delete("/api/guidelines/NG232").expect(204);
    });
    test("DELETE /api/guidelines/:guideline_id: should return 204 if delete successful", async () => {
      await request(app).delete("/api/guidelines/QS143").expect(204);
    });
  });
});

describe("Error Handing", () => {
  describe("GET Error Handling", () => {
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
  describe("POST Error Handling", () => {
    test("Status 400: Malformed body - not content in the new Guideline object", async () => {
      const newGuideline = {};

      const res = await request(app)
        .post("/api/guidelines")
        .send(newGuideline)
        .expect(400);
      expect(res.body.msg).toBe("Bad Request");
    });
  });
  describe("PATCH Error Handling", () => {
    test("Status 404: Guideline ID/Number does not exist", async () => {
      const chapterNum = 1;
      const sectionNum = 4;
      const patchBody = { keyName: "Test" };

      const res = await request(app)
        .patch("/api/guidelines/ZZ999")
        .send({ chapterNum, sectionNum, patchBody })
        .expect(404);
      expect(res.body.msg).toBe("Guideline not found");
    });
    test("Status 400: Malformed body - chapterNum missing/not a number", async () => {
      const chapterNum = null;
      const sectionNum = 4;
      const patchBody = { keyName: "Test" };

      const res = await request(app)
        .patch("/api/guidelines/NG133")
        .send({ chapterNum, sectionNum, patchBody })
        .expect(400);
      expect(res.body.msg).toBe("Bad Request");
    });
    test("Status 400: Malformed body - sectionNum missing/not a number", async () => {
      const chapterNum = 0;
      const sectionNum = null;
      const patchBody = { keyName: "Test" };

      const res = await request(app)
        .patch("/api/guidelines/NG133")
        .send({ chapterNum, sectionNum, patchBody })
        .expect(400);
      expect(res.body.msg).toBe("Bad Request");
    });
    test("Status 400: Malformed body - nothing submitted for patchBody", async () => {
      const chapterNum = 0;
      const sectionNum = 1;
      const patchBody = {};

      const res = await request(app)
        .patch("/api/guidelines/NG133")
        .send({ chapterNum, sectionNum, patchBody })
        .expect(400);
      expect(res.body.msg).toBe("Bad Request");
    });
  });

  describe("DELETE Error Handling", () => {
    test("Status 404: Guideline ID/Number does not exist", async () => {
      let res = await request(app).delete("/api/guidelines/AB123").expect(404);
      expect(res.body.msg).toBe("Guideline not found");
      res = await request(app).delete("/api/guidelines/999ZZ").expect(404);
      expect(res.body.msg).toBe("Guideline not found");
    });
  });
});
