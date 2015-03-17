const Promise = require('bluebird');
const Store = require('./store');

class RedisStore extends Store {
  /**
   * @param {RedisClient} redis
   * @param {string} prefix
   */
  constructor(redis, prefix = 'sess:') {
    this.client = Promise.promisifyAll(redis);
    this.prefix = prefix;
  }

  /**
   * Set session data by id.
   * @param {string} id
   * @param {object} data
   * @returns {Promise}
   */
  set(id, data) {
    return Store.serialize(data).then((data) => {
      return this.client.setAsync(id, data);
    });
  }

  /**
   * Get session by id.
   * @param {string} id
   * @returns {Promise}
   */
  get(id) {
    return this.client.getAsync(id).then((data) => {
      return Store.deserialize(data);
    });
  }

  /**
   * Destroy session by id.
   * @param {string} id
   * @returns {Promise}
   */
  destroy(id) {
    return this.client.delAsync(id);
  }
}

module.exports = RedisStore;
