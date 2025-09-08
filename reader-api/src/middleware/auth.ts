import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { config } from '../config';
// import { TokenBlacklist } from '../utils/tokenBlacklist'; // 不再使用令牌黑名单

// 扩展Request接口以包含用户信息
declare global {
  namespace Express {
    interface Request {
      user?: {
        userId: string;
        iat: number;
        exp: number;
      };
    }
  }
}

// JWT认证中间件
export const authenticateToken = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const authHeader = req.headers.authorization;
    const token = authHeader && authHeader.split(' ')[1]; // Bearer TOKEN

    if (!token) {
      res.status(401).json({
        success: false,
        message: '访问令牌缺失'
      });
      return;
    }

    // 不再检查令牌黑名单，依赖JWT的自然过期机制

    // 验证JWT令牌
    jwt.verify(token, config.jwt.secret, async (err: any, decoded: any) => {
      if (err) {
        let message = '令牌无效';
        
        if (err.name === 'TokenExpiredError') {
          message = '令牌已过期';
        } else if (err.name === 'JsonWebTokenError') {
          message = '令牌格式错误';
        }

        res.status(403).json({
          success: false,
          message
        });
        return;
      }

      // 不再检查全局退出登录状态，依赖JWT的自然过期机制

      // 将用户信息添加到请求对象
      req.user = {
        userId: decoded.userId,
        iat: decoded.iat,
        exp: decoded.exp
      };

      next();
    });
  } catch (error: any) {
    console.error('JWT认证中间件错误:', error);
    res.status(500).json({
      success: false,
      message: '服务器内部错误',
      error: error.message
    });
  }
};

// 可选的JWT认证中间件（不强制要求认证）
export const optionalAuth = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const authHeader = req.headers.authorization;
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
      // 没有令牌，继续执行但不设置用户信息
      next();
      return;
    }

    // 不再检查令牌黑名单，依赖JWT的自然过期机制

    // 验证JWT令牌
    jwt.verify(token, config.jwt.secret, async (err: any, decoded: any) => {
      if (!err && decoded) {
        // 令牌有效，设置用户信息
        req.user = {
          userId: decoded.userId,
          iat: decoded.iat,
          exp: decoded.exp
        };
      }
      // 无论令牌是否有效都继续执行
      next();
    });
  } catch (error: any) {
    console.error('可选JWT认证中间件错误:', error);
    // 发生错误时也继续执行
    next();
  }
};

// 提取令牌的工具函数
export const extractToken = (req: Request): string | null => {
  const authHeader = req.headers.authorization;
  return authHeader && authHeader.split(' ')[1] || null;
};

// 验证令牌格式的工具函数
export const validateTokenFormat = (token: string): boolean => {
  if (!token || typeof token !== 'string') {
    return false;
  }
  
  // JWT令牌应该有三个部分，用点分隔
  const parts = token.split('.');
  return parts.length === 3;
};