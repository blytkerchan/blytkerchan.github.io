const { inspect } = require("util");

function createTelemetry({ env, db }) {
  async function traceAsync(message, severity, timestamp, ...data) {
    try {
      await db.insertOne({
        message,
        severity,
        timestamp,
        data: `[${data.reduce((acc, curr) => {
          return acc + inspect(curr) + ","
        }, "")}]`,
      });
    } catch (err) {
      console.error(`[ERROR] ${err.message}`);
    }
  }
  function trace(message, severity, ...data) {
    traceAsync(message, severity, Date.now(), ...data);
  }

  return { trace };
}

module.exports = createTelemetry;
