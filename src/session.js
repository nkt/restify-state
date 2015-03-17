const crypto = require('crypto');
const defaults = require('lodash.defaults');
const RequestSession = require('./request-session');
const MemoryStore = require('./store/memory');

function sha1(str) {
  return crypto.createHash('sha1').update(str).digest('hex');
}

function generateSessionId(req) {
  const now = Date.now();
  const ip = req.connection.remoteAddress;
  const userAgent = req.headers['user-agent'];
  const random = crypto.randomBytes(64).toString();
  return sha1(`${now}${ip}${userAgent}${random}`);
}

/**
 * @param {object} [options] Session options
 * @param {string} [options.name] The cookie name of the session id.
 * @param {boolean} [options.proxy] Should we trust proxies.
 * @param {Store} [options.store] The instance of Store implementation.
 * @param {string} [options.path] The session cookie path.
 * @param {string} [options.domain] The session cookie domain.
 * @param {number} [options.lifetime] The session cookie lifetime in seconds.
 * @param {number} [options.secure] The session cookie secure.
 * @returns {Function}
 */
function session(options) {
  const config = defaults(options, {
    name: 'user_session',
    proxy: false,
    store: null,
    path: '/',
    domain: '',
    lifetime: 30 * 24 * 60 * 60,
    secure: false
  });

  const cookieOptions = {
    path: config.path,
    domain: config.domain,
    maxAge: config.lifetime,
    httpOnly: true,
    secure: config.secure
  };

  const store = config.store || new MemoryStore();

  return function session(req, res, next) {
    if (typeof req.session !== 'undefined') {
      return next();
    }

    let id = req.cookies[config.name];
    if (typeof id === 'undefined') {
      id = generateSessionId(req);
      res.setCookie(config.name, id, cookieOptions);
    }

    store.get(id).then((data) => {
      req.session = new RequestSession(id, data);
      next();
    }).catch(next);

    res.on('finish', () => {
      store.set(id, req.session).catch((e) => {
        req.log.error('Failed write session: "%s"', e.message);
      });
    });
  };
}

module.exports = session;
