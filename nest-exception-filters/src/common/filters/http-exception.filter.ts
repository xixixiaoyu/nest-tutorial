import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
} from '@nestjs/common';
import { Request, Response } from 'express';

/**
 * HttpException 过滤器
 * 捕获 HttpException 类型的异常，并自定义响应格式
 */
@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter {
  catch(exception: HttpException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();
    const status = exception.getStatus();
    const exceptionResponse = exception.getResponse();

    // 提取原始错误信息（如果是对象形式）
    const errorMessage =
      typeof exceptionResponse === 'string'
        ? exceptionResponse
        : (exceptionResponse as any).message ||
          (exceptionResponse as any).error ||
          'Http Exception';

    console.log(
      `[HttpExceptionFilter] Caught HttpException: ${exception.message}, Status: ${status}, Path: ${request.url}`,
    );

    response.status(status).json({
      statusCode: status,
      timestamp: new Date().toISOString(),
      path: request.url,
      method: request.method,
      message: errorMessage, // 使用提取或默认的错误消息
      // 可以选择性地包含原始异常的详细信息（仅开发环境）
      // errorDetails: process.env.NODE_ENV === 'development' ? exception.getResponse() : undefined,
    });
  }
}
