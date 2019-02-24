const proxy = require('http-proxy-middleware');

const http = require('http');
const agent = new http.Agent({
  maxSockets: Number.MAX_VALUE,
  keepAlive: true,
  keepAliveMsecs: 1000,
});

module.exports = function (app) {
  app.use(proxy('/events', {target: 'http://localhost:8080', headers: {Connection: 'keep-alive'}, agent: agent}));
  app.use(proxy('/status', {target: 'http://localhost:8080'}));
  app.use(proxy('/ws', {target: 'http://localhost:8080/', ws: true}));
  app.use(proxy('/vnc/', {target: 'http://localhost:3000/', pathRewrite: {"^/vnc/": ""}, ws: true}));
  app.use(proxy('/log/', {target: 'http://localhost:3000/', pathRewrite: {"^/log/": ""}, ws: true}));
};