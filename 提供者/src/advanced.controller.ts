import { Controller, Get, Inject, Optional } from '@nestjs/common';
import { ConfigService, RequestContextService } from './config.service';

@Controller('advanced')
export class AdvancedController {
  // 属性注入示例
  @Inject('APP_CONFIG')
  private readonly appConfig: any;

  @Inject('LOGGER')
  private readonly logger: any;

  constructor(
    private readonly configService: ConfigService,
    private readonly requestContext: RequestContextService,
    @Inject('ASYNC_DB_CONNECTION') private readonly dbConnection: any,
    @Optional()
    @Inject('OPTIONAL_SERVICE')
    private readonly optionalService?: any,
  ) {
    this.logger.log('AdvancedController 初始化完成');
  }

  @Get('config')
  getConfig() {
    return {
      appConfig: this.appConfig,
      maxAge: this.configService.get('cats.maxAge'),
      defaultBreed: this.configService.get('cats.defaultBreed'),
    };
  }

  @Get('request-info')
  getRequestInfo() {
    return {
      requestId: this.requestContext.getRequestId(),
      elapsedTime: this.requestContext.getElapsedTime(),
      message: '每个请求都会创建新的 RequestContextService 实例',
    };
  }

  @Get('database')
  async getDatabaseInfo() {
    this.logger.log('获取数据库信息');
    return {
      connection: {
        host: this.dbConnection.host,
        port: this.dbConnection.port,
        database: this.dbConnection.database,
        connected: this.dbConnection.connected,
      },
      message: '这是通过异步提供者创建的数据库连接',
    };
  }

  @Get('optional-service')
  getOptionalServiceInfo() {
    return {
      hasOptionalService: !!this.optionalService,
      message: this.optionalService
        ? '可选服务已注入'
        : '可选服务未注入，但应用仍然正常运行',
    };
  }

  @Get('demo')
  async runDemo() {
    this.logger.log('开始演示高级提供者功能');

    // 演示数据库查询
    await this.dbConnection.query('SELECT * FROM cats');

    return {
      message: '高级提供者演示完成',
      features: [
        '异步提供者（数据库连接）',
        '值提供者（应用配置）',
        '工厂提供者（日志服务）',
        '请求作用域服务',
        '可选依赖注入',
        '属性注入',
      ],
    };
  }
}
