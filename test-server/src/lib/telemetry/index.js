const { inspect } = require("util");

function createTelemetry({ env, Trace }) {
  async function traceAsync(traceId, message, severity, timestamp, ...data) {
    try {
      const trace = new Trace({
        traceId,
        message,
        severity,
        timestamp,
        data: `[${data.reduce((acc, curr) => {
          return acc + inspect(curr) + ","
        }, "")}]`,
      });
      await trace.save();
    } catch (err) {
      console.error(`[ERROR] ${err.message}`);
    }
  }
  function trace(traceId, message, severity, ...data) {
    traceAsync(traceId, message, severity, Date.now(), ...data);
  }

  return { trace };
}

module.exports = createTelemetry;
