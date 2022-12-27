const dotenv = require("dotenv");

const packageJson = require("../package.json");

const envResult = dotenv.config();

if (envResult.error) {
  // eslint-disable-next-line no-console
  console.error(
    `[ERROR] env failed to load: ${envResult.error}`
  );

  process.exit(1);
}

function requireFromEnv(key) {
  if (!process.env[key]) {
    console.error(`[APP ERROR] Missing env variable: ${key}`);
    return process.exit(1);
  }

  return process.env[key];
}

module.exports = {
  appName: packageJson.name,
  env: requireFromEnv("NODE_ENV"),
  port: parseInt(requireFromEnv("PORT"), 10),
  version: packageJson.version,
  db: requireFromEnv("PHOENIX_DATABASE_CONNECTION"),
  locale: requireFromEnv("PHOENIX_LOCALE"),
  rootUser: { username: requireFromEnv("PHOENIX_ROOT_USER"), hash: requireFromEnv("PHOENIX_ROOT_PASSWORDHASH") }
};
