function validateCredentials({ env, queries, log, requireExists }) {
  return async (req, res, next) => {
    const re = /\s/;
    if (
      Object.keys(req.body).includes("username") &&
      Object.keys(req.body).includes("password") &&
      typeof req.body.username === "string" &&
      typeof req.body.password === "string" &&
      !req.body.username.match(re)
    ) {
      try {
        const record = await queries.getCredentials(req.body.username);
        if (record) {
          req.context.record = record;
          next();
        } else if (env.rootUser.username.toLowerCase() === req.body.username.toLowerCase()) {
          req.context.record = env.rootUser;
          next();
        } else if (requireExists) {
          log.trace(req.context.traceId, "Authentication failure", "Warning", Date.now());
          const err = {
            name: "AuthenticationError",
            message: "Authentication failed",
          };
          res.status(401).send(JSON.stringify(err));
          next(err);
        } else {
          next();
        }
      } catch (err) {
        log.trace(req.context.traceId, "Internal error during authentication", "Error", Date.now(), err);
        res.status(500).send(
          JSON.stringify({
            name: "InternalAuthenticationError",
            message: "Authentication failed",
          })
        );
        next(err);
      }
    } else {
      log.trace(req.context.traceId, "Authentication failure", "Warning", Date.now());
      const err = {
        name: "AuthenticationError",
        message: "Authentication failed",
      };
      res.status(401).send(JSON.stringify(err));
      next(err);
    }
  };
}

module.exports = validateCredentials;
