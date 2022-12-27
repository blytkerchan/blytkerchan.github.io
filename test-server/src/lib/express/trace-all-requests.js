function traceAllRequests(req, res, next) {
  console.log(req);
  next();
}

module.exports = traceAllRequests;
