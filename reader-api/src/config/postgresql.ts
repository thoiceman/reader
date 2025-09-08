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
    connectionTimeoutMillis: 10000, // 连接超时时间增加到10秒
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

// 执行PostgreSQL查询（带重试机制）
export const executeQuery = async <T = any>(text: string, params?: any[], retries = 3): Promise<T[]> => {
  const pgPool = getPool();
  
  for (let attempt = 1; attempt <= retries; attempt++) {
    let client;
    try {
      client = await pgPool.connect();
      const result = await client.query(text, params);
      return result.rows;
    } catch (error: any) {
      if (client) {
        client.release();
      }
      
      // 如果是最后一次尝试，抛出错误
      if (attempt === retries) {
        console.error(`数据库查询失败，已重试 ${retries} 次:`, error.message);
        throw error;
      }
      
      // 等待一段时间后重试
      console.warn(`数据库查询失败，第 ${attempt} 次重试中...`);
      await new Promise(resolve => setTimeout(resolve, 1000 * attempt));
    }
  }
  
  throw new Error('数据库查询重试次数已用完');
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