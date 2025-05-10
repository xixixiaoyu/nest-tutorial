import { Module } from '@nestjs/common';
import { CatsController } from './cats.controller';
import { CatsService } from './cats.service';

@Module({
  controllers: [CatsController],
  providers: [CatsService],
  // 导出 CatsService，使其可以在导入此模块的其他模块中使用
  exports: [CatsService],
})
export class CatsModule {
  // 在模块类中注入服务
  constructor(private catsService: CatsService) {
    console.log('CatsModule initialized! CatsService instance available here.');
    // 你可以在这里使用 this.catsService 进行一些模块级别的初始化或配置
  }
}
