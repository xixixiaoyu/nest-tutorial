import {
  Controller,
  Get,
  HttpException,
  HttpStatus,
  BadRequestException,
  ForbiddenException,
  Post,
  UseFilters,
  Body,
} from '@nestjs/common';
import { AppService } from './app.service';
// 导入稍后将创建的过滤器和异常
import { HttpExceptionFilter } from './common/filters/http-exception.filter';
import { CustomForbiddenException } from './common/exceptions/forbidden.exception';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  // 演示抛出标准 HttpException
  @Get('forbidden')
  throwForbidden() {
    throw new HttpException('Forbidden', HttpStatus.FORBIDDEN);
  }

  // 演示抛出带自定义响应体和原因的 HttpException
  @Get('forbidden-custom')
  throwForbiddenCustom() {
    try {
      // 模拟一个可能出错的操作
      throw new Error('内部错误导致禁止访问');
    } catch (error) {
      throw new HttpException(
        { status: HttpStatus.FORBIDDEN, error: '无权访问此资源' },
        HttpStatus.FORBIDDEN,
        { cause: error },
      );
    }
  }

  // 演示抛出内置 BadRequestException
  @Get('bad-request')
  throwBadRequest() {
    throw new BadRequestException('参数无效', {
      cause: new Error(),
      description: '请检查输入参数',
    });
  }

  // 演示抛出内置 ForbiddenException
  @Get('forbidden-builtin')
  throwForbiddenBuiltin() {
    throw new ForbiddenException('禁止访问内置异常');
  }

  // 演示方法作用域过滤器
  @Post('create-forbidden')
  @UseFilters(new HttpExceptionFilter()) // 应用方法作用域过滤器
  async createForbidden(@Body() createDto: any) {
    console.log('DTO:', createDto); // 假设有 DTO
    // 抛出自定义异常或内置异常
    throw new CustomForbiddenException();
    // 或者 throw new ForbiddenException('来自方法作用域过滤器的禁止访问');
  }

  // 演示抛出未捕获的错误 (将被全局过滤器捕获)
  @Get('unhandled')
  throwUnhandledError() {
    throw new Error('这是一个未处理的错误');
  }
}
