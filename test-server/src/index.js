const createExpressApp = require("./lib/express");
const createConfig = require("./config");
const env = require("./env");

const config = createConfig({ env });
const app = createExpressApp({ config, env });

function start() {
  config.aggregators.forEach((a) => a.start());
  config.components.forEach((s) => s.start());
  app.listen(env.port, "0.0.0.0", signalAppStart);
}

function signalAppStart() {
  console.log(`${env.appName} started`);
  console.table([
    ["Port", env.port],
    ["Environment", env.env],
  ]);
}

module.exports = {
  app,
  config,
  start,
};
