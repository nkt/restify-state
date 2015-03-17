const cookie = require('cookie');

function cookieParser(req, res, next) {
  if (typeof req.headers.cookie !== 'undefined') {
    req.cookies = cookie.parse(req.headers.cookie);
  } else {
    req.cookies = {};
  }

  res.setCookie = function setCookie(name, value, options = {}) {
    let cookies = res.header('set-cookie') || [];

    cookies.push(cookie.serialize(name, value, options));
    res.header('set-cookie', cookies);

    return res;
  };

  next();
}

module.exports = () => cookieParser;
