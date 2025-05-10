import { Module } from '@nestjs/common';
import { CatsController } from './controller/cats/cats.controller';
import { CatsService } from './controller/cats/cats.service'; // 导入 CatsService

@Module({
  controllers: [CatsController],
  providers: [CatsService], // 将 CatsService 添加到 providers 数组
})
export class AppModule {}
