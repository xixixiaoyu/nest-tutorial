import { Injectable } from '@nestjs/common';
import { Cat } from './interfaces/cat.interface';

@Injectable() // 这个装饰器是关键
export class CatsService {
  private readonly cats: Cat[] = []; // 用数组模拟数据库
  private nextId = 1; // 简单的 ID 生成器

  create(cat: Cat): Cat {
    const newCat = {
      ...cat,
      id: this.nextId++,
    };
    this.cats.push(newCat);
    console.log('一只新猫咪加入了！现在有', this.cats.length, '只猫咪。');
    return newCat;
  }

  findAll(): Cat[] {
    console.log('正在查找所有猫咪...');
    return this.cats;
  }

  findOne(id: number): Cat | undefined {
    console.log(`正在查找 ID 为 ${id} 的猫咪...`);
    return this.cats.find((cat) => cat.id === id);
  }

  update(id: number, updateData: Partial<Cat>): Cat | null {
    const catIndex = this.cats.findIndex((cat) => cat.id === id);
    if (catIndex === -1) {
      console.log(`未找到 ID 为 ${id} 的猫咪`);
      return null;
    }

    this.cats[catIndex] = { ...this.cats[catIndex], ...updateData };
    console.log(`成功更新了 ID 为 ${id} 的猫咪信息`);
    return this.cats[catIndex];
  }

  remove(id: number): boolean {
    const catIndex = this.cats.findIndex((cat) => cat.id === id);
    if (catIndex === -1) {
      console.log(`未找到 ID 为 ${id} 的猫咪`);
      return false;
    }

    this.cats.splice(catIndex, 1);
    console.log(
      `成功删除了 ID 为 ${id} 的猫咪，现在有 ${this.cats.length} 只猫咪`,
    );
    return true;
  }

  // 演示异步操作
  async findByBreed(breed: string): Promise<Cat[]> {
    console.log(`正在查找品种为 ${breed} 的猫咪...`);
    // 模拟异步操作
    return new Promise((resolve) => {
      setTimeout(() => {
        const result = this.cats.filter(
          (cat) => cat.breed.toLowerCase() === breed.toLowerCase(),
        );
        resolve(result);
      }, 100);
    });
  }
}
