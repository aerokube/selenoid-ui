const { createProxyMiddleware } = require("http-proxy-middleware");

const http = require("http");
const agent = new http.Agent({
    maxSockets: Number.MAX_VALUE,
    keepAlive: true,
    keepAliveMsecs: 1000,
});

module.exports = function (app) {
    app.use(
        createProxyMiddleware("/events", {
            target: "http://localhost:8080",
            headers: { Connection: "keep-alive" },
            agent: agent,
        })
    );
    app.use(createProxyMiddleware("/clipboard", { target: "http://selenoid:4444" }));
    app.use(createProxyMiddleware("/status", { target: "http://localhost:8080" }));
    app.use(createProxyMiddleware("/video/", { target: "http://localhost:8080" }));
    app.use(createProxyMiddleware("/wd/hub/", { target: "http://localhost:8080" }));
    app.use(createProxyMiddleware("/ws", { target: "http://localhost:8080/", ws: true }));
    app.use(
        createProxyMiddleware("/vnc/", {
            target: "http://localhost:3000/",
            pathRewrite: { "^/vnc/": "" },
            ws: true,
        })
    );
    app.use(
        createProxyMiddleware("/log/", {
            target: "http://localhost:3000/",
            pathRewrite: { "^/log/": "" },
            ws: true,
        })
    );
};
