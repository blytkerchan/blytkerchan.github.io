const YAML = require("yaml");
const fs = require("fs");
const path = require("path");
const express = require("express");
const swaggerUi = require("swagger-ui-express");

const file = fs.readFileSync(path.join(path.normalize(__dirname), path.normalize("../../../openapi.yml")), "utf8");
const swaggerDocument = YAML.parse(file);

function createApiDocs({ env }) {
  const router = express.Router();

  router.use("/api-docs", swaggerUi.serve);
  router.get("/api-docs", swaggerUi.setup(swaggerDocument));

  return router;
}

module.exports = createApiDocs;
