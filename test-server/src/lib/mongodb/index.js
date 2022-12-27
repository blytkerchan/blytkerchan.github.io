const { depromisify } = require("depromisify");
const { MongoClient } = require("mongodb");

async function createMongoClientAsync(databaseConnection) {
  const client = new MongoClient(databaseConnection.url);
  await client.connect();
  const db = client.db(databaseConnection.db);

  return {
    collection: (collectionName) => {
      return db.collection(collectionName);
    },
  };
}

module.exports = (databaseConnection) =>
  depromisify(createMongoClientAsync(databaseConnection));
