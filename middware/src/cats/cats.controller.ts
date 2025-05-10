import { Controller, Get, Post, Param } from '@nestjs/common';

@Controller('cats')
export class CatsController {
  @Get()
  findAll(): string {
    console.log('处理 GET /cats 请求');
    return 'This action returns all cats';
  }

  @Post()
  create(): string {
    console.log('处理 POST /cats 请求');
    return 'This action adds a new cat';
  }

  @Get('special')
  findSpecial(): string {
    console.log('处理 GET /cats/special 请求');
    return 'This is a special cat route';
  }

  @Get(':id')
  findOne(@Param('id') id: string): string {
    console.log(`处理 GET /cats/${id} 请求`);
    return `This action returns a #${id} cat`;
  }
}
