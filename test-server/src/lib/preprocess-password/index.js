const sha256 = require("crypto-js/sha256");

function preprocessPassword(password) {
  var buf = Buffer.from(password, "utf-8");
  if (buf.length < 72) {
    return password;
  }
  return sha256(password);
}

module.exports = preprocessPassword;
