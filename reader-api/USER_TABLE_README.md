# 用户表设计文档

## 概述

本文档描述了阅读器系统的用户表设计，包括表结构、功能特性、安全考虑和使用方法。

## 表结构设计

### 主表：users

用户主表包含用户的基本信息和系统管理字段：

| 字段名 | 类型 | 长度 | 是否必填 | 默认值 | 说明 |
|--------|------|------|----------|--------|---------|
| user_id | BIGINT | - | 是 | AUTO_INCREMENT | 用户ID，主键 |
| username | VARCHAR | 50 | 是 | - | 用户名，唯一 |
| password | VARCHAR | 255 | 是 | - | 密码，BCrypt加密 |
| email | VARCHAR | 100 | 是 | - | 邮箱，唯一 |
| phone | VARCHAR | 20 | 否 | NULL | 手机号 |
| real_name | VARCHAR | 50 | 否 | NULL | 真实姓名 |
| nickname | VARCHAR | 50 | 否 | NULL | 昵称 |
| avatar_url | VARCHAR | 500 | 否 | NULL | 头像URL |
| status | INT | - | 是 | 1 | 用户状态 |
| role | INT | - | 是 | 0 | 用户角色 |
| created_at | DATETIME | - | 是 | CURRENT_TIMESTAMP | 注册时间 |
| updated_at | DATETIME | - | 是 | CURRENT_TIMESTAMP | 更新时间 |
| last_login_at | DATETIME | - | 否 | NULL | 最后登录时间 |
| last_login_ip | VARCHAR | 45 | 否 | NULL | 最后登录IP |
| login_count | INT | - | 是 | 0 | 登录次数 |
| email_verified | INT | - | 是 | 0 | 邮箱验证状态 |
| phone_verified | INT | - | 是 | 0 | 手机验证状态 |
| remark | VARCHAR | 500 | 否 | NULL | 备注信息 |
| deleted | INT | - | 是 | 0 | 软删除标记 |

### 辅助表

#### user_login_logs（用户登录日志表）
记录用户的详细登录历史，包括成功和失败的登录尝试。

#### user_sessions（用户会话表）
管理用户的活跃会话，支持会话管理和安全控制。

## 字段说明

### 状态字段

- **status（用户状态）**：
  - 0：禁用
  - 1：正常
  - 2：锁定

- **role（用户角色）**：
  - 0：普通用户
  - 1：管理员
  - 2：超级管理员

- **email_verified/phone_verified（验证状态）**：
  - 0：未验证
  - 1：已验证

- **deleted（软删除标记）**：
  - 0：未删除
  - 1：已删除

## 索引设计

为了提高查询效率，创建了以下索引：

- **唯一索引**：
  - `uk_username`：用户名唯一索引
  - `uk_email`：邮箱唯一索引

- **普通索引**：
  - `idx_phone`：手机号索引
  - `idx_status`：用户状态索引
  - `idx_role`：用户角色索引
  - `idx_created_at`：注册时间索引
  - `idx_last_login_at`：最后登录时间索引
  - `idx_deleted`：软删除标记索引

## 安全特性

### 1. 密码安全
- 使用BCrypt算法进行密码加密
- 密码强度验证（至少6位，包含字母和数字）
- 支持密码修改和重置功能

### 2. 数据安全
- 软删除机制，避免数据丢失
- 敏感信息不在API响应中返回
- 输入验证和SQL注入防护

### 3. 访问控制
- 基于角色的权限管理
- 用户状态控制（禁用、锁定）
- 登录IP记录和监控

## 功能特性

### 1. 用户管理
- 用户注册和登录
- 用户信息更新
- 密码修改和重置
- 用户状态管理（启用、禁用、锁定）

### 2. 验证功能
- 邮箱验证
- 手机号验证
- 用户名和邮箱唯一性检查

### 3. 查询功能
- 多条件用户搜索
- 按状态、角色筛选
- 按时间范围查询
- 用户统计信息

### 4. 日志记录
- 登录历史记录
- 操作日志追踪
- 会话管理

## API接口

### 用户注册
```http
POST /api/users/register
Content-Type: application/json

{
  "username": "testuser",
  "password": "password123",
  "email": "test@example.com",
  "phone": "13800138000",
  "realName": "测试用户",
  "nickname": "小测"
}
```

### 用户登录
```http
POST /api/users/login
Content-Type: application/json

{
  "username": "testuser",
  "password": "password123"
}
```

### 获取用户信息
```http
GET /api/users/{userId}
```

### 更新用户信息
```http
PUT /api/users/{userId}
Content-Type: application/json

{
  "realName": "新的真实姓名",
  "nickname": "新昵称",
  "phone": "13900139000"
}
```

