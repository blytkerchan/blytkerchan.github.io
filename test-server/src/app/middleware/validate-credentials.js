function validateCredentials({ env, queries, log }) {
  return (req, res, next) => {
    const re = /\s/;
    if (
      Object.keys(req.body).includes("username") &&
      Object.keys(req.body).includes("password") &&
      typeof req.body.username === "string" &&
      typeof req.body.password === "string" &&
      !req.body.username.match(re)
    ) {
      queries
        .getCredentials(req.body.username)
        .then((record) => {
          if (record) {
            req.context.record = record;
            next();
          } else if (
            env.rootUser.username.toLowerCase() ===
            req.body.username.toLowerCase()
          ) {
            req.context.record = env.rootUser;
            next();
          } else {
            log.trace(
              req.context.traceId,
              "Authentication failure",
              "Warning",
              Date.now()
            );
            res.status(401).send(
              JSON.stringify({
                name: "AuthenticationError",
                message: "Authentication failed",
              })
            );
          }
        })
        .catch((err) => {
          log.trace(
            req.context.traceId,
            "Internal error during authentication",
            "Error",
            Date.now(),
            err
          );
          res.status(500).send(
            JSON.stringify({
              name: "InternalAuthenticationError",
              message: "Authentication failed",
            })
          );
        });
    } else {
      log.trace(
        req.context.traceId,
        "Authentication failure",
        "Warning",
        Date.now()
      );
      res.status(401).send(
        JSON.stringify({
          name: "AuthenticationError",
          message: "Authentication failed",
        })
      );
    }
  };
}

module.exports = validateCredentials;
