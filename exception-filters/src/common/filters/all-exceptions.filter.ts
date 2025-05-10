import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { HttpAdapterHost } from '@nestjs/core';

/**
 * 全局异常过滤器
 * 捕获所有未处理的异常（包括非 HttpException）
 * 使用 HttpAdapterHost 来确保与底层 HTTP 框架（如 Express 或 Fastify）的兼容性
 */
@Catch() // 空的 @Catch() 装饰器捕获所有异常
export class AllExceptionsFilter implements ExceptionFilter {
  // 注入 HttpAdapterHost 以便访问底层 HTTP 适配器
  constructor(private readonly httpAdapterHost: HttpAdapterHost) {}

  catch(exception: unknown, host: ArgumentsHost): void {
    // HttpAdapterHost 提供了对底层 HTTP 平台适配器的引用
    const { httpAdapter } = this.httpAdapterHost;

    const ctx = host.switchToHttp();
    const request = ctx.getRequest();
    const response = ctx.getResponse();

    // 判断异常类型，如果是 HttpException，则使用其状态码，否则默认为 500
    const httpStatus =
      exception instanceof HttpException
        ? exception.getStatus()
        : HttpStatus.INTERNAL_SERVER_ERROR;

    // 构建标准化的错误响应体
    const responseBody = {
      statusCode: httpStatus,
      timestamp: new Date().toISOString(),
      path: httpAdapter.getRequestUrl(request), // 使用适配器获取请求 URL
      method: httpAdapter.getRequestMethod(request), // 使用适配器获取请求方法
      message:
        exception instanceof HttpException
          ? (exception.getResponse() as any)?.message || exception.message // 尝试获取 HttpException 的消息
          : exception instanceof Error
            ? exception.message
            : 'Internal server error', // 获取标准 Error 的消息或默认消息
      // 可以根据需要添加更多信息，例如错误堆栈（仅开发环境）
      // stack: process.env.NODE_ENV === 'development' && exception instanceof Error ? exception.stack : undefined,
    };

    console.error(`[AllExceptionsFilter] Caught Exception:`, exception);

    // 使用 HTTP 适配器的 reply 方法发送响应，确保跨平台兼容性
    httpAdapter.reply(response, responseBody, httpStatus);
  }
}
