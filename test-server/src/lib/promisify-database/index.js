function promisifyDatabase(db) {
  return {
    insert: (doc) => {
      return new Promise((resolve, reject) => {
        db.insert(doc, (err, newDoc) => {
          if (err) {
            reject(err);
          } else {
            resolve(newDoc);
          }
        });
      });
    },
    update: (query, update, options) => {
      return new Promise((resolve, reject) => {
        db.update(query, update, options, (err, numAffected, affectedDocuments, upsert) => {
          if (err) {
            reject(err);
          } else {
            resolve({ numAffected, affectedDocuments, upsert });
          }
        });
      });
    },
    find: (query) => {
      return new Promise((resolve, reject) => {
        db.find(query, (err, docs) => {
          if (err) {
            reject(err);
          } else {
            resolve(docs);
          }
        });
      });
    },
    count: (query) => {
      return new Promise((resolve, reject) => {
        db.count(query, (err, count) => {
          if (err) {
            reject(err);
          } else {
            resolve(count);
          }
        });
      });
    },
    remove: (query, options) => {
      return new Promise((resolve, reject) => {
        db.remove(query, options, (err, numRemoved) => {
          if (err) {
            reject(err);
          } else {
            resolve(numRemoved);
          }
        });
      });
    },
    ensureIndex: (options) => {
      return new Promise((resolve, reject) => {
        db.ensureIndex(options, (err) => {
          if (err) {
            reject(err);
          } else {
            resolve();
          }
        });
      });
    },
  };
}

module.exports = promisifyDatabase;
