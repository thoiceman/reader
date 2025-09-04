import { Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import { User, IUser } from '../models/User';
import { config } from '../config';

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
      orderDirection: 'DESC',
      isActive: true
    });

    // 移除密码字段
    const safeUsers = users.map(user => {
      const { password, ...safeUser } = user;
      return safeUser;
    });

    const total = await User.count(true);

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
    const { password, ...safeUser } = user;

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

// 创建用户
export const createUser = async (req: Request, res: Response): Promise<void> => {
  try {
    const { username, email, password, avatar, bio } = req.body;

    // 检查用户名是否已存在
    const usernameExists = await User.isUsernameExists(username);
    if (usernameExists) {
      res.status(400).json({
        success: false,
        message: '用户名已存在'
      });
      return;
    }

    // 检查邮箱是否已存在
    const emailExists = await User.isEmailExists(email);
    if (emailExists) {
      res.status(400).json({
        success: false,
        message: '邮箱已存在'
      });
      return;
    }

    // 创建新用户
    const newUser = await User.create({
      username,
      email,
      password,
      avatar,
      bio
    });

    // 生成JWT token
    const token = generateToken(newUser.id!.toString());

    res.status(201).json({
      success: true,
      message: '用户创建成功',
      data: {
        user: {
          id: newUser.id,
          username: newUser.username,
          email: newUser.email,
          avatar: newUser.avatar,
          bio: newUser.bio,
          isActive: newUser.isActive,
          createdAt: newUser.createdAt
        },
        token
      }
    });
  } catch (error: any) {
    console.error('创建用户错误:', error);
    res.status(500).json({
      success: false,
      message: '服务器内部错误',
      error: error.message
    });
  }
};

// 用户登录
export const loginUser = async (req: Request, res: Response): Promise<void> => {
  try {
    const { email, password } = req.body;

    // 查找用户
    const user = await User.findByEmail(email);

    if (!user) {
      res.status(401).json({
        success: false,
        message: '邮箱或密码错误'
      });
      return;
    }

    // 验证密码
    const isPasswordValid = await User.comparePassword(password, user.password);

    if (!isPasswordValid) {
      res.status(401).json({
        success: false,
        message: '邮箱或密码错误'
      });
      return;
    }

    // 更新最后登录时间
    await User.updateLastLogin(user.id!);

    // 生成JWT token
    const token = generateToken(user.id!.toString());

    res.json({
      success: true,
      message: '登录成功',
      data: {
        user: {
          id: user.id,
          username: user.username,
          email: user.email,
          avatar: user.avatar,
          bio: user.bio,
          isActive: user.isActive,
          createdAt: user.createdAt
        },
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
    const { password, ...safeUser } = updatedUser;

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

    const deleted = await User.deleteById(userId);

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