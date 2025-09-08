import bcrypt from 'bcryptjs';
import { executeQuery } from '../config/postgresql';

// 用户接口 - 匹配SQL表结构
export interface IUser {
  id?: number;
  username: string;
  password_hash: string;
  is_default_password: boolean;
  name: string;
  email?: string;
  book_preferences: string;
  created_at?: Date;
}

// 用户创建接口
export interface ICreateUser {
  username: string;
  password: string;
  name: string;
  email?: string;
  book_preferences?: string;
}

// 用户更新接口
export interface IUpdateUser {
  username?: string;
  password?: string;
  name?: string;
  email?: string;
  book_preferences?: string;
  is_default_password?: boolean;
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
      INSERT INTO users (username, password_hash, name, email, book_preferences)
      VALUES ($1, $2, $3, $4, $5)
      RETURNING *
    `;
    
    const values = [
      userData.username,
      hashedPassword,
      userData.name,
      userData.email || null,
      userData.book_preferences || '{}'
    ];

    const result = await executeQuery(query, values);
    return result[0] as IUser;
  }

  // 根据ID查找用户
  static async findById(id: number): Promise<IUser | null> {
    const query = 'SELECT * FROM users WHERE id = $1';
    const result = await executeQuery(query, [id]);
    return result.length > 0 ? (result[0] as IUser) : null;
  }

  // 根据用户名查找用户
  static async findByUsername(username: string): Promise<IUser | null> {
    const query = 'SELECT * FROM users WHERE username = $1';
    const result = await executeQuery(query, [username]);
    return result.length > 0 ? (result[0] as IUser) : null;
  }

  // 根据邮箱查找用户
  static async findByEmail(email: string): Promise<IUser | null> {
    const query = 'SELECT * FROM users WHERE email = $1';
    const result = await executeQuery(query, [email]);
    return result.length > 0 ? (result[0] as IUser) : null;
  }

  // 查找所有用户
  static async findAll(options: IUserQueryOptions = {}): Promise<IUser[]> {
    const {
      limit = 10,
      offset = 0,
      orderBy = 'created_at',
      orderDirection = 'DESC'
    } = options;

    const query = `
      SELECT * FROM users 
      ORDER BY ${orderBy} ${orderDirection}
      LIMIT $1 OFFSET $2
    `;
    
    const result = await executeQuery(query, [limit, offset]);
    return result as IUser[];
  }

  // 根据ID更新用户
  static async updateById(id: number, userData: IUpdateUser): Promise<IUser | null> {
    const updateFields: string[] = [];
    const values: any[] = [];
    let paramCount = 0;

    // 动态构建更新字段
    if (userData.username !== undefined) {
      paramCount++;
      updateFields.push(`username = $${paramCount}`);
      values.push(userData.username);
    }

    if (userData.name !== undefined) {
      paramCount++;
      updateFields.push(`name = $${paramCount}`);
      values.push(userData.name);
    }

    if (userData.email !== undefined) {
      paramCount++;
      updateFields.push(`email = $${paramCount}`);
      values.push(userData.email);
    }

    if (userData.password !== undefined) {
      // 密码加密
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(userData.password, salt);
      paramCount++;
      updateFields.push(`password_hash = $${paramCount}`);
      values.push(hashedPassword);
      
      // 更新密码时，设置is_default_password为false
      paramCount++;
      updateFields.push(`is_default_password = $${paramCount}`);
      values.push(false);
    }

    if (userData.book_preferences !== undefined) {
      paramCount++;
      updateFields.push(`book_preferences = $${paramCount}`);
      values.push(userData.book_preferences);
    }

    if (userData.is_default_password !== undefined) {
      paramCount++;
      updateFields.push(`is_default_password = $${paramCount}`);
      values.push(userData.is_default_password);
    }

    if (updateFields.length === 0) {
      throw new Error('No fields to update');
    }

    // 添加ID参数
    paramCount++;
    values.push(id);

    const query = `
      UPDATE users 
      SET ${updateFields.join(', ')}
      WHERE id = $${paramCount}
      RETURNING *
    `;

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
    return await bcrypt.compare(plainPassword, hashedPassword);
  }

  // 统计用户数量
  static async count(): Promise<number> {
    const query = 'SELECT COUNT(*) as count FROM users';
    const result = await executeQuery(query, []);
    return parseInt(result[0].count);
  }

  // 删除用户
  static async delete(id: number): Promise<boolean> {
    const query = 'DELETE FROM users WHERE id = $1';
    const result = await executeQuery(query, [id]);
    return result.length > 0;
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

  // 验证用户密码（用于登录）
  static async validateUser(username: string, password: string): Promise<IUser | null> {
    const user = await this.findByUsername(username);
    if (!user) {
      return null;
    }

    const isValidPassword = await this.comparePassword(password, user.password_hash);
    if (!isValidPassword) {
      return null;
    }

    return user;
  }
}