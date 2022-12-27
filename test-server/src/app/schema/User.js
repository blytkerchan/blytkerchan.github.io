const mongoose = require("mongoose");

function User({ env }) {
  const retval = new mongoose.Schema(
    {
      username: {
        type: String,
        unique: true,
        collation: { locale: `${env.locale}`, strength: 2 },
        required: true
      },
      hash: { type: String, required: true },
    },
    { timestamps: true, strict: true, strictQuery: true }
  );
  retval.pre('save', async function() {
    this.username = this.username.toLowerCase();
  });

  return retval;
}



module.exports = User;
