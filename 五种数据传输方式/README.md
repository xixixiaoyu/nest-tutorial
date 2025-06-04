# 🚀 NestJS 五种数据传输方式实战教程

本项目演示了在 NestJS 框架中实现五种常见的数据传输方式，包含完整的后端 API 和前端测试页面。

## 📋 项目概述

### 五种数据传输方式

1. **URL 参数传输** - 通过 URL 路径传递参数
2. **查询参数传输** - 通过 URL 查询字符串传递参数
3. **Form-urlencoded 传输** - 通过请求体传递表单编码数据
4. **JSON 数据传输** - 通过请求体传递 JSON 格式数据
5. **Form-data 传输** - 通过 multipart/form-data 传递数据和文件

## 🛠️ 技术栈

- **后端框架**: NestJS 11.x
- **运行时**: Node.js
- **语言**: TypeScript
- **前端**: 原生 HTML/JavaScript + Axios
- **包管理器**: pnpm

## 📦 项目结构

```
五种数据传输方式/
├── src/
│   ├── person/                    # Person 模块
│   │   ├── dto/
│   │   │   └── create-person.dto.ts # 数据传输对象
│   │   ├── person.controller.ts     # 控制器（核心逻辑）
│   │   └── person.module.ts         # 模块定义
│   ├── app.controller.ts           # 应用控制器
│   ├── app.module.ts               # 根模块
│   ├── app.service.ts              # 应用服务
│   └── main.ts                     # 应用入口
├── public/
│   └── index.html                  # 前端测试页面
├── test/                           # 测试文件
├── package.json                    # 项目配置
└── README.md                       # 项目说明
```

## 🚀 快速开始

### 1. 安装依赖

```bash
# 使用 pnpm 安装依赖
pnpm install

# 或使用 npm
npm install

# 或使用 yarn
yarn install
```

### 2. 启动开发服务器

```bash
# 开发模式启动（支持热重载）
pnpm run start:dev

# 或使用 npm
npm run start:dev
```

### 3. 访问应用

- **API 服务**: http://localhost:3000
- **测试页面**: http://localhost:3000/static/index.html
- **API 文档**: 查看下方 API 接口说明

## 📚 详细教学说明

### 1. URL 参数传输

**概念**: 通过 URL 路径传递参数，参数作为 URL 的一部分。

**NestJS 实现**:

```typescript
@Get(':id')
getPersonById(@Param('id') id: string) {
  return { id, name: '用户' + id };
}
```

**前端调用**:

```javascript
const response = await axios.get('/api/person/12345');
```

**特点**:

- ✅ 简单直观，RESTful 风格
- ✅ 适合传递单个标识符
- ❌ 不适合传递复杂数据
- ❌ 参数会显示在 URL 中

### 2. 查询参数传输 (Query String)

**概念**: 通过 URL 查询字符串传递参数，格式为 `?key1=value1&key2=value2`。

**NestJS 实现**:

```typescript
@Get()
findPerson(@Query('name') name: string, @Query('age') age: string) {
  return { name, age: parseInt(age) };
}
```

**前端调用**:

```javascript
const response = await axios.get('/api/person', {
  params: { name: '张三', age: 28 },
});
```

**特点**:

- ✅ 适合 GET 请求传递多个参数
- ✅ 支持可选参数
- ✅ 便于缓存和书签
- ❌ URL 长度有限制
- ❌ 参数会显示在 URL 中

### 3. Form-urlencoded 传输

**概念**: 通过请求体传递表单编码数据，Content-Type 为 `application/x-www-form-urlencoded`。

**NestJS 实现**:

```typescript
@Post()
createPerson(@Body() createPersonDto: CreatePersonDto) {
  return { ...createPersonDto, id: Math.random() };
}
```

**前端调用**:

```javascript
const data = { name: '李四', age: 25 };
const response = await axios.post('/api/person', Qs.stringify(data), {
  headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
});
```

**特点**:

- ✅ 传统表单提交方式
- ✅ 广泛支持
- ✅ 数据不显示在 URL 中
- ❌ 不支持嵌套对象
- ❌ 不支持文件上传

