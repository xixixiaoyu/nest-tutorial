import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { CatsModule } from './cats/cats.module';
import { DatabaseModule } from './database/database.module'; // 导入 DatabaseModule

// 模拟 User 实体，用于动态模块示例
class User {}

@Module({
  imports: [
    CatsModule, // 导入功能模块
    // 使用动态模块的 forRoot 方法进行配置
    DatabaseModule.forRoot([User], { url: 'localhost', port: 5432 }),
  ],
  controllers: [AppController],
  providers: [AppService],
  // 如果 CatsService 被导出，AppService 也可以注入它
  // providers: [AppService, CatsService], // AppService 无法直接注入 CatsService，除非 CatsModule 导出它
})
export class AppModule {}
