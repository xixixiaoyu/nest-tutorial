import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';

@Injectable()
export class LoggerMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: NextFunction) {
    console.log(`[类中间件] 请求进入: ${req.method} ${req.originalUrl}`);
    const start = Date.now();
    res.on('finish', () => {
      const duration = Date.now() - start;
      console.log(`[类中间件] 请求完成: ${res.statusCode} - ${duration}ms`);
    });
    next();
  }
}
