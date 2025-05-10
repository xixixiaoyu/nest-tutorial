// /Users/yunmu/Desktop/Front-End-Interview-Handbook/nest/src/controller/cats/cats.service.ts
import { Injectable } from '@nestjs/common';
import { CreateCatDto } from './dto/create-cat.dto';
import { UpdateCatDto } from './dto/update-cat.dto';
import { ListAllEntities } from './dto/list-all-entities.dto';

// 模拟 Cat 类型
interface Cat {
  id: number;
  name: string;
  age: number;
  breed: string;
}

@Injectable()
export class CatsService {
  private readonly cats: Cat[] = [
    { id: 1, name: '波斯猫', age: 2, breed: 'Persian' },
    { id: 2, name: '英短', age: 1, breed: 'British Shorthair' },
  ];
  private nextId = 3;

  async create(createCatDto: CreateCatDto): Promise<Cat> {
    console.log('Service: Creating cat with data:', createCatDto);
    const newCat = { id: this.nextId++, ...createCatDto };
    this.cats.push(newCat);
    return newCat;
  }

  async findAll(query: ListAllEntities): Promise<Cat[]> {
    console.log('Service: Finding all cats with query:', query);
    // 实际应用中会根据 query.limit 和 query.offset 进行分页
    return this.cats;
  }

  async findOne(id: number): Promise<Cat | undefined> {
    console.log(`Service: Finding cat with id: ${id}`);
    return this.cats.find((cat) => cat.id === id);
  }

  async update(
    id: number,
    updateCatDto: UpdateCatDto,
  ): Promise<Cat | undefined> {
    console.log(`Service: Updating cat with id: ${id} and data:`, updateCatDto);
    const catIndex = this.cats.findIndex((cat) => cat.id === id);
    if (catIndex === -1) {
      return undefined; // 或者抛出 NotFoundException
    }
    const updatedCat = { ...this.cats[catIndex], ...updateCatDto };
    this.cats[catIndex] = updatedCat;
    return updatedCat;
  }

  async remove(id: number): Promise<boolean> {
    console.log(`Service: Removing cat with id: ${id}`);
    const initialLength = this.cats.length;
    this.cats.splice(
      this.cats.findIndex((cat) => cat.id === id),
      1,
    );
    return this.cats.length < initialLength;
  }
}
