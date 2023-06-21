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

describe("Clinical Guideline API tests for /approvals", () => {
  describe("POST Requests", () => {
    test("Status 201: Should setup a new approval with relevant properties when POST request made with a type of 'edit'", async () => {
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
        .expect(201);

      expect(res.body.approval.approvalSetupDateTime).toBe(currentDateTime);
      expect(res.body.approval).toHaveProperty("_id");
      expect(res.body.approval).toMatchObject({
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
      });
    });
  });
  describe("GET Requests", () => {
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
});

describe("Error Handing", () => {
  describe("GET Error Handling", () => {
    test("Status 404: Invalid URL /api/approval & /api/approvalz", async () => {
      let res = await request(app).get("/api/approval").expect(404);
      expect(res.body.msg).toBe("Invalid URL");
      res = await request(app).get("/api/approvalz").expect(404);
      expect(res.body.msg).toBe("Invalid URL");
    });
  });
  describe("POST Error Handling", () => {
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
  });
});
