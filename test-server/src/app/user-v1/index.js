const express = require("express");
const createHandlers = require("./create-handlers");
const getCredentialsQueries = require("../queries/credentials");

function createQueries({ Credentials, User }) {
  return {
    getCredentials: getCredentialsQueries({ Credentials }).find,
    insertCredentials: getCredentialsQueries({ Credentials }).insert,
  };
}

function createUserApi({ env, Credentials, User, log, validatePassword, preprocessPassword }) {
  const queries = createQueries({ Credentials, User });
  const handlers = createHandlers({ env, queries, log, User, Credentials, validatePassword, preprocessPassword });
  const router = express.Router();

  router.route("/register").post(handlers.postRegisterUser);

  return { router };
}

module.exports = createUserApi;
