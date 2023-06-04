require("dotenv").config();
const mongoose = require("mongoose");
const readFormatFiles = require("./readFormatFiles");
const guidelineSchema = require("../schemas/GuidelineSchema.js");
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

    await guidelineSchema.deleteMany({});

    await guidelineSchema.insertMany(guidelinesData);

    await mongoose.connection.close();
  });
}

module.exports = seed;
