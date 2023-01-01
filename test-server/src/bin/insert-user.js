const bcrypt = require("bcrypt");
const { depromisify } = require("depromisify");

const createConfig = require("../config");
const env = require("../env");
const preprocessPassword = require("../lib/preprocess-password");

const saltRounds = 10;

const username = process.argv[2];
const password = process.argv[3];
config = createConfig({env});

async function insertUser(username, hash) {
  try {
    const credentials = new config.schemas.Credentials({ username, hash });
    await credentials.save();
  } catch (err) {
    console.log(`[ERROR]: ${err.message}`);
  }
}

function main() {
  depromisify(bcrypt
    .hash(preprocessPassword(password), saltRounds)
    .then((result) => {
      return insertUser(username, result);
    })
    .then(() => {
      console.log("done");
    }));
}

main();
