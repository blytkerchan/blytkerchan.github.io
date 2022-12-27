function validateCredentials({ env, queries }) {
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
        .getUserAsync(req.body.username)
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
            res.status(401).send(
              JSON.stringify({
                name: "AuthenticationError",
                message: "Authentication failed",
              })
            );
          }
        })
        .catch((err) => {
          //TODO check the error
          res.status(500).send(
            JSON.stringify({
              name: "InternalAuthenticationError",
              message: "Authentication failed",
            })
          );
        });
    } else {
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
