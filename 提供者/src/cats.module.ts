import { Module } from '@nestjs/common';
import { CatsController } from './cats.controller';
import { CatsService } from './cats.service';

@Module({
  controllers: [CatsController],
  providers: [CatsService], // 在这里注册服务
  exports: [CatsService], // 如果其他模块需要使用，记得导出
})
export class CatsModule {}
