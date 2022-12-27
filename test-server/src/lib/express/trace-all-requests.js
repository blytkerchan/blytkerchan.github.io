function traceAllRequests({ env, config }) {
  return (req, res, next) => {
    config.telemetry.trace("Received request", "Info", req);
    next();
  };
}

module.exports = traceAllRequests;
