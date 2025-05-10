import { Request, Response, NextFunction } from 'express';

export function functionalLogger(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  console.log(`[函数式中间件] 请求进入: ${req.method} ${req.originalUrl}`);
  next();
}
