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
});

describe("Error Handling", () => {
  describe("GET Error Handling", () => {
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
