const request = require("supertest");
const mongoose = require("mongoose");
const app = require("../app");
const seed = require("../data/seed");

beforeAll(async () => {
  await seed();

  console.log("🌱 Seeding complete on TEST Database");

  await mongoose.connect(process.env.DATABASE_URL);

  console.log("⚡️ Connected to TEST Database");
});

afterAll(async () => {
  await mongoose.connection.close();
});

describe("Clinical Guideline API tests for /guidelines", () => {
  describe("GET Requests", () => {
    test("GET /api/users: should return 200 and all users", async () => {
      const res = await request(app).get("/api/users").expect(200);
      expect(res.body.users).toBeInstanceOf(Array);
      expect(res.body.users).toHaveLength(1);
      res.body.users.forEach((user) => {
        expect(user).toMatchObject({
          _id: expect.any(String),
          firstName: expect.any(String),
          lastName: expect.any(String),
          preferredName: expect.any(String),
          userName: expect.any(String),
          emailAddress: expect.any(String),
          primaryAccessLevel: expect.any(String),
          secondaryAccessLevel: expect.any(String),
          dateAccountCreated: expect.any(String),
        });
      });
    });
  });
});
