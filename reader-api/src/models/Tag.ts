import { executeQuery } from '../config/postgresql';

// 标签接口
export interface ITag {
  id?: number;
  name: string;
  description?: string;
  slug?: string;
  color?: string;
  isActive: boolean;
  createdAt?: Date;
  updatedAt?: Date;
  // 关联数据
  articleCount?: number;
}

// 标签创建接口
export interface ICreateTag {
  name: string;
  description?: string;
  color?: string;
}

// 标签更新接口
export interface IUpdateTag {
  name?: string;
  description?: string;
  color?: string;
  isActive?: boolean;
}

// 标签查询选项
export interface ITagQueryOptions {
  limit?: number;
  offset?: number;
  orderBy?: string;
  orderDirection?: 'ASC' | 'DESC';
  isActive?: boolean;
  search?: string;
  includeArticleCount?: boolean;
}

// 标签模型类
export class Tag {
  // 创建标签
  static async create(tagData: ICreateTag): Promise<ITag> {
    const {
      name,
      description,
      color
    } = tagData;

    const query = `
      INSERT INTO tags (name, description, color)
      VALUES ($1, $2, $3)
      RETURNING *
    `;
    
    const values = [
      name,
      description || null,
      color || null
    ];

    const result = await executeQuery(query, values);
    return result[0] as ITag;
  }

  // 根据ID查找标签
  static async findById(id: number, options: Partial<ITagQueryOptions> = {}): Promise<ITag | null> {
    const { includeArticleCount = false } = options;

    let selectFields = 't.*';
    let joins = '';

    if (includeArticleCount) {
      selectFields += ', COALESCE(ac.article_count, 0) as article_count';
      joins += ` LEFT JOIN (
        SELECT tag_id, COUNT(*) as article_count 
        FROM article_tags at
        INNER JOIN articles a ON at.article_id = a.id
        WHERE a.status = 'published'
        GROUP BY tag_id
      ) ac ON t.id = ac.tag_id`;
    }

    const query = `SELECT ${selectFields} FROM tags t${joins} WHERE t.id = $1 AND t.is_active = true`;
    
    const result = await executeQuery(query, [id]);
    
    if (result.length === 0) {
      return null;
    }

    return this.formatTagResult(result[0], includeArticleCount);
  }

  // 根据slug查找标签
  static async findBySlug(slug: string, options: Partial<ITagQueryOptions> = {}): Promise<ITag | null> {
    const { includeArticleCount = false } = options;

    let selectFields = 't.*';
    let joins = '';

    if (includeArticleCount) {
      selectFields += ', COALESCE(ac.article_count, 0) as article_count';
      joins += ` LEFT JOIN (
        SELECT tag_id, COUNT(*) as article_count 
        FROM article_tags at
        INNER JOIN articles a ON at.article_id = a.id
        WHERE a.status = 'published'
        GROUP BY tag_id
      ) ac ON t.id = ac.tag_id`;
    }

    const query = `SELECT ${selectFields} FROM tags t${joins} WHERE t.slug = $1 AND t.is_active = true`;
    
    const result = await executeQuery(query, [slug]);
    
    if (result.length === 0) {
      return null;
    }

    return this.formatTagResult(result[0], includeArticleCount);
  }

  // 根据名称查找标签
  static async findByName(name: string, options: Partial<ITagQueryOptions> = {}): Promise<ITag | null> {
    const { includeArticleCount = false } = options;

    let selectFields = 't.*';
    let joins = '';

    if (includeArticleCount) {
      selectFields += ', COALESCE(ac.article_count, 0) as article_count';
      joins += ` LEFT JOIN (
        SELECT tag_id, COUNT(*) as article_count 
        FROM article_tags at
        INNER JOIN articles a ON at.article_id = a.id
        WHERE a.status = 'published'
        GROUP BY tag_id
      ) ac ON t.id = ac.tag_id`;
    }

    const query = `SELECT ${selectFields} FROM tags t${joins} WHERE t.name = $1 AND t.is_active = true`;
    
    const result = await executeQuery(query, [name]);
    
    if (result.length === 0) {
      return null;
    }

    return this.formatTagResult(result[0], includeArticleCount);
  }

