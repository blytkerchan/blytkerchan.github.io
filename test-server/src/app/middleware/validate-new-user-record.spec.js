const validateNewUserRecord = require("./validate-new-user-record");
const chai = require("chai");
const spies = require("chai-spies");
const uuid = require("uuid").v4;

chai.use(spies);

describe("validateNewUserRecord", () => {
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
  class Credentials {};
  class User {};
  function validatePassword() {}
  function preprocessPassword() {}

  it("bails out a missing name field", (done) => {
    const next = chai.spy();

    const req = { context: { traceId: uuid() }, body: {} };
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
    });
    middleware(req, res, next);
    chai.expect(logSpy).to.have.been.called();
    chai.expect(resStatusSpy).to.have.been.called();
    chai.expect(resSendSpy).to.have.been.called();
    chai.expect(queriesSpy).not.to.have.been.called();
    chai.expect(next).to.have.been.called();
    done();
  });
});
