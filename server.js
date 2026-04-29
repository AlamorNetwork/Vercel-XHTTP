const express = require('express');
const { createProxyMiddleware } = require('http-proxy-middleware');

const app = express();
const PORT = process.env.PORT || 3000;
const TARGET_BASE = process.env.TARGET_DOMAIN;

if (!TARGET_BASE) {
    console.error("Misconfigured: TARGET_DOMAIN is not set");
    process.exit(1);
}

app.use('/', createProxyMiddleware({
    target: TARGET_BASE,
    changeOrigin: true,
    ws: true, // پشتیبانی از وب‌سوکت در صورت نیاز
    onProxyReq: (proxyReq, req, res) => {
        if (req.headers['x-real-ip']) {
            proxyReq.setHeader('x-forwarded-for', req.headers['x-real-ip']);
        }
    }
}));

app.listen(PORT, () => {
    console.log(`Relay is running on port ${PORT}`);
});
