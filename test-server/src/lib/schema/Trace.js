const mongoose = require("mongoose");

function Trace({ env }) {
  return new mongoose.Schema(
    { message: String, severity: String, timestamp: Number, data: String, traceId: String },
    { timestamps: true, strict: true, strictQuery: true }
  );
}

module.exports = Trace;
