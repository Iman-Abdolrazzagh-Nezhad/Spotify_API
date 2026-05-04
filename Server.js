const dotenv = require("dotenv");

const app = require("./app");

//set path for environment variables
dotenv.config({ path: "./config.env", quiet: true });

//booting up the server
const port = process.env.PORT || 3000;
const server = app.listen(port, () => {
  console.log(
    `Server started in ${process.env.NODE_ENV} mode on port ${port}.`
  );
});
