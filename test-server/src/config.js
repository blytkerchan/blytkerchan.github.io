// connectors to databases, buses, etc. go here
const createMongoClient = require("./lib/mongodb");
const preprocessPassword = require("./lib/preprocess-password");

// aggregators
// components
// apis
const createVersionApi = require("./app/version-v1");
const createAuthenticationApi = require("./app/authn-v1");
const createApiDocs = require("./app/api-docs");
const createTelemetry = require("./lib/telemetry");

function connectToDatabase(_databaseConnection) {
  const databaseConnection = JSON.parse(_databaseConnection);
  if (Object.keys(databaseConnection).includes("url") && databaseConnection.url.startsWith("mongodb://")) {
    return createMongoClient(databaseConnection);
  }
  console.error(
    `[WARNING]: didn't recognize scheme for database connection ${JSON.stringify(databaseConnection)} -- not connecting`
  );
  return null;
}

function getSchemas(env, db) {
  function getCredentialsSchema() {
    const collection = db.collection("credentials", require("./app/schema/Credentials")({ env }), "credentials");
    return collection;
  }
  function getTraceSchema() {
    const collection = db.collection("telemetry", require("./lib/schema/Trace")({ env }), "telemetry");
    return collection;
  }
  function getUserSchema() {
    const collection = db.collection("users", require("./app/schema/User")({ env }), "users");
    return collection;
  }
  return {
    Credentials: getCredentialsSchema(),
    Trace: getTraceSchema(),
    User: getUserSchema(),
  };
}

function createConfig({ env }) {
  const db = connectToDatabase(env.db);

  const schemas = getSchemas(env, db);

  const telemetry = createTelemetry({ env, Trace: schemas.Trace });

  const aggregators = [];
  const components = [];
  const apis = [
    // expects entries in the form of { path: '/', router: ... }
    { path: "/api/v1/version", router: createVersionApi({ env }).router },
    {
      path: "/api/v1/authn",
      router: createAuthenticationApi({
        env,
        Credentials: schemas.Credentials,
        log: telemetry,
        preprocessPassword,
      }).router,
    },
    {
      path: "/",
      router: createApiDocs({ env }),
    },
  ];

  return {
    env,
    aggregators,
    components,
    apis,
    telemetry,
    schemas,
  };
}

module.exports = createConfig;