### 修改密码
```http
PUT /api/users/{userId}/password
Content-Type: application/json

{
  "oldPassword": "oldpassword123",
  "newPassword": "newpassword123"
}
```

### 用户管理操作
```http
# 启用用户
PUT /api/users/{userId}/enable

# 禁用用户
PUT /api/users/{userId}/disable

# 锁定用户
PUT /api/users/{userId}/lock

# 删除用户（软删除）
DELETE /api/users/{userId}
```

### 查询操作
```http
# 获取所有用户
GET /api/users

# 搜索用户
GET /api/users/search?keyword=关键词

# 获取统计信息
GET /api/users/statistics
```

## 数据库初始化

### 1. 执行SQL脚本
运行 `src/main/resources/sql/init_users_table.sql` 脚本来创建表结构和初始数据。

### 2. 默认用户
脚本会创建以下默认用户：

- **管理员用户**：
  - 用户名：admin
  - 密码：admin123
  - 邮箱：admin@reader.com
  - 角色：超级管理员

- **测试用户**：
  - 用户名：testuser
  - 密码：user123
  - 邮箱：testuser@reader.com
  - 角色：普通用户

## 配置说明

### 数据库配置
在 `application.yml` 中配置数据库连接：

```yaml
spring:
  datasource:
    url: jdbc:mysql://your-host:3306/reader?useSSL=false&serverTimezone=UTC
    username: your-username
    password: your-password
    driver-class-name: com.mysql.cj.jdbc.Driver
  
  jpa:
    hibernate:
      ddl-auto: none  # 使用手动SQL脚本
    show-sql: true
    properties:
      hibernate:
        dialect: org.hibernate.dialect.MySQLDialect
```

### 依赖配置
确保 `pom.xml` 中包含必要的依赖：

```xml
<!-- JPA支持 -->
<dependency>
    <groupId>org.springframework.boot</groupId>
    <artifactId>spring-boot-starter-data-jpa</artifactId>
</dependency>

<!-- MySQL驱动 -->
<dependency>
    <groupId>com.mysql</groupId>
    <artifactId>mysql-connector-j</artifactId>
    <scope>runtime</scope>
</dependency>

<!-- Spring Security Core，用于密码加密 -->
<dependency>
    <groupId>org.springframework.security</groupId>
    <artifactId>spring-security-crypto</artifactId>
</dependency>

<!-- Lombok -->
<dependency>
    <groupId>org.projectlombok</groupId>
    <artifactId>lombok</artifactId>
    <optional>true</optional>
</dependency>
```

## 使用示例

### Java代码示例

```java
@Autowired
private UserService userService;

// 用户注册
User newUser = new User();
newUser.setUsername("newuser");
newUser.setPassword("password123");
newUser.setEmail("newuser@example.com");
User registeredUser = userService.register(newUser);

// 用户登录
User loginUser = userService.login("newuser", "password123");
if (loginUser != null) {
    // 登录成功
    userService.updateLastLogin(loginUser.getUserId(), "192.168.1.1");
}

// 查询用户
Optional<User> user = userService.findById(1L);
Optional<User> userByUsername = userService.findByUsername("admin");

// 用户管理
userService.enableUser(1L);   // 启用用户
userService.disableUser(1L);  // 禁用用户
userService.lockUser(1L);     // 锁定用户

// 统计信息
long totalUsers = userService.getTotalUserCount();
long activeUsers = userService.getActiveUserCount();
long todayRegistrations = userService.getTodayRegistrationCount();
```

## 扩展建议

### 1. 增强安全性
- 添加登录失败次数限制
- 实现账户锁定策略
- 添加两步验证功能
- 实现密码过期策略

### 2. 功能扩展
- 用户分组管理
- 更细粒度的权限控制
- 用户偏好设置
- 社交登录集成

### 3. 性能优化
- 添加缓存机制
- 数据库分表策略
- 读写分离
- 索引优化

### 4. 监控和分析
- 用户行为分析
- 登录统计报表
- 异常登录检测
- 性能监控

## 注意事项

1. **密码安全**：永远不要在日志或API响应中暴露明文密码
2. **数据验证**：在服务层和控制器层都要进行数据验证
3. **事务管理**：涉及多表操作时要使用事务
4. **软删除**：使用软删除而不是物理删除，保护数据安全
5. **索引维护**：定期检查和优化数据库索引
6. **备份策略**：制定定期备份策略，确保数据安全

## 总结

本用户表设计充分考虑了系统的安全性、可扩展性和查询效率，提供了完整的用户管理功能。通过合理的表结构设计、索引优化和安全措施，能够满足大多数应用系统的用户管理需求。

在实际使用中，可以根据具体业务需求对表结构和功能进行调整和扩展。