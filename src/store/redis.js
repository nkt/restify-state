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
    const key = `${this.prefix}${id}`;

    return Store.serialize(data).then((data) => {
      return this.client.setAsync(key, data);
    });
  }

  /**
   * Get session by id.
   * @param {string} id
   * @returns {Promise}
   */
  get(id) {
    const key = `${this.prefix}${id}`;

    return this.client.getAsync(key).then((data) => {
      return Store.deserialize(data);
    });
  }

  /**
   * Destroy session by id.
   * @param {string} id
   * @returns {Promise}
   */
  destroy(id) {
    const key = `${this.prefix}${id}`;

    return this.client.delAsync(key);
  }
}

module.exports = RedisStore;
