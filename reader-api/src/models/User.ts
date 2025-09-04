import bcrypt from 'bcryptjs';
import { executeQuery } from '../config/postgresql';

// 用户接口
export interface IUser {
  id?: number;
  username: string;
  email: string;
  password: string;
  avatar?: string;
  bio?: string;
  isActive: boolean;
  lastLoginAt?: Date;
  createdAt?: Date;
  updatedAt?: Date;
}

// 用户创建接口
export interface ICreateUser {
  username: string;
  email: string;
  password: string;
  avatar?: string;
  bio?: string;
}

// 用户更新接口
export interface IUpdateUser {
  username?: string;
  email?: string;
  password?: string;
  avatar?: string;
  bio?: string;
  isActive?: boolean;
  lastLoginAt?: Date;
}

// 用户查询选项
export interface IUserQueryOptions {
  limit?: number;
  offset?: number;
  orderBy?: string;
  orderDirection?: 'ASC' | 'DESC';
  isActive?: boolean;
}

// 用户模型类
export class User {
  // 创建用户
  static async create(userData: ICreateUser): Promise<IUser> {
    // 密码加密
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(userData.password, salt);

    const query = `
      INSERT INTO users (username, email, password, avatar, bio)
      VALUES ($1, $2, $3, $4, $5)
      RETURNING *
    `;
    
    const values = [
      userData.username,
      userData.email,
      hashedPassword,
      userData.avatar || null,
      userData.bio || null
    ];

    const result = await executeQuery(query, values);
    return result[0] as IUser;
  }

  // 根据ID查找用户
  static async findById(id: number): Promise<IUser | null> {
    const query = 'SELECT * FROM users WHERE id = $1 AND is_active = true';
    const result = await executeQuery(query, [id]);
    return result.length > 0 ? (result[0] as IUser) : null;
  }

  // 根据用户名查找用户
  static async findByUsername(username: string): Promise<IUser | null> {
    const query = 'SELECT * FROM users WHERE username = $1 AND is_active = true';
    const result = await executeQuery(query, [username]);
    return result.length > 0 ? (result[0] as IUser) : null;
  }

  // 根据邮箱查找用户
  static async findByEmail(email: string): Promise<IUser | null> {
    const query = 'SELECT * FROM users WHERE email = $1 AND is_active = true';
    const result = await executeQuery(query, [email]);
    return result.length > 0 ? (result[0] as IUser) : null;
  }

  // 查找所有用户
  static async findAll(options: IUserQueryOptions = {}): Promise<IUser[]> {
    const {
      limit = 50,
      offset = 0,
      orderBy = 'created_at',
      orderDirection = 'DESC',
      isActive = true
    } = options;

    let query = 'SELECT * FROM users WHERE 1=1';
    const values: any[] = [];
    let paramCount = 0;

    if (isActive !== undefined) {
      paramCount++;
      query += ` AND is_active = $${paramCount}`;
      values.push(isActive);
    }

    query += ` ORDER BY ${orderBy} ${orderDirection}`;
    
    paramCount++;
    query += ` LIMIT $${paramCount}`;
    values.push(limit);
    
    paramCount++;
    query += ` OFFSET $${paramCount}`;
    values.push(offset);

    const result = await executeQuery(query, values);
    return result as IUser[];
  }

  // 更新用户
  static async updateById(id: number, updateData: IUpdateUser): Promise<IUser | null> {
    const fields: string[] = [];
    const values: any[] = [];
    let paramCount = 0;

    // 动态构建更新字段
    Object.entries(updateData).forEach(([key, value]) => {
      if (value !== undefined) {
        paramCount++;
        // 将驼峰命名转换为下划线命名
        const dbField = key === 'isActive' ? 'is_active' : 
                       key === 'lastLoginAt' ? 'last_login_at' : key;
        fields.push(`${dbField} = $${paramCount}`);
        values.push(value);
      }
    });

    if (fields.length === 0) {
      throw new Error('没有提供更新字段');
    }

    // 如果更新密码，需要加密
    if (updateData.password) {
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(updateData.password, salt);
      const passwordIndex = values.findIndex((_, index) => 
        fields[index].includes('password'));
      if (passwordIndex !== -1) {
        values[passwordIndex] = hashedPassword;
      }
    }

    paramCount++;
    const query = `
      UPDATE users 
      SET ${fields.join(', ')}, updated_at = CURRENT_TIMESTAMP
      WHERE id = $${paramCount} AND is_active = true
      RETURNING *
    `;
    values.push(id);

    const result = await executeQuery(query, values);
    return result.length > 0 ? (result[0] as IUser) : null;
  }

  // 软删除用户
  static async deleteById(id: number): Promise<boolean> {
    const query = `
      UPDATE users 
      SET is_active = false, updated_at = CURRENT_TIMESTAMP
      WHERE id = $1 AND is_active = true
      RETURNING id
    `;
    
    const result = await executeQuery(query, [id]);
    return result.length > 0;
  }

  // 验证密码
  static async comparePassword(plainPassword: string, hashedPassword: string): Promise<boolean> {
    return bcrypt.compare(plainPassword, hashedPassword);
  }

  // 统计用户数量
  static async count(isActive: boolean = true): Promise<number> {
    const query = 'SELECT COUNT(*) as count FROM users WHERE is_active = $1';
    const result = await executeQuery(query, [isActive]);
    return parseInt(result[0].count);
  }

  // 更新最后登录时间
  static async updateLastLogin(id: number): Promise<void> {
    const query = `
      UPDATE users 
      SET last_login_at = CURRENT_TIMESTAMP, updated_at = CURRENT_TIMESTAMP
      WHERE id = $1
    `;
    await executeQuery(query, [id]);
  }

  // 检查用户名是否存在
  static async isUsernameExists(username: string, excludeId?: number): Promise<boolean> {
    let query = 'SELECT COUNT(*) as count FROM users WHERE username = $1';
    const values: any[] = [username];
    
    if (excludeId) {
      query += ' AND id != $2';
      values.push(excludeId);
    }
    
    const result = await executeQuery(query, values);
    return parseInt(result[0].count) > 0;
  }

  // 检查邮箱是否存在
  static async isEmailExists(email: string, excludeId?: number): Promise<boolean> {
    let query = 'SELECT COUNT(*) as count FROM users WHERE email = $1';
    const values: any[] = [email];
    
    if (excludeId) {
      query += ' AND id != $2';
      values.push(excludeId);
    }
    
    const result = await executeQuery(query, values);
    return parseInt(result[0].count) > 0;
  }
}