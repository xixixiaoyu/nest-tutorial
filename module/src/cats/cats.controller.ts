import { Controller, Get, Post, Body } from '@nestjs/common';
import { CatsService } from './cats.service';
import { Cat } from './interfaces/cat.interface'; // Assuming interface exists
import { CreateCatDto } from './dto/create-cat.dto'; // Assuming DTO exists

@Controller('cats')
export class CatsController {
  constructor(private catsService: CatsService) {}

  @Post()
  async create(@Body() createCatDto: CreateCatDto) {
    this.catsService.create(createCatDto);
    console.log('Created a new cat:', createCatDto);
  }

  @Get()
  async findAll(): Promise<Cat[]> {
    console.log('Finding all cats...');
    return this.catsService.findAll();
  }
}
