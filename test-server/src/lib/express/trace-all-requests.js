function traceAllRequests({ env, config }) {
  return (req, res, next) => {
    res.oldStatus = res.status;
    res.status = (code) => {
      config.telemetry.trace(req.context.traceId, `Request ${req.context.traceId} return status ${code}`, "Info");
      return res.oldStatus(code);
    }

    config.telemetry.trace(
      req.context.traceId,
      `Received request ${req.context.traceId}`,
      "Info",
      env.env === "!development" ? req : undefined
    );
    next();
  };
}

module.exports = traceAllRequests;
