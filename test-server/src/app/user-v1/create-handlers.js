const bodyParser = require("body-parser");
const detectDuplicateCredentials = require("../middleware/detect-duplicate-credentials");
const validateCredentials = require("../middleware/validate-credentials");
const validateNewUserRecord = require("../middleware/validate-new-user-record");
const bcrypt = require("bcrypt");

function saveUserRecord({ env, log }) {
  return async (req, res, next) => {
    try {
      await req.context.user.save();
      await req.context.context.save();
      next();
    } catch (err) {
      log.trace(req.context.traceId, "Error while saving user and credentials", "Error", Date.now(), err);
      res.status(500).send(
        JSON.stringify({
          name: "InternalError",
          message: "Error while saving user and credentials",
        })
      );
    }
  };
}

function createHandlers({ env, queries, log, User, Credentials, validatePassword, preprocessPassword }) {
  return {
    postRegisterUser: [
      bodyParser.json(),
      validateCredentials({ env, queries, log, requireExists: false }),
      detectDuplicateCredentials({ env, queries, log }),
      validateNewUserRecord({
        env,
        User,
        Credentials,
        validatePassword,
        preprocessPassword,
        log,
        bcrypt,
      }),
      saveUserRecord({ env, log }),
      //TODO prepare and send validation E-mail
      (req, res, next) => {
        res.status(200).send(JSON.stringify(req.context.session));
      },
    ],
  };
}

module.exports = createHandlers;
