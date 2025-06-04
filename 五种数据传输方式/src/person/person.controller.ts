import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Query,
  UploadedFiles,
  UseInterceptors,
} from '@nestjs/common';
import { FilesInterceptor } from '@nestjs/platform-express';
import { CreatePersonDto } from './dto/create-person.dto';

@Controller('api/person')
export class PersonController {
  // 1. URL 参数传输
  @Get(':id')
  getPersonById(@Param('id') id: string) {
    return {
      message: '通过 URL 参数获取用户信息',
      method: 'URL 参数',
      data: {
        id,
        name: '用户' + id,
        description: '这是通过 URL 参数 (:id) 传递的数据',
      },
    };
  }

  // 2. 查询参数传输
  @Get()
  findPerson(@Query('name') name: string, @Query('age') age: string) {
    return {
      message: '通过查询参数获取用户信息',
      method: '查询参数 (Query String)',
      data: {
        name: name || '未提供姓名',
        age: age ? parseInt(age) : '未提供年龄',
        description: '这是通过查询参数 (?name=xxx&age=xxx) 传递的数据',
      },
    };
  }

  // 3. Form-urlencoded 和 JSON 数据传输
  @Post()
  createPerson(@Body() createPersonDto: CreatePersonDto) {
    const contentType = 'application/json 或 application/x-www-form-urlencoded';
    return {
      message: '创建用户成功',
      method: 'POST Body 数据',
      contentType,
      data: {
        ...createPersonDto,
        id: Math.floor(Math.random() * 10000),
        description:
          '这是通过 POST 请求体传递的数据，支持 JSON 和 Form-urlencoded 格式',
      },
    };
  }

  // 4. Form-data (文件上传)
  @Post('file')
  @UseInterceptors(FilesInterceptor('files'))
  uploadFiles(@Body() body: any, @UploadedFiles() files: any[]) {
    return {
      message: '文件上传成功',
      method: 'Form-data (multipart/form-data)',
      data: {
        name: body.name || '未提供姓名',
        age: body.age ? parseInt(body.age) : '未提供年龄',
        files:
          files?.map((file) => ({
            originalName: file.originalname,
            filename: file.filename,
            size: file.size,
            mimetype: file.mimetype,
          })) || [],
        description: '这是通过 Form-data 格式传递的数据，支持文件上传',
      },
    };
  }

  // 5. 获取所有传输方式的说明
  @Get('info/methods')
  getTransferMethods() {
    return {
      message: 'NestJS 五种数据传输方式说明',
      methods: [
        {
          name: 'URL 参数',
          description: '通过 URL 路径传递参数，如 /api/person/123',
          decorator: '@Param()',
          example: 'GET /api/person/123',
        },
        {
          name: '查询参数',
          description: '通过 URL 查询字符串传递参数，如 ?name=张三&age=25',
          decorator: '@Query()',
          example: 'GET /api/person?name=张三&age=25',
        },
        {
          name: 'JSON 数据',
          description: '通过请求体传递 JSON 格式数据',
          decorator: '@Body()',
          contentType: 'application/json',
          example: 'POST /api/person',
        },
        {
          name: 'Form-urlencoded',
          description: '通过请求体传递表单编码数据',
          decorator: '@Body()',
          contentType: 'application/x-www-form-urlencoded',
          example: 'POST /api/person',
        },
        {
          name: 'Form-data',
          description: '通过 multipart/form-data 传递数据和文件',
          decorator: '@Body() + @UploadedFiles()',
          contentType: 'multipart/form-data',
          example: 'POST /api/person/file',
        },
      ],
    };
  }
}