### 4. JSON 数据传输

**概念**: 通过请求体传递 JSON 格式数据，Content-Type 为 `application/json`。

**NestJS 实现**:

```typescript
@Post()
createPerson(@Body() createPersonDto: CreatePersonDto) {
  return { ...createPersonDto, id: Math.random() };
}
```

**前端调用**:

```javascript
const data = { name: '王五', age: 30 };
const response = await axios.post('/api/person', data);
```

**特点**:

- ✅ 现代 API 标准格式
- ✅ 支持复杂数据结构
- ✅ 易于解析和处理
- ✅ 支持嵌套对象和数组
- ❌ 不支持文件上传

### 5. Form-data 传输 (文件上传)

**概念**: 通过 multipart/form-data 传递数据和文件，支持文件上传。

**NestJS 实现**:

```typescript
@Post('file')
@UseInterceptors(FilesInterceptor('files'))
uploadFiles(
  @Body() body: any,
  @UploadedFiles() files: Express.Multer.File[],
) {
  return { ...body, files: files.map(f => f.originalname) };
}
```

**前端调用**:

```javascript
const formData = new FormData();
formData.append('name', '赵六');
formData.append('age', '35');
formData.append('files', fileInput.files[0]);

const response = await axios.post('/api/person/file', formData);
```

**特点**:

- ✅ 支持文件上传
- ✅ 支持混合数据类型
- ✅ 支持多文件上传
- ❌ 数据量较大
- ❌ 处理相对复杂

## 🔧 API 接口文档

### 基础路径

所有 API 接口的基础路径为: `http://localhost:3000/api/person`

### 接口列表

| 方法 | 路径            | 描述                  | 参数类型         |
| ---- | --------------- | --------------------- | ---------------- |
| GET  | `/info/methods` | 获取传输方式说明      | 无               |
| GET  | `/:id`          | 通过 URL 参数获取用户 | URL 参数         |
| GET  | `/`             | 通过查询参数查找用户  | Query 参数       |
| POST | `/`             | 创建用户              | Body (JSON/Form) |
| POST | `/file`         | 上传文件和数据        | Form-data        |

### 请求示例

#### 1. 获取传输方式说明

```bash
GET /api/person/info/methods
```

#### 2. URL 参数

```bash
GET /api/person/12345
```

#### 3. 查询参数

```bash
GET /api/person?name=张三&age=28
```

#### 4. JSON 数据

```bash
POST /api/person
Content-Type: application/json

{
  "name": "王五",
  "age": 30
}
```

#### 5. Form-urlencoded

```bash
POST /api/person
Content-Type: application/x-www-form-urlencoded

name=李四&age=25
```

#### 6. Form-data (文件上传)

```bash
POST /api/person/file
Content-Type: multipart/form-data

--boundary
Content-Disposition: form-data; name="name"

赵六
--boundary
Content-Disposition: form-data; name="age"

35
--boundary
Content-Disposition: form-data; name="files"; filename="test.txt"
Content-Type: text/plain

文件内容...
--boundary--
```

## 🧪 测试指南

### 使用前端测试页面

1. 启动开发服务器: `pnpm run start:dev`
2. 打开浏览器访问: http://localhost:3000/static/index.html
3. 点击各个测试按钮体验不同的数据传输方式
4. 打开浏览器开发者工具的 Network 标签查看请求详情

### 使用 API 测试工具

推荐使用以下工具测试 API:

- **Postman**: 图形化 API 测试工具
- **Insomnia**: 轻量级 API 测试工具
- **curl**: 命令行工具
- **VS Code REST Client**: VS Code 插件

### curl 测试示例

