package com.example.readerapi.service.impl;

import com.example.readerapi.entity.User;
import com.example.readerapi.repository.UserRepository;
import com.example.readerapi.service.UserService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.util.StringUtils;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

/**
 * 用户服务实现类
 * 实现用户管理相关的业务逻辑
 */
@Slf4j
@Service
@RequiredArgsConstructor
public class UserServiceImpl implements UserService {
    
    private final UserRepository userRepository;
    private final BCryptPasswordEncoder passwordEncoder = new BCryptPasswordEncoder();
    
    // 删除标记常量
    private static final Integer NOT_DELETED = 0;
    private static final Integer DELETED = 1;
    
    // 用户状态常量
    private static final Integer STATUS_DISABLED = 0;
    private static final Integer STATUS_NORMAL = 1;
    private static final Integer STATUS_LOCKED = 2;
    
    // 验证状态常量
    private static final Integer NOT_VERIFIED = 0;
    private static final Integer VERIFIED = 1;
    
    @Override
    @Transactional
    public User register(User user) {
        log.info("开始注册用户: {}", user.getUsername());
        
        // 验证用户名是否已存在
        if (existsByUsername(user.getUsername())) {
            throw new RuntimeException("用户名已存在");
        }
        
        // 验证邮箱是否已存在
        if (existsByEmail(user.getEmail())) {
            throw new RuntimeException("邮箱已存在");
        }
        
        // 验证手机号是否已存在（如果提供了手机号）
        if (StringUtils.hasText(user.getPhone()) && existsByPhone(user.getPhone())) {
            throw new RuntimeException("手机号已存在");
        }
        
        // 加密密码
        user.setPassword(passwordEncoder.encode(user.getPassword()));
        
        // 设置默认值
        user.setStatus(STATUS_NORMAL);
        user.setRole(0); // 普通用户
        user.setLoginCount(0);
        user.setEmailVerified(NOT_VERIFIED);
        user.setPhoneVerified(NOT_VERIFIED);
        user.setDeleted(NOT_DELETED);
        
        User savedUser = userRepository.save(user);
        log.info("用户注册成功: {}", savedUser.getUsername());
        return savedUser;
    }
    
    @Override
    @Transactional
    public User login(String username, String password) {
        log.info("用户尝试登录: {}", username);
        
        // 根据用户名或邮箱查找用户
        Optional<User> userOpt = findByUsername(username);
        if (userOpt.isEmpty()) {
            userOpt = findByEmail(username);
        }
        
        if (userOpt.isEmpty()) {
            log.warn("登录失败，用户不存在: {}", username);
            return null;
        }
        
        User user = userOpt.get();
        
        // 检查用户状态
        if (!STATUS_NORMAL.equals(user.getStatus())) {
            log.warn("登录失败，用户状态异常: {}, 状态: {}", username, user.getStatus());
            return null;
        }
        
        // 验证密码
        if (!passwordEncoder.matches(password, user.getPassword())) {
            log.warn("登录失败，密码错误: {}", username);
            return null;
        }
        
        log.info("用户登录成功: {}", username);
        return user;
    }
    
    @Override
    public Optional<User> findById(Long userId) {
        return userRepository.findById(userId)
                .filter(user -> NOT_DELETED.equals(user.getDeleted()));
    }
    
    @Override
    public Optional<User> findByUsername(String username) {
        return userRepository.findByUsernameAndDeleted(username, NOT_DELETED);
    }
    
    @Override
    public Optional<User> findByEmail(String email) {
        return userRepository.findByEmailAndDeleted(email, NOT_DELETED);
    }
    
    @Override
    @Transactional
    public User updateUser(User user) {
        log.info("更新用户信息: {}", user.getUserId());
        
        Optional<User> existingUserOpt = findById(user.getUserId());
        if (existingUserOpt.isEmpty()) {
            throw new RuntimeException("用户不存在");
        }
        
        User existingUser = existingUserOpt.get();
        
        // 更新允许修改的字段
        if (StringUtils.hasText(user.getRealName())) {
            existingUser.setRealName(user.getRealName());
        }
        if (StringUtils.hasText(user.getNickname())) {
            existingUser.setNickname(user.getNickname());
        }
        if (StringUtils.hasText(user.getAvatarUrl())) {
            existingUser.setAvatarUrl(user.getAvatarUrl());
        }
        if (StringUtils.hasText(user.getPhone())) {
            // 检查手机号是否已被其他用户使用
            Optional<User> phoneUser = userRepository.findByPhoneAndDeleted(user.getPhone(), NOT_DELETED);
            if (phoneUser.isPresent() && !phoneUser.get().getUserId().equals(user.getUserId())) {
                throw new RuntimeException("手机号已被其他用户使用");
            }
            existingUser.setPhone(user.getPhone());
            existingUser.setPhoneVerified(NOT_VERIFIED); // 重置手机验证状态
        }
        if (StringUtils.hasText(user.getRemark())) {
            existingUser.setRemark(user.getRemark());
        }
        
        User updatedUser = userRepository.save(existingUser);
        log.info("用户信息更新成功: {}", updatedUser.getUserId());
        return updatedUser;
    }
    
    @Override
    @Transactional
    public boolean changePassword(Long userId, String oldPassword, String newPassword) {
        log.info("用户修改密码: {}", userId);
        
        Optional<User> userOpt = findById(userId);
        if (userOpt.isEmpty()) {
            return false;
        }
        
        User user = userOpt.get();
        
        // 验证旧密码
        if (!passwordEncoder.matches(oldPassword, user.getPassword())) {
            log.warn("修改密码失败，旧密码错误: {}", userId);
            return false;
        }
        
        // 设置新密码
        user.setPassword(passwordEncoder.encode(newPassword));
        userRepository.save(user);
        
        log.info("用户密码修改成功: {}", userId);
        return true;
    }
    
