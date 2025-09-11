package com.example.readerapi.dto;

import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;

import java.time.LocalDateTime;

/**
 * 用户数据传输对象
 * 用于API请求和响应，不包含敏感信息如密码
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
public class UserDTO {
    
    /**
     * 用户ID
     */
    private Long userId;
    
    /**
     * 用户名
     */
    private String username;
    
    /**
     * 邮箱
     */
    private String email;
    
    /**
     * 手机号
     */
    private String phone;
    
    /**
     * 真实姓名
     */
    private String realName;
    
    /**
     * 昵称
     */
    private String nickname;
    
    /**
     * 头像URL
     */
    private String avatarUrl;
    
    /**
     * 用户状态：0-禁用，1-正常，2-锁定
     */
    private Integer status;
    
    /**
     * 用户角色：0-普通用户，1-管理员，2-超级管理员
     */
    private Integer role;
    
    /**
     * 注册时间
     */
    private LocalDateTime createdAt;
    
    /**
     * 更新时间
     */
    private LocalDateTime updatedAt;
    
    /**
     * 最后登录时间
     */
    private LocalDateTime lastLoginAt;
    
    /**
     * 最后登录IP
     */
    private String lastLoginIp;
    
    /**
     * 登录次数
     */
    private Integer loginCount;
    
    /**
     * 邮箱验证状态：0-未验证，1-已验证
     */
    private Integer emailVerified;
    
    /**
     * 手机验证状态：0-未验证，1-已验证
     */
    private Integer phoneVerified;
    
    /**
     * 备注信息
     */
    private String remark;
    
    /**
     * 获取状态描述
     * @return 状态描述
     */
    public String getStatusDescription() {
        if (status == null) {
            return "未知";
        }
        switch (status) {
            case 0:
                return "禁用";
            case 1:
                return "正常";
            case 2:
                return "锁定";
            default:
                return "未知";
        }
    }
    
    /**
     * 获取角色描述
     * @return 角色描述
     */
    public String getRoleDescription() {
        if (role == null) {
            return "未知";
        }
        switch (role) {
            case 0:
                return "普通用户";
            case 1:
                return "管理员";
            case 2:
                return "超级管理员";
            default:
                return "未知";
        }
    }
    
    /**
     * 获取邮箱验证状态描述
     * @return 验证状态描述
     */
    public String getEmailVerifiedDescription() {
        if (emailVerified == null) {
            return "未知";
        }
        return emailVerified == 1 ? "已验证" : "未验证";
    }
    
    /**
     * 获取手机验证状态描述
     * @return 验证状态描述
     */
    public String getPhoneVerifiedDescription() {
        if (phoneVerified == null) {
            return "未知";
        }
        return phoneVerified == 1 ? "已验证" : "未验证";
    }
}