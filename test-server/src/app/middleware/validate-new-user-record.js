const bcrypt = require("bcrypt");
const uuid = require("uuid").v4;

function validateNewUserRecord({
  env,
  User,
  Credentials,
  validatePassword,
  preprocessPassword,
  log,
  bcrypt,
}) {
  return async (req, res, next) => {
    // we assume the username uniqueness has already been validated by this
    // point. We only look at whether all the necessary fields are set, the
    // E-mail address looks OK, and the password survives a basic dictionary
    // attack.
    const newUserUid = uuid();
    const name = req.body.name;
    if (typeof name !== "string" || name === "") {
      log.trace(
        req.context.traceId,
        "Missing or empty name field",
        "Warning",
        Date.now()
      );
      const err = {
        name: "RequiredFieldMissingOrEmpty",
        message: "Missing or empty name field",
        field: "name",
      };
      res.status(400).send(JSON.stringify(err));
      next(err);
      return;
    }
    const email = req.body.name;
    if (typeof email !== "string" || email === "") {
      log.trace(
        req.context.traceId,
        "Missing or empty email field",
        "Warning",
        Date.now()
      );
      const err = {
        name: "RequiredFieldMissingOrEmpty",
        message: "Missing or empty email field",
        field: "email",
      };
      res.status(400).send(JSON.stringify(err));
      next(err);
      return;
    }
    const username = req.body.username;
    if (typeof username !== "string" || username === "") {
      log.trace(
        req.context.traceId,
        "Missing or empty username field",
        "Warning",
        Date.now()
      );
      const err = {
        name: "RequiredFieldMissingOrEmpty",
        message: "Missing or empty username field",
        field: "username",
      };
      res.status(400).send(JSON.stringify(err));
      next(err);
      return;
    }
    const re =
      /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\\.[a-zA-Z0-9-]+)*$/;
    if (email.match(re)) {
      log.trace(
        req.context.traceId,
        "Badly formatted email field",
        "Warning",
        Date.now()
      );
      const err = {
        name: "FormatError",
        message: "The value for email is badly formatted",
        field: "email",
      };
      res.status(400).send(JSON.stringify(err));
      next(err);
      return;
    }
    let password = req.body.password;
    try {
      validatePassword(password);
    } catch (err) {
      log.trace(
        req.context.traceId,
        "Password field failed validation",
        "Warning",
        Date.now()
      );
      res.status(400).send(
        JSON.stringify({
          name: err.name,
          message: err.message,
        })
      );
      next(err);
      return;
    }
    bcrypt.hash(preprocessPassword(password), env.saltRounds).then((result) => {
      req.context.record = {
        user: new User({ uid: newUserUid, name, email }),
        credentials: new Credentials({
          uid: newUserUid,
          username,
          hash: result,
        }),
      };
      next();
    });
  };
}

module.exports = validateNewUserRecord;
