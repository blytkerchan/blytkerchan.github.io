const validateCredentials = require("./validate-credentials");
const chai = require("chai");
const spies = require("chai-spies");
const uuid = require("uuid").v4;

chai.use(spies);

describe("validateCredentials", () => {
  afterEach(() => {
    chai.spy.restore();
  });

  const env = { rootUser: { username: "root" } };
  const log = {};
  const queries = {
    credentials: null,
    getCredentials: function () {
      return new Promise((resolve, reject) => {
        resolve(this.credentials);
      });
    },
  };

  it("logs and returns an authentication error for an empty body", (done) => {
    const next = chai.spy();

    const requireExists = true;

    const req = { context: { traceId: uuid() }, body: {} };
    const logSpy = chai.spy.on(log, "trace", (traceId, ...a) => {
      chai.expect(traceId).to.equal(req.context.traceId);
    });
    const queriesSpy = chai.spy.on(queries, "getCredentials");
    const res = {
      status: function (code) {
        chai.expect(code).to.equal(401);
        return this;
      },
      send: function (str) {
        chai.expect(str).to.be.a("string");
        const obj = JSON.parse(str);
        chai.expect(obj).to.be.an("object");
        chai.expect(Object.keys(obj)).to.include("name");
        chai.expect(obj.name).to.be.a("string");
        chai.expect(obj.name).to.equal("AuthenticationError");
        chai.expect(Object.keys(obj)).to.include("message");
        chai.expect(obj.message).to.be.a("string");
        chai.expect(obj.message).to.equal("Authentication failed");
        return this;
      },
    };

    const resStatusSpy = chai.spy.on(res, "status");
    const resSendSpy = chai.spy.on(res, "send");

    const middleware = validateCredentials({
      env,
      queries,
      log,
      requireExists,
    });
    middleware(req, res, next);
    chai.expect(logSpy).to.have.been.called();
    chai.expect(resStatusSpy).to.have.been.called();
    chai.expect(resSendSpy).to.have.been.called();
    chai.expect(queriesSpy).not.to.have.been.called();
    chai.expect(next).to.have.been.called();
    done();
  });
  it("logs and returns an authentication error if a username is missing", (done) => {
    const next = chai.spy();

    const requireExists = true;

    const req = {
      context: { traceId: uuid() },
      body: { password: "52wtgags" },
    };
    const logSpy = chai.spy.on(log, "trace", (traceId, ...a) => {
      chai.expect(traceId).to.equal(req.context.traceId);
    });
    const queriesSpy = chai.spy.on(queries, "getCredentials");
    const res = {
      status: function (code) {
        chai.expect(code).to.equal(401);
        return this;
      },
      send: function (str) {
        chai.expect(str).to.be.a("string");
        const obj = JSON.parse(str);
        chai.expect(obj).to.be.an("object");
        chai.expect(Object.keys(obj)).to.include("name");
        chai.expect(obj.name).to.be.a("string");
        chai.expect(obj.name).to.equal("AuthenticationError");
        chai.expect(Object.keys(obj)).to.include("message");
        chai.expect(obj.message).to.be.a("string");
        chai.expect(obj.message).to.equal("Authentication failed");
        return this;
      },
    };

    const resStatusSpy = chai.spy.on(res, "status");
    const resSendSpy = chai.spy.on(res, "send");

    const middleware = validateCredentials({
      env,
      queries,
      log,
      requireExists,
    });
    middleware(req, res, next);
    chai.expect(logSpy).to.have.been.called();
    chai.expect(resStatusSpy).to.have.been.called();
    chai.expect(resSendSpy).to.have.been.called();
    chai.expect(queriesSpy).not.to.have.been.called();
    chai.expect(next).to.have.been.called();
    done();
  });
  it("logs and returns an authentication error if a password is missing", (done) => {
    const next = chai.spy();

    const requireExists = true;

    const req = {
      context: { traceId: uuid() },
      body: { username: "52wtgags" },
    };
    const logSpy = chai.spy.on(log, "trace", (traceId, ...a) => {
      chai.expect(traceId).to.equal(req.context.traceId);
    });
    const queriesSpy = chai.spy.on(queries, "getCredentials");
    const res = {
      status: function (code) {
        chai.expect(code).to.equal(401);
        return this;
      },
      send: function (str) {
        chai.expect(str).to.be.a("string");
        const obj = JSON.parse(str);
        chai.expect(obj).to.be.an("object");
        chai.expect(Object.keys(obj)).to.include("name");
        chai.expect(obj.name).to.be.a("string");
        chai.expect(obj.name).to.equal("AuthenticationError");
        chai.expect(Object.keys(obj)).to.include("message");
        chai.expect(obj.message).to.be.a("string");
        chai.expect(obj.message).to.equal("Authentication failed");
        return this;
      },
    };

    const resStatusSpy = chai.spy.on(res, "status");
    const resSendSpy = chai.spy.on(res, "send");

    const middleware = validateCredentials({
      env,
      queries,
      log,
      requireExists,
    });
    middleware(req, res, next);
    chai.expect(logSpy).to.have.been.called();
    chai.expect(resStatusSpy).to.have.been.called();
    chai.expect(resSendSpy).to.have.been.called();
    chai.expect(queriesSpy).not.to.have.been.called();
    chai.expect(next).to.have.been.called();
    done();
  });
  it("logs and returns an authentication error if the username contains a space", (done) => {
    const next = chai.spy();

    const requireExists = true;

    const req = {
      context: { traceId: uuid() },
      body: { username: "52w tgags", password: "52wtgags" },
    };
    const logSpy = chai.spy.on(log, "trace", (traceId, ...a) => {
      chai.expect(traceId).to.equal(req.context.traceId);
    });
    const queriesSpy = chai.spy.on(queries, "getCredentials");
    const res = {
      status: function (code) {
        chai.expect(code).to.equal(401);
        return this;
      },
      send: function (str) {
        chai.expect(str).to.be.a("string");
        const obj = JSON.parse(str);
        chai.expect(obj).to.be.an("object");
        chai.expect(Object.keys(obj)).to.include("name");
        chai.expect(obj.name).to.be.a("string");
        chai.expect(obj.name).to.equal("AuthenticationError");
        chai.expect(Object.keys(obj)).to.include("message");
        chai.expect(obj.message).to.be.a("string");
        chai.expect(obj.message).to.equal("Authentication failed");
        return this;
      },
    };

    const resStatusSpy = chai.spy.on(res, "status");
    const resSendSpy = chai.spy.on(res, "send");

    const middleware = validateCredentials({
      env,
      queries,
      log,
      requireExists,
    });
    middleware(req, res, next);
    chai.expect(logSpy).to.have.been.called();
    chai.expect(resStatusSpy).to.have.been.called();
    chai.expect(resSendSpy).to.have.been.called();
    chai.expect(queriesSpy).not.to.have.been.called();
    chai.expect(next).to.have.been.called();
    done();
  });
  it("attempts to fetch credentials if they look plausible (and succeeds)", (done) => {
    const requireExists = true;

    const req = {
      context: { traceId: uuid() },
      body: { username: "52wtgags", password: "52wtgags" },
    };
    const logSpy = chai.spy.on(log, "trace");
    const queriesSpy = chai.spy.on(queries, "getCredentials");
    const res = {};

    const resStatusSpy = chai.spy.on(res, "status");
    const resSendSpy = chai.spy.on(res, "send");

    const middleware = validateCredentials({
      env,
      queries,
      log,
      requireExists,
    });
    const next = () => {
      chai.expect(logSpy).not.to.have.been.called();
      chai.expect(resStatusSpy).not.to.have.been.called();
      chai.expect(resSendSpy).not.to.have.been.called();
      chai.expect(queriesSpy).to.have.been.called();
      done();
    };
    queries.credentials = {};
    middleware(req, res, next);
  });
  it("attempts to fetch credentials if they look plausible (and it's the root)", (done) => {
    const requireExists = true;

    const req = {
      context: { traceId: uuid() },
      body: { username: "root", password: "52wtgags" },
    };
    const logSpy = chai.spy.on(log, "trace");
    const queriesSpy = chai.spy.on(queries, "getCredentials");
    const res = {};

    const resStatusSpy = chai.spy.on(res, "status");
    const resSendSpy = chai.spy.on(res, "send");

    const middleware = validateCredentials({
      env,
      queries,
      log,
      requireExists,
    });
    const next = () => {
      chai.expect(logSpy).not.to.have.been.called();
      chai.expect(resStatusSpy).not.to.have.been.called();
      chai.expect(resSendSpy).not.to.have.been.called();
      chai.expect(queriesSpy).to.have.been.called();
      done();
    };
    queries.credentials = null;
    middleware(req, res, next);
  });
  it("attempts to fetch credentials if they look plausible (and fails to find one, but is required to)", () => {
    const requireExists = true;

    const req = {
      context: { traceId: uuid() },
      body: { username: "khgkjhgss", password: "52wtgags" },
    };
    const logSpy = chai.spy.on(log, "trace");
    const queriesSpy = chai.spy.on(queries, "getCredentials");
    const res = {
      status: function (code) {
        chai.expect(code).to.equal(401);
        return this;
      },
      send: function (str) {
        chai.expect(str).to.be.a("string");
        const obj = JSON.parse(str);
        chai.expect(obj).to.be.an("object");
        chai.expect(Object.keys(obj)).to.include("name");
        chai.expect(obj.name).to.be.a("string");
        chai.expect(obj.name).to.equal("AuthenticationError");
        chai.expect(Object.keys(obj)).to.include("message");
        chai.expect(obj.message).to.be.a("string");
        chai.expect(obj.message).to.equal("Authentication failed");
        return this;
      },
    };
    const next = chai.spy();

    const resStatusSpy = chai.spy.on(res, "status");
    const resSendSpy = chai.spy.on(res, "send");

    const middleware = validateCredentials({
      env,
      queries,
      log,
      requireExists,
    });
    queries.credentials = null;
    return middleware(req, res, next).then(() => {
      chai.expect(logSpy).to.have.been.called();
      chai.expect(resStatusSpy).to.have.been.called();
      chai.expect(resSendSpy).to.have.been.called();
      chai.expect(queriesSpy).to.have.been.called();
      chai.expect(next).to.have.been.called();
    });
  });
  it("attempts to fetch credentials if they look plausible (and fails to find one, and is not required to)", () => {
    const requireExists = false;

    const req = {
      context: { traceId: uuid() },
      body: { username: "khgkjhgss", password: "52wtgags" },
    };
    const logSpy = chai.spy.on(log, "trace");
    const queriesSpy = chai.spy.on(queries, "getCredentials");
    const res = {};
    const next = chai.spy();

    const resStatusSpy = chai.spy.on(res, "status");
    const resSendSpy = chai.spy.on(res, "send");

    const middleware = validateCredentials({
      env,
      queries,
      log,
      requireExists,
    });
    queries.credentials = null;
    return middleware(req, res, next).then(() => {
      chai.expect(logSpy).not.to.have.been.called();
      chai.expect(resStatusSpy).not.to.have.been.called();
      chai.expect(resSendSpy).not.to.have.been.called();
      chai.expect(queriesSpy).to.have.been.called();
      chai.expect(next).to.have.been.called();
    });
  });
  it("reports an internal error when getting credentials fails", () => {
    const requireExists = false;

    const req = {
      context: { traceId: uuid() },
      body: { username: "khgkjhgss", password: "52wtgags" },
    };
    const logSpy = chai.spy.on(log, "trace");
    const queriesSpy = chai.spy.on(queries, "getCredentials", () => {
      return new Promise((resolve, reject) => {
        reject({ name: "InternalError", message: "Internal failure" });
      });
    });
    const res = {
      status: function (code) {
        chai.expect(code).to.equal(500);
        return this;
      },
      send: function (str) {
        chai.expect(str).to.be.a("string");
        const obj = JSON.parse(str);
        chai.expect(obj).to.be.an("object");
        chai.expect(Object.keys(obj)).to.include("name");
        chai.expect(obj.name).to.be.a("string");
        chai.expect(obj.name).to.equal("InternalAuthenticationError");
        chai.expect(Object.keys(obj)).to.include("message");
        chai.expect(obj.message).to.be.a("string");
        chai.expect(obj.message).to.equal("Authentication failed");
        return this;
      },
    };
    const next = chai.spy();

    const resStatusSpy = chai.spy.on(res, "status");
    const resSendSpy = chai.spy.on(res, "send");

    const middleware = validateCredentials({
      env,
      queries,
      log,
      requireExists,
    });
    queries.credentials = null;
    return middleware(req, res, next).then(() => {
      chai.expect(logSpy).to.have.been.called();
      chai.expect(resStatusSpy).to.have.been.called();
      chai.expect(resSendSpy).to.have.been.called();
      chai.expect(queriesSpy).to.have.been.called();
      chai.expect(next).to.have.been.called();
    });
  });
});
