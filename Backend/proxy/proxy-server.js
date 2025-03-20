const express = require('express');
const { createProxyMiddleware } = require('http-proxy-middleware');
const cors = require('cors');

const app = express();
app.use(cors());

// Proxy requests to the NestJS backend
app.use('/api', createProxyMiddleware({
    target: 'http://localhost:3500',  // NestJS backend URL
    changeOrigin: true,
    pathRewrite: { '^/api': '' }, // Remove "/api" prefix before forwarding
}));

app.listen(5000, () => {
    console.log('Proxy server running on http://localhost:5000');
});
