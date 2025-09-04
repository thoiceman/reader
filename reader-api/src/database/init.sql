-- Reader API PostgreSQL 数据库初始化脚本
-- 创建数据库（如果不存在）
-- CREATE DATABASE reader_db;

-- 连接到数据库
-- \c reader_db;

-- 启用必要的扩展
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pg_trgm";

-- 执行表结构创建脚本
\i users.sql
\i categories.sql
\i articles.sql
\i tags.sql

-- 插入初始数据

-- 插入默认分类
INSERT INTO categories (name, description, slug, sort_order) VALUES
('技术', '技术相关文章', 'technology', 1),
('生活', '生活感悟和经验分享', 'life', 2),
('学习', '学习笔记和心得', 'study', 3),
('随笔', '随意记录的想法', 'notes', 4)
ON CONFLICT (name) DO NOTHING;

-- 插入默认标签
INSERT INTO tags (name, description, slug, color) VALUES
('JavaScript', 'JavaScript相关内容', 'javascript', '#f7df1e'),
('Node.js', 'Node.js相关内容', 'nodejs', '#339933'),
('PostgreSQL', 'PostgreSQL数据库相关', 'postgresql', '#336791'),
('API', 'API开发相关', 'api', '#ff6b6b'),
('教程', '教程类文章', 'tutorial', '#4ecdc4'),
('经验分享', '经验分享类文章', 'experience', '#45b7d1')
ON CONFLICT (name) DO NOTHING;

-- 插入测试用户（密码为bcrypt加密的'password123'）
INSERT INTO users (username, email, password, first_name, last_name, is_active) VALUES
('admin', 'admin@example.com', '$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewdBPj6hsxq9w5KS', 'Admin', 'User', true),
('testuser', 'test@example.com', '$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewdBPj6hsxq9w5KS', 'Test', 'User', true)
ON CONFLICT (username) DO NOTHING;

-- 插入示例文章
INSERT INTO articles (title, content, summary, author_id, category_id, status, published_at) VALUES
(
    '从MongoDB迁移到PostgreSQL的完整指南',
    '本文详细介绍了如何将Node.js应用从MongoDB迁移到PostgreSQL，包括数据模型重构、查询语句转换等关键步骤...',
    '详细介绍MongoDB到PostgreSQL的迁移过程',
    1,
    1,
    'published',
    CURRENT_TIMESTAMP
),
(
    'PostgreSQL高级查询技巧',
    '探讨PostgreSQL中的高级查询技巧，包括窗口函数、CTE、全文搜索等功能的使用...',
    'PostgreSQL高级功能使用指南',
    1,
    1,
    'published',
    CURRENT_TIMESTAMP
),
(
    'Node.js API开发最佳实践',
    '分享Node.js API开发中的最佳实践，包括错误处理、安全性、性能优化等方面...',
    'Node.js API开发经验总结',
    2,
    1,
    'draft',
    NULL
)
ON CONFLICT (title) DO NOTHING;

-- 为文章添加标签关联
INSERT INTO article_tags (article_id, tag_id)
SELECT a.id, t.id
FROM articles a, tags t
WHERE (a.title = '从MongoDB迁移到PostgreSQL的完整指南' AND t.name IN ('PostgreSQL', '教程', '经验分享'))
   OR (a.title = 'PostgreSQL高级查询技巧' AND t.name IN ('PostgreSQL', '教程'))
   OR (a.title = 'Node.js API开发最佳实践' AND t.name IN ('Node.js', 'API', '教程'))
ON CONFLICT (article_id, tag_id) DO NOTHING;

-- 创建视图：文章详情视图（包含作者和分类信息）
CREATE OR REPLACE VIEW article_details AS
SELECT 
    a.id,
    a.title,
    a.content,
    a.summary,
    a.slug,
    a.status,
    a.view_count,
    a.like_count,
    a.featured_image,
    a.published_at,
    a.created_at,
    a.updated_at,
    u.username as author_username,
    u.first_name as author_first_name,
    u.last_name as author_last_name,
    c.name as category_name,
    c.slug as category_slug,
    ARRAY_AGG(DISTINCT t.name) as tags
FROM articles a
LEFT JOIN users u ON a.author_id = u.id
LEFT JOIN categories c ON a.category_id = c.id
LEFT JOIN article_tags at ON a.id = at.article_id
LEFT JOIN tags t ON at.tag_id = t.id
GROUP BY a.id, u.username, u.first_name, u.last_name, c.name, c.slug;

-- 创建函数：搜索文章
CREATE OR REPLACE FUNCTION search_articles(search_term TEXT)
RETURNS TABLE(
    id INTEGER,
    title VARCHAR(255),
    summary TEXT,
    author_username VARCHAR(30),
    category_name VARCHAR(100),
    published_at TIMESTAMP WITH TIME ZONE,
    rank REAL
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        a.id,
        a.title,
        a.summary,
        u.username,
        c.name,
        a.published_at,
        ts_rank(to_tsvector('english', a.title || ' ' || a.content), plainto_tsquery('english', search_term)) as rank
    FROM articles a
    LEFT JOIN users u ON a.author_id = u.id
    LEFT JOIN categories c ON a.category_id = c.id
    WHERE a.status = 'published'
    AND (to_tsvector('english', a.title || ' ' || a.content) @@ plainto_tsquery('english', search_term))
    ORDER BY rank DESC, a.published_at DESC;
END;
$$ LANGUAGE plpgsql;

-- 完成初始化
SELECT 'Database initialization completed successfully!' as status;