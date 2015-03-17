const Promise = require('bluebird');
const Store = require('./store');

/**
 * Stores sessions in memory.
 */
class MemoryStore extends Store {
  constructor() {
    this.sessions = Object.create(null);
  }

  /**
   * @returns {number}
   */
  get length() {
    return Object.keys(this.sessions).length;
  }

  /**
   * Set session data by id.
   * @param {string} id
   * @param {object} data
   * @returns {Promise}
   */
  set(id, data) {
    return Store.serialize(data).then((data) => {
      this.sessions[id] = data;
    });
  }

  /**
   * Get session by id.
   * @param {string} id
   * @returns {Promise}
   */
  get(id) {
    if (!(id in this.sessions)) {
      return Promise.resolve();
    }

    return Store.deserialize(this.sessions[id]);
  }

  /**
   * Destroy session by id.
   * @param {string} id
   * @returns {Promise}
   */
  destroy(id) {
    delete this.sessions[id];
    return Promise.resolve();
  }

  /**
   * Destroy all sessions.
   * @returns {Promise}
   */
  clear() {
    this.sessions = Object.create(null);
    return Promise.resolve();
  }
}

module.exports = MemoryStore;
