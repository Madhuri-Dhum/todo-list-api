const express = require("express");
require("dotenv/config");
const dbConnect = require("./utils/database");
const authRoute = require("./routes/auth.route");
const todoRoute = require("./routes/todo.route");
const commonRoute = require("./routes/common.routes");
const validateRequest = require("./utils/validate");
const app = express();

function makeApp() {
  app.use(express.json());

  dbConnect;

  app.use(validateRequest);
  app.use("/", commonRoute);
  app.use("/auth", authRoute);
  app.use("/todos", todoRoute);

  app.use(function (error, req, res, next) {
    const message = error.message;
    const data = error.data;
    const code = error.statusCode || 500;
    res.status(code).json({ message, data, status: false });
  });

  app.listen(process.env.PORT, () => {
    console.log(`Server start on port ${process.env.PORT}`);
  });
}

makeApp();
