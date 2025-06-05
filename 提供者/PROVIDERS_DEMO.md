# NestJS 提供者（Providers）完整演示

这个项目演示了 NestJS 中提供者的各种用法和概念，包括基础服务、异步提供者、不同作用域、依赖注入等高级特性。

## 项目结构

```
src/
├── interfaces/
│   └── cat.interface.ts          # 猫咪接口定义
├── dto/
│   └── create-cat.dto.ts          # 数据传输对象
├── cats.service.ts                # 基础服务提供者
├── cats.controller.ts             # 猫咪管理控制器
├── cats.module.ts                 # 猫咪模块
├── config.service.ts              # 配置服务（演示不同作用域）
├── advanced.controller.ts         # 高级提供者演示控制器
├── dynamic.service.ts             # 动态服务（演示手动实例化）
├── dynamic.controller.ts          # 动态服务控制器
├── advanced-providers.module.ts   # 高级提供者模块
├── app.module.ts                  # 主模块
└── main.ts                        # 应用入口
```

## 功能演示

### 1. 基础提供者（CatsService）

**演示内容：**

- `@Injectable()` 装饰器的使用
- 构造函数依赖注入
- 基础的 CRUD 操作
- 异步方法

**测试端点：**

```bash
# 获取所有猫咪
GET http://localhost:3000/cats

# 添加新猫咪
POST http://localhost:3000/cats
Content-Type: application/json
{
  "name": "小花",
  "age": 2,
  "breed": "中华田园猫",
  "color": "橘色"
}

# 根据品种查找
GET http://localhost:3000/cats/breed/中华田园猫

# 获取特定猫咪
GET http://localhost:3000/cats/1

# 更新猫咪信息
PUT http://localhost:3000/cats/1
Content-Type: application/json
{
  "age": 3
}

# 删除猫咪
DELETE http://localhost:3000/cats/1
```

### 2. 高级提供者特性

**演示内容：**

- 异步提供者（数据库连接）
- 值提供者（应用配置）
- 工厂提供者（日志服务）
- 不同作用域（DEFAULT、REQUEST）
- 可选依赖注入
- 属性注入

**测试端点：**

```bash
# 获取配置信息
GET http://localhost:3000/advanced/config

# 获取请求上下文信息（每次请求都不同）
GET http://localhost:3000/advanced/request-info

# 获取数据库连接信息
GET http://localhost:3000/advanced/database

# 检查可选服务
GET http://localhost:3000/advanced/optional-service

# 运行完整演示
GET http://localhost:3000/advanced/demo
```

### 3. 动态服务和手动实例化

**演示内容：**

- `ModuleRef` 的使用
- 手动获取服务实例
- 瞬态作用域（TRANSIENT）
- 动态服务解析

**测试端点：**

```bash
# 演示手动实例化
GET http://localhost:3000/dynamic/manual-instantiation

# 条件性服务注入
GET http://localhost:3000/dynamic/conditional/cats
GET http://localhost:3000/dynamic/conditional/config
GET http://localhost:3000/dynamic/conditional/unknown

# 瞬态服务演示
GET http://localhost:3000/dynamic/transient-demo

# 作用域对比
GET http://localhost:3000/dynamic/scope-comparison
```

## 启动项目

```bash
# 安装依赖
pnpm install

# 启动开发服务器
pnpm run start:dev
```

服务器将在 `http://localhost:3000` 启动。

## 核心概念说明

### 1. 依赖注入（Dependency Injection）

```typescript
@Controller('cats')
export class CatsController {
  // 通过构造函数注入 CatsService
  constructor(private readonly catsService: CatsService) {}
}
```

### 2. 提供者作用域

- **DEFAULT（单例）**：整个应用共享一个实例
- **REQUEST**：每个 HTTP 请求创建新实例
- **TRANSIENT**：每次注入都创建新实例

### 3. 自定义提供者

```typescript
// 值提供者
{
  provide: 'APP_CONFIG',
  useValue: { name: '猫咪管理系统' }
}

// 工厂提供者
{
  provide: 'LOGGER',
  useFactory: (config: ConfigService) => createLogger(config),
  inject: [ConfigService]
}

// 异步提供者
{
  provide: 'ASYNC_CONNECTION',
  useFactory: async () => await createConnection()
}
```

### 4. 可选依赖

```typescript
constructor(
  @Optional() private readonly optionalService?: OptionalService
) {}
```

### 5. 属性注入

```typescript
@Inject('APP_CONFIG')
private readonly appConfig: any;
```

## 观察控制台输出

启动应用时，注意观察控制台输出，你会看到：

1. 各种服务的初始化顺序
2. 异步提供者的加载过程
3. 不同作用域服务的创建时机
4. 请求处理过程中的日志信息

这些输出帮助理解 NestJS 依赖注入系统的工作原理。

## 学习要点

1. **提供者是什么**：可注入的类，承担特定职责
2. **如何创建**：使用 `@Injectable()` 装饰器
3. **如何注入**：通过构造函数或属性注入
4. **如何注册**：在模块的 `providers` 数组中
5. **高级用法**：异步提供者、自定义提供者、不同作用域
6. **最佳实践**：合理选择作用域、使用接口定义契约、编写可测试的代码
