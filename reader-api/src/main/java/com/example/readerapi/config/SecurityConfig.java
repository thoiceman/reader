package com.example.readerapi.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;

/**
 * 安全配置类
 * 提供密码加密等安全相关的配置
 */
@Configuration
public class SecurityConfig {
    
    /**
     * 密码加密器Bean
     * 使用BCrypt算法进行密码加密
     * @return BCryptPasswordEncoder实例
     */
    @Bean
    public BCryptPasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }
}