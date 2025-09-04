import { Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import { User, IUser } from '../models/User';
import { config } from '../config';
// import { TokenBlacklist } from '../utils/tokenBlacklist'; // 不再使用令牌黑名单
import { extractToken } from '../middleware/auth';

// 响应接口
interface ApiResponse<T = any> {
  success: boolean;
  message: string;
  data?: T;
  error?: string;
}

// 创建响应函数
const createResponse = <T>(success: boolean, message: string, data?: T, error?: string): ApiResponse<T> => {
  return { success, message, data, error };
};

// 生成JWT Token
const generateToken = (userId: string): string => {
  return jwt.sign({ userId }, config.jwt.secret, { 
    expiresIn: config.jwt.expiresIn 
  } as jwt.SignOptions);
};

// 获取所有用户
export const getUsers = async (req: Request, res: Response): Promise<void> => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    const offset = (page - 1) * limit;

    const users = await User.findAll({
      limit,
      offset,
      orderBy: 'created_at',
      orderDirection: 'DESC'
    });

    // 移除密码字段
    const safeUsers = users.map(user => {
      const { password_hash, ...safeUser } = user;
      return safeUser;
    });

    const total = await User.count();

    res.json({
      success: true,
      data: {
        users: safeUsers,
        pagination: {
          current: page,
          pages: Math.ceil(total / limit),
          total
        }
      }
    });
  } catch (error: any) {
    console.error('获取用户列表错误:', error);
    res.status(500).json({
      success: false,
      message: '服务器内部错误',
      error: error.message
    });
  }
};

// 根据ID获取用户
export const getUserById = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const userId = parseInt(id);

    if (isNaN(userId)) {
      res.status(400).json({
        success: false,
        message: '无效的用户ID'
      });
      return;
    }

    const user = await User.findById(userId);

    if (!user) {
      res.status(404).json({
        success: false,
        message: '用户不存在'
      });
      return;
    }

    // 移除密码字段
    const { password_hash, ...safeUser } = user;

    res.json({
      success: true,
      data: { user: safeUser }
    });
  } catch (error: any) {
    console.error('获取用户错误:', error);
    res.status(500).json({
      success: false,
      message: '服务器内部错误',
      error: error.message
    });
  }
};

// 用户注册
export const registerUser = async (req: Request, res: Response): Promise<void> => {
  try {
    const { username, password, name, email, book_preferences } = req.body;

    // 输入验证
    if (!username || !password || !name) {
      res.status(400).json({
        success: false,
        message: '用户名、密码和姓名为必填项'
      });
      return;
    }

    // 密码强度验证
    if (password.length < 6) {
      res.status(400).json({
        success: false,
        message: '密码长度至少为6位'
      });
      return;
    }

    // 检查用户名是否已存在
    const usernameExists = await User.isUsernameExists(username);
    if (usernameExists) {
      res.status(400).json({
        success: false,
        message: '用户名已存在'
      });
      return;
    }

    // 检查邮箱是否已存在（如果提供了邮箱）
    if (email) {
      const emailExists = await User.isEmailExists(email);
      if (emailExists) {
        res.status(400).json({
          success: false,
          message: '邮箱已存在'
        });
        return;
      }
    }

    // 创建新用户
    const newUser = await User.create({
      username,
      password,
      name,
      email,
      book_preferences: book_preferences || '{}'
    });

    // 生成JWT token
    const token = generateToken(newUser.id!.toString());

    // 移除密码字段
    const { password_hash, ...safeUser } = newUser;

    res.status(201).json({
      success: true,
      message: '用户注册成功',
      data: {
        user: safeUser,
        token
      }
    });
  } catch (error: any) {
    console.error('用户注册错误:', error);
    res.status(500).json({
      success: false,
      message: '服务器内部错误',
      error: error.message
    });
  }
};

// 创建用户（保持向后兼容）
export const createUser = registerUser;

// 用户登录
export const loginUser = async (req: Request, res: Response): Promise<void> => {
  try {
    const { username, password } = req.body;

    // 输入验证
    if (!username || !password) {
      res.status(400).json({
        success: false,
        message: '用户名和密码为必填项'
      });
      return;
    }

    // 验证用户凭据
    const user = await User.validateUser(username, password);

    if (!user) {
      res.status(401).json({
        success: false,
        message: '用户名或密码错误'
      });
      return;
    }

    // 生成JWT token
    const token = generateToken(user.id!.toString());

    // 移除密码字段
    const { password_hash, ...safeUser } = user;

    res.json({
      success: true,
      message: '登录成功',
      data: {
        user: safeUser,
        token
      }
    });
  } catch (error: any) {
    console.error('用户登录错误:', error);
    res.status(500).json({
      success: false,
      message: '服务器内部错误',
      error: error.message
    });
  }
};

