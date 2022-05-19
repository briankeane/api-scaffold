const path = require("path");
const addSubRoutes = require("./api/routes");

module.exports = function (app) {
  addSubRoutes(app);

  // serve the main swagger file
  app.get("/swagger.yaml", (req, res) => {
    res.sendFile(path.join(`${__dirname}/swagger/swagger.yaml`));
  });

  app.get("/models.swagger.yaml", (req, res) => {
    res.sendFile(path.join(`${__dirname}/swagger/models.swagger.yaml`));
  });

  // serve any files within /api/** subdirectory
  app.get("/:apiName.swagger.yaml", (req, res) => {
    res.sendFile(
      path.join(
        `${__dirname}/api/${req.params.apiName}/${req.params.apiName}.swagger.yaml`
      )
    );
  });

  app.get("/docs", (req, res) => {
    res.sendFile(path.join(`${__dirname}/swagger/docs.html`));
  });
};
