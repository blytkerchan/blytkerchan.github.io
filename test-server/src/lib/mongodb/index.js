const { depromisify } = require("depromisify");
const mongoose = require("mongoose");

async function createMongoClientAsync(databaseConnection) {
  mongoose.set("strictQuery", true);
  const client = await mongoose.connect(databaseConnection.url, {
    dbName: databaseConnection.db,
  });
  return {
    collection: (modelName, schema, collectionName) => {
      return client.model(modelName, schema, collectionName);
    },
  };
}

module.exports = (databaseConnection) =>
  depromisify(createMongoClientAsync(databaseConnection));
