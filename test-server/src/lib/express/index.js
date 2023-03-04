const express = require("express");
const cors = require("cors");

const mountMiddleware = require("./mount-middleware");
const mountRoutes = require("./mount-routes");

function createExpressApp({ config, env }) {
  const app = express();

  app.use(cors());
  mountMiddleware({ app, env, config });
  mountRoutes({ app, config });

  return app;
}

module.exports = createExpressApp;
