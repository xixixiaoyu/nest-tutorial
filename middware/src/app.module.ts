import {
  Module,
  NestModule,
  MiddlewareConsumer,
  RequestMethod,
} from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { CatsModule } from './cats/cats.module';
import { LoggerMiddleware } from './common/middleware/logger.middleware';
import { functionalLogger } from './common/middleware/functional-logger.middleware';
import { CatsController } from './cats/cats.controller';

@Module({
  imports: [CatsModule], // 导入 CatsModule
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    // 1. 应用类中间件到 'cats' 路由
    // consumer
    //   .apply(LoggerMiddleware)
    //   .forRoutes('cats');

    // 2. 应用类中间件到特定请求方法 (GET /cats)
    // consumer
    //   .apply(LoggerMiddleware)
    //   .forRoutes({ path: 'cats', method: RequestMethod.GET });

    // 3. 应用类中间件到整个 CatsController
    // consumer
    //   .apply(LoggerMiddleware)
    //   .forRoutes(CatsController);

    // 4. 应用多个中间件 (类和函数式) 到 CatsController
    // consumer
    //   .apply(LoggerMiddleware, functionalLogger)
    //   .forRoutes(CatsController);

    // 5. 应用中间件并使用通配符
    // consumer
    //   .apply(LoggerMiddleware)
    //   .forRoutes('cats/*');

    // 6. 应用中间件并排除特定路由
    consumer
      .apply(LoggerMiddleware, functionalLogger) // 应用两个中间件
      .exclude(
        { path: 'cats', method: RequestMethod.POST }, // 排除 POST /cats
        'cats/special', // 排除 GET /cats/special (路径字符串)
        { path: 'cats/:id', method: RequestMethod.GET }, // 排除 GET /cats/:id
      )
      .forRoutes(CatsController); // 应用到 CatsController 的其余路由
  }
}
