const express = require("express");
const morgan = require("morgan");

const usersRouter = require("./Routers/userRouter");
const musicsRouter = require("./Routers/musicRouter");
const authRouter = require("./Routers/authRouter");
const globalErrorHandler = require("./Utilities/errorHandler");

const app = express();

//global middlewares
app.use(express.json());

if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
}

//ROUTERS
app.use("/api/v1", authRouter);
app.use("/api/v1/user", usersRouter);
app.use("/api/v1/music", musicsRouter);

app.use(globalErrorHandler);

module.exports = app;
