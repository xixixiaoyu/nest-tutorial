import { Injectable, Scope } from '@nestjs/common';

// 演示不同作用域的服务
@Injectable({ scope: Scope.DEFAULT }) // 单例模式（默认）
export class ConfigService {
  private readonly config = new Map<string, any>();

  constructor() {
    // 模拟配置初始化
    this.config.set('cats.maxAge', 20);
    this.config.set('cats.defaultBreed', '中华田园猫');
    this.config.set('app.name', '猫咪管理系统');
    console.log('ConfigService 初始化完成');
  }

  get(key: string): any {
    return this.config.get(key);
  }

  set(key: string, value: any): void {
    this.config.set(key, value);
  }
}

// 演示请求作用域的服务
@Injectable({ scope: Scope.REQUEST })
export class RequestContextService {
  private requestId: string;
  private startTime: number;

  constructor() {
    this.requestId = Math.random().toString(36).substr(2, 9);
    this.startTime = Date.now();
    console.log(`RequestContextService 创建，请求 ID: ${this.requestId}`);
  }

  getRequestId(): string {
    return this.requestId;
  }

  getElapsedTime(): number {
    return Date.now() - this.startTime;
  }
}
