package com.example.readerapi.controller;

import com.example.readerapi.entity.User;
import com.example.readerapi.service.UserService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import jakarta.servlet.http.HttpServletRequest;
import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;

/**
 * 用户管理控制器
 * 提供用户相关的REST API接口
 */
@Slf4j
@RestController
@RequestMapping("/api/users")
@RequiredArgsConstructor
public class UserController {
    
    private final UserService userService;
    
    /**
     * 用户注册
     * @param user 用户信息
     * @return 注册结果
     */
    @PostMapping("/register")
    public ResponseEntity<Map<String, Object>> register(@RequestBody User user) {
        Map<String, Object> response = new HashMap<>();
        
        try {
            // 基本验证
            if (user.getUsername() == null || user.getUsername().trim().isEmpty()) {
                response.put("success", false);
                response.put("message", "用户名不能为空");
                return ResponseEntity.badRequest().body(response);
            }
            
            if (user.getPassword() == null || user.getPassword().trim().isEmpty()) {
                response.put("success", false);
                response.put("message", "密码不能为空");
                return ResponseEntity.badRequest().body(response);
            }
            
            if (user.getEmail() == null || user.getEmail().trim().isEmpty()) {
                response.put("success", false);
                response.put("message", "邮箱不能为空");
                return ResponseEntity.badRequest().body(response);
            }
            
            User registeredUser = userService.register(user);
            
            // 不返回密码信息
            registeredUser.setPassword(null);
            
            response.put("success", true);
            response.put("message", "注册成功");
            response.put("data", registeredUser);
            
            return ResponseEntity.ok(response);
            
        } catch (Exception e) {
            log.error("用户注册失败", e);
            response.put("success", false);
            response.put("message", e.getMessage());
            return ResponseEntity.badRequest().body(response);
        }
    }
    
    /**
     * 用户登录
     * @param loginRequest 登录请求
     * @param request HTTP请求
     * @return 登录结果
     */
    @PostMapping("/login")
    public ResponseEntity<Map<String, Object>> login(@RequestBody Map<String, String> loginRequest, 
                                                    HttpServletRequest request) {
        Map<String, Object> response = new HashMap<>();
        
        try {
            String username = loginRequest.get("username");
            String password = loginRequest.get("password");
            
            if (username == null || username.trim().isEmpty()) {
                response.put("success", false);
                response.put("message", "用户名不能为空");
                return ResponseEntity.badRequest().body(response);
            }
            
            if (password == null || password.trim().isEmpty()) {
                response.put("success", false);
                response.put("message", "密码不能为空");
                return ResponseEntity.badRequest().body(response);
            }
            
            User user = userService.login(username, password);
            
            if (user == null) {
                response.put("success", false);
                response.put("message", "用户名或密码错误");
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(response);
            }
            
            // 更新登录信息
            String clientIp = getClientIpAddress(request);
            userService.updateLastLogin(user.getUserId(), clientIp);
            
            // 不返回密码信息
            user.setPassword(null);
            
            response.put("success", true);
            response.put("message", "登录成功");
            response.put("data", user);
            
            return ResponseEntity.ok(response);
            
        } catch (Exception e) {
            log.error("用户登录失败", e);
            response.put("success", false);
            response.put("message", "登录失败");
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(response);
        }
    }
    
    /**
     * 根据ID获取用户信息
     * @param userId 用户ID
     * @return 用户信息
     */
    @GetMapping("/{userId}")
    public ResponseEntity<Map<String, Object>> getUserById(@PathVariable Long userId) {
        Map<String, Object> response = new HashMap<>();
        
        try {
            Optional<User> userOpt = userService.findById(userId);
            
            if (userOpt.isEmpty()) {
                response.put("success", false);
                response.put("message", "用户不存在");
                return ResponseEntity.notFound().build();
            }
            
            User user = userOpt.get();
            // 不返回密码信息
            user.setPassword(null);
            
            response.put("success", true);
            response.put("data", user);
            
            return ResponseEntity.ok(response);
            
        } catch (Exception e) {
            log.error("获取用户信息失败", e);
            response.put("success", false);
            response.put("message", "获取用户信息失败");
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(response);
        }
    }
    
