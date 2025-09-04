import { Router } from 'express';
import {
  getUsers,
  getUserById,
  createUser,
  loginUser
} from '../controllers/userController';

const router = Router();

// 用户路由
router.get('/', getUsers);              // GET /api/users - 获取所有用户
router.get('/:id', getUserById);        // GET /api/users/:id - 根据ID获取用户
router.post('/', createUser);           // POST /api/users - 创建新用户
router.post('/login', loginUser);       // POST /api/users/login - 用户登录

export default router;