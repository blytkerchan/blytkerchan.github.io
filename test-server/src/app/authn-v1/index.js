const express = require("express");
const createHandlers = require("./create-handlers");
const getCredentialsQueries = require("../queries/credentials");

function createQueries({ Credentials }) {
  return {
    getCredentials: getCredentialsQueries({ Credentials }).find,
  };
}

function createAuthenticationApi({ env, Credentials, log, preprocessPassword }) {
  const queries = createQueries({ Credentials });
  const handlers = createHandlers({ env, queries, log, preprocessPassword });
  const router = express.Router();

  router.route("/").post(handlers.postLogin);

  return { router };
}

module.exports = createAuthenticationApi;
