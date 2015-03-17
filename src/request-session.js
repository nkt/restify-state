class RequestSession {
  constructor(id, data) {
    Object.defineProperty(this, 'id', {
      value: id
    });
    Object.keys(data).forEach((key) => {
        this[key] = data[key];
    });
  }
}

module.exports = RequestSession;
