import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { NestExpressApplication } from '@nestjs/platform-express';
import { join } from 'path';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);

  // 配置静态文件服务
  app.useStaticAssets(join(__dirname, '..', 'public'), {
    prefix: '/static/',
  });

  // 启用 CORS（可选，用于前端测试）
  app.enableCors();

  await app.listen(process.env.PORT ?? 3000);
  console.log(`应用程序运行在: http://localhost:${process.env.PORT ?? 3000}`);
  console.log(
    `静态文件访问: http://localhost:${process.env.PORT ?? 3000}/static/`,
  );
}
bootstrap();
