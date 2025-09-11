package com.example.readerapi.repository;

import com.example.readerapi.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

/**
 * 用户数据访问接口
 * 提供用户相关的数据库操作方法
 */
@Repository
public interface UserRepository extends JpaRepository<User, Long> {
    
    /**
     * 根据用户名查找用户（未删除）
     * @param username 用户名
     * @return 用户信息
     */
    Optional<User> findByUsernameAndDeleted(String username, Integer deleted);
    
    /**
     * 根据邮箱查找用户（未删除）
     * @param email 邮箱
     * @return 用户信息
     */
    Optional<User> findByEmailAndDeleted(String email, Integer deleted);
    
    /**
     * 根据手机号查找用户（未删除）
     * @param phone 手机号
     * @return 用户信息
     */
    Optional<User> findByPhoneAndDeleted(String phone, Integer deleted);
    
    /**
     * 检查用户名是否存在（未删除）
     * @param username 用户名
     * @return 是否存在
     */
    boolean existsByUsernameAndDeleted(String username, Integer deleted);
    
    /**
     * 检查邮箱是否存在（未删除）
     * @param email 邮箱
     * @return 是否存在
     */
    boolean existsByEmailAndDeleted(String email, Integer deleted);
    
    /**
     * 检查手机号是否存在（未删除）
     * @param phone 手机号
     * @return 是否存在
     */
    boolean existsByPhoneAndDeleted(String phone, Integer deleted);
    
    /**
     * 根据状态查找用户列表（未删除）
     * @param status 用户状态
     * @return 用户列表
     */
    List<User> findByStatusAndDeletedOrderByCreatedAtDesc(Integer status, Integer deleted);
    
    /**
     * 根据角色查找用户列表（未删除）
     * @param role 用户角色
     * @return 用户列表
     */
    List<User> findByRoleAndDeletedOrderByCreatedAtDesc(Integer role, Integer deleted);
    
    /**
     * 查找所有未删除的用户
     * @return 用户列表
     */
    List<User> findByDeletedOrderByCreatedAtDesc(Integer deleted);
    
    /**
     * 根据注册时间范围查找用户
     * @param startTime 开始时间
     * @param endTime 结束时间
     * @return 用户列表
     */
    @Query("SELECT u FROM User u WHERE u.createdAt BETWEEN :startTime AND :endTime AND u.deleted = 0 ORDER BY u.createdAt DESC")
    List<User> findByCreatedAtBetween(@Param("startTime") LocalDateTime startTime, @Param("endTime") LocalDateTime endTime);
    
    /**
     * 根据最后登录时间范围查找用户
     * @param startTime 开始时间
     * @param endTime 结束时间
     * @return 用户列表
     */
    @Query("SELECT u FROM User u WHERE u.lastLoginAt BETWEEN :startTime AND :endTime AND u.deleted = 0 ORDER BY u.lastLoginAt DESC")
    List<User> findByLastLoginAtBetween(@Param("startTime") LocalDateTime startTime, @Param("endTime") LocalDateTime endTime);
    
    /**
     * 模糊搜索用户（根据用户名、邮箱、真实姓名、昵称）
     * @param keyword 搜索关键词
     * @return 用户列表
     */
    @Query("SELECT u FROM User u WHERE (u.username LIKE %:keyword% OR u.email LIKE %:keyword% OR u.realName LIKE %:keyword% OR u.nickname LIKE %:keyword%) AND u.deleted = 0 ORDER BY u.createdAt DESC")
    List<User> searchUsers(@Param("keyword") String keyword);
    
    /**
     * 统计用户总数（未删除）
     * @return 用户总数
     */
    @Query("SELECT COUNT(u) FROM User u WHERE u.deleted = 0")
    long countActiveUsers();
    
    /**
     * 统计指定状态的用户数量
     * @param status 用户状态
     * @return 用户数量
     */
    @Query("SELECT COUNT(u) FROM User u WHERE u.status = :status AND u.deleted = 0")
    long countByStatus(@Param("status") Integer status);
    
    /**
     * 统计今日注册用户数
     * @param startOfDay 今日开始时间
     * @param endOfDay 今日结束时间
     * @return 今日注册用户数
     */
    @Query("SELECT COUNT(u) FROM User u WHERE u.createdAt BETWEEN :startOfDay AND :endOfDay AND u.deleted = 0")
    long countTodayRegistrations(@Param("startOfDay") LocalDateTime startOfDay, @Param("endOfDay") LocalDateTime endOfDay);
}