// 更新用户信息
export const updateUser = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const userId = parseInt(id);
    const updateData = req.body;

    if (isNaN(userId)) {
      res.status(400).json({
        success: false,
        message: '无效的用户ID'
      });
      return;
    }

    // 检查用户名和邮箱唯一性（如果要更新的话）
    if (updateData.username) {
      const usernameExists = await User.isUsernameExists(updateData.username, userId);
      if (usernameExists) {
        res.status(400).json({
          success: false,
          message: '用户名已存在'
        });
        return;
      }
    }

    if (updateData.email) {
      const emailExists = await User.isEmailExists(updateData.email, userId);
      if (emailExists) {
        res.status(400).json({
          success: false,
          message: '邮箱已存在'
        });
        return;
      }
    }

    const updatedUser = await User.updateById(userId, updateData);

    if (!updatedUser) {
      res.status(404).json({
        success: false,
        message: '用户不存在'
      });
      return;
    }

    // 移除密码字段
    const { password_hash, ...safeUser } = updatedUser;

    res.json({
      success: true,
      message: '用户信息更新成功',
      data: { user: safeUser }
    });
  } catch (error: any) {
    console.error('更新用户错误:', error);
    res.status(500).json({
      success: false,
      message: '服务器内部错误',
      error: error.message
    });
  }
};

// 用户退出登录
export const logoutUser = async (req: Request, res: Response): Promise<void> => {
  try {
    // 提取JWT令牌
    const token = extractToken(req);
    
    // 解码JWT令牌以获取用户信息（如果有的话）
    let userId: number | null = null;
    if (token) {
      try {
        const decoded: any = jwt.verify(token, config.jwt.secret);
        userId = parseInt(decoded.userId);
      } catch (error: any) {
        // 令牌无效也没关系，继续处理退出登录
      }
    }

    // 记录退出日志
    if (userId) {
      console.log(`用户退出登录 - 用户ID: ${userId}, 时间: ${new Date().toISOString()}, IP: ${req.ip || req.connection.remoteAddress}`);
    } else {
      console.log(`匿名用户退出登录 - 时间: ${new Date().toISOString()}, IP: ${req.ip || req.connection.remoteAddress}`);
    }

    // 返回成功响应
    // 注意：实际的令牌失效由客户端负责（清除本地存储的令牌）
    // 服务端不再维护令牌黑名单，依赖JWT的自然过期机制
    res.json({
      success: true,
      message: '退出登录成功'
    });

  } catch (error: any) {
    console.error('用户退出登录错误:', error);
    
    // 即使发生错误，我们也应该返回成功状态
    // 因为退出登录的目标是使令牌失效，即使过程中出错也不应该阻止用户退出
    res.json({
      success: true,
      message: '退出登录成功'
    });
  }
};

// 全局退出登录（简化版本 - 不使用令牌黑名单）
export const logoutAllDevices = async (req: Request, res: Response): Promise<void> => {
  try {
    // 从认证中间件获取用户信息
    const user = (req as any).user;
    
    if (!user || !user.userId) {
      res.status(401).json({
        success: false,
        message: '未授权访问'
      });
      return;
    }

    const userId = parseInt(user.userId);

    // 记录全局退出日志
    console.log(`用户全局退出登录 - 用户ID: ${userId}, 时间: ${new Date().toISOString()}, IP: ${req.ip || req.connection.remoteAddress}`);

    // 注意：在没有令牌黑名单的情况下，全局退出登录的效果有限
    // 只能依赖客户端清除所有存储的令牌，以及JWT的自然过期
    // 建议缩短JWT过期时间以提高安全性
    res.json({
      success: true,
      message: '已从所有设备退出登录（请确保清除所有客户端存储的令牌）'
    });

  } catch (error: any) {
    console.error('全局退出登录错误:', error);
    res.status(500).json({
      success: false,
      message: '服务器内部错误',
      error: error.message
    });
  }
};

// 删除用户（软删除）
export const deleteUser = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const userId = parseInt(id);

    if (isNaN(userId)) {
      res.status(400).json({
        success: false,
        message: '无效的用户ID'
      });
      return;
    }

    const deleted = await User.delete(userId);

    if (!deleted) {
      res.status(404).json({
        success: false,
        message: '用户不存在'
      });
      return;
    }

    res.json({
      success: true,
      message: '用户删除成功'
    });
  } catch (error: any) {
    console.error('删除用户错误:', error);
    res.status(500).json({
      success: false,
      message: '服务器内部错误',
      error: error.message
    });
  }
};