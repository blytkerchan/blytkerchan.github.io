const bcrypt = require("bcrypt");

function verifyCredentials({ log, preprocessPassword }) {
  return (req, res, next) => {
    const credentials = req.body;
    const userRecord = req.context.record;
    bcrypt.compare(
      preprocessPassword(credentials.password),
      userRecord.hash,
      function (err, result) {
        if (result) {
          next();
        } else {
          log.trace(
            req.context.traceId,
            "Authentication failure",
            "Error",
            Date.now(),
            err
          );
          res.status(401).send(
            JSON.stringify({
              name: "AuthenticationError",
              message: "Authentication failed",
            })
          );
        }
      }
    );
  };
}

module.exports = verifyCredentials;
