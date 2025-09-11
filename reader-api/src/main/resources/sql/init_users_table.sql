-- 用户表初始化脚本
-- 适用于MySQL数据库

-- 创建用户表
CREATE TABLE IF NOT EXISTS `users` (
    `user_id` BIGINT NOT NULL AUTO_INCREMENT COMMENT '用户ID，主键自增',
    `username` VARCHAR(50) NOT NULL COMMENT '用户名，唯一',
    `password` VARCHAR(255) NOT NULL COMMENT '密码，BCrypt加密存储',
    `email` VARCHAR(100) NOT NULL COMMENT '邮箱，唯一',
    `phone` VARCHAR(20) DEFAULT NULL COMMENT '手机号',
    `real_name` VARCHAR(50) DEFAULT NULL COMMENT '真实姓名',
    `nickname` VARCHAR(50) DEFAULT NULL COMMENT '昵称',
    `avatar_url` VARCHAR(500) DEFAULT NULL COMMENT '头像URL',
    `status` INT NOT NULL DEFAULT 1 COMMENT '用户状态：0-禁用，1-正常，2-锁定',
    `role` INT NOT NULL DEFAULT 0 COMMENT '用户角色：0-普通用户，1-管理员，2-超级管理员',
    `created_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '注册时间',
    `updated_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
    `last_login_at` DATETIME DEFAULT NULL COMMENT '最后登录时间',
    `last_login_ip` VARCHAR(45) DEFAULT NULL COMMENT '最后登录IP',
    `login_count` INT NOT NULL DEFAULT 0 COMMENT '登录次数',
    `email_verified` INT NOT NULL DEFAULT 0 COMMENT '邮箱验证状态：0-未验证，1-已验证',
    `phone_verified` INT NOT NULL DEFAULT 0 COMMENT '手机验证状态：0-未验证，1-已验证',
    `remark` VARCHAR(500) DEFAULT NULL COMMENT '备注信息',
    `deleted` INT NOT NULL DEFAULT 0 COMMENT '软删除标记：0-未删除，1-已删除',
    
    PRIMARY KEY (`user_id`),
    UNIQUE KEY `uk_username` (`username`),
    UNIQUE KEY `uk_email` (`email`),
    KEY `idx_phone` (`phone`),
    KEY `idx_status` (`status`),
    KEY `idx_role` (`role`),
    KEY `idx_created_at` (`created_at`),
    KEY `idx_last_login_at` (`last_login_at`),
    KEY `idx_deleted` (`deleted`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='用户表';

-- 插入默认管理员用户（密码为：admin123，已使用BCrypt加密）
INSERT INTO `users` (
    `username`, 
    `password`, 
    `email`, 
    `real_name`, 
    `nickname`, 
    `status`, 
    `role`, 
    `email_verified`,
    `created_at`
) VALUES (
    'admin',
    '$2a$10$N.zmdr9k7uOCQb376NoUnuTJ8iAt6Z5EHsM8lE9P2.nRJ.rZ.7Cha', -- admin123
    'admin@reader.com',
    '系统管理员',
    '管理员',
    1,
    2,
    1,
    NOW()
) AS new_values ON DUPLICATE KEY UPDATE 
    `password` = new_values.`password`,
    `email` = new_values.`email`,
    `real_name` = new_values.`real_name`,
    `nickname` = new_values.`nickname`,
    `role` = new_values.`role`,
    `email_verified` = new_values.`email_verified`;

-- 插入测试普通用户（密码为：user123，已使用BCrypt加密）
INSERT INTO `users` (
    `username`, 
    `password`, 
    `email`, 
    `phone`,
    `real_name`, 
    `nickname`, 
    `status`, 
    `role`, 
    `created_at`
) VALUES (
    'testuser',
    '$2a$10$8K1p/a0dQ2jH.mfaooTOaOIiH8.qhHlyoqGqvn/ZwQfqb6cjuMYxG', -- user123
    'testuser@reader.com',
    '13800138000',
    '测试用户',
    '小测',
    1,
    0,
    NOW()
) AS new_values ON DUPLICATE KEY UPDATE 
    `password` = new_values.`password`,
    `email` = new_values.`email`,
    `phone` = new_values.`phone`,
    `real_name` = new_values.`real_name`,
    `nickname` = new_values.`nickname`;

-- 创建用户登录日志表（可选，用于记录详细的登录历史）
CREATE TABLE IF NOT EXISTS `user_login_logs` (
    `log_id` BIGINT NOT NULL AUTO_INCREMENT COMMENT '日志ID',
    `user_id` BIGINT NOT NULL COMMENT '用户ID',
    `login_time` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '登录时间',
    `login_ip` VARCHAR(45) NOT NULL COMMENT '登录IP',
    `user_agent` VARCHAR(500) DEFAULT NULL COMMENT '用户代理信息',
    `login_status` INT NOT NULL DEFAULT 1 COMMENT '登录状态：0-失败，1-成功',
    `failure_reason` VARCHAR(200) DEFAULT NULL COMMENT '失败原因',
    
    PRIMARY KEY (`log_id`),
    KEY `idx_user_id` (`user_id`),
    KEY `idx_login_time` (`login_time`),
    KEY `idx_login_ip` (`login_ip`),
    KEY `idx_login_status` (`login_status`),
    
    FOREIGN KEY (`user_id`) REFERENCES `users`(`user_id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='用户登录日志表';

-- 创建用户会话表（可选，用于管理用户会话）
CREATE TABLE IF NOT EXISTS `user_sessions` (
    `session_id` VARCHAR(128) NOT NULL COMMENT '会话ID',
    `user_id` BIGINT NOT NULL COMMENT '用户ID',
    `created_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
    `last_accessed_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '最后访问时间',
    `expires_at` DATETIME NOT NULL COMMENT '过期时间',
    `ip_address` VARCHAR(45) NOT NULL COMMENT 'IP地址',
    `user_agent` VARCHAR(500) DEFAULT NULL COMMENT '用户代理信息',
    `is_active` INT NOT NULL DEFAULT 1 COMMENT '是否活跃：0-非活跃，1-活跃',
    
    PRIMARY KEY (`session_id`),
    KEY `idx_user_id` (`user_id`),
    KEY `idx_expires_at` (`expires_at`),
    KEY `idx_is_active` (`is_active`),
    
    FOREIGN KEY (`user_id`) REFERENCES `users`(`user_id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='用户会话表';

-- 添加表注释和字段注释的完整性检查（可选，在需要时手动执行）
-- SHOW CREATE TABLE `users`;
-- SHOW CREATE TABLE `user_login_logs`;
-- SHOW CREATE TABLE `user_sessions`;

-- 查看创建的索引（可选，在需要时手动执行）
-- SHOW INDEX FROM `users`;

-- 验证数据插入
SELECT 
    user_id,
    username,
    email,
    real_name,
    nickname,
    status,
    role,
    email_verified,
    created_at
FROM `users` 
WHERE deleted = 0
ORDER BY created_at DESC;