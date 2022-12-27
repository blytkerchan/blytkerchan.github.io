const express = require("express");
const uuid = require("uuid").v4;
const bodyParser = require("body-parser");

function createQueries({ db }) {
  function getUser(username) {
    const query = { username };
    const options = {
      projection: {
        _id: 0,
        username: 1,
        salt: 1,
        saltedPassword: 1,
        rounds: 1,
        algorithm: 1,
      },
    };
    return db.findOne(query, options);
  }

  return { getUser };
}

function createHandlers({ env, queries }) {
  function validateCredentials(req, res, next) {
    const re = /\s/;
    if (
      Object.keys(req.body).includes("username") &&
      Object.keys(req.body).includes("password") &&
      typeof req.body.username === "string" &&
      typeof req.body.password === "string" &&
      !req.body.username.match(re)
    ) {
      queries.getUser(req.body.username)
      .then(record => {
        if (record) {
          req.record = record;
        }
        res
        .status(401)
        .send(
          JSON.stringify({
            name: "AuthenticationError",
            message: "Authentication failed",
          })
        );
      })
      .catch(err => {
        //TODO check the error
        res
        .status(401)
        .send(
          JSON.stringify({
            name: "AuthenticationError",
            message: "Authentication failed",
          })
        );
      })
    } else {
      res
        .status(401)
        .send(
          JSON.stringify({
            name: "AuthenticationError",
            message: "Authentication failed",
          })
        );
    }
  }
  function generateSession(req, res, next) {
    res.status(200).send(JSON.stringify({ token: uuid() }));
  }

  return {
    postLogin: [bodyParser.json(), validateCredentials, generateSession],
  };
}

function createLoginApi({ env, db }) {
  const queries = createQueries({ db });
  const handlers = createHandlers({ env, queries });
  const router = express.Router();

  const jsonParser = bodyParser.json();
  router.route("/").post(handlers.postLogin);

  return { router };
}

module.exports = createLoginApi;
