import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const port = process.env.PORT ?? 3001;
  await app.listen(port);
  console.log(`\n🚀 应用已启动！`);
  console.log(`📍 服务地址: http://localhost:${port}`);
  console.log(`📖 查看演示说明: PROVIDERS_DEMO.md`);
}
bootstrap();
