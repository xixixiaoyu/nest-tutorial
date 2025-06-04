// cats/cats.controller.ts
import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  Query,
  Headers,
  Ip,
  HttpCode,
  Header,
  Redirect,
  Res,
} from '@nestjs/common';
import { Response } from 'express';
import { CreateCatDto } from '../dto/create-cat.dto';

@Controller('cats') // 设置基础路径为 /cats
export class CatsController {
  // ========== 基础路由示例 ==========

  /**
   * 获取所有猫咪 - 基础 GET 请求
   * 路径：GET /cats
   */
  @Get()
  findAll(): any {
    // 返回对象时，Nest 会自动转换为 JSON
    return {
      message: '获取所有猫咪成功',
      data: [
        { id: 1, name: '小白', age: 2, breed: '英短' },
        { id: 2, name: '小黑', age: 3, breed: '美短' },
        { id: 3, name: '橘猫', age: 1, breed: '田园猫' },
      ],
    };
  }

  /**
   * 获取所有猫咪品种 - 静态路由
   * 路径：GET /cats/breeds
   * 注意：静态路由要放在动态路由之前！
   */
  @Get('breeds')
  findAllBreeds(): string[] {
    return ['英国短毛猫', '美国短毛猫', '波斯猫', '暹罗猫', '布偶猫'];
  }

  /**
   * 获取纯文本响应
   * 路径：GET /cats/text
   */
  @Get('text')
  getText(): string {
    // 返回基本类型时，直接发送原始值
    return '这是纯文本响应，不会被转换为 JSON';
  }

  // ========== 路由参数示例 ==========

  // ========== 查询参数示例 ==========

  /**
   * 搜索猫咪 - 查询参数
   * 路径：GET /cats/search?limit=10&breed=英短&minAge=1
   */
  @Get('search')
  searchCats(
    @Query('limit') limit: string,
    @Query('breed') breed: string,
    @Query('minAge') minAge: string,
  ): any {
    return {
      message: '搜索猫咪',
      filters: {
        limit: limit || '不限制',
        breed: breed || '所有品种',
        minAge: minAge || '不限制年龄',
      },
      data: [{ id: 1, name: '小白', age: 2, breed: '英短' }],
    };
  }

  // ========== POST 请求和请求体示例 ==========

  /**
   * 添加新猫咪 - POST 请求
   * 路径：POST /cats
   * 请求体：{ "name": "小花", "age": 1, "breed": "波斯猫" }
   */
  @Post()
  async create(@Body() createCatDto: CreateCatDto): Promise<any> {
    console.log('接收到的猫咪数据：', createCatDto);

    // 模拟保存到数据库
    const newCat = {
      id: Date.now(), // 简单的 ID 生成
      ...createCatDto,
      createdAt: new Date().toISOString(),
    };

    return {
      message: '成功添加了一只新猫咪！',
      data: newCat,
    };
  }

  // ========== PUT 请求示例 ==========

  /**
   * 更新猫咪信息 - PUT 请求
   * 路径：PUT /cats/123
   */
  @Put(':id')
  update(@Param('id') id: string, @Body() updateCatDto: CreateCatDto): any {
    return {
      message: `成功更新 ID 为 ${id} 的猫咪信息`,
      data: {
        id,
        ...updateCatDto,
        updatedAt: new Date().toISOString(),
      },
    };
  }

  // ========== DELETE 请求示例 ==========

  /**
   * 删除猫咪 - DELETE 请求
   * 路径：DELETE /cats/123
   */
  @Delete(':id')
  @HttpCode(204) // 自定义状态码：204 No Content
  remove(@Param('id') id: string): void {
    console.log(`删除 ID 为 ${id} 的猫咪`);
    // 删除成功，不返回内容
  }

  // ========== 获取请求详细信息示例 ==========

  /**
   * 获取请求详细信息
   * 路径：GET /cats/request-info
   */
  @Get('request-info')
  getRequestInfo(
    @Headers() headers: any,
    @Headers('user-agent') userAgent: string,
    @Ip() ip: string,
    @Query() query: any,
  ): any {
    return {
      message: '请求详细信息',
      data: {
        clientIp: ip,
        userAgent: userAgent,
        allHeaders: headers,
        queryParams: query,
      },
    };
  }

  // ========== 自定义响应头示例 ==========

  /**
   * 设置自定义响应头
   * 路径：POST /cats/with-headers
   */
  @Post('with-headers')
  @HttpCode(200) // 自定义状态码，默认是 201
  @Header('Cache-Control', 'no-store') // 设置响应头，完全禁止缓存
  @Header('X-Custom-Header', 'NestJS-Tutorial')
  createWithHeaders(@Body() createCatDto: CreateCatDto): any {
    return {
      message: '创建成功，并设置了自定义响应头',
      data: createCatDto,
    };
  }

  // ========== 重定向示例 ==========

  /**
   * 重定向到文档
   * 路径：GET /cats/docs
   */
  @Get('docs')
  @Redirect('https://docs.nestjs.com', 301)
  getDocs(@Query('version') version: string) {
    // 动态重定向
    if (version && version === '5') {
      return {
        url: 'https://docs.nestjs.com/v5/',
        statusCode: 302,
      };
    }
    // 如果没有返回值，使用装饰器中的默认重定向
  }

  // ========== 路由通配符示例 ==========

  /**
   * 通配符路由
   * 路径：GET /cats/ab*cd (匹配 abcd、ab_cd、abXYZcd 等)
   */
  @Get('ab*cd')
  wildcardRoute(): string {
    return '这是通配符匹配的路由！';
  }

  // ========== 特定于库的响应方式示例 ==========

  /**
   * 使用 Express 响应对象
   * 路径：GET /cats/express-style
   */
  @Get('express-style')
  expressStyle(@Res() response: Response): void {
    // 直接使用 Express 的响应对象
    response.status(200).cookie('tutorial', 'nestjs-controller').json({
      message: '使用 Express 风格的响应',
      timestamp: new Date().toISOString(),
    });
  }

  /**
   * 使用 passthrough 模式
   * 路径：GET /cats/passthrough
   */
  @Get('passthrough')
  passthroughMode(@Res({ passthrough: true }) response: Response): any {
    // 设置 Cookie 和 Header，但仍然让 Nest 处理响应体
    response.cookie('mode', 'passthrough');
    response.header('X-Response-Mode', 'Passthrough');

    return {
      message:
        'Passthrough 模式：设置了 Cookie 和 Header，但响应体由 Nest 处理',
    };
  }

  // ========== 异步处理示例 ==========

  /**
   * 异步获取猫咪数据
   * 路径：GET /cats/async
   */
  @Get('async')
  async getAsyncCats(): Promise<any> {
    // 模拟异步数据库查询
    await new Promise((resolve) => setTimeout(resolve, 1000));

    return {
      message: '异步获取猫咪数据完成',
      data: [{ id: 1, name: '异步小猫', age: 1, breed: '异步品种' }],
      timestamp: new Date().toISOString(),
    };
  }

  /**
   * 根据 ID 获取单个猫咪 - 动态路由
   * 路径：GET /cats/123
   */
  @Get(':id')
  findOne(@Param('id') catId: string): any {
    return {
      message: `获取 ID 为 ${catId} 的猫咪信息`,
      data: {
        id: catId,
        name: '小白',
        age: 2,
        breed: '英短',
      },
    };
  }
}
