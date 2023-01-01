const generateSession = require("../middleware/generate-session");
const validateCredentials = require("../middleware/validate-credentials");
const verifyCredentials = require("../middleware/verify-credentials.js");
const bodyParser = require("body-parser");

function createHandlers({ env, queries, log, preprocessPassword }) {
  return {
    postLogin: [
      bodyParser.json(),
      validateCredentials({ env, queries, log, requireExists: true }),
      verifyCredentials({ env, queries, log, preprocessPassword }),
      generateSession({ env, queries, log }),
      (req, res, next) => {
        res.status(200).send(JSON.stringify(req.context.session));
      },
    ],
  };
}

module.exports = createHandlers;