    @Override
    @Transactional
    public boolean resetPassword(Long userId, String newPassword) {
        log.info("重置用户密码: {}", userId);
        
        Optional<User> userOpt = findById(userId);
        if (userOpt.isEmpty()) {
            return false;
        }
        
        User user = userOpt.get();
        user.setPassword(passwordEncoder.encode(newPassword));
        userRepository.save(user);
        
        log.info("用户密码重置成功: {}", userId);
        return true;
    }
    
    @Override
    @Transactional
    public void updateLastLogin(Long userId, String loginIp) {
        Optional<User> userOpt = findById(userId);
        if (userOpt.isPresent()) {
            User user = userOpt.get();
            user.setLastLoginAt(LocalDateTime.now());
            user.setLastLoginIp(loginIp);
            user.setLoginCount(user.getLoginCount() + 1);
            userRepository.save(user);
            log.info("更新用户登录信息: {}, IP: {}", userId, loginIp);
        }
    }
    
    @Override
    @Transactional
    public boolean enableUser(Long userId) {
        return updateUserStatus(userId, STATUS_NORMAL, "启用");
    }
    
    @Override
    @Transactional
    public boolean disableUser(Long userId) {
        return updateUserStatus(userId, STATUS_DISABLED, "禁用");
    }
    
    @Override
    @Transactional
    public boolean lockUser(Long userId) {
        return updateUserStatus(userId, STATUS_LOCKED, "锁定");
    }
    
    /**
     * 更新用户状态的通用方法
     */
    private boolean updateUserStatus(Long userId, Integer status, String operation) {
        log.info("{}用户: {}", operation, userId);
        
        Optional<User> userOpt = findById(userId);
        if (userOpt.isEmpty()) {
            return false;
        }
        
        User user = userOpt.get();
        user.setStatus(status);
        userRepository.save(user);
        
        log.info("用户{}成功: {}", operation, userId);
        return true;
    }
    
    @Override
    @Transactional
    public boolean deleteUser(Long userId) {
        log.info("软删除用户: {}", userId);
        
        Optional<User> userOpt = findById(userId);
        if (userOpt.isEmpty()) {
            return false;
        }
        
        User user = userOpt.get();
        user.setDeleted(DELETED);
        userRepository.save(user);
        
        log.info("用户软删除成功: {}", userId);
        return true;
    }
    
    @Override
    @Transactional
    public boolean verifyEmail(Long userId) {
        return updateVerificationStatus(userId, "email", "邮箱");
    }
    
    @Override
    @Transactional
    public boolean verifyPhone(Long userId) {
        return updateVerificationStatus(userId, "phone", "手机");
    }
    
    /**
     * 更新验证状态的通用方法
     */
    private boolean updateVerificationStatus(Long userId, String type, String typeName) {
        log.info("验证用户{}: {}", typeName, userId);
        
        Optional<User> userOpt = findById(userId);
        if (userOpt.isEmpty()) {
            return false;
        }
        
        User user = userOpt.get();
        if ("email".equals(type)) {
            user.setEmailVerified(VERIFIED);
        } else if ("phone".equals(type)) {
            user.setPhoneVerified(VERIFIED);
        }
        userRepository.save(user);
        
        log.info("用户{}验证成功: {}", typeName, userId);
        return true;
    }
    
    @Override
    public boolean existsByUsername(String username) {
        return userRepository.existsByUsernameAndDeleted(username, NOT_DELETED);
    }
    
    @Override
    public boolean existsByEmail(String email) {
        return userRepository.existsByEmailAndDeleted(email, NOT_DELETED);
    }
    
    @Override
    public boolean existsByPhone(String phone) {
        if (!StringUtils.hasText(phone)) {
            return false;
        }
        return userRepository.existsByPhoneAndDeleted(phone, NOT_DELETED);
    }
    
    @Override
    public List<User> getAllUsers() {
        return userRepository.findByDeletedOrderByCreatedAtDesc(NOT_DELETED);
    }
    
    @Override
    public List<User> getUsersByStatus(Integer status) {
        return userRepository.findByStatusAndDeletedOrderByCreatedAtDesc(status, NOT_DELETED);
    }
    
    @Override
    public List<User> getUsersByRole(Integer role) {
        return userRepository.findByRoleAndDeletedOrderByCreatedAtDesc(role, NOT_DELETED);
    }
    
    @Override
    public List<User> searchUsers(String keyword) {
        return userRepository.searchUsers(keyword);
    }
    
    @Override
    public List<User> getUsersByRegistrationTime(LocalDateTime startTime, LocalDateTime endTime) {
        return userRepository.findByCreatedAtBetween(startTime, endTime);
    }
    
    @Override
    public long getTotalUserCount() {
        return userRepository.countActiveUsers();
    }
    
    @Override
    public long getActiveUserCount() {
        return userRepository.countByStatus(STATUS_NORMAL);
    }
    
    @Override
    public long getTodayRegistrationCount() {
        LocalDateTime startOfDay = LocalDateTime.now().withHour(0).withMinute(0).withSecond(0).withNano(0);
        LocalDateTime endOfDay = startOfDay.plusDays(1).minusNanos(1);
        return userRepository.countTodayRegistrations(startOfDay, endOfDay);
    }
}