# 🎯 编程范式综合示例 - 待办事项应用

这个项目展示了如何将**面向对象编程（OOP）**、**函数式编程（FP）**和**函数响应式编程（FRP）**三种编程范式有机结合，构建一个功能完整且架构清晰的待办事项应用。

## 🚀 快速开始

### 方式一：浏览器直接运行

1. 用浏览器打开 `index.html` 文件
2. 开始体验交互式的待办事项应用
3. 打开浏览器开发者工具查看控制台输出

### 方式二：Node.js 环境运行

```bash
# 在终端中运行 JavaScript 文件
node todo-app.js
```

### 方式三：本地服务器运行

```bash
# 使用 Python 启动本地服务器
python3 -m http.server 8000
# 或使用 Node.js
npx http-server

# 然后在浏览器中访问 http://localhost:8000
```

## 📚 项目结构

```
combined-example/
├── todo-app.js      # 核心逻辑实现
├── index.html       # 交互式演示页面
└── README.md        # 项目说明文档
```

## 🎨 三种编程范式的协同应用

### 🔴 面向对象编程（OOP）

**核心类设计：**

- `TodoItem` - 待办事项实体类
- `TodoManager` - 待办事项管理器
- `TodoApp` - 应用主控制器

**体现的 OOP 特性：**

- **封装**：数据和方法封装在类内部，提供安全的访问接口
- **继承**：可扩展的类层次结构
- **多态**：统一的接口，不同的实现
- **观察者模式**：事件驱动的状态通知机制

```javascript
// 封装示例
class TodoItem {
  constructor(id, title, description, priority) {
    this.id = id
    this.title = title
    // ... 其他属性
  }

  // 安全的状态修改方法
  complete() {
    this.completed = true
    this.updatedAt = new Date()
    return this // 支持链式调用
  }
}
```

### 🔵 函数式编程（FP）

**核心概念实现：**

- **纯函数**：无副作用的数据处理函数
- **不可变性**：数据不直接修改，而是创建新副本
- **高阶函数**：接收或返回函数的函数
- **函数组合**：将简单函数组合成复杂功能
- **柯里化**：函数参数的部分应用

```javascript
// 纯函数示例
const filterByStatus = curry((completed, todos) =>
  todos.filter((todo) => todo.completed === completed)
)

// 函数组合示例
const getHighPriorityPending = pipe(
  filterByStatus(false),
  filterByPriority('high'),
  sortByCreatedDate
)
```

### 🟢 函数响应式编程（FRP）

**核心特性：**

- **数据流**：将用户交互和状态变化建模为数据流
- **响应式操作符**：map、filter、debounceTime、distinctUntilChanged 等
- **异步处理**：优雅处理时间相关的复杂交互
- **声明式编程**：描述"做什么"而不是"怎么做"

```javascript
// 搜索流示例
this.searchStream = this.actionStream
  .filter((action) => action.type === 'search')
  .map((action) => action.query)
  .debounceTime(300) // 防抖
  .distinctUntilChanged() // 去重
  .map((query) => this.searchTodos(query))
```

## 🛠️ 功能特性

### 基础功能

- ✅ 添加、编辑、删除待办事项
- ✅ 标记任务完成/未完成
- ✅ 设置任务优先级（高/中/低）
- ✅ 添加任务描述和标签

### 高级功能

- 🔍 **实时搜索**：支持标题、描述、标签搜索
- 📊 **数据分析**：完成率、优先级分布、生产力指标
- 🎛️ **灵活过滤**：按状态、优先级、标签过滤
- 📈 **多维排序**：按时间、优先级、标题排序
- ⚡ **响应式更新**：状态变化自动更新界面

### 性能优化

- 🚀 **防抖处理**：避免频繁的搜索请求
- 🎯 **去重优化**：相同查询不重复处理
- 📦 **批量操作**：支持批量完成任务
- 🔄 **增量更新**：只更新变化的部分

## 🎓 学习要点

### 1. 架构设计思想

**分层架构：**

```
┌─────────────────┐
│   表现层 (UI)    │  ← FRP 响应式更新
├─────────────────┤
│   业务逻辑层     │  ← OOP 封装业务规则
├─────────────────┤
│   数据处理层     │  ← FP 纯函数处理
├─────────────────┤
│   数据存储层     │  ← OOP 数据模型
└─────────────────┘
```

### 2. 范式选择原则

- **OOP 适用场景**：

  - 复杂的业务实体建模
  - 状态管理和封装
  - 大型系统的模块化

- **FP 适用场景**：

  - 数据转换和处理
  - 算法实现
  - 并发和并行计算

- **FRP 适用场景**：
  - 用户交互处理
  - 异步事件流
  - 实时数据更新

### 3. 代码质量提升

**可测试性：**

```javascript
// 纯函数易于测试
test('filterByStatus should filter completed todos', () => {
  const todos = [
    /* test data */
  ]
  const result = filterByStatus(true)(todos)
  expect(result).toEqual([
    /* expected result */
  ])
})
```

**可维护性：**

- 清晰的职责分离
- 松耦合的模块设计
- 一致的编码风格

**可扩展性：**

- 开放封闭原则
- 依赖注入
- 插件化架构

## 🔧 扩展建议

### 功能扩展

1. **数据持久化**：添加 localStorage 或数据库支持
2. **用户系统**：多用户支持和权限管理
3. **协作功能**：任务分享和团队协作
4. **通知系统**：到期提醒和进度通知
5. **数据可视化**：图表展示和趋势分析

### 技术扩展

1. **TypeScript**：添加类型安全
2. **测试框架**：单元测试和集成测试
3. **构建工具**：Webpack、Vite 等
4. **UI 框架**：React、Vue 等
5. **状态管理**：Redux、MobX 等

## 📖 相关资源

### 学习资料

- [MDN JavaScript 指南](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Guide)
- [函数式编程指北](https://github.com/MostlyAdequate/mostly-adequate-guide-chinese)
- [RxJS 官方文档](https://rxjs.dev/)

### 推荐书籍

- 《JavaScript 高级程序设计》
- 《函数式编程思维》
- 《响应式编程》

## 🤝 贡献指南

欢迎提交 Issue 和 Pull Request 来改进这个示例项目！

### 贡献方式

1. Fork 项目
2. 创建特性分支
3. 提交更改
4. 发起 Pull Request

### 代码规范

- 遵循 ESLint 规则
- 添加适当的注释
- 保持代码简洁清晰
- 编写测试用例

## 📄 许可证

MIT License - 详见 LICENSE 文件

---

**💡 记住：编程范式不是互斥的，而是互补的。选择合适的工具解决合适的问题，才是优秀程序员的标志！**
