const detectDuplicateCredentials = require("./detect-duplicate-credentials");
const depromisify = require('depromisify').depromisify
const chai = depromisify(import('camelcase').then(({ default: chai }) => chai));

const spies = require("chai-spies");

chai.use(spies);

describe("detectDuplicateCredentials", () => {
  afterEach(() => {
    chai.spy.restore();
  });
  const log = {};

  const res = {
    status: function (code) {
      chai.expect(code).to.equal(400);
      return this;
    },
    send: function () {
      return this;
    },
  };

  it("logs when credentials are there", (done) => {
    const logSpy = chai.spy.on(log, "trace");
    const resSpy = chai.spy.on(res, ["status", "send"]);
    const next = chai.spy();
    const middleware = detectDuplicateCredentials({ log });
    middleware({ context: { record: {} }, body: { username: "" } }, res, next);
    chai.expect(logSpy).to.have.been.called();
    chai.expect(resSpy[0]).to.have.been.called();
    chai.expect(resSpy[1]).to.have.been.called();
    chai.expect(next).to.have.been.called();
    done();
  });

  it("calls next when there is no record in the context", (done) => {
    const logSpy = chai.spy.on(log, "trace");
    const resSpy = chai.spy.on(res, ["status", "send"]);
    const next = chai.spy();
    const middleware = detectDuplicateCredentials({ log });
    middleware({ context: {}, body: { username: "" } }, res, next);
    chai.expect(logSpy).not.to.have.been.called();
    chai.expect(resSpy[0]).not.to.have.been.called();
    chai.expect(resSpy[1]).not.to.have.been.called();
    chai.expect(next).to.have.been.called();
    done();
  });
});
