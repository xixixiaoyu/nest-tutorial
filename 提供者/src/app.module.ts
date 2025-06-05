import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { CatsModule } from './cats.module';
import { AdvancedProvidersModule } from './advanced-providers.module';

@Module({
  imports: [
    CatsModule, // 猫咪管理模块
    AdvancedProvidersModule, // 高级提供者演示模块
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
