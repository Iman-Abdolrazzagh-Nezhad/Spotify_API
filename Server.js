const dotenv = require("dotenv");
const mongoose = require("mongoose");

//set path for environment variables
dotenv.config({ path: "./config.env", quiet: true });

const app = require("./app");

//connecting database
const db = process.env.DATABASE;

mongoose
  .connect(db)
  .then(() => {
    console.log(
      `mongoose connected with status code : ${mongoose.connection.readyState}`
    );
  })
  .catch((err) => {
    console.log("Error while connecting mongoose");
    if (process.env.NODE_ENV === "development") {
      console.error(err);
    }
  });

//booting up the server
const port = process.env.PORT || 3000;
const server = app.listen(port, () => {
  console.log(
    `Server started in ${process.env.NODE_ENV} mode on port ${port}.`
  );
});

//new line for check git
