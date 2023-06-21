require("dotenv").config();
const mongoose = require("mongoose");
const readFormatFiles = require("./readFormatFiles");
const guidelineSchema = require("../schemas/GuidelineSchema.js");
const userSchema = require("../schemas/UserSchema.js");
const usersData = require("./user-data/users");
const branchSchema = require("../schemas/BranchSchema");
const ENV = process.env.NODE_ENV || "development";

require("dotenv").config({
  path: `${__dirname}/../.env.${ENV}`,
});

async function seed() {
  if (!process.env.DATABASE_URL) throw new Error("Need to set a DATABASE_URL");

  return mongoose.connect(process.env.DATABASE_URL).then(async () => {
    console.log(
      `⚡️ Connected to the ${process.env.NODE_ENV} Database, preparing to seed...`
    );

    const guidelinesData = await readFormatFiles();

    const { guidelines, users, branches } = mongoose.connection.collections;

    await branches.drop(() => {});

    await branchSchema.deleteMany({});

    await guidelines.drop(() => {});

    await guidelineSchema.deleteMany({});

    await guidelineSchema.insertMany(guidelinesData);

    await users.drop(() => {});

    await userSchema.deleteMany({});

    await userSchema.insertMany(usersData);

    await mongoose.connection.close();
  });
}

module.exports = seed;
