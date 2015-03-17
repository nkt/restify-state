Restify state
=============

Module provides middlewares for saving state between requests for restify.

Installation
------------

```
npm install restify-state
```

Usage
-----

```js
const restify = require('restify');
const restifyState = require('restify-state');

let server = restify.createServer({
  name: 'app'
});

server.use(restifyState.cookieParser());
server.use(restifyState.session({ // default
  name: 'user_session',
  proxy: false,
  store: null,
  path: '/',
  domain: '',
  lifetime: 30 * 24 * 60 * 60,
  secure: false
}));


server.get('/counter', (req, res) => {
  if (req.session.counter) {
    req.session.counter++;
  } else {
    req.session.counter = 1;
  }

  res.send({
    counter: req.session.counter
  });
});
```

License
-------
MIT
