const seed = require("./seed");

seed().then(() => {
  console.log(`🌱 Seeding complete on ${process.env.NODE_ENV} Database`);

  console.log(`❌ ${process.env.NODE_ENV} Database connection ended`);
});
