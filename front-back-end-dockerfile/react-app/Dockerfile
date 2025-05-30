# 第一阶段：构建我们的应用
# 使用 Node.js 20 的轻量版本作为基础镜像
FROM node:20-alpine AS build

# 设置工作目录（在容器内创建 /app 文件夹并进入）
WORKDIR /app

# 先复制依赖配置文件
# 这样做的好处：如果代码改变但依赖没变，Docker 可以重用之前的依赖安装步骤
COPY package*.json ./

# 安装项目依赖
# --only=production: 只安装生产环境需要的依赖
# --silent: 减少安装时的输出信息
RUN npm install

# 复制所有源代码到容器中
COPY . .

# 构建项目（生成可部署的静态文件）
RUN npm run build

# 第二阶段：创建最终的生产环境镜像
# 使用轻量级的 nginx 服务器来托管我们的静态文件
FROM nginx:alpine

# 添加项目信息（可选，帮助识别镜像）
# LABEL maintainer="your-email@example.com"
# LABEL description="React/Vue production app"

# 安装 curl 工具（用于健康检查）
RUN apk add --no-cache curl

# 复制自定义的 nginx 配置文件（如果你有的话）
# 这个文件可以设置路由规则、缓存策略等
COPY nginx.conf /etc/nginx/conf.d/default.conf

# 把第一阶段构建好的静态文件复制到 nginx 的网站目录
# /usr/share/nginx/html 是 nginx 默认的网站文件存放位置
COPY --from=build /app/dist /usr/share/nginx/html

# 设置文件所有者为 nginx 用户（安全考虑）
RUN chown -R nginx:nginx /usr/share/nginx/html

# 设置健康检查
# 每30秒检查一次网站是否正常运行，超时3秒，失败3次则认为不健康
HEALTHCHECK --interval=30s --timeout=3s --retries=3 \
    CMD curl -f http://localhost/ || exit 1

# 声明容器对外提供服务的端口
EXPOSE 80

# 启动 nginx 服务器
# daemon off 表示让 nginx 在前台运行（容器需要这样）
CMD ["nginx", "-g", "daemon off;"]
