const express = require("express");
const { join } = require("path");

const attachLocals = require("./attach-locals");
const lastResortErrorHandler = require("./last-resort-error-handler");
const primeRequestContext = require("./prime-request-context");
const traceAllRequests = require("./trace-all-requests");

function mountMiddleware({app, env, config}) {
  app.use(lastResortErrorHandler);
  app.use(primeRequestContext);
  app.use(attachLocals);
  if (env.env === "development") {
    app.use(traceAllRequests({env, config}));
  }
}

module.exports = mountMiddleware;
