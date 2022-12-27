const express = require("express");
const createHandlers = require("./create-handlers");

function createQueries({ db }) {
  function getUser(username) {
    const query = { username };
    const options = {
      projection: {
        _id: 0,
        username: 1,
        hash: 1,
      },
    };
    return db.findOne(query, options);
  }

  return { getUser };
}

function createLoginApi({ env, db }) {
  const queries = createQueries({ db });
  const handlers = createHandlers({ env, queries });
  const router = express.Router();

  router.route("/").post(handlers.postLogin);

  return { router };
}

module.exports = createLoginApi;
