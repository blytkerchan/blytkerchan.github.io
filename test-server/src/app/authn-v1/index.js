const express = require("express");
const createHandlers = require("./create-handlers");

function createQueries({ Credentials }) {
  async function getCredentialsAsync(username) {
    const user = await Credentials.findOne({username});
    return user;
  }

  return { getCredentialsAsync };
}

function createAuthenticationApi({ env, Credentials }) {
  const queries = createQueries({ Credentials });
  const handlers = createHandlers({ env, queries });
  const router = express.Router();

  router.route("/").post(handlers.postLogin);

  return { router };
}

module.exports = createAuthenticationApi;
