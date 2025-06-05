import { Controller, Get, Param } from '@nestjs/common';
import { DynamicService, TransientService } from './dynamic.service';

@Controller('dynamic')
export class DynamicController {
  constructor(
    private readonly dynamicService: DynamicService,
    private readonly transientService: TransientService,
  ) {}

  @Get('manual-instantiation')
  async demonstrateManualInstantiation() {
    return this.dynamicService.demonstrateManualInstantiation();
  }

  @Get('conditional/:serviceName')
  async demonstrateConditionalInjection(
    @Param('serviceName') serviceName: string,
  ) {
    return this.dynamicService.demonstrateConditionalInjection(serviceName);
  }

  @Get('transient-demo')
  getTransientDemo() {
    return {
      message: '这是通过构造函数注入的 TransientService 实例',
      instanceId: this.transientService.getInstanceId(),
      note: '每次请求这个端点，都会显示相同的实例 ID，因为它是通过构造函数注入的',
    };
  }

  @Get('scope-comparison')
  async compareDifferentScopes() {
    // 通过手动解析获取新的瞬态实例
    const manualResult =
      await this.dynamicService.demonstrateManualInstantiation();

    return {
      message: '作用域对比演示',
      constructorInjectedTransientId: this.transientService.getInstanceId(),
      manuallyResolvedTransientIds: {
        instance1: manualResult.results.transientInstance1Id,
        instance2: manualResult.results.transientInstance2Id,
      },
      explanation: {
        constructor: '构造函数注入的瞬态服务在控制器生命周期内保持相同',
        manual: '手动解析的瞬态服务每次都创建新实例',
      },
    };
  }
}