  // 查找所有标签
  static async findAll(options: ITagQueryOptions = {}): Promise<ITag[]> {
    const {
      limit = 50,
      offset = 0,
      orderBy = 'name',
      orderDirection = 'ASC',
      isActive = true,
      search,
      includeArticleCount = false
    } = options;

    let selectFields = 't.*';
    let joins = '';
    let whereConditions = ['1=1'];
    const values: any[] = [];
    let paramCount = 0;

    if (includeArticleCount) {
      selectFields += ', COALESCE(ac.article_count, 0) as article_count';
      joins += ` LEFT JOIN (
        SELECT tag_id, COUNT(*) as article_count 
        FROM article_tags at
        INNER JOIN articles a ON at.article_id = a.id
        WHERE a.status = 'published'
        GROUP BY tag_id
      ) ac ON t.id = ac.tag_id`;
    }

    // 构建WHERE条件
    if (isActive !== undefined) {
      paramCount++;
      whereConditions.push(`t.is_active = $${paramCount}`);
      values.push(isActive);
    }

    if (search) {
      paramCount++;
      whereConditions.push(`(t.name ILIKE $${paramCount} OR t.description ILIKE $${paramCount})`);
      values.push(`%${search}%`);
    }

    const query = `
      SELECT ${selectFields}
      FROM tags t${joins}
      WHERE ${whereConditions.join(' AND ')}
      ORDER BY t.${orderBy} ${orderDirection}
      LIMIT $${paramCount + 1} OFFSET $${paramCount + 2}
    `;
    
    values.push(limit, offset);

    const result = await executeQuery(query, values);
    return result.map(row => this.formatTagResult(row, includeArticleCount));
  }

  // 获取热门标签
  static async getPopularTags(limit: number = 10): Promise<ITag[]> {
    const query = `
      SELECT t.*, COUNT(at.article_id) as article_count
      FROM tags t
      INNER JOIN article_tags at ON t.id = at.tag_id
      INNER JOIN articles a ON at.article_id = a.id
      WHERE t.is_active = true AND a.status = 'published'
      GROUP BY t.id, t.name, t.description, t.slug, t.color, t.is_active, t.created_at, t.updated_at
      ORDER BY article_count DESC, t.name ASC
      LIMIT $1
    `;
    
    const result = await executeQuery(query, [limit]);
    return result.map(row => this.formatTagResult(row, true));
  }

  // 根据文章ID获取标签
  static async findByArticleId(articleId: number): Promise<ITag[]> {
    const query = `
      SELECT t.*
      FROM tags t
      INNER JOIN article_tags at ON t.id = at.tag_id
      WHERE at.article_id = $1 AND t.is_active = true
      ORDER BY t.name ASC
    `;
    
    const result = await executeQuery(query, [articleId]);
    return result.map(row => this.formatTagResult(row, false));
  }

  // 批量根据ID查找标签
  static async findByIds(ids: number[]): Promise<ITag[]> {
    if (ids.length === 0) {
      return [];
    }

    const query = `
      SELECT *
      FROM tags
      WHERE id = ANY($1) AND is_active = true
      ORDER BY name ASC
    `;
    
    const result = await executeQuery(query, [ids]);
    return result.map(row => this.formatTagResult(row, false));
  }

  // 更新标签
  static async updateById(id: number, updateData: IUpdateTag): Promise<ITag | null> {
    const fields: string[] = [];
    const values: any[] = [];
    let paramCount = 0;

    // 动态构建更新字段
    Object.entries(updateData).forEach(([key, value]) => {
      if (value !== undefined) {
        paramCount++;
        const dbField = key === 'isActive' ? 'is_active' : key;
        fields.push(`${dbField} = $${paramCount}`);
        values.push(value);
      }
    });

    if (fields.length === 0) {
      throw new Error('没有提供更新字段');
    }

    paramCount++;
    const query = `
      UPDATE tags 
      SET ${fields.join(', ')}, updated_at = CURRENT_TIMESTAMP
      WHERE id = $${paramCount} AND is_active = true
      RETURNING *
    `;
    values.push(id);

    const result = await executeQuery(query, values);
    return result.length > 0 ? this.formatTagResult(result[0], false) : null;
  }

  // 软删除标签
  static async deleteById(id: number): Promise<boolean> {
    await executeQuery('BEGIN');
    
    try {
      // 删除文章标签关联
      await executeQuery('DELETE FROM article_tags WHERE tag_id = $1', [id]);
      
      // 软删除标签
      const result = await executeQuery(
        `UPDATE tags 
         SET is_active = false, updated_at = CURRENT_TIMESTAMP
         WHERE id = $1 AND is_active = true
         RETURNING id`,
        [id]
      );
      
      await executeQuery('COMMIT');
      return result.length > 0;
    } catch (error) {
      await executeQuery('ROLLBACK');
      throw error;
    }
  }

