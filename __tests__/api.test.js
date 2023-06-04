const request = require("supertest");
const app = require("../app");
const mongoose = require("mongoose");

afterAll(async () => {
  await mongoose.connection.close();
});

describe("GET Request", () => {
  test("GET /api: should return 200 and msg", async () => {
    const res = await request(app).get("/api").expect(200);
    expect(res.body.msg).toBe(
      "Welcome to the Clinical Guideline Authoring App: API"
    );
  });
});
