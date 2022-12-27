const bcrypt = require("bcrypt");
const saltRounds = 10;

const password = process.argv[2];

bcrypt.hash(password, saltRounds).then(result => console.log(result));
