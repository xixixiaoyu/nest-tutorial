// src/database/database.module.ts
import { Module, DynamicModule, Provider } from '@nestjs/common';

// 模拟数据库连接服务
export const CONNECTION = 'CONNECTION';
class MockConnection {
  constructor(private options: any) {
    console.log(`Database Connection Initialized with options:`, options);
  }
  query(sql: string) {
    console.log(`Executing query: ${sql}`);
    return `Result for: ${sql}`;
  }
}

// 模拟创建数据库提供者的函数
function createDatabaseProviders(options?: any, entities?: any[]): Provider[] {
  console.log('Creating database providers...');
  console.log('Entities:', entities);
  console.log('Options:', options);
  return [
    {
      provide: CONNECTION, // 使用常量作为注入令牌
      useValue: new MockConnection(options), // 创建模拟连接实例
    },
    // 可以根据 entities 创建更多的提供者，例如 Repository
  ];
}

@Module({})
export class DatabaseModule {
  static forRoot(entities = [], options?: any): DynamicModule {
    console.log('DatabaseModule.forRoot called');
    const providers = createDatabaseProviders(options, entities);
    return {
      module: DatabaseModule,
      providers: providers,
      exports: providers, // 导出提供者，以便其他模块可以使用连接
      // global: true, // 如果需要全局可用，取消注释此行
    };
  }
}
