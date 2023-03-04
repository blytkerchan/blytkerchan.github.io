const { setWorldConstructor, World } = require("@cucumber/cucumber");
const tmp = require("tmp");

class CustomWorld extends World {
  constructor(options) {
    super(options);
    this.tmpDir = tmp.dirSync({ template: "tmp-XXXXXX", unsafeCleanup: true });
    this.serverUrl = process.env["SERVER_URL"] || "http://127.0.0.1:3000";
  }
}
setWorldConstructor(CustomWorld);
