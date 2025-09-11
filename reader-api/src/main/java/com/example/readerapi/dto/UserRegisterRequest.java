package com.example.readerapi.dto;

import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;

/**
 * 用户注册请求DTO
 * 用于接收用户注册时的请求参数
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
public class UserRegisterRequest {
    
    /**
     * 用户名（必填）
     */
    private String username;
    
    /**
     * 密码（必填）
     */
    private String password;
    
    /**
     * 确认密码（必填）
     */
    private String confirmPassword;
    
    /**
     * 邮箱（必填）
     */
    private String email;
    
    /**
     * 手机号（可选）
     */
    private String phone;
    
    /**
     * 真实姓名（可选）
     */
    private String realName;
    
    /**
     * 昵称（可选）
     */
    private String nickname;
    
    /**
     * 验证码（可选，用于邮箱或手机验证）
     */
    private String verificationCode;
    
    /**
     * 验证密码是否一致
     * @return 密码是否一致
     */
    public boolean isPasswordMatch() {
        if (password == null || confirmPassword == null) {
            return false;
        }
        return password.equals(confirmPassword);
    }
    
    /**
     * 验证必填字段是否完整
     * @return 必填字段是否完整
     */
    public boolean isRequiredFieldsComplete() {
        return username != null && !username.trim().isEmpty() &&
               password != null && !password.trim().isEmpty() &&
               email != null && !email.trim().isEmpty();
    }
    
    /**
     * 验证用户名格式（3-20位字母数字下划线）
     * @return 用户名格式是否正确
     */
    public boolean isUsernameValid() {
        if (username == null) {
            return false;
        }
        return username.matches("^[a-zA-Z0-9_]{3,20}$");
    }
    
    /**
     * 验证密码强度（至少6位，包含字母和数字）
     * @return 密码强度是否符合要求
     */
    public boolean isPasswordStrong() {
        if (password == null) {
            return false;
        }
        // 至少6位，包含字母和数字
        return password.length() >= 6 && 
               password.matches(".*[a-zA-Z].*") && 
               password.matches(".*[0-9].*");
    }
    
    /**
     * 验证邮箱格式
     * @return 邮箱格式是否正确
     */
    public boolean isEmailValid() {
        if (email == null) {
            return false;
        }
        return email.matches("^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}$");
    }
    
    /**
     * 验证手机号格式（中国大陆手机号）
     * @return 手机号格式是否正确
     */
    public boolean isPhoneValid() {
        if (phone == null || phone.trim().isEmpty()) {
            return true; // 手机号是可选的
        }
        return phone.matches("^1[3-9]\\d{9}$");
    }
    
    /**
     * 获取验证错误信息
     * @return 验证错误信息，如果验证通过返回null
     */
    public String getValidationError() {
        if (!isRequiredFieldsComplete()) {
            return "用户名、密码和邮箱为必填项";
        }
        
        if (!isUsernameValid()) {
            return "用户名格式不正确，应为3-20位字母、数字或下划线";
        }
        
        if (!isPasswordStrong()) {
            return "密码强度不够，至少6位且包含字母和数字";
        }
        
        if (!isPasswordMatch()) {
            return "两次输入的密码不一致";
        }
        
        if (!isEmailValid()) {
            return "邮箱格式不正确";
        }
        
        if (!isPhoneValid()) {
            return "手机号格式不正确";
        }
        
        return null; // 验证通过
    }
}