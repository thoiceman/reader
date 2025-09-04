import { Router } from 'express';
import userRoutes from './userRoutes';
import articleRoutes from './articleRoutes';
import categoryRoutes from './categoryRoutes';
import tagRoutes from './tagRoutes';

const router = Router();

// API路由
router.use('/users', userRoutes);
router.use('/articles', articleRoutes);
router.use('/categories', categoryRoutes);
router.use('/tags', tagRoutes);

// API信息路由
router.get('/', (req, res) => {
  res.json({
    message: 'Welcome to React API',
    version: '1.0.0',
    endpoints: {
      users: '/api/users',
      articles: '/api/articles',
      categories: '/api/categories',
      tags: '/api/tags',
      health: '/health'
    },
    documentation: {
      swagger: '/api/docs' // 未来可以添加Swagger文档
    }
  });
});

export default router;