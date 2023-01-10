const validateNewUserRecord = require("./validate-new-user-record");
const chai = require("chai");
const spies = require("chai-spies");
const uuid = require("uuid").v4;
const bcrypt = require("bcrypt");

chai.use(spies);

describe("validateNewUserRecord", () => {
  afterEach(() => {
    chai.spy.restore();
  });

  const env = { rootUser: { username: "root" } };
  const log = {};
  const queries = {};
  class Credentials {}
  class User {}
  function validatePassword() {}
  function preprocessPassword(pwd) {
    return pwd;
  }

  const reqBody = {
    username: "TheUserName",
    name: "TheName",
    password: "ThePassword",
    email: "TheEmail@TheDomain.TheTopLevelDomain",
  };

  it("bails out when a missing name field", async () => {
    const next = chai.spy((err) => {
      chai.expect(err).to.be.an("object");
      chai.expect(Object.keys(err)).to.include("name");
      chai.expect(err.name).to.be.a("string");
      chai.expect(err.name).to.equal("RequiredFieldMissingOrEmpty");
      chai.expect(Object.keys(err)).to.include("message");
      chai.expect(err.message).to.be.a("string");
      chai.expect(err.message).to.equal("Missing or empty name field");
      chai.expect(Object.keys(err)).to.include("field");
      chai.expect(err.field).to.be.a("string");
      chai.expect(err.field).to.equal("name");
    });

    const _reqBody = JSON.parse(JSON.stringify(reqBody));
    delete _reqBody.name;

    const req = { context: { traceId: uuid() }, body: _reqBody };
    const logSpy = chai.spy.on(log, "trace", (traceId, ...a) => {
      chai.expect(traceId).to.equal(req.context.traceId);
    });
    const queriesSpy = chai.spy.on(queries, "getCredentials");
    const res = {
      status: function (code) {
        chai.expect(code).to.equal(400);
        return this;
      },
      send: function (str) {
        chai.expect(str).to.be.a("string");
        const obj = JSON.parse(str);
        chai.expect(obj).to.be.an("object");
        chai.expect(Object.keys(obj)).to.include("name");
        chai.expect(obj.name).to.be.a("string");
        chai.expect(obj.name).to.equal("RequiredFieldMissingOrEmpty");
        chai.expect(Object.keys(obj)).to.include("message");
        chai.expect(obj.message).to.be.a("string");
        chai.expect(obj.message).to.equal("Missing or empty name field");
        chai.expect(Object.keys(obj)).to.include("field");
        chai.expect(obj.field).to.be.a("string");
        chai.expect(obj.field).to.equal("name");
        return this;
      },
    };

    const resStatusSpy = chai.spy.on(res, "status");
    const resSendSpy = chai.spy.on(res, "send");

    const middleware = validateNewUserRecord({
      env,
      User,
      Credentials,
      validatePassword,
      preprocessPassword,
      log,
      bcrypt,
    });
    await middleware(req, res, next);
    chai.expect(logSpy).to.have.been.called();
    chai.expect(resStatusSpy).to.have.been.called();
    chai.expect(resSendSpy).to.have.been.called();
    chai.expect(queriesSpy).not.to.have.been.called();
    chai.expect(next).to.have.been.called();
  });
  it("bails out when a missing email field", async () => {
    const next = chai.spy((err) => {
      chai.expect(err).to.be.an("object");
      chai.expect(Object.keys(err)).to.include("name");
      chai.expect(err.name).to.be.a("string");
      chai.expect(err.name).to.equal("RequiredFieldMissingOrEmpty");
      chai.expect(Object.keys(err)).to.include("message");
      chai.expect(err.message).to.be.a("string");
      chai.expect(err.message).to.equal("Missing or empty email field");
      chai.expect(Object.keys(err)).to.include("field");
      chai.expect(err.field).to.be.a("string");
      chai.expect(err.field).to.equal("email");
    });

    const _reqBody = JSON.parse(JSON.stringify(reqBody));
    delete _reqBody.email;

    const req = { context: { traceId: uuid() }, body: _reqBody };
    const logSpy = chai.spy.on(log, "trace", (traceId, ...a) => {
      chai.expect(traceId).to.equal(req.context.traceId);
    });
    const queriesSpy = chai.spy.on(queries, "getCredentials");
    const res = {
      status: function (code) {
        chai.expect(code).to.equal(400);
        return this;
      },
      send: function (str) {
        chai.expect(str).to.be.a("string");
        const obj = JSON.parse(str);
        chai.expect(obj).to.be.an("object");
        chai.expect(Object.keys(obj)).to.include("name");
        chai.expect(obj.name).to.be.a("string");
        chai.expect(obj.name).to.equal("RequiredFieldMissingOrEmpty");
        chai.expect(Object.keys(obj)).to.include("message");
        chai.expect(obj.message).to.be.a("string");
        chai.expect(obj.message).to.equal("Missing or empty email field");
        chai.expect(Object.keys(obj)).to.include("field");
        chai.expect(obj.field).to.be.a("string");
        chai.expect(obj.field).to.equal("email");
        return this;
      },
    };

    const resStatusSpy = chai.spy.on(res, "status");
    const resSendSpy = chai.spy.on(res, "send");

    const middleware = validateNewUserRecord({
      env,
      User,
      Credentials,
      validatePassword,
      preprocessPassword,
      log,
      bcrypt,
    });
    await middleware(req, res, next);
    chai.expect(logSpy).to.have.been.called();
    chai.expect(resStatusSpy).to.have.been.called();
    chai.expect(resSendSpy).to.have.been.called();
    chai.expect(queriesSpy).not.to.have.been.called();
    chai.expect(next).to.have.been.called();
  });
  it("bails out when a missing username field", async () => {
    const next = chai.spy((err) => {
      chai.expect(err).to.be.an("object");
      chai.expect(Object.keys(err)).to.include("name");
      chai.expect(err.name).to.be.a("string");
      chai.expect(err.name).to.equal("RequiredFieldMissingOrEmpty");
      chai.expect(Object.keys(err)).to.include("message");
      chai.expect(err.message).to.be.a("string");
      chai.expect(err.message).to.equal("Missing or empty username field");
      chai.expect(Object.keys(err)).to.include("field");
      chai.expect(err.field).to.be.a("string");
      chai.expect(err.field).to.equal("username");
    });

    const _reqBody = JSON.parse(JSON.stringify(reqBody));
    delete _reqBody.username;

    const req = { context: { traceId: uuid() }, body: _reqBody };
    const logSpy = chai.spy.on(log, "trace", (traceId, ...a) => {
      chai.expect(traceId).to.equal(req.context.traceId);
    });
    const queriesSpy = chai.spy.on(queries, "getCredentials");
    const res = {
      status: function (code) {
        chai.expect(code).to.equal(400);
        return this;
      },
      send: function (str) {
        chai.expect(str).to.be.a("string");
        const obj = JSON.parse(str);
        chai.expect(obj).to.be.an("object");
        chai.expect(Object.keys(obj)).to.include("name");
        chai.expect(obj.name).to.be.a("string");
        chai.expect(obj.name).to.equal("RequiredFieldMissingOrEmpty");
        chai.expect(Object.keys(obj)).to.include("message");
        chai.expect(obj.message).to.be.a("string");
        chai.expect(obj.message).to.equal("Missing or empty username field");
        chai.expect(Object.keys(obj)).to.include("field");
        chai.expect(obj.field).to.be.a("string");
        chai.expect(obj.field).to.equal("username");
        return this;
      },
    };

    const resStatusSpy = chai.spy.on(res, "status");
    const resSendSpy = chai.spy.on(res, "send");

    const middleware = validateNewUserRecord({
      env,
      User,
      Credentials,
      validatePassword,
      preprocessPassword,
      log,
      bcrypt,
    });
    await middleware(req, res, next);
    chai.expect(logSpy).to.have.been.called();
    chai.expect(resStatusSpy).to.have.been.called();
    chai.expect(resSendSpy).to.have.been.called();
    chai.expect(queriesSpy).not.to.have.been.called();
    chai.expect(next).to.have.been.called();
  });
  it("bails out when the email field is badly formatted", async () => {
    const next = chai.spy((err) => {
      chai.expect(err).to.be.an("object");
      chai.expect(Object.keys(err)).to.include("name");
      chai.expect(err.name).to.be.a("string");
      chai.expect(err.name).to.equal("FormatError");
      chai.expect(Object.keys(err)).to.include("message");
      chai.expect(err.message).to.be.a("string");
      chai.expect(err.message).to.equal("The value for email is badly formatted");
      chai.expect(Object.keys(err)).to.include("field");
      chai.expect(err.field).to.be.a("string");
      chai.expect(err.field).to.equal("email");
    });

    const _reqBody = JSON.parse(JSON.stringify(reqBody));
    _reqBody.email = "NotAnEmailAddress";

    const req = { context: { traceId: uuid() }, body: _reqBody };
    const logSpy = chai.spy.on(log, "trace", (traceId, ...a) => {
      chai.expect(traceId).to.equal(req.context.traceId);
    });
    const queriesSpy = chai.spy.on(queries, "getCredentials");
    const res = {
      status: function (code) {
        chai.expect(code).to.equal(400);
        return this;
      },
      send: function (str) {
        chai.expect(str).to.be.a("string");
        const obj = JSON.parse(str);
        chai.expect(obj).to.be.an("object");
        chai.expect(Object.keys(obj)).to.include("name");
        chai.expect(obj.name).to.be.a("string");
        chai.expect(obj.name).to.equal("FormatError");
        chai.expect(Object.keys(obj)).to.include("message");
        chai.expect(obj.message).to.be.a("string");
        chai.expect(obj.message).to.equal("The value for email is badly formatted");
        chai.expect(Object.keys(obj)).to.include("field");
        chai.expect(obj.field).to.be.a("string");
        chai.expect(obj.field).to.equal("email");
        return this;
      },
    };

    const resStatusSpy = chai.spy.on(res, "status");
    const resSendSpy = chai.spy.on(res, "send");

    const middleware = validateNewUserRecord({
      env,
      User,
      Credentials,
      validatePassword,
      preprocessPassword,
      log,
      bcrypt,
    });
    await middleware(req, res, next);
    chai.expect(logSpy).to.have.been.called();
    chai.expect(resStatusSpy).to.have.been.called();
    chai.expect(resSendSpy).to.have.been.called();
    chai.expect(queriesSpy).not.to.have.been.called();
    chai.expect(next).to.have.been.called();
  });
  it("bails out when password validation fails", async () => {
    const _reqBody = JSON.parse(JSON.stringify(reqBody));

    const req = { context: { traceId: uuid() }, body: _reqBody };
    const logSpy = chai.spy.on(log, "trace", (traceId, ...a) => {
      chai.expect(traceId).to.equal(req.context.traceId);
    });
    const queriesSpy = chai.spy.on(queries, "getCredentials");
    const res = {
      status: function (code) {
        chai.expect(code).to.equal(400);
        return this;
      },
      send: function (str) {
        chai.expect(str).to.be.a("string");
        const obj = JSON.parse(str);
        chai.expect(obj).to.be.an("object");
        chai.expect(Object.keys(obj)).to.include("name");
        chai.expect(obj.name).to.be.a("string");
        chai.expect(obj.name).to.equal("Error");
        chai.expect(Object.keys(obj)).to.include("message");
        chai.expect(obj.message).to.be.a("string");
        chai.expect(obj.message).to.equal("Password validation error");
        return this;
      },
    };

    const resStatusSpy = chai.spy.on(res, "status");
    const resSendSpy = chai.spy.on(res, "send");

    class PasswordValidationError extends Error {}
    function buggyValidatePassword() {
      throw new PasswordValidationError("Password validation error");
    }

    const next = chai.spy((err) => {
      chai.expect(err).to.be.an.instanceOf(PasswordValidationError);
      chai.expect(err.name).to.equal("Error");
      chai.expect(err.message).to.equal("Password validation error");
    });

    const middleware = validateNewUserRecord({
      env,
      User,
      Credentials,
      validatePassword: buggyValidatePassword,
      preprocessPassword,
      log,
      bcrypt,
    });
    await middleware(req, res, next);
    chai.expect(logSpy).to.have.been.called();
    chai.expect(resStatusSpy).to.have.been.called();
    chai.expect(resSendSpy).to.have.been.called();
    chai.expect(queriesSpy).not.to.have.been.called();
    chai.expect(next).to.have.been.called();
  });
  it("bails out when password hash fails", async () => {
    const _reqBody = JSON.parse(JSON.stringify(reqBody));

    const req = { context: { traceId: uuid() }, body: _reqBody };
    const logSpy = chai.spy.on(log, "trace", (traceId, ...a) => {
      chai.expect(traceId).to.equal(req.context.traceId);
    });
    const queriesSpy = chai.spy.on(queries, "getCredentials");
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
        chai.expect(obj.name).to.equal("Error");
        chai.expect(Object.keys(obj)).to.include("message");
        chai.expect(obj.message).to.be.a("string");
        chai.expect(obj.message).to.equal("Bug out");
        return this;
      },
    };

    const resStatusSpy = chai.spy.on(res, "status");
    const resSendSpy = chai.spy.on(res, "send");

    class BcryptError extends Error {}
    const buggyBcrypt = {
      hash: () => {
        throw new BcryptError("Bug out");
      },
    };

    const next = chai.spy((err) => {
      chai.expect(err).to.be.an.instanceOf(BcryptError);
      chai.expect(err.name).to.equal("Error");
      chai.expect(err.message).to.equal("Bug out");
    });

    const middleware = validateNewUserRecord({
      env,
      User,
      Credentials,
      validatePassword,
      preprocessPassword,
      log,
      bcrypt: buggyBcrypt,
    });
    await middleware(req, res, next);
    chai.expect(logSpy).to.have.been.called();
    chai.expect(resStatusSpy).to.have.been.called();
    chai.expect(resSendSpy).to.have.been.called();
    chai.expect(queriesSpy).not.to.have.been.called();
    chai.expect(next).to.have.been.called();
  });
  it("succeeds when it succeeds", async () => {
    const _reqBody = JSON.parse(JSON.stringify(reqBody));

    const req = { context: { traceId: uuid() }, body: _reqBody };
    const logSpy = chai.spy.on(log, "trace");
    const queriesSpy = chai.spy.on(queries, "getCredentials");
    const res = {};

    const resStatusSpy = chai.spy.on(res, "status");
    const resSendSpy = chai.spy.on(res, "send");

    const next = chai.spy(function () {
      chai.expect(arguments.length).to.equal(0);
    });

    const middleware = validateNewUserRecord({
      env: { saltRounds: 10 },
      User,
      Credentials,
      validatePassword,
      preprocessPassword,
      log,
      bcrypt,
    });
    await middleware(req, res, next);
    chai.expect(logSpy).not.to.have.been.called();
    chai.expect(resStatusSpy).not.to.have.been.called();
    chai.expect(resSendSpy).not.to.have.been.called();
    chai.expect(queriesSpy).not.not.to.have.been.called();
    chai.expect(next).to.have.been.called();
    chai.expect(Object.keys(req.context)).to.include("record");
    chai.expect(req.context.record).to.be.an("object");
    chai.expect(req.context.record.user).to.be.an.instanceOf(User);
    chai.expect(req.context.record.credentials).to.be.an.instanceOf(Credentials);
  });
});
