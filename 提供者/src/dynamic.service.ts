import { Injectable, Scope } from '@nestjs/common';
import { ModuleRef } from '@nestjs/core';
import { CatsService } from './cats.service';
import { ConfigService } from './config.service';

// 演示瞬态作用域
@Injectable({ scope: Scope.TRANSIENT })
export class TransientService {
  private readonly instanceId: string;

  constructor() {
    this.instanceId = Math.random().toString(36).substr(2, 9);
    console.log(`TransientService 实例创建，ID: ${this.instanceId}`);
  }

  getInstanceId(): string {
    return this.instanceId;
  }
}

@Injectable()
export class DynamicService {
  constructor(private moduleRef: ModuleRef) {}

  async demonstrateManualInstantiation() {
    console.log('演示手动获取实例...');

    // 获取单例服务实例
    const catsService = this.moduleRef.get(CatsService);
    const configService = this.moduleRef.get(ConfigService);

    console.log('获取到 CatsService 实例:', !!catsService);
    console.log('获取到 ConfigService 实例:', !!configService);

    // 获取瞬态服务的新实例
    const transientService1 = await this.moduleRef.resolve(TransientService);
    const transientService2 = await this.moduleRef.resolve(TransientService);

    console.log(
      'TransientService 实例 1 ID:',
      transientService1.getInstanceId(),
    );
    console.log(
      'TransientService 实例 2 ID:',
      transientService2.getInstanceId(),
    );
    console.log('两个实例是否相同:', transientService1 === transientService2);

    // 使用获取到的服务
    const allCats = catsService.findAll();
    const appName = configService.get('app.name');

    return {
      message: '手动实例化演示完成',
      results: {
        catsCount: allCats.length,
        appName,
        transientInstance1Id: transientService1.getInstanceId(),
        transientInstance2Id: transientService2.getInstanceId(),
        instancesAreDifferent: transientService1 !== transientService2,
      },
    };
  }

  async demonstrateConditionalInjection(serviceName: string) {
    console.log(`尝试动态获取服务: ${serviceName}`);

    try {
      let service;
      switch (serviceName) {
        case 'cats':
          service = this.moduleRef.get(CatsService);
          return {
            serviceName,
            available: true,
            info: `找到 ${service.findAll().length} 只猫咪`,
          };
        case 'config':
          service = this.moduleRef.get(ConfigService);
          return {
            serviceName,
            available: true,
            info: `应用名称: ${service.get('app.name')}`,
          };
        default:
          return {
            serviceName,
            available: false,
            info: '未知的服务名称',
          };
      }
    } catch (error) {
      return {
        serviceName,
        available: false,
        error: error.message,
      };
    }
  }
}
