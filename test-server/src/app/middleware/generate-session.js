const uuid = require("uuid").v4;

function generateSession({ log }) {
  return (req, res, next) => {
    req.context.session = { token: uuid() };
    log.trace(req.context.traceId, `Session created ${req.context.session.token}`, "Info", Date.now());
    next();
  };
}
module.exports = generateSession;
