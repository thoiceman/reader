import { Router } from 'express';
import {
  getUsers,
  getUserById,
  createUser,
  registerUser,
  loginUser,
  logoutUser,
  logoutAllDevices,
  updateUser,
  deleteUser
} from '../controllers/userController';
import { authenticateToken } from '../middleware/auth';

const router = Router();

// 用户管理路由
router.get('/', getUsers);              // GET /api/users - 获取所有用户
router.get('/:id', getUserById);        // GET /api/users/:id - 根据ID获取用户
router.put('/:id', updateUser);         // PUT /api/users/:id - 更新用户信息
router.delete('/:id', deleteUser);      // DELETE /api/users/:id - 删除用户

// 认证路由
router.post('/register', registerUser); // POST /api/users/register - 用户注册
router.post('/login', loginUser);       // POST /api/users/login - 用户登录
router.post('/logout', logoutUser);     // POST /api/users/logout - 用户退出登录
router.post('/logout-all', authenticateToken, logoutAllDevices); // POST /api/users/logout-all - 全局退出登录

// 向后兼容路由
router.post('/', createUser);           // POST /api/users - 创建新用户（兼容旧版本）

export default router;