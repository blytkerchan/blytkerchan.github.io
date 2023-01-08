const generateSession = require("./generate-session");
const chai = require("chai");
const spies = require("chai-spies");
const uuid = require("uuid").v4;

chai.use(spies);

describe("generateSession", () => {
  afterEach(() => {
    chai.spy.restore();
  });
  const log = {};

  const res = {};

  it("logs when a session is created, but does not send anything", (done) => {
    const logSpy = chai.spy.on(log, "trace");
    const resSpy = chai.spy.on(res, ["status", "send"]);
    const next = chai.spy();

    const req = { context: { traceId: uuid() } };
    const middleware = generateSession({ log });
    middleware(req, res, next);
    chai.expect(logSpy).to.have.been.called();
    chai.expect(resSpy[0]).not.to.have.been.called();
    chai.expect(resSpy[1]).not.to.have.been.called();
    chai.expect(next).to.have.been.called();
    chai.expect(Object.keys(req.context)).to.include("session");
    chai.expect(req.context.session).to.be.an("object");
    chai.expect(Object.keys(req.context.session)).to.include("token");
    chai.expect(req.context.session.token).to.be.a("string");
    done();
  });
});
