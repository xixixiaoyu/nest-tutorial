import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Query,
  Param,
  Headers,
  Ip,
  HttpCode,
  Header,
  Redirect,
  Res,
} from '@nestjs/common';
import { CreateCatDto } from '../dto/create-cat.dto';
import { UpdateCatDto } from '../dto/update-cat.dto';
import { QueryCatDto } from '../dto/query-cat.dto';
import { Response } from 'express';

// 模拟数据存储
interface Cat {
  id: number;
  name: string;
  age: number;
  breed: string;
  color?: string;
}

@Controller('cats') // 基础路径前缀: /cats
export class CatsController {
  // 模拟数据库
  private cats: Cat[] = [
    { id: 1, name: '小白', age: 2, breed: '英短', color: '白色' },
    { id: 2, name: '小黑', age: 3, breed: '美短', color: '黑色' },
    { id: 3, name: '橘猫', age: 1, breed: '田园猫', color: '橘色' },
  ];
  private nextId = 4;

  // 1. 基础 GET 请求 - 获取所有猫咪
  @Get() // 路径: GET /cats
  findAll(@Query() query: QueryCatDto): any {
    console.log('查询参数:', query);

    let result = [...this.cats];

    // 根据查询参数过滤
    if (query.breed) {
      result = result.filter((cat) => cat.breed.includes(query.breed));
    }
    if (query.minAge) {
      result = result.filter((cat) => cat.age >= query.minAge);
    }
    if (query.maxAge) {
      result = result.filter((cat) => cat.age <= query.maxAge);
    }

    // 分页
    if (query.offset) {
      result = result.slice(query.offset);
    }
    if (query.limit) {
      result = result.slice(0, query.limit);
    }

    return {
      data: result,
      total: this.cats.length,
      message: '成功获取猫咪列表',
    };
  }

  // 2. 带路由参数的 GET 请求 - 获取单只猫咪
  @Get(':id') // 路径: GET /cats/:id
  findOne(@Param('id') id: string): any {
    const catId = parseInt(id);
    const cat = this.cats.find((c) => c.id === catId);

    if (!cat) {
      return {
        error: '猫咪不存在',
        message: `ID 为 ${id} 的猫咪未找到`,
      };
    }

    return {
      data: cat,
      message: `成功获取 ID 为 ${id} 的猫咪信息`,
    };
  }

  // 3. POST 请求 - 创建新猫咪
  @Post() // 路径: POST /cats
  @HttpCode(201) // 设置状态码为 201 Created
  @Header('X-Custom-Header', 'Cat-Created') // 设置自定义响应头
  async create(
    @Body() createCatDto: CreateCatDto,
    @Headers('user-agent') userAgent: string,
    @Ip() ip: string,
  ): Promise<any> {
    console.log('用户代理:', userAgent);
    console.log('客户端IP:', ip);

    // 模拟异步操作
    await new Promise((resolve) => setTimeout(resolve, 100));

    const newCat: Cat = {
      id: this.nextId++,
      ...createCatDto,
    };

    this.cats.push(newCat);

    return {
      data: newCat,
      message: '成功创建新猫咪',
      meta: {
        userAgent,
        clientIp: ip,
      },
    };
  }

  // 4. PUT 请求 - 更新猫咪信息
  @Put(':id') // 路径: PUT /cats/:id
  update(@Param('id') id: string, @Body() updateCatDto: UpdateCatDto): any {
    const catId = parseInt(id);
    const catIndex = this.cats.findIndex((c) => c.id === catId);

    if (catIndex === -1) {
      return {
        error: '猫咪不存在',
        message: `ID 为 ${id} 的猫咪未找到`,
      };
    }

    // 更新猫咪信息
    this.cats[catIndex] = {
      ...this.cats[catIndex],
      ...updateCatDto,
    };

    return {
      data: this.cats[catIndex],
      message: `成功更新 ID 为 ${id} 的猫咪信息`,
    };
  }

  // 5. DELETE 请求 - 删除猫咪
  @Delete(':id') // 路径: DELETE /cats/:id
  @HttpCode(204) // 设置状态码为 204 No Content
  remove(@Param('id') id: string): void {
    const catId = parseInt(id);
    const catIndex = this.cats.findIndex((c) => c.id === catId);

    if (catIndex !== -1) {
      this.cats.splice(catIndex, 1);
    }
    // 204 状态码通常不返回响应体
  }

  // 6. 查询参数示例 - 按品种搜索
  @Get('search/breed') // 路径: GET /cats/search/breed
  searchByBreed(
    @Query('name') breedName: string,
    @Query('limit') limit: string = '10',
  ): any {
    const limitNum = parseInt(limit);
    const result = this.cats
      .filter((cat) => cat.breed.includes(breedName))
      .slice(0, limitNum);

    return {
      data: result,
      searchTerm: breedName,
      limit: limitNum,
      message: `找到 ${result.length} 只 ${breedName} 猫咪`,
    };
  }

  // 7. 重定向示例
  @Get('docs') // 路径: GET /cats/docs
  @Redirect('https://docs.nestjs.com', 302)
  getDocs(@Query('version') version: string) {
    // 动态重定向
    if (version && version === 'v9') {
      return {
        url: 'https://docs.nestjs.com/v9/',
        statusCode: 301,
      };
    }
    // 如果没有返回对象，使用装饰器中的默认值
  }

  // 8. 通配符路由示例
  @Get('special/*') // 路径: GET /cats/special/*
  handleSpecialRoutes(@Param() params: any): any {
    return {
      message: '这是一个通配符路由',
      capturedPath: params[0], // 通配符捕获的部分
      fullParams: params,
    };
  }

  // 9. 使用原生响应对象 (特定于库的方式)
  @Get('native-response')
  nativeResponse(@Res() res: Response): void {
    res.status(200).json({
      message: '使用原生 Express 响应对象',
      timestamp: new Date().toISOString(),
    });
  }

  // 10. 混合方式 - 既使用响应对象又让 Nest 处理返回值
  @Get('mixed-response')
  mixedResponse(@Res({ passthrough: true }) res: Response): any {
    // 设置自定义头部
    res.cookie('cat-session', 'abc123', { httpOnly: true });
    res.header('X-Total-Cats', this.cats.length.toString());

    // 返回数据，让 Nest 处理序列化
    return {
      message: '混合响应方式',
      totalCats: this.cats.length,
      timestamp: new Date().toISOString(),
    };
  }

  // 11. 异步处理示例
  @Get('async-example')
  async getAsyncData(): Promise<any> {
    // 模拟异步数据库查询
    await new Promise((resolve) => setTimeout(resolve, 500));

    return {
      data: this.cats,
      message: '异步获取数据成功',
      processedAt: new Date().toISOString(),
    };
  }

  // 12. 错误处理示例
  @Get('error-example/:id')
  errorExample(@Param('id') id: string): any {
    const catId = parseInt(id);

    if (isNaN(catId)) {
      throw new Error('ID 必须是数字');
    }

    if (catId < 0) {
      throw new Error('ID 不能为负数');
    }

    const cat = this.cats.find((c) => c.id === catId);
    if (!cat) {
      throw new Error(`ID 为 ${id} 的猫咪不存在`);
    }

    return { data: cat };
  }
}
