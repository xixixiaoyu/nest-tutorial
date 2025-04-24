import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // 应用全局中间件 (注意：全局中间件无法访问 DI 容器)
  // app.use(functionalLogger);

  console.log('应用将在 http://localhost:3000 启动');
  await app.listen(3000);
}
bootstrap();
