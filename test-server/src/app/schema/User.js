const mongoose = require("mongoose");

function User({ env }) {
  const retval = new mongoose.Schema(
    {
      uid: { type: String, required: true, unique: true },
      name: { type: String, required: true },
      email: { type: String, required: true },
      status: {
        type: String,
        enum: [
          "Unconfirmed", // user needs to confirm their identity (i.e. E-mail address)
          "Confirmed", // user is confirmed and active
          "Archived", // user is archived - no longer allowed to log in
          "Unknown", // user status is unknown - need admin intervention
          "ResetRequired", // user is confirmed, but the user must request a code and reset their password before they can sign in
          "ForceChangePassword", // user is confirmed and the user can sign in using a temporary password, but on first sign-in, the user must change their password to a new value before doing anything else
          "Compromised", // user credentials are compromised, should be warned about this, and will need to reset their password
        ],
      },
    },
    { timestamps: true, strict: true, strictQuery: true }
  );

  return retval;
}

module.exports = User;
