import { Router } from 'express';
import userRoutes from './userRoutes';

const router = Router();

// API路由
router.use('/users', userRoutes);

// API信息路由
router.get('/', (req, res) => {
  res.json({
    message: 'Welcome to React API',
    version: '1.0.0',
    endpoints: {
      users: '/api/users',
      userStats: '/api/users/stats',
      userLogin: '/api/users/login',
      health: '/health'
    },
    documentation: {
      swagger: '/api/docs' // 未来可以添加Swagger文档
    }
  });
});

export default router;