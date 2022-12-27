// connectors to databases, buses, etc. go here
const createMongoClient = require("./lib/mongodb");

// aggregators
// components
// apis
const createVersionApi = require("./app/version-v1");
const createLoginApi = require("./app/login-v1");
const createTelemetry = require("./lib/telemetry");

function connectToDatabase(_databaseConnection) {
  databaseConnection = JSON.parse(_databaseConnection);
  if (
    Object.keys(databaseConnection).includes("url") &&
    databaseConnection.url.startsWith("mongodb://")
  ) {
    return createMongoClient(databaseConnection);
  }
  console.error(
    `[WARNING]: didn't recognize scheme for database connection ${JSON.stringify(
      databaseConnection
    )} -- not connecting`
  );
  return null;
}

function getSchemas(env, db) {
  function getCredentialsSchema() {
    const collection = db.collection(
      "credentials",
      require("./app/schema/Credentials")({ env }),
      "credentials"
    );
    return collection;
  }
  function getTraceSchema() {
    const collection = db.collection(
      "telemetry",
      require("./lib/schema/Trace")({ env }),
      "telemetry"
    );
    return collection;
  }
  return {
    Credentials: getCredentialsSchema(),
    Trace: getTraceSchema(),
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
      path: "/api/v1/login",
      router: createLoginApi({ env, Credentials: schemas.Credentials }).router,
    },
  ];

  return {
    env,
    aggregators,
    components,
    apis,
    telemetry,
    schemas
  };
}

module.exports = createConfig;
