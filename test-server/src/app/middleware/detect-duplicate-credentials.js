function detectDuplicateCredentials({ env, queries, log }) {
  return (req, res, next) => {
    // if req.context.record is set here, that means we do have a duplicate record - and therefore a user error
    if (req.context.record) {
      log.trace(req.context.traceId, "Duplicate username", "Info", Date.now());
      const err = {
        name: "DuplicateUsername",
        message: `Duplicate username ${req.body.username}`,
      };
      res.status(400).send(JSON.stringify(err));
      next(err);
    } else {
      next();
    }
  };
}

module.exports = detectDuplicateCredentials;
