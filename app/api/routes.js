module.exports = function (app) {
  app.use("/v1/healthCheck", require("./healthCheck"));
};
