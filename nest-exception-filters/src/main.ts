import { NestFactory, HttpAdapterHost } from '@nestjs/core';
import { AppModule } from './app.module';
import { AllExceptionsFilter } from './common/filters/all-exceptions.filter';
// import { LoggingAllExceptionsFilter } from './common/filters/logging-all-exceptions.filter';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // 获取 HttpAdapterHost 以便传递给全局过滤器
  const httpAdapterHost = app.get(HttpAdapterHost);

  // **方法一：应用 AllExceptionsFilter (捕获所有异常并自定义响应)**
  app.useGlobalFilters(new AllExceptionsFilter(httpAdapterHost));

  // **方法二：应用 LoggingAllExceptionsFilter (继承基础过滤器并添加日志)**
  // 注意：如果使用此过滤器，需要确保它已注入 HttpAdapterHost 或直接传递
  // const { httpAdapter } = app.get(HttpAdapterHost);
  // app.useGlobalFilters(new LoggingAllExceptionsFilter(httpAdapter)); // 如果构造函数需要 adapter
  // 或者如果 LoggingAllExceptionsFilter 使用 @Injectable() 并且 BaseExceptionFilter 处理注入:
  // app.useGlobalFilters(app.get(LoggingAllExceptionsFilter)); // 如果通过 DI 容器获取实例

  // **方法三：通过 APP_FILTER 提供全局过滤器 (在 app.module.ts 中配置)**
  // 这种方式更推荐，因为它允许依赖注入
  // 参考文档中 AppModule 的示例

  await app.listen(3000);
  console.log(`Application is running on: ${await app.getUrl()}`);
}
bootstrap();
