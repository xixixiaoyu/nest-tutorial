import { Catch, ArgumentsHost, Injectable } from '@nestjs/common';
import { BaseExceptionFilter } from '@nestjs/core';

/**
 * 继承基础过滤器的全局异常过滤器
 * 用于在默认处理逻辑前后添加自定义行为，例如日志记录
 */
@Catch() // 捕获所有异常
@Injectable() // 如果过滤器有依赖（如此处的 HttpAdapter），则需要此装饰器
export class LoggingAllExceptionsFilter extends BaseExceptionFilter {
  // BaseExceptionFilter 已经处理了 HttpAdapterHost 的注入，我们不需要显式注入
  // constructor(private readonly httpAdapterHost: HttpAdapterHost) {
  //   super(httpAdapterHost.httpAdapter); // 调用父类构造函数并传递 adapter
  // }

  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const request = ctx.getRequest();

    // 在调用基础过滤器处理之前添加自定义逻辑
    console.log(
      `[LoggingAllExceptionsFilter] Caught Exception at path: ${request.url}`,
    );
    console.error('[LoggingAllExceptionsFilter] Exception details:', exception);

    // 调用父类的 catch 方法，委托给 NestJS 的默认异常处理
    super.catch(exception, host);

    // 可以在调用父类方法后添加其他逻辑，例如记录响应状态
    // const response = ctx.getResponse();
    // console.log(`[LoggingAllExceptionsFilter] Response status: ${response.statusCode}`);
  }
}
