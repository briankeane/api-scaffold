const app = require("express")();
const bearerToken = require("express-bearer-token");
const bodyParser = require("body-parser");
const errorHandler = require("errorhandler");

const morgan = require("morgan");
const compression = require("compression");
const port = process.env.PORT || 5000;
const { sequelize } = require("./db");
const logger = require("./logger");
const http = require("http");
const addRoutes = require("./routes.js");

app.all("*", function (req, res, next) {
  res.header("Access-Control-Allow-Credentials", true);
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Methods", "GET,PUT,POST,DELETE");
  res.header(
    "Access-Control-Allow-Headers",
    "X-Requested-With, X-HTTP-Method-Override, Content-Type, Accept, Authorization"
  );
  if ("OPTIONS" === req.method) {
    res.status(200).end();
  } else {
    next();
  }
});

app.use(bearerToken());
app.use(compression());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

if (process.env.NODE_ENV !== "test") {
  app.use(morgan("dev"));
}

Promise.all([sequelize.sync()])
  .then(() => {
    app.isReady = true;
    app.emit("READY");
  })
  .catch((err) => logger.error(err));

const server = http.createServer(app);
addRoutes(app);

if (process.env.environment !== "production") {
  app.use(errorHandler({ log: (err, str, req) => logger.error(err) }));
}

server.listen(port, function () {
  logger.log(`Listening on port: ${port}`);
});

// explicitly log stack trace for unhandled rejections
process.on("unhandledRejection", (err, p) => {
  logger.always.log(err);
});

exports = module.exports = app;
