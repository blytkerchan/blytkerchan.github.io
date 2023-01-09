const verifyCredentials = require("./verify-credentials");
const chai = require("chai");
const spies = require("chai-spies");
const uuid = require("uuid").v4;
const bcrypt = require("bcrypt");

chai.use(spies);

describe("verifyCredentials", () => {
  afterEach(() => {
    chai.spy.restore();
  });

  const log = {};
  function preprocessPassword(pwd) {
    return pwd;
  }

  const req = {
    context: {
      traceId: uuid(),
      record: { hash: "kjhgkjg" },
    },
    body: { password: "jkhgkh" },
  };

  it("fails on wrong password", async () => {
    const preprocessPasswordSpy = chai.spy(preprocessPassword);

    const logSpy = chai.spy.on(log, "trace", (traceId, ...a) => {
      chai.expect(traceId).to.equal(req.context.traceId);
    });
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

    const middleware = verifyCredentials({
      preprocessPassword: preprocessPasswordSpy,
      log,
      bcrypt,
    });
    const next = chai.spy((err) => {
      chai.expect(err).to.be.an("object");
      chai.expect(Object.keys(err)).to.include("name");
      chai.expect(err.name).to.be.a("string");
      chai.expect(err.name).to.equal("AuthenticationError");
      chai.expect(Object.keys(err)).to.include("message");
      chai.expect(err.message).to.be.a("string");
      chai.expect(err.message).to.equal("Authentication failed");
      chai.expect(preprocessPasswordSpy).to.have.been.called();
      chai.expect(logSpy).to.have.been.called();
      chai.expect(resStatusSpy).to.have.been.called();
      chai.expect(resSendSpy).to.have.been.called();
    });
    await middleware(req, res, next);
    chai.expect(next).to.have.been.called();
  });
  it("succeeds with the right password", async () => {
    req.context.record.hash = await bcrypt.hash(
      preprocessPassword(req.body.password),
      10
    );

    const preprocessPasswordSpy = chai.spy(preprocessPassword);

    const logSpy = chai.spy.on(log, "trace");
    const res = {};

    const resStatusSpy = chai.spy.on(res, "status");
    const resSendSpy = chai.spy.on(res, "send");

    const middleware = verifyCredentials({
      preprocessPassword: preprocessPasswordSpy,
      log,
      bcrypt,
    });
    const next = chai.spy(() => {
      chai.expect(preprocessPasswordSpy).to.have.been.called();
      chai.expect(logSpy).not.to.have.been.called();
      chai.expect(resStatusSpy).not.to.have.been.called();
      chai.expect(resSendSpy).not.to.have.been.called();
    });
    await middleware(req, res, next);
    chai.expect(next).to.have.been.called();
  });
  it("handles errors gracefully (1)", async () => {
    const preprocessPasswordSpy = chai.spy(preprocessPassword);
    const bcrypt = {
      compare: chai.spy((pwd, hash) => {
        chai.expect(pwd).to.be.a("string");
        chai.expect(pwd).to.equal(req.body.password);
        chai.expect(hash).to.be.a("string");
        chai.expect(hash).to.equal(req.context.record.hash);
        return Promise.reject({ name: "InternalError", message: "TheError" });
      }),
    };

    const logSpy = chai.spy.on(log, "trace", (traceId, ...a) => {
      chai.expect(traceId).to.equal(req.context.traceId);
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

    const resStatusSpy = chai.spy.on(res, "status");
    const resSendSpy = chai.spy.on(res, "send");

    const middleware = verifyCredentials({
      preprocessPassword: preprocessPasswordSpy,
      log,
      bcrypt,
    });
    const next = chai.spy((err) => {
      chai.expect(err).to.be.an("object");
      chai.expect(Object.keys(err)).to.include("name");
      chai.expect(err.name).to.be.a("string");
      chai.expect(err.name).to.equal("InternalError");
      chai.expect(Object.keys(err)).to.include("message");
      chai.expect(err.message).to.be.a("string");
      chai.expect(err.message).to.equal("TheError");
      chai.expect(preprocessPasswordSpy).to.have.been.called();
      chai.expect(logSpy).to.have.been.called();
      chai.expect(resStatusSpy).to.have.been.called();
      chai.expect(resSendSpy).to.have.been.called();
    });
    await middleware(req, res, next);
    chai.expect(next).to.have.been.called();
  });
  it("handles errors gracefully (2)", async () => {
    const preprocessPasswordSpy = chai.spy(preprocessPassword);
    const bcrypt = {
      compare: chai.spy((pwd, hash) => {
        chai.expect(pwd).to.be.a("string");
        chai.expect(pwd).to.equal(req.body.password);
        chai.expect(hash).to.be.a("string");
        chai.expect(hash).to.equal(req.context.record.hash);
        return Promise.reject();
      }),
    };

    const logSpy = chai.spy.on(log, "trace", (traceId, ...a) => {
      chai.expect(traceId).to.equal(req.context.traceId);
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

    const resStatusSpy = chai.spy.on(res, "status");
    const resSendSpy = chai.spy.on(res, "send");

    const middleware = verifyCredentials({
      preprocessPassword: preprocessPasswordSpy,
      log,
      bcrypt,
    });
    const next = chai.spy((err) => {
      chai.expect(err).to.be.an("object");
      chai.expect(Object.keys(err)).to.include("name");
      chai.expect(err.name).to.be.a("string");
      chai.expect(err.name).to.equal("InternalAuthenticationError");
      chai.expect(Object.keys(err)).to.include("message");
      chai.expect(err.message).to.be.a("string");
      chai.expect(err.message).to.equal("Authentication failed");
      chai.expect(preprocessPasswordSpy).to.have.been.called();
      chai.expect(logSpy).to.have.been.called();
      chai.expect(resStatusSpy).to.have.been.called();
      chai.expect(resSendSpy).to.have.been.called();
    });
    await middleware(req, res, next);
    chai.expect(next).to.have.been.called();
  });
});
