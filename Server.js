const express = require("express");
const morgan = require("morgan");
const dotenv = require("dotenv");

const usersRouter = require("./Routers/UserRouter");

//set path for environment variables
dotenv.config({ path: "./config.env", quiet: true });

const app = express();

//global middlewares
app.use(express.json());

if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
}

//ROUTERS
app.use("/api/v1/user", usersRouter);

//booting up the server
const port = process.env.PORT || 3000;
const server = app.listen(port, () => {
  console.log(
    `Server started in ${process.env.NODE_ENV} mode on port ${port}.`
  );
});
