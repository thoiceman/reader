# Reader API

一个基于Node.js和Express的RESTful API项目，支持MySQL和PostgreSQL双数据库。

## 功能特性

- ✅ Express.js框架
- ✅ TypeScript支持
- ✅ MySQL数据库连接（使用连接池）
- ✅ PostgreSQL数据库连接（使用pg连接池）
- ✅ JWT身份验证
- ✅ 密码加密（bcrypt）
- ✅ CORS支持
- ✅ 安全中间件（Helmet）
- ✅ 请求日志（Morgan）
- ✅ 环境变量配置
- ✅ 优雅关闭
- ✅ 错误处理

## 项目结构

```
reader-api/
├── src/
│   ├── config/          # 配置文件
│   │   ├── index.ts     # 主配置
│   │   ├── mysql.ts     # MySQL配置
│   │   └── postgresql.ts # PostgreSQL配置
│   ├── controllers/     # 控制器
│   │   ├── userController.ts
│   │   ├── articleController.ts
│   │   ├── categoryController.ts
│   │   └── tagController.ts
│   ├── models/          # 数据模型
│   │   ├── User.ts
│   │   ├── Article.ts
│   │   ├── Category.ts
│   │   └── Tag.ts
│   ├── routes/          # 路由
│   │   ├── index.ts
│   │   ├── userRoutes.ts
│   │   ├── articleRoutes.ts
│   │   ├── categoryRoutes.ts
│   │   └── tagRoutes.ts
│   ├── middleware/      # 中间件
│   ├── utils/           # 工具函数
│   ├── app.ts           # Express应用配置
│   └── index.ts         # 应用入口
├── src/database/        # 数据库相关
│   ├── init.sql         # 数据库初始化脚本
│   └── migrate.ts       # 数据库迁移脚本
├── tests/               # 测试文件
├── .env                 # 环境变量
├── .env.example         # 环境变量示例
├── tsconfig.json        # TypeScript配置
└── package.json         # 项目依赖
```

## 快速开始

### 1. 安装依赖

```bash
npm install
```

### 2. 配置环境变量

复制 `.env.example` 到 `.env` 并修改配置：

```bash
cp .env.example .env
```

### 3. 启动开发服务器

```bash
npm run dev
```

### 4. 构建生产版本

```bash
npm run build
npm start
```

## API端点

### 健康检查
- `GET /health` - 服务器健康状态

### 用户管理
- `GET /api/users` - 获取所有用户
- `GET /api/users/:id` - 根据ID获取用户
- `POST /api/users` - 创建新用户
- `POST /api/users/login` - 用户登录
- `PUT /api/users/:id` - 更新用户信息
- `DELETE /api/users/:id` - 删除用户

### 文章管理
- `GET /api/articles` - 获取所有文章
- `GET /api/articles/:id` - 根据ID获取文章
- `GET /api/articles/slug/:slug` - 根据slug获取文章
- `POST /api/articles` - 创建新文章
- `PUT /api/articles/:id` - 更新文章
- `DELETE /api/articles/:id` - 删除文章
- `PUT /api/articles/:id/publish` - 发布文章
- `PUT /api/articles/:id/archive` - 归档文章

### 分类管理
- `GET /api/categories` - 获取所有分类
- `GET /api/categories/:id` - 根据ID获取分类
- `GET /api/categories/slug/:slug` - 根据slug获取分类
- `GET /api/categories/tree` - 获取分类树
- `POST /api/categories` - 创建新分类
- `PUT /api/categories/:id` - 更新分类
- `DELETE /api/categories/:id` - 删除分类
- `PUT /api/categories/sort` - 更新分类排序

### 标签管理
- `GET /api/tags` - 获取所有标签
- `GET /api/tags/:id` - 根据ID获取标签
- `GET /api/tags/slug/:slug` - 根据slug获取标签
- `GET /api/tags/name/:name` - 根据名称获取标签
- `POST /api/tags` - 创建新标签
- `PUT /api/tags/:id` - 更新标签
- `DELETE /api/tags/:id` - 删除标签
- `GET /api/tags/unused` - 获取未使用的标签
- `DELETE /api/tags/cleanup` - 清理未使用的标签
- `POST /api/tags/merge` - 合并标签

### 示例请求

#### 创建用户
```bash
curl -X POST http://localhost:3000/api/users \
  -H "Content-Type: application/json" \
  -d '{
    "username": "testuser",
    "email": "test@example.com",
    "password": "password123",
    "firstName": "Test",
    "lastName": "User"
  }'
```

#### 用户登录
```bash
curl -X POST http://localhost:3000/api/users/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "password123"
  }'
```

## 数据库配置

### MySQL
项目使用MySQL连接池，需要确保MySQL服务正在运行。默认配置：
- 主机: localhost
- 端口: 3306
- 数据库: react_api_db

### PostgreSQL
项目使用pg连接池连接PostgreSQL，需要确保PostgreSQL服务正在运行。默认配置：
- 主机: localhost
- 端口: 5432
- 数据库: reader_api_db

#### 数据库初始化
```bash
# 运行数据库迁移脚本
npm run migrate
```

## 环境变量说明

| 变量名 | 描述 | 默认值 |
|--------|------|--------|
| PORT | 服务器端口 | 3000 |
| NODE_ENV | 运行环境 | development |
| MYSQL_HOST | MySQL主机 | localhost |
| MYSQL_PORT | MySQL端口 | 3306 |
| MYSQL_USER | MySQL用户名 | root |
| MYSQL_PASSWORD | MySQL密码 | password |
| MYSQL_DATABASE | MySQL数据库名 | react_api_db |
| POSTGRES_HOST | PostgreSQL主机 | localhost |
| POSTGRES_PORT | PostgreSQL端口 | 5432 |
| POSTGRES_USER | PostgreSQL用户名 | postgres |
| POSTGRES_PASSWORD | PostgreSQL密码 | password |
| POSTGRES_DATABASE | PostgreSQL数据库名 | reader_api_db |
| POSTGRES_MAX_CONNECTIONS | PostgreSQL最大连接数 | 20 |
| POSTGRES_IDLE_TIMEOUT | PostgreSQL空闲超时(ms) | 30000 |
| POSTGRES_CONNECTION_TIMEOUT | PostgreSQL连接超时(ms) | 2000 |
| JWT_SECRET | JWT密钥 | 必须设置 |
| JWT_EXPIRES_IN | JWT过期时间 | 7d |
| CORS_ORIGIN | CORS允许的源 | http://localhost:3000 |

## 开发说明

- 项目使用TypeScript开发，提供类型安全
- 支持热重载开发（nodemon）
- 遵循RESTful API设计规范
- 包含完整的错误处理和日志记录
- 支持优雅关闭，确保数据库连接正确关闭

## 数据库架构

项目使用PostgreSQL作为主数据库，包含以下主要表：
- `users` - 用户表
- `articles` - 文章表
- `categories` - 分类表
- `tags` - 标签表
- `article_tags` - 文章标签关联表

详细的数据库结构请参考 `src/database/init.sql` 文件。

## 注意事项

1. 确保MySQL和PostgreSQL服务正在运行
2. 修改 `.env` 文件中的数据库连接信息
3. 首次运行前请执行 `npm run migrate` 初始化数据库
4. 生产环境请使用强密码和安全的JWT密钥
5. 建议使用反向代理（如Nginx）部署生产环境