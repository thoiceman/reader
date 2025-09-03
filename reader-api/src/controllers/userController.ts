import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { User, IUser } from '../models/User';
import { executeQuery } from '../config/mysql';
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

// 获取所有用户 (暂时使用模拟数据)
export const getAllUsers = async (req: Request, res: Response): Promise<void> => {
  try {
    // 暂时返回模拟数据，因为MongoDB未连接
    const mockUsers = [
      { _id: '1', username: 'testuser1', email: 'test1@example.com', createdAt: new Date() },
      { _id: '2', username: 'testuser2', email: 'test2@example.com', createdAt: new Date() }
    ];
    
    res.status(200).json(createResponse(true, '获取用户列表成功 (模拟数据)', mockUsers));
  } catch (error) {
    console.error('获取用户列表失败:', error);
    res.status(500).json(createResponse(false, '获取用户列表失败', null, (error as Error).message));
  }
};

// 根据ID获取用户 (MongoDB)
export const getUserById = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const user = await User.findById(id).select('-password');
    
    if (!user) {
      res.status(404).json(createResponse(false, '用户不存在'));
      return;
    }
    
    res.status(200).json(createResponse(true, '获取用户信息成功', user));
  } catch (error) {
    console.error('获取用户信息失败:', error);
    res.status(500).json(createResponse(false, '获取用户信息失败', null, (error as Error).message));
  }
};

// 创建用户 (MongoDB)
export const createUser = async (req: Request, res: Response): Promise<void> => {
  try {
    const { username, email, password, firstName, lastName } = req.body;
    
    // 验证必需字段
    if (!username || !email || !password) {
      res.status(400).json(createResponse(false, '用户名、邮箱和密码是必需的'));
      return;
    }
    
    // 检查用户是否已存在
    const existingUser = await User.findOne({
      $or: [{ email }, { username }]
    });
    
    if (existingUser) {
      res.status(409).json(createResponse(false, '用户名或邮箱已存在'));
      return;
    }
    
    // 加密密码
    const saltRounds = 12;
    const hashedPassword = await bcrypt.hash(password, saltRounds);
    
    // 创建新用户
    const newUser = new User({
      username,
      email,
      password: hashedPassword,
      firstName,
      lastName
    });
    
    const savedUser = await newUser.save();
    
    // 生成JWT Token
    const token = generateToken(savedUser._id);
    
    res.status(201).json(createResponse(true, '用户创建成功', {
      user: savedUser.toJSON(),
      token
    }));
  } catch (error) {
    console.error('创建用户失败:', error);
    res.status(500).json(createResponse(false, '创建用户失败', null, (error as Error).message));
  }
};

// 用户登录 (MongoDB)
export const loginUser = async (req: Request, res: Response): Promise<void> => {
  try {
    const { email, password } = req.body;
    
    // 验证必需字段
    if (!email || !password) {
      res.status(400).json(createResponse(false, '邮箱和密码是必需的'));
      return;
    }
    
    // 查找用户
    const user = await User.findOne({ email, isActive: true });
    if (!user) {
      res.status(401).json(createResponse(false, '邮箱或密码错误'));
      return;
    }
    
    // 验证密码
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      res.status(401).json(createResponse(false, '邮箱或密码错误'));
      return;
    }
    
    // 生成JWT Token
    const token = generateToken(user._id);
    
    res.status(200).json(createResponse(true, '登录成功', {
      user: user.toJSON(),
      token
    }));
  } catch (error) {
    console.error('用户登录失败:', error);
    res.status(500).json(createResponse(false, '登录失败', null, (error as Error).message));
  }
};

// 获取用户统计信息 (暂时使用模拟数据)
export const getUserStats = async (req: Request, res: Response): Promise<void> => {
  try {
    // 暂时返回模拟统计数据，因为MySQL未连接
    const mockStats = {
      total_users: 150,
      recent_users: 25,
      active_users: 120,
      last_updated: new Date().toISOString()
    };
    
    res.status(200).json(createResponse(true, '获取用户统计成功 (模拟数据)', mockStats));
  } catch (error) {
    console.error('获取用户统计失败:', error);
    res.status(500).json(createResponse(false, '获取用户统计失败', null, (error as Error).message));
  }
};