  // 统计标签数量
  static async count(options: Partial<ITagQueryOptions> = {}): Promise<number> {
    const { isActive = true, search } = options;
    
    let whereConditions = ['1=1'];
    const values: any[] = [];
    let paramCount = 0;

    if (isActive !== undefined) {
      paramCount++;
      whereConditions.push(`is_active = $${paramCount}`);
      values.push(isActive);
    }

    if (search) {
      paramCount++;
      whereConditions.push(`(name ILIKE $${paramCount} OR description ILIKE $${paramCount})`);
      values.push(`%${search}%`);
    }

    const query = `SELECT COUNT(*) as count FROM tags WHERE ${whereConditions.join(' AND ')}`;
    const result = await executeQuery(query, values);
    return parseInt(result[0].count);
  }

  // 检查标签名称是否存在
  static async isNameExists(name: string, excludeId?: number): Promise<boolean> {
    let query = 'SELECT COUNT(*) as count FROM tags WHERE name = $1 AND is_active = true';
    const values: any[] = [name];
    
    if (excludeId) {
      query += ' AND id != $2';
      values.push(excludeId);
    }
    
    const result = await executeQuery(query, values);
    return parseInt(result[0].count) > 0;
  }

  // 检查slug是否存在
  static async isSlugExists(slug: string, excludeId?: number): Promise<boolean> {
    let query = 'SELECT COUNT(*) as count FROM tags WHERE slug = $1 AND is_active = true';
    const values: any[] = [slug];
    
    if (excludeId) {
      query += ' AND id != $2';
      values.push(excludeId);
    }
    
    const result = await executeQuery(query, values);
    return parseInt(result[0].count) > 0;
  }

  // 创建或查找标签（用于文章标签关联）
  static async findOrCreate(name: string, options: { description?: string; color?: string } = {}): Promise<ITag> {
    // 先尝试查找
    const existingTag = await this.findByName(name);
    if (existingTag) {
      return existingTag;
    }

    // 不存在则创建
    return await this.create({
      name,
      description: options.description,
      color: options.color
    });
  }

  // 批量创建或查找标签
  static async findOrCreateMany(tagNames: string[]): Promise<ITag[]> {
    const tags: ITag[] = [];
    
    for (const name of tagNames) {
      const tag = await this.findOrCreate(name.trim());
      tags.push(tag);
    }
    
    return tags;
  }

  // 获取未使用的标签
  static async getUnusedTags(): Promise<ITag[]> {
    const query = `
      SELECT t.*
      FROM tags t
      LEFT JOIN article_tags at ON t.id = at.tag_id
      WHERE t.is_active = true AND at.tag_id IS NULL
      ORDER BY t.created_at DESC
    `;
    
    const result = await executeQuery(query);
    return result.map(row => this.formatTagResult(row, false));
  }

  // 清理未使用的标签
  static async cleanupUnusedTags(): Promise<number> {
    const query = `
      UPDATE tags 
      SET is_active = false, updated_at = CURRENT_TIMESTAMP
      WHERE is_active = true 
      AND id NOT IN (
        SELECT DISTINCT tag_id 
        FROM article_tags 
        WHERE tag_id IS NOT NULL
      )
      RETURNING id
    `;
    
    const result = await executeQuery(query);
    return result.length;
  }

  // 合并标签（将sourceTagId的所有关联转移到targetTagId）
  static async mergeTags(sourceTagId: number, targetTagId: number): Promise<void> {
    await executeQuery('BEGIN');
    
    try {
      // 更新文章标签关联
      await executeQuery(
        `UPDATE article_tags 
         SET tag_id = $1 
         WHERE tag_id = $2 
         AND article_id NOT IN (
           SELECT article_id 
           FROM article_tags 
           WHERE tag_id = $1
         )`,
        [targetTagId, sourceTagId]
      );
      
      // 删除重复的关联
      await executeQuery(
        'DELETE FROM article_tags WHERE tag_id = $1',
        [sourceTagId]
      );
      
      // 软删除源标签
      await executeQuery(
        'UPDATE tags SET is_active = false, updated_at = CURRENT_TIMESTAMP WHERE id = $1',
        [sourceTagId]
      );
      
      await executeQuery('COMMIT');
    } catch (error) {
      await executeQuery('ROLLBACK');
      throw error;
    }
  }

  // 格式化标签结果
  private static formatTagResult(row: any, includeArticleCount: boolean): ITag {
    const tag: ITag = {
      id: row.id,
      name: row.name,
      description: row.description,
      slug: row.slug,
      color: row.color,
      isActive: row.is_active,
      createdAt: row.created_at,
      updatedAt: row.updated_at
    };

    if (includeArticleCount && row.article_count !== undefined) {
      tag.articleCount = parseInt(row.article_count);
    }

    return tag;
  }
}