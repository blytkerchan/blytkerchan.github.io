const bcrypt = require("bcrypt");

function verifyCredentials() {
  return (req, res, next) => {
    const credentials = req.body;
    const userRecord = req.context.record;
    bcrypt.compare(
      credentials.password,
      userRecord.hash,
      function (err, result) {
        if (result) {
          next();
        } else {
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
