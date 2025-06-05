import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  Query,
} from '@nestjs/common';
import { CreateCatDto } from './dto/create-cat.dto';
import { CatsService } from './cats.service';
import { Cat } from './interfaces/cat.interface';

@Controller('cats')
export class CatsController {
  // 通过构造函数注入 CatsService
  constructor(private readonly catsService: CatsService) {}

  @Post()
  async create(
    @Body() createCatDto: CreateCatDto,
  ): Promise<{ message: string; cat: Cat }> {
    const cat = this.catsService.create(createCatDto);
    return {
      message: '成功添加了一只猫咪！',
      cat,
    };
  }

  @Get()
  async findAll(): Promise<Cat[]> {
    return this.catsService.findAll();
  }

  @Get('breed/:breed')
  async findByBreed(@Param('breed') breed: string): Promise<Cat[]> {
    return this.catsService.findByBreed(breed);
  }

  @Get(':id')
  async findOne(@Param('id') id: string): Promise<Cat | { message: string }> {
    const cat = this.catsService.findOne(+id);
    if (!cat) {
      return { message: `未找到 ID 为 ${id} 的猫咪` };
    }
    return cat;
  }

  @Put(':id')
  async update(
    @Param('id') id: string,
    @Body() updateData: Partial<CreateCatDto>,
  ): Promise<Cat | { message: string }> {
    const updatedCat = this.catsService.update(+id, updateData);
    if (!updatedCat) {
      return { message: `未找到 ID 为 ${id} 的猫咪` };
    }
    return updatedCat;
  }

  @Delete(':id')
  async remove(@Param('id') id: string): Promise<{ message: string }> {
    const success = this.catsService.remove(+id);
    if (!success) {
      return { message: `未找到 ID 为 ${id} 的猫咪` };
    }
    return { message: `成功删除了 ID 为 ${id} 的猫咪` };
  }
}
