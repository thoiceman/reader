import mysql from 'mysql2/promise';
import { config } from './index';

// 创建MySQL连接池
export const mysqlPool = mysql.createPool({
  host: config.mysql.host,
  port: config.mysql.port,
  user: config.mysql.user,
  password: config.mysql.password,
  database: config.mysql.database,
  connectionLimit: config.mysql.connectionLimit,
  queueLimit: 0,
  charset: 'utf8mb4'
});

// 测试MySQL连接
export const testMySQLConnection = async (): Promise<boolean> => {
  try {
    const connection = await mysqlPool.getConnection();
    console.log('✅ MySQL数据库连接成功');
    connection.release();
    return true;
  } catch (error) {
    console.error('❌ MySQL数据库连接失败:', error);
    return false;
  }
};

// 执行MySQL查询的辅助函数
export const executeQuery = async (query: string, params?: any[]): Promise<any> => {
  try {
    const [results] = await mysqlPool.execute(query, params);
    return results;
  } catch (error) {
    console.error('MySQL查询执行失败:', error);
    throw error;
  }
};

// 关闭MySQL连接池
export const closeMySQLPool = async (): Promise<void> => {
  try {
    await mysqlPool.end();
    console.log('MySQL连接池已关闭');
  } catch (error) {
    console.error('关闭MySQL连接池时出错:', error);
  }
};

export default mysqlPool;