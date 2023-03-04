const mongoose = require("mongoose");

function Credentials({ env }) {
  const retval = new mongoose.Schema(
    {
      username: {
        type: String,
        index: {
          unique: true,
          collation: { locale: `${env.locale}`, strength: 2 },
        },
        required: true,
      },
      hash: { type: String, required: true },
      uid: { type: String, required: true, unique: true },
    },
    { timestamps: true, strict: true, strictQuery: true }
  );

  return retval;
}

module.exports = Credentials;
