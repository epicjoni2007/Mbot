import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { createProxyMiddleware } from 'http-proxy-middleware';

@Injectable()
export class ProxyMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: NextFunction) {
    if (req.url.startsWith('/mbot')) {
      // Direkt die Proxy-Middleware aufrufen, ohne sie als Property zu speichern
      const proxy = createProxyMiddleware({
        target: 'http://localhost:3500', // Ziel-Backend
        changeOrigin: true,
        pathRewrite: { '^/mbot': '' }, // "/api" entfernen
      });

      proxy(req, res, next);
    } else {
      next();
    }
  }
}
