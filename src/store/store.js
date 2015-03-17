const {EventEmitter} = require('events')
const Promise = require('bluebird');

class Store extends EventEmitter {
  static serialize(data) {
    try {
      return Promise.resolve(JSON.stringify(data));
    } catch (e) {
      return Promise.reject(e);
    }
  }

  static deserialize(data) {
    try {
      return Promise.resolve(JSON.parse(data));
    } catch (e) {
      return Promise.reject(e);
    }
  }
}

module.exports = Store;
