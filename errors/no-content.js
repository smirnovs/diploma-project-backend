class NoContent extends Error {
  constructor(message) {
    super(message);
    this.statusCode = 204;
  }
}

module.exports = NoContent;
