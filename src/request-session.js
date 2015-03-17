class RequestSession {
  constructor(id, data) {
    Object.defineProperty(this, 'id', {
      value: id
    });
    Object.assign(this, data);
  }
}

module.exports = RequestSession;
