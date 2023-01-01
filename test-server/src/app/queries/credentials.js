function getCredentialsQueries({ Credentials }) {
    async function find(username) {
      const user = await Credentials.findOne({username});
      return user;
    }
    async function insert({username, hash, uid}) {
      const credentials = new Credentials({ username, hash, uid });
      await credentials.save();  
    }
  
    return { find, insert };
  }
  
  module.exports = getCredentialsQueries;
