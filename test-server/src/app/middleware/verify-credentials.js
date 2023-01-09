function verifyCredentials({ log, preprocessPassword, bcrypt }) {
  return async (req, res, next) => {
    const credentials = req.body;
    const userRecord = req.context.record;
    try {
      const result = await bcrypt.compare(
        preprocessPassword(credentials.password),
        userRecord.hash
      );
      if (result) {
        next();
      } else {
        log.trace(
          req.context.traceId,
          "Authentication failure",
          "Error",
          Date.now()
        );
        const authError = {
          name: "AuthenticationError",
          message: "Authentication failed",
        };
        res.status(401).send(JSON.stringify(authError));
        next(authError);
      }
    } catch (err) {
      log.trace(
        req.context.traceId,
        "Authentication failure",
        "Error",
        Date.now(),
        err
      );
      const authError = {
        name: "InternalAuthenticationError",
        message: "Authentication failed",
      };
      res.status(500).send(JSON.stringify(authError));
      next(err ? err : authError);
    }
  };
}

module.exports = verifyCredentials;
