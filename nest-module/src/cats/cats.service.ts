import { Injectable } from '@nestjs/common';
import { Cat } from './interfaces/cat.interface'; // Assuming interface exists
import { CreateCatDto } from './dto/create-cat.dto'; // Assuming DTO exists

@Injectable()
export class CatsService {
  private readonly cats: Cat[] = [];

  create(cat: CreateCatDto) {
    // In a real app, you'd save to a database
    const newCat: Cat = { id: Date.now(), ...cat }; // Simple ID generation
    this.cats.push(newCat);
    console.log('CatsService: Added cat:', newCat);
  }

  findAll(): Cat[] {
    console.log('CatsService: Returning all cats:', this.cats);
    return this.cats;
  }
}
