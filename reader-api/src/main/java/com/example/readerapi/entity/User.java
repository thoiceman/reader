package com.example.readerapi.entity;

import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.time.LocalDateTime;

/**
 * 用户实体类
 * 包含用户的基本信息和系统管理字段
 */
@Entity
@Table(name = "users", indexes = {
    @Index(name = "idx_username", columnList = "username", unique = true),
    @Index(name = "idx_email", columnList = "email", unique = true),
    @Index(name = "idx_phone", columnList = "phone"),
    @Index(name = "idx_status", columnList = "status"),
    @Index(name = "idx_created_at", columnList = "created_at")
})
@Data
@NoArgsConstructor
@AllArgsConstructor
public class User {
    
    /**
     * 用户ID - 主键，自增
     */
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "user_id")
    private Long userId;
    
    /**
     * 用户名 - 唯一，不能为空
     */
    @Column(name = "username", nullable = false, unique = true, length = 50)
    private String username;
    
    /**
     * 密码 - 加密存储，不能为空
     */
    @Column(name = "password", nullable = false, length = 255)
    private String password;
    
    /**
     * 邮箱 - 唯一，不能为空
     */
    @Column(name = "email", nullable = false, unique = true, length = 100)
    private String email;
    
    /**
     * 手机号 - 可为空
     */
    @Column(name = "phone", length = 20)
    private String phone;
    
    /**
     * 真实姓名 - 可为空
     */
    @Column(name = "real_name", length = 50)
    private String realName;
    
    /**
     * 昵称 - 可为空
     */
    @Column(name = "nickname", length = 50)
    private String nickname;
    
    /**
     * 头像URL - 可为空
     */
    @Column(name = "avatar_url", length = 500)
    private String avatarUrl;
    
    /**
     * 用户状态：0-禁用，1-正常，2-锁定
     */
    @Column(name = "status", nullable = false)
    private Integer status = 1;
    
    /**
     * 用户角色：0-普通用户，1-管理员，2-超级管理员
     */
    @Column(name = "role", nullable = false)
    private Integer role = 0;
    
    /**
     * 注册时间 - 自动设置
     */
    @CreationTimestamp
    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;
    
    /**
     * 更新时间 - 自动更新
     */
    @UpdateTimestamp
    @Column(name = "updated_at", nullable = false)
    private LocalDateTime updatedAt;
    
    /**
     * 最后登录时间 - 可为空
     */
    @Column(name = "last_login_at")
    private LocalDateTime lastLoginAt;
    
    /**
     * 最后登录IP - 可为空
     */
    @Column(name = "last_login_ip", length = 45)
    private String lastLoginIp;
    
    /**
     * 登录次数 - 默认0
     */
    @Column(name = "login_count", nullable = false)
    private Integer loginCount = 0;
    
    /**
     * 邮箱验证状态：0-未验证，1-已验证
     */
    @Column(name = "email_verified", nullable = false)
    private Integer emailVerified = 0;
    
    /**
     * 手机验证状态：0-未验证，1-已验证
     */
    @Column(name = "phone_verified", nullable = false)
    private Integer phoneVerified = 0;
    
    /**
     * 备注信息 - 可为空
     */
    @Column(name = "remark", length = 500)
    private String remark;
    
    /**
     * 软删除标记：0-未删除，1-已删除
     */
    @Column(name = "deleted", nullable = false)
    private Integer deleted = 0;
}