    /**
     * 更新用户信息
     * @param userId 用户ID
     * @param user 用户信息
     * @return 更新结果
     */
    @PutMapping("/{userId}")
    public ResponseEntity<Map<String, Object>> updateUser(@PathVariable Long userId, @RequestBody User user) {
        Map<String, Object> response = new HashMap<>();
        
        try {
            user.setUserId(userId);
            User updatedUser = userService.updateUser(user);
            
            // 不返回密码信息
            updatedUser.setPassword(null);
            
            response.put("success", true);
            response.put("message", "用户信息更新成功");
            response.put("data", updatedUser);
            
            return ResponseEntity.ok(response);
            
        } catch (Exception e) {
            log.error("更新用户信息失败", e);
            response.put("success", false);
            response.put("message", e.getMessage());
            return ResponseEntity.badRequest().body(response);
        }
    }
    
    /**
     * 修改密码
     * @param userId 用户ID
     * @param passwordRequest 密码修改请求
     * @return 修改结果
     */
    @PutMapping("/{userId}/password")
    public ResponseEntity<Map<String, Object>> changePassword(@PathVariable Long userId, 
                                                            @RequestBody Map<String, String> passwordRequest) {
        Map<String, Object> response = new HashMap<>();
        
        try {
            String oldPassword = passwordRequest.get("oldPassword");
            String newPassword = passwordRequest.get("newPassword");
            
            if (oldPassword == null || oldPassword.trim().isEmpty()) {
                response.put("success", false);
                response.put("message", "旧密码不能为空");
                return ResponseEntity.badRequest().body(response);
            }
            
            if (newPassword == null || newPassword.trim().isEmpty()) {
                response.put("success", false);
                response.put("message", "新密码不能为空");
                return ResponseEntity.badRequest().body(response);
            }
            
            boolean success = userService.changePassword(userId, oldPassword, newPassword);
            
            if (success) {
                response.put("success", true);
                response.put("message", "密码修改成功");
                return ResponseEntity.ok(response);
            } else {
                response.put("success", false);
                response.put("message", "密码修改失败，请检查旧密码是否正确");
                return ResponseEntity.badRequest().body(response);
            }
            
        } catch (Exception e) {
            log.error("修改密码失败", e);
            response.put("success", false);
            response.put("message", "密码修改失败");
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(response);
        }
    }
    
    /**
     * 获取所有用户列表
     * @return 用户列表
     */
    @GetMapping
    public ResponseEntity<Map<String, Object>> getAllUsers() {
        Map<String, Object> response = new HashMap<>();
        
        try {
            List<User> users = userService.getAllUsers();
            
            // 不返回密码信息
            users.forEach(user -> user.setPassword(null));
            
            response.put("success", true);
            response.put("data", users);
            response.put("total", users.size());
            
            return ResponseEntity.ok(response);
            
        } catch (Exception e) {
            log.error("获取用户列表失败", e);
            response.put("success", false);
            response.put("message", "获取用户列表失败");
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(response);
        }
    }
    
    /**
     * 搜索用户
     * @param keyword 搜索关键词
     * @return 搜索结果
     */
    @GetMapping("/search")
    public ResponseEntity<Map<String, Object>> searchUsers(@RequestParam String keyword) {
        Map<String, Object> response = new HashMap<>();
        
        try {
            List<User> users = userService.searchUsers(keyword);
            
            // 不返回密码信息
            users.forEach(user -> user.setPassword(null));
            
            response.put("success", true);
            response.put("data", users);
            response.put("total", users.size());
            
            return ResponseEntity.ok(response);
            
        } catch (Exception e) {
            log.error("搜索用户失败", e);
            response.put("success", false);
            response.put("message", "搜索用户失败");
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(response);
        }
    }
    
