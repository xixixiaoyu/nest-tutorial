# Nest.js 深度学习之旅 🚀

欢迎来到 Nest.js 深度学习之旅！本仓库旨在提供一个全面、深入的 Nest.js 学习体验，帮助您从基础到进阶，掌握这个强大的 Node.js 框架。

## ✨ 项目简介

Nest.js 是一个用于构建高效、可扩展的服务器端应用程序的渐进式 Node.js 框架。它使用现代 JavaScript，基于 TypeScript 构建，并结合了 OOP（面向对象编程）、FP（函数式编程）和 FRP（函数式反应编程）的最佳实践。

本教程将通过一系列精心设计的示例和项目，带您一步步探索 Nest.js 的核心概念和高级特性。

## 📚 教程内容概览

本教程仓库包含以下主要模块和主题：

- **🏁 基础入门**
  - [控制器 (Controllers)](./controller/README.md) - 学习如何处理传入的请求和响应。
  - [模块 (Modules)](./module/README.md) - 了解如何组织和管理您的应用程序结构。
  - [中间件 (Middleware)](./middware/README.md) - 掌握在请求-响应周期中执行自定义逻辑的方法。
  - [异常过滤器 (Exception Filters)](./exception-filters/README.md) - 学习如何优雅地处理应用程序中的错误。
- **💡 进阶概念**
  - [计算机状态监控示例 (Computer Status)](./computer-status/README.md) - 一个实践项目，展示如何构建一个简单的状态监控 API。
  - [编程范式 (OOP, FP, FRP)](./oop、fp、frp/) - 探讨 Nest.js 如何融合不同的编程范式。
- **🛠️ 更多特性 (敬请期待)**
  - 管道 (Pipes)
  - 守卫 (Guards)
  - 拦截器 (Interceptors)
  - 自定义装饰器 (Custom Decorators)
  - 数据库集成 (Database Integration)
  - 认证与授权 (Authentication & Authorization)
  - 微服务 (Microservices)
  - GraphQL
  - WebSocket
  - 测试 (Testing)

每个子目录都包含一个独立的 Nest.js 项目或代码示例，并附有相应的 `README.md` 文件，详细解释了该部分的内容。

## 🚀 如何开始

1.  **克隆仓库**:
    ```bash
    git clone https://github.com/your-username/nest-tutorial.git
    cd nest-tutorial
    ```
2.  **进入子项目目录**:
    每个教程模块都是一个独立的 Nest.js 项目，位于各自的子目录中。例如，要运行 `controller` 示例：
    ```bash
    cd controller
    ```
3.  **安装依赖**:
    在每个子项目目录中，使用以下命令安装依赖 (推荐使用 pnpm):
    ```bash
    pnpm install
    # 或者 npm install
    # 或者 yarn install
    ```
4.  **运行项目**:
    ```bash
    pnpm run start:dev
    # 或者 npm run start:dev
    # 或者 yarn start:dev
    ```
    通常，应用程序将在 `http://localhost:3000` 上运行。

## 🤝 贡献指南

我们非常欢迎您为这个项目做出贡献！如果您有任何改进建议、发现错误或想添加新的教程内容，请随时通过以下方式参与：

1.  **Fork 本仓库**
2.  **创建您的特性分支** (`git checkout -b feature/AmazingFeature`)
3.  **提交您的更改** (`git commit -m 'Add some AmazingFeature'`)
4.  **推送到分支** (`git push origin feature/AmazingFeature`)
5.  **提交 Pull Request**

请确保您的代码遵循项目的编码规范，并为新的功能添加适当的文档和测试。

## 📄 许可证

本项目采用 [MIT 许可证](LICENSE) (如果未来添加 LICENSE 文件，请取消此注释并创建 LICENSE 文件)。

## 🙏 致谢

- 感谢 [Nest.js 官方文档](https://docs.nestjs.com/) 提供的宝贵资源。
- 感谢所有为开源社区做出贡献的开发者。

---

希望本教程能帮助您更好地学习和掌握 Nest.js！如果您有任何问题或建议，欢迎提出 Issue。

Happy Coding! 🎉
