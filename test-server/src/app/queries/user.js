function getCredentialsQueries({ User }) {
  async function find(uid) {
    const user = await User.findOne({ uid });
    return user;
  }
  async function insert({ uid, name, email }) {
    const user = new User({ uid, name, email, status: "Unconfirmed" });
    await user.save();
  }

  return { find, insert };
}

module.exports = getCredentialsQueries;
