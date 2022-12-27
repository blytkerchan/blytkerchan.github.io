const uuid = require("uuid").v4;

function generateSession({ env, queries }) {
  return (req, res, next) => {
    req.context.session = { token: uuid() };
    next();
  };
}
module.exports = generateSession;
