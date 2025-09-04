import { Pool, PoolClient } from 'pg';
import { config } from './index';

// PostgreSQL连接池
let pool: Pool | null = null;

// 创建PostgreSQL连接池
const createPool = (): Pool => {
  return new Pool({
    host: config.postgresql.host,
    port: config.postgresql.port,
    user: config.postgresql.user,
    password: config.postgresql.password,
    database: config.postgresql.database,
    max: config.postgresql.max, // 连接池最大连接数
    idleTimeoutMillis: 30000, // 空闲连接超时时间
    connectionTimeoutMillis: 2000, // 连接超时时间
    ssl: config.postgresql.ssl ? { rejectUnauthorized: false } : false
  });
};

// 获取PostgreSQL连接池
export const getPool = (): Pool => {
  if (!pool) {
    pool = createPool();
  }
  return pool;
};

// 连接PostgreSQL数据库
export const connectPostgreSQL = async (): Promise<boolean> => {
  try {
    const pgPool = getPool();
    const client = await pgPool.connect();
    await client.query('SELECT NOW()');
    client.release();
    console.log('✅ PostgreSQL数据库连接成功');
    return true;
  } catch (error) {
    console.error('❌ PostgreSQL数据库连接失败:', error);
    return false;
  }
};

// 执行PostgreSQL查询
export const executeQuery = async <T = any>(text: string, params?: any[]): Promise<T[]> => {
  const pgPool = getPool();
  const client = await pgPool.connect();
  try {
    const result = await client.query(text, params);
    return result.rows;
  } finally {
    client.release();
  }
};

// 执行事务
export const executeTransaction = async (
  queries: Array<{ text: string; params?: any[] }>
): Promise<any[][]> => {
  const pgPool = getPool();
  const client = await pgPool.connect();
  try {
    await client.query('BEGIN');
    const results: any[][] = [];
    
    for (const query of queries) {
      const result = await client.query(query.text, query.params);
      results.push(result.rows);
    }
    
    await client.query('COMMIT');
    return results;
  } catch (error) {
    await client.query('ROLLBACK');
    throw error;
  } finally {
    client.release();
  }
};

// 断开PostgreSQL连接
export const disconnectPostgreSQL = async (): Promise<void> => {
  try {
    if (pool) {
      await pool.end();
      pool = null;
      console.log('PostgreSQL连接池已关闭');
    }
  } catch (error) {
    console.error('关闭PostgreSQL连接池时出错:', error);
  }
};

// 优雅关闭
process.on('SIGINT', async () => {
  await disconnectPostgreSQL();
  process.exit(0);
});

process.on('SIGTERM', async () => {
  await disconnectPostgreSQL();
  process.exit(0);
});

export default { getPool, executeQuery, executeTransaction };