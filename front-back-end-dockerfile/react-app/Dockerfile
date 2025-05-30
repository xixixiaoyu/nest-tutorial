# 第一阶段：构建我们的应用
# 使用 Node.js 20 的轻量版本作为基础镜像
FROM node:20-alpine AS build

# 全局安装 pnpm
RUN npm install -g pnpm

# 设置工作目录（在容器内创建 /app 文件夹并进入）
WORKDIR /app

# 先复制依赖配置文件
# pnpm 需要 package.json 和 pnpm-lock.yaml
COPY package*.json pnpm-lock.yaml ./

# 安装所有依赖（包括开发依赖，构建需要）
RUN pnpm install --frozen-lockfile

# 复制所有源代码到容器中
COPY . .

# 构建项目（生成可部署的静态文件）
RUN pnpm run build

# 第二阶段：创建最终的生产环境镜像
# 使用轻量级的 nginx 服务器来托管我们的静态文件
FROM nginx:alpine

# 安装 curl 工具（用于健康检查）和设置时区
RUN apk add --no-cache curl tzdata && \
    cp /usr/share/zoneinfo/Asia/Shanghai /etc/localtime && \
    echo "Asia/Shanghai" > /etc/timezone

# 复制自定义的 nginx 配置文件
COPY nginx.conf /etc/nginx/conf.d/default.conf

# 把第一阶段构建好的静态文件复制到 nginx 的网站目录
COPY --from=build /app/dist /usr/share/nginx/html

# 设置文件权限
RUN chown -R nginx:nginx /usr/share/nginx/html && \
    chmod -R 755 /usr/share/nginx/html

# 设置健康检查
HEALTHCHECK --interval=30s --timeout=3s --retries=3 \
    CMD curl -f http://localhost/ || exit 1

# 声明容器对外提供服务的端口
EXPOSE 80

# 启动 nginx 服务器
CMD ["nginx", "-g", "daemon off;"]
