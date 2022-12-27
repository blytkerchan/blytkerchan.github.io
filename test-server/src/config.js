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

function getCollections(db) {
  function getCredentialsCollection() {
    const collection = db.collection("credentials");
    collection.createIndex({ username: 1 }, { unique: true });
    return collection;
  }
  function getTelemetryCollection() {
    const collection = db.collection("telemetry");
    return collection;
  }
  return {
    credentials: getCredentialsCollection(),
    telemetry: getTelemetryCollection(),
  };
}

function createConfig({ env }) {
  const db = connectToDatabase(env.db);

  const collections = getCollections(db);

  const telemetry = createTelemetry({ env, db: collections.telemetry });

  const aggregators = [];
  const components = [];
  const apis = [
    // expects entries in the form of { path: '/', router: ... }
    { path: "/api/v1/version", router: createVersionApi({ env }).router },
    { path: "/api/v1/login", router: createLoginApi({ env, db: collections.credentials }).router },
  ];

  return {
    env,
    aggregators,
    components,
    apis,
    telemetry,
  };
}

module.exports = createConfig;
