# ---- 阶段 1: 构建阶段 ----
FROM node:18.17-alpine AS builder

# 创建非 root 用户
RUN addgroup --system --gid 1001 nestjs
RUN adduser --system --uid 1001 --ingroup nestjs nestjs

# 设置工作目录
WORKDIR /usr/src/app

# 安装 pnpm
RUN npm install -g pnpm

# 复制 package.json 和 pnpm-lock.yaml
COPY package*.json pnpm-lock.yaml ./

# 安装所有依赖（包括开发依赖，用于构建）
RUN pnpm install --frozen-lockfile

# 复制源代码
COPY . .

# 执行构建
RUN pnpm run build

# 移除开发依赖，使得 node_modules 目录仅包含生产环境所需的依赖
RUN pnpm prune --prod

# ---- 阶段 2: 运行阶段 ----
FROM node:18.17-alpine AS runner

# 创建非 root 用户
# 创建非 root 用户 (与构建阶段保持一致的组名)
RUN addgroup --system --gid 1001 nestjs && \
    adduser --system --uid 1001 --ingroup nestjs nestjs

# 设置工作目录
WORKDIR /usr/src/app

# 从构建阶段复制构建产物和生产依赖
COPY --from=builder --chown=nestjs:nestjs /usr/src/app/dist ./dist
COPY --from=builder --chown=nestjs:nestjs /usr/src/app/node_modules ./node_modules
COPY --from=builder --chown=nestjs:nestjs /usr/src/app/package.json ./package.json

# 切换到非 root 用户
USER nestjs

# 暴露端口
EXPOSE 3000

# 启动应用
CMD ["node", "dist/main"]