import { readFileSync } from 'fs';
import { join } from 'path';
import { executeQuery, connectPostgreSQL } from '../config/postgresql';

// 迁移脚本接口
interface Migration {
  version: string;
  name: string;
  up: string;
  down?: string;
}

// 创建迁移记录表
const createMigrationsTable = async (): Promise<void> => {
  const createTableSQL = `
    CREATE TABLE IF NOT EXISTS migrations (
      id SERIAL PRIMARY KEY,
      version VARCHAR(50) NOT NULL UNIQUE,
      name VARCHAR(255) NOT NULL,
      executed_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
    );
  `;
  
  await executeQuery(createTableSQL);
  console.log('✅ 迁移记录表已创建');
};

// 检查迁移是否已执行
const isMigrationExecuted = async (version: string): Promise<boolean> => {
  const result = await executeQuery(
    'SELECT COUNT(*) as count FROM migrations WHERE version = $1',
    [version]
  );
  return parseInt(result[0].count) > 0;
};

// 记录迁移执行
const recordMigration = async (version: string, name: string): Promise<void> => {
  await executeQuery(
    'INSERT INTO migrations (version, name) VALUES ($1, $2)',
    [version, name]
  );
};

// 读取SQL文件
const readSQLFile = (filename: string): string => {
  const filePath = join(__dirname, 'schema', filename);
  return readFileSync(filePath, 'utf-8');
};

// 执行SQL脚本
const executeSQLScript = async (sql: string): Promise<void> => {
  // 分割SQL语句（简单的分割，实际项目中可能需要更复杂的解析）
  const statements = sql
    .split(';')
    .map(stmt => stmt.trim())
    .filter(stmt => stmt.length > 0 && !stmt.startsWith('--'));

  for (const statement of statements) {
    if (statement.trim()) {
      await executeQuery(statement);
    }
  }
};

// 定义迁移脚本
const migrations: Migration[] = [
  {
    version: '001',
    name: 'create_users_table',
    up: readSQLFile('users.sql')
  },
  {
    version: '002',
    name: 'create_categories_table',
    up: readSQLFile('categories.sql')
  },
  {
    version: '003',
    name: 'create_articles_table',
    up: readSQLFile('articles.sql')
  },
  {
    version: '004',
    name: 'create_tags_table',
    up: readSQLFile('tags.sql')
  }
];

// 执行迁移
export const runMigrations = async (): Promise<void> => {
  try {
    console.log('🚀 开始执行数据库迁移...');
    
    // 确保数据库连接
    const connected = await connectPostgreSQL();
    if (!connected) {
      throw new Error('无法连接到PostgreSQL数据库');
    }

    // 创建迁移记录表
    await createMigrationsTable();

    // 执行迁移
    for (const migration of migrations) {
      const isExecuted = await isMigrationExecuted(migration.version);
      
      if (!isExecuted) {
        console.log(`📝 执行迁移: ${migration.version} - ${migration.name}`);
        await executeSQLScript(migration.up);
        await recordMigration(migration.version, migration.name);
        console.log(`✅ 迁移完成: ${migration.version} - ${migration.name}`);
      } else {
        console.log(`⏭️  跳过已执行的迁移: ${migration.version} - ${migration.name}`);
      }
    }

    console.log('🎉 所有迁移执行完成!');
  } catch (error) {
    console.error('❌ 迁移执行失败:', error);
    throw error;
  }
};

// 初始化数据库（包含示例数据）
export const initializeDatabase = async (): Promise<void> => {
  try {
    console.log('🚀 开始初始化数据库...');
    
    // 先执行迁移
    await runMigrations();
    
    // 插入初始数据
    console.log('📝 插入初始数据...');
    
    // 插入默认分类
    const categoriesSQL = `
      INSERT INTO categories (name, description, slug, sort_order) VALUES
      ('技术', '技术相关文章', 'technology', 1),
      ('生活', '生活感悟和经验分享', 'life', 2),
      ('学习', '学习笔记和心得', 'study', 3),
      ('随笔', '随意记录的想法', 'notes', 4)
      ON CONFLICT (name) DO NOTHING;
    `;
    await executeQuery(categoriesSQL);
    
    // 插入默认标签
    const tagsSQL = `
      INSERT INTO tags (name, description, slug, color) VALUES
      ('JavaScript', 'JavaScript相关内容', 'javascript', '#f7df1e'),
      ('Node.js', 'Node.js相关内容', 'nodejs', '#339933'),
      ('PostgreSQL', 'PostgreSQL数据库相关', 'postgresql', '#336791'),
      ('API', 'API开发相关', 'api', '#ff6b6b'),
      ('教程', '教程类文章', 'tutorial', '#4ecdc4'),
      ('经验分享', '经验分享类文章', 'experience', '#45b7d1')
      ON CONFLICT (name) DO NOTHING;
    `;
    await executeQuery(tagsSQL);
    
    console.log('✅ 初始数据插入完成');
    console.log('🎉 数据库初始化完成!');
  } catch (error) {
    console.error('❌ 数据库初始化失败:', error);
    throw error;
  }
};

// 如果直接运行此文件，则执行初始化
if (require.main === module) {
  initializeDatabase()
    .then(() => {
      console.log('数据库初始化成功');
      process.exit(0);
    })
    .catch((error) => {
      console.error('数据库初始化失败:', error);
      process.exit(1);
    });
}