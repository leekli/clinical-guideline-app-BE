const app = require("./app");
require("dotenv").config({ path: `${__dirname}/.env.${process.env.NODE_ENV}` });
require("./connection.js");

// Server connection and listener
const { PORT = 9090 } = process.env;

app.listen(PORT, (err) => {
  if (err) throw err;
  console.log(`⚡️ Server started on port: ${PORT}...`);
});
