import {
  Controller,
  Post,
  Body,
  Get,
  Query,
  Param,
  Put,
  Delete,
  HttpCode,
  ParseIntPipe,
  NotFoundException,
} from '@nestjs/common';
import { CreateCatDto } from './dto/create-cat.dto';
import { UpdateCatDto } from './dto/update-cat.dto'; // 导入 UpdateCatDto
import { ListAllEntities } from './dto/list-all-entities.dto'; // 导入 ListAllEntities
import { CatsService } from './cats.service'; // 导入 CatsService

// 模拟 Cat 类型，与 Service 中的保持一致
interface Cat {
  id: number;
  name: string;
  age: number;
  breed: string;
}

@Controller('cats')
export class CatsController {
  // 注入 CatsService
  constructor(private readonly catsService: CatsService) {}

  @Post()
  @HttpCode(201) // 设置成功创建的状态码为 201
  async create(@Body() createCatDto: CreateCatDto): Promise<Cat> {
    console.log('Controller: Received create request with data:', createCatDto);
    return this.catsService.create(createCatDto);
  }

  @Get()
  async findAll(@Query() query: ListAllEntities): Promise<Cat[]> {
    console.log('Controller: Received findAll request with query:', query);
    return this.catsService.findAll(query);
  }

  @Get(':id')
  async findOne(@Param('id', ParseIntPipe) id: number): Promise<Cat> {
    // 使用 ParseIntPipe 转换 id 为数字
    console.log(`Controller: Received findOne request for id: ${id}`);
    const cat = await this.catsService.findOne(id);
    if (!cat) {
      // 如果找不到猫咪，抛出 NotFoundException
      throw new NotFoundException(`Cat with ID ${id} not found`);
    }
    return cat;
  }

  @Put(':id')
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateCatDto: UpdateCatDto,
  ): Promise<Cat> {
    console.log(
      `Controller: Received update request for id: ${id} with data:`,
      updateCatDto,
    );
    const updatedCat = await this.catsService.update(id, updateCatDto);
    if (!updatedCat) {
      throw new NotFoundException(`Cat with ID ${id} not found`);
    }
    return updatedCat;
  }

  @Delete(':id')
  @HttpCode(204) // 设置成功删除的状态码为 204 No Content
  async remove(@Param('id', ParseIntPipe) id: number): Promise<void> {
    console.log(`Controller: Received delete request for id: ${id}`);
    const success = await this.catsService.remove(id);
    if (!success) {
      throw new NotFoundException(`Cat with ID ${id} not found`);
    }
    // 成功删除不返回任何内容
  }
}
