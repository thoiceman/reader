# Reader API

一个基于Node.js和Express的RESTful API项目，支持MySQL和MongoDB双数据库。

## 功能特性

- ✅ Express.js框架
- ✅ TypeScript支持
- ✅ MySQL数据库连接（使用连接池）
- ✅ MongoDB数据库连接（使用Mongoose）
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
│   │   └── mongodb.ts   # MongoDB配置
│   ├── controllers/     # 控制器
│   │   └── userController.ts
│   ├── models/          # 数据模型
│   │   └── User.ts
│   ├── routes/          # 路由
│   │   ├── index.ts
│   │   └── userRoutes.ts
│   ├── middleware/      # 中间件
│   ├── utils/           # 工具函数
│   ├── app.ts           # Express应用配置
│   └── index.ts         # 应用入口
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
- `GET /api/users/stats` - 获取用户统计（MySQL示例）

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

### MongoDB
项目使用Mongoose连接MongoDB，需要确保MongoDB服务正在运行。默认配置：
- URI: mongodb://localhost:27017/react_api_db

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
| MONGODB_URI | MongoDB连接URI | mongodb://localhost:27017/react_api_db |
| JWT_SECRET | JWT密钥 | 必须设置 |
| JWT_EXPIRES_IN | JWT过期时间 | 7d |
| CORS_ORIGIN | CORS允许的源 | http://localhost:3000 |

## 开发说明

- 项目使用TypeScript开发，提供类型安全
- 支持热重载开发（nodemon）
- 遵循RESTful API设计规范
- 包含完整的错误处理和日志记录
- 支持优雅关闭，确保数据库连接正确关闭

## 注意事项

1. 确保MySQL和MongoDB服务正在运行
2. 修改 `.env` 文件中的数据库连接信息
3. 生产环境请使用强密码和安全的JWT密钥
4. 建议使用反向代理（如Nginx）部署生产环境