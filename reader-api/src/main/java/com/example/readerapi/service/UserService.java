package com.example.readerapi.service;

import com.example.readerapi.entity.User;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

/**
 * 用户服务接口
 * 定义用户管理相关的业务逻辑方法
 */
public interface UserService {
    
    /**
     * 用户注册
     * @param user 用户信息
     * @return 注册后的用户信息
     */
    User register(User user);
    
    /**
     * 用户登录验证
     * @param username 用户名或邮箱
     * @param password 密码（明文）
     * @return 用户信息（登录成功）或null（登录失败）
     */
    User login(String username, String password);
    
    /**
     * 根据用户ID查找用户
     * @param userId 用户ID
     * @return 用户信息
     */
    Optional<User> findById(Long userId);
    
    /**
     * 根据用户名查找用户
     * @param username 用户名
     * @return 用户信息
     */
    Optional<User> findByUsername(String username);
    
    /**
     * 根据邮箱查找用户
     * @param email 邮箱
     * @return 用户信息
     */
    Optional<User> findByEmail(String email);
    
    /**
     * 更新用户信息
     * @param user 用户信息
     * @return 更新后的用户信息
     */
    User updateUser(User user);
    
    /**
     * 修改密码
     * @param userId 用户ID
     * @param oldPassword 旧密码（明文）
     * @param newPassword 新密码（明文）
     * @return 是否修改成功
     */
    boolean changePassword(Long userId, String oldPassword, String newPassword);
    
    /**
     * 重置密码
     * @param userId 用户ID
     * @param newPassword 新密码（明文）
     * @return 是否重置成功
     */
    boolean resetPassword(Long userId, String newPassword);
    
    /**
     * 更新最后登录信息
     * @param userId 用户ID
     * @param loginIp 登录IP
     */
    void updateLastLogin(Long userId, String loginIp);
    
    /**
     * 启用用户
     * @param userId 用户ID
     * @return 是否操作成功
     */
    boolean enableUser(Long userId);
    
    /**
     * 禁用用户
     * @param userId 用户ID
     * @return 是否操作成功
     */
    boolean disableUser(Long userId);
    
    /**
     * 锁定用户
     * @param userId 用户ID
     * @return 是否操作成功
     */
    boolean lockUser(Long userId);
    
    /**
     * 软删除用户
     * @param userId 用户ID
     * @return 是否删除成功
     */
    boolean deleteUser(Long userId);
    
    /**
     * 验证邮箱
     * @param userId 用户ID
     * @return 是否验证成功
     */
    boolean verifyEmail(Long userId);
    
    /**
     * 验证手机号
     * @param userId 用户ID
     * @return 是否验证成功
     */
    boolean verifyPhone(Long userId);
    
    /**
     * 检查用户名是否存在
     * @param username 用户名
     * @return 是否存在
     */
    boolean existsByUsername(String username);
    
    /**
     * 检查邮箱是否存在
     * @param email 邮箱
     * @return 是否存在
     */
    boolean existsByEmail(String email);
    
    /**
     * 检查手机号是否存在
     * @param phone 手机号
     * @return 是否存在
     */
    boolean existsByPhone(String phone);
    
    /**
     * 获取所有用户列表
     * @return 用户列表
     */
    List<User> getAllUsers();
    
    /**
     * 根据状态获取用户列表
     * @param status 用户状态
     * @return 用户列表
     */
    List<User> getUsersByStatus(Integer status);
    
    /**
     * 根据角色获取用户列表
     * @param role 用户角色
     * @return 用户列表
     */
    List<User> getUsersByRole(Integer role);
    
    /**
     * 搜索用户
     * @param keyword 搜索关键词
     * @return 用户列表
     */
    List<User> searchUsers(String keyword);
    
    /**
     * 根据注册时间范围查找用户
     * @param startTime 开始时间
     * @param endTime 结束时间
     * @return 用户列表
     */
    List<User> getUsersByRegistrationTime(LocalDateTime startTime, LocalDateTime endTime);
    
    /**
     * 统计用户总数
     * @return 用户总数
     */
    long getTotalUserCount();
    
    /**
     * 统计活跃用户数（状态为正常）
     * @return 活跃用户数
     */
    long getActiveUserCount();
    
    /**
     * 统计今日注册用户数
     * @return 今日注册用户数
     */
    long getTodayRegistrationCount();
}