    /**
     * 启用用户
     * @param userId 用户ID
     * @return 操作结果
     */
    @PutMapping("/{userId}/enable")
    public ResponseEntity<Map<String, Object>> enableUser(@PathVariable Long userId) {
        return updateUserStatus(userId, "enable", "启用");
    }
    
    /**
     * 禁用用户
     * @param userId 用户ID
     * @return 操作结果
     */
    @PutMapping("/{userId}/disable")
    public ResponseEntity<Map<String, Object>> disableUser(@PathVariable Long userId) {
        return updateUserStatus(userId, "disable", "禁用");
    }
    
    /**
     * 锁定用户
     * @param userId 用户ID
     * @return 操作结果
     */
    @PutMapping("/{userId}/lock")
    public ResponseEntity<Map<String, Object>> lockUser(@PathVariable Long userId) {
        return updateUserStatus(userId, "lock", "锁定");
    }
    
    /**
     * 删除用户（软删除）
     * @param userId 用户ID
     * @return 删除结果
     */
    @DeleteMapping("/{userId}")
    public ResponseEntity<Map<String, Object>> deleteUser(@PathVariable Long userId) {
        Map<String, Object> response = new HashMap<>();
        
        try {
            boolean success = userService.deleteUser(userId);
            
            if (success) {
                response.put("success", true);
                response.put("message", "用户删除成功");
                return ResponseEntity.ok(response);
            } else {
                response.put("success", false);
                response.put("message", "用户删除失败，用户不存在");
                return ResponseEntity.notFound().build();
            }
            
        } catch (Exception e) {
            log.error("删除用户失败", e);
            response.put("success", false);
            response.put("message", "用户删除失败");
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(response);
        }
    }
    
    /**
     * 获取用户统计信息
     * @return 统计信息
     */
    @GetMapping("/statistics")
    public ResponseEntity<Map<String, Object>> getUserStatistics() {
        Map<String, Object> response = new HashMap<>();
        
        try {
            Map<String, Object> statistics = new HashMap<>();
            statistics.put("totalUsers", userService.getTotalUserCount());
            statistics.put("activeUsers", userService.getActiveUserCount());
            statistics.put("todayRegistrations", userService.getTodayRegistrationCount());
            
            response.put("success", true);
            response.put("data", statistics);
            
            return ResponseEntity.ok(response);
            
        } catch (Exception e) {
            log.error("获取用户统计信息失败", e);
            response.put("success", false);
            response.put("message", "获取统计信息失败");
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(response);
        }
    }
    
    /**
     * 更新用户状态的通用方法
     */
    private ResponseEntity<Map<String, Object>> updateUserStatus(Long userId, String action, String actionName) {
        Map<String, Object> response = new HashMap<>();
        
        try {
            boolean success = false;
            
            switch (action) {
                case "enable":
                    success = userService.enableUser(userId);
                    break;
                case "disable":
                    success = userService.disableUser(userId);
                    break;
                case "lock":
                    success = userService.lockUser(userId);
                    break;
            }
            
            if (success) {
                response.put("success", true);
                response.put("message", "用户" + actionName + "成功");
                return ResponseEntity.ok(response);
            } else {
                response.put("success", false);
                response.put("message", "用户" + actionName + "失败，用户不存在");
                return ResponseEntity.notFound().build();
            }
            
        } catch (Exception e) {
            log.error("用户{}失败", actionName, e);
            response.put("success", false);
            response.put("message", "用户" + actionName + "失败");
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(response);
        }
    }
    
    /**
     * 获取客户端IP地址
     */
    private String getClientIpAddress(HttpServletRequest request) {
        String xForwardedFor = request.getHeader("X-Forwarded-For");
        if (xForwardedFor != null && !xForwardedFor.isEmpty() && !"unknown".equalsIgnoreCase(xForwardedFor)) {
            return xForwardedFor.split(",")[0].trim();
        }
        
        String xRealIp = request.getHeader("X-Real-IP");
        if (xRealIp != null && !xRealIp.isEmpty() && !"unknown".equalsIgnoreCase(xRealIp)) {
            return xRealIp;
        }
        
        return request.getRemoteAddr();
    }
}