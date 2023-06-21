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

describe("Clinical Guideline API tests for /branches", () => {
  describe("POST Requests", () => {
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
    test("Status 200: Should respond with all branches for GET request to /api/branches", async () => {
      const res = await request(app).get("/api/branches").expect(200);
      expect(res.body.branches).toBeInstanceOf(Array);
      expect(res.body.branches).toHaveLength(1);
      res.body.branches.forEach((branch) => {
        expect(branch).toMatchObject({
          _id: expect.any(String),
          type: expect.any(String),
          branchName: expect.any(String),
          branchOwner: expect.any(String),
          branchAllowedUsers: expect.any(Array),
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
  describe("PATCH Requests", () => {
    test("Status 200: Should respond with updated branch information with a status 200 when a successful PATCH request is made to /api/branches/:branch_name", async () => {
      const chapterNum = 0;
      const sectionNum = 0;

      const patchBody = {
        SectionId: "who-is-it-for",
        Title: "Who is it for?",
        Content:
          '<div class="section" title="Who is it for?" id="ng232_who-is-it-for" xmlns="http://www.w3.org/1999/xhtml">\r\n  <h3 class="title">\r\n    <a id="who-is-it-for"></a>Who is it for?</h3>\r\n  <div class="itemizedlist">\r\n    <ul class="itemizedlist">\r\n      <li class="listitem">\r\n        <p>Healthcare professionals</p>\r\n      </li>\r\n      <li class="listitem">\r\n        <p>People with a head injury, their families and carers</p>\r\n      </li>\r\n      <li class="listitem">\r\n        <p>Commissioners and providers YYY XXX ZZZ</p>\r\n      </li>\r\n    </ul>\r\n  </div>\r\n</div>',
      };

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
  });
  describe("DELETE Requests", () => {
    test("Status 204: Should respond with a status 204 and no content when a branch is successfully deleted by branch_name", async () => {
      await request(app).delete("/api/branches/test-edit-branch").expect(204);
    });
  });
});
