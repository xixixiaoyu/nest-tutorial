import { Module } from '@nestjs/common';
import { ConfigService, RequestContextService } from './config.service';
import { AdvancedController } from './advanced.controller';
import { DynamicController } from './dynamic.controller';
import { DynamicService, TransientService } from './dynamic.service';

// 模拟异步数据库连接
const createAsyncConnection = async () => {
  console.log('正在建立数据库连接...');
  // 模拟异步操作
  await new Promise((resolve) => setTimeout(resolve, 1000));
  console.log('数据库连接成功！');
  return {
    host: 'localhost',
    port: 5432,
    database: 'cats_db',
    connected: true,
    query: (sql: string) => {
      console.log(`执行 SQL: ${sql}`);
      return Promise.resolve([]);
    },
  };
};

@Module({
  controllers: [AdvancedController, DynamicController],
  providers: [
    ConfigService,
    RequestContextService,
    DynamicService,
    TransientService,
    // 异步提供者示例
    {
      provide: 'ASYNC_DB_CONNECTION',
      useFactory: async () => {
        const connection = await createAsyncConnection();
        return connection;
      },
    },
    // 值提供者示例
    {
      provide: 'APP_CONFIG',
      useValue: {
        name: '猫咪管理系统',
        version: '1.0.0',
        author: 'NestJS 学习者',
      },
    },
    // 工厂提供者示例
    {
      provide: 'LOGGER',
      useFactory: (config: ConfigService) => {
        const appName = config.get('app.name');
        return {
          log: (message: string) => {
            console.log(
              `[${appName}] ${new Date().toISOString()} - ${message}`,
            );
          },
          error: (message: string) => {
            console.error(
              `[${appName}] ${new Date().toISOString()} - ERROR: ${message}`,
            );
          },
        };
      },
      inject: [ConfigService], // 注入依赖
    },
    // 类提供者的别名示例
    {
      provide: 'CONFIG_SERVICE_ALIAS',
      useExisting: ConfigService,
    },
  ],
  exports: [
    ConfigService,
    RequestContextService,
    DynamicService,
    TransientService,
    'ASYNC_DB_CONNECTION',
    'APP_CONFIG',
    'LOGGER',
    'CONFIG_SERVICE_ALIAS',
  ],
})
export class AdvancedProvidersModule {}
