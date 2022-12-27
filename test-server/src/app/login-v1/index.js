const express = require("express");
const createHandlers = require("./create-handlers");

function createQueries({ User }) {
  async function getUserAsync(username) {
    const user = await User.findOne({username});
    return user;
  }

  return { getUserAsync };
}

function createLoginApi({ env, User }) {
  const queries = createQueries({ User });
  const handlers = createHandlers({ env, queries });
  const router = express.Router();

  router.route("/").post(handlers.postLogin);

  return { router };
}

module.exports = createLoginApi;
