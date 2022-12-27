const createExpressApp = require("./lib/express");
const createConfig = require("./config");
const env = require("./env");

function start() {
  try {
    const config = createConfig({ env });
    const app = createExpressApp({ config, env });

    config.aggregators.forEach((a) => a.start());
    config.components.forEach((s) => s.start());
    app.listen(env.port, "0.0.0.0", signalAppStart);
  } catch (err) {
    console.log(`[ERROR]: ${err.message}`);
  }
}

function signalAppStart() {
  console.log(`${env.appName} started`);
  console.table([
    ["Port", env.port],
    ["Environment", env.env],
  ]);
}

module.exports = {
  start,
};
