const express = require("express");

function createHandlers({ env }) {
  function getVersion(req, res, next) {
    res.status(200).send(JSON.stringify({ version: env.version }));
  }

  return { getVersion };
}

function createVersionApi({ env }) {
  const handlers = createHandlers({ env });
  const router = express.Router();

  router.route("/").get(handlers.getVersion);

  return { router };
}

module.exports = createVersionApi;