```bash
# 1. URL 参数
curl http://localhost:3000/api/person/12345

# 2. 查询参数
curl "http://localhost:3000/api/person?name=张三&age=28"

# 3. JSON 数据
curl -X POST http://localhost:3000/api/person \
  -H "Content-Type: application/json" \
  -d '{"name":"王五","age":30}'

# 4. Form-urlencoded
curl -X POST http://localhost:3000/api/person \
  -H "Content-Type: application/x-www-form-urlencoded" \
  -d "name=李四&age=25"

# 5. Form-data
curl -X POST http://localhost:3000/api/person/file \
  -F "name=赵六" \
  -F "age=35" \
  -F "files=@test.txt"
```

## 📝 核心代码解析

### 控制器装饰器说明

```typescript
// URL 参数装饰器
@Param('id') id: string          // 获取路径参数
@Param() params: any             // 获取所有路径参数

// 查询参数装饰器
@Query('name') name: string      // 获取单个查询参数
@Query() query: any              // 获取所有查询参数

// 请求体装饰器
@Body() body: CreatePersonDto    // 获取整个请求体
@Body('name') name: string       // 获取请求体中的特定字段

// 文件上传装饰器
@UploadedFile() file: Express.Multer.File     // 单文件上传
@UploadedFiles() files: Express.Multer.File[] // 多文件上传
```

### 静态文件服务配置

```typescript
// main.ts 中的配置
app.useStaticAssets(join(__dirname, '..', 'public'), {
  prefix: '/static/',
});
```

这样配置后，`public` 目录下的文件可以通过 `/static/` 路径访问。

## 🔍 常见问题

### Q1: 文件上传不工作？

**A**: 确保:

1. 使用了 `@UseInterceptors(FilesInterceptor('files'))` 装饰器
2. 前端使用 `FormData` 对象
3. Content-Type 设置为 `multipart/form-data`

### Q2: CORS 错误？

**A**: 在 `main.ts` 中添加 `app.enableCors()` 启用跨域支持。

### Q3: 静态文件无法访问？

**A**: 检查:

1. `public` 目录是否存在
2. 静态文件服务是否正确配置
3. 访问路径是否包含 `/static/` 前缀

### Q4: 请求体解析失败？

**A**: 确保:

1. Content-Type 头设置正确
2. 数据格式与 Content-Type 匹配
3. DTO 类型定义正确

## 🎯 学习要点

### 1. 装饰器的使用

- `@Param()`: 获取 URL 路径参数
- `@Query()`: 获取查询字符串参数
- `@Body()`: 获取请求体数据
- `@UploadedFiles()`: 获取上传的文件

### 2. 数据传输选择原则

- **URL 参数**: 资源标识符 (如用户 ID)
- **查询参数**: 过滤、排序、分页参数
- **JSON**: 复杂数据结构
- **Form-urlencoded**: 简单表单数据
- **Form-data**: 文件上传或混合数据

### 3. 安全考虑

- URL 参数和查询参数会记录在日志中
- 敏感数据应使用 POST 请求体传输
- 文件上传需要验证文件类型和大小
- 始终验证和清理输入数据

## 🚀 扩展功能

### 1. 添加数据验证

```bash
# 安装验证相关包
pnpm add class-validator class-transformer
```

```typescript
// 在 DTO 中添加验证
import { IsString, IsNumber, Min, Max } from 'class-validator';

export class CreatePersonDto {
  @IsString()
  name: string;

  @IsNumber()
  @Min(0)
  @Max(150)
  age: number;
}
```

### 2. 添加 Swagger 文档

```bash
# 安装 Swagger
pnpm add @nestjs/swagger swagger-ui-express
```

### 3. 添加文件存储

```bash
# 安装 multer
pnpm add @nestjs/platform-express multer
pnpm add -D @types/multer
```

## 📖 相关资源

- [NestJS 官方文档](https://docs.nestjs.com/)
- [NestJS 中文文档](https://docs.nestjs.cn/)
- [Express Multer 文档](https://github.com/expressjs/multer)
- [Axios 文档](https://axios-http.com/)

## 📄 许可证

本项目采用 MIT 许可证。详情请查看 [LICENSE](LICENSE) 文件。

## 🤝 贡献

欢迎提交 Issue 和 Pull Request 来改进这个项目！

---

**Happy Coding! 🎉**
