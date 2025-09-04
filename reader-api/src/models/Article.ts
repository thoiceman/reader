import { executeQuery } from '../config/postgresql';

// 文章接口
export interface IArticle {
  id?: number;
  title: string;
  content: string;
  summary?: string;
  slug?: string;
  authorId: number;
  categoryId?: number;
  status: 'draft' | 'published' | 'archived';
  featuredImage?: string;
  viewCount: number;
  likeCount: number;
  isPublic: boolean;
  publishedAt?: Date;
  createdAt?: Date;
  updatedAt?: Date;
  // 关联数据
  author?: {
    id: number;
    username: string;
    avatar?: string;
  };
  category?: {
    id: number;
    name: string;
    slug: string;
  };
  tags?: Array<{
    id: number;
    name: string;
    slug: string;
    color?: string;
  }>;
}

// 文章创建接口
export interface ICreateArticle {
  title: string;
  content: string;
  summary?: string;
  authorId: number;
  categoryId?: number;
  status?: 'draft' | 'published' | 'archived';
  featuredImage?: string;
  isPublic?: boolean;
  tagIds?: number[];
}

// 文章更新接口
export interface IUpdateArticle {
  title?: string;
  content?: string;
  summary?: string;
  categoryId?: number;
  status?: 'draft' | 'published' | 'archived';
  featuredImage?: string;
  isPublic?: boolean;
  tagIds?: number[];
}

// 文章查询选项
export interface IArticleQueryOptions {
  limit?: number;
  offset?: number;
  orderBy?: string;
  orderDirection?: 'ASC' | 'DESC';
  status?: 'draft' | 'published' | 'archived';
  authorId?: number;
  categoryId?: number;
  isPublic?: boolean;
  search?: string;
  tagIds?: number[];
  includeAuthor?: boolean;
  includeCategory?: boolean;
  includeTags?: boolean;
}

// 文章模型类
export class Article {
  // 创建文章
  static async create(articleData: ICreateArticle): Promise<IArticle> {
    const {
      title,
      content,
      summary,
      authorId,
      categoryId,
      status = 'draft',
      featuredImage,
      isPublic = true,
      tagIds = []
    } = articleData;

    // 开始事务
    const client = await executeQuery('BEGIN');
    
    try {
      // 插入文章
      const articleQuery = `
        INSERT INTO articles (title, content, summary, author_id, category_id, status, featured_image, is_public)
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
        RETURNING *
      `;
      
      const articleValues = [
        title,
        content,
        summary || null,
        authorId,
        categoryId || null,
        status,
        featuredImage || null,
        isPublic
      ];

      const articleResult = await executeQuery(articleQuery, articleValues);
      const article = articleResult[0] as IArticle;

      // 如果有标签，插入文章标签关联
      if (tagIds.length > 0) {
        const tagQuery = `
          INSERT INTO article_tags (article_id, tag_id)
          VALUES ${tagIds.map((_, index) => `($1, $${index + 2})`).join(', ')}
        `;
        const tagValues = [article.id, ...tagIds];
        await executeQuery(tagQuery, tagValues);
      }

      await executeQuery('COMMIT');
      return article;
    } catch (error) {
      await executeQuery('ROLLBACK');
      throw error;
    }
  }

  // 根据ID查找文章
  static async findById(id: number, options: Partial<IArticleQueryOptions> = {}): Promise<IArticle | null> {
    const {
      includeAuthor = false,
      includeCategory = false,
      includeTags = false
    } = options;

    let query = 'SELECT a.* FROM articles a WHERE a.id = $1';
    let selectFields = 'a.*';
    let joins = '';

    if (includeAuthor) {
      selectFields += ', u.username as author_username, u.avatar as author_avatar';
      joins += ' LEFT JOIN users u ON a.author_id = u.id';
    }

    if (includeCategory) {
      selectFields += ', c.name as category_name, c.slug as category_slug';
      joins += ' LEFT JOIN categories c ON a.category_id = c.id';
    }

    query = `SELECT ${selectFields} FROM articles a${joins} WHERE a.id = $1`;
    
    const result = await executeQuery(query, [id]);
    
    if (result.length === 0) {
      return null;
    }

    const article = this.formatArticleResult(result[0], includeAuthor, includeCategory);

    // 如果需要包含标签
    if (includeTags) {
      article.tags = await this.getArticleTags(id);
    }

    return article;
  }

  // 根据slug查找文章
  static async findBySlug(slug: string, options: Partial<IArticleQueryOptions> = {}): Promise<IArticle | null> {
    const {
      includeAuthor = false,
      includeCategory = false,
      includeTags = false
    } = options;

    let selectFields = 'a.*';
    let joins = '';

    if (includeAuthor) {
      selectFields += ', u.username as author_username, u.avatar as author_avatar';
      joins += ' LEFT JOIN users u ON a.author_id = u.id';
    }

    if (includeCategory) {
      selectFields += ', c.name as category_name, c.slug as category_slug';
      joins += ' LEFT JOIN categories c ON a.category_id = c.id';
    }

    const query = `SELECT ${selectFields} FROM articles a${joins} WHERE a.slug = $1 AND a.status = 'published'`;
    
    const result = await executeQuery(query, [slug]);
    
    if (result.length === 0) {
      return null;
    }

    const article = this.formatArticleResult(result[0], includeAuthor, includeCategory);

    // 如果需要包含标签
    if (includeTags) {
      article.tags = await this.getArticleTags(article.id!);
    }

    // 增加浏览量
    await this.incrementViewCount(article.id!);

    return article;
  }

  // 查找所有文章
  static async findAll(options: IArticleQueryOptions = {}): Promise<IArticle[]> {
    const {
      limit = 20,
      offset = 0,
      orderBy = 'created_at',
      orderDirection = 'DESC',
      status,
      authorId,
      categoryId,
      isPublic,
      search,
      tagIds = [],
      includeAuthor = false,
      includeCategory = false,
      includeTags = false
    } = options;

    let selectFields = 'DISTINCT a.*';
    let joins = '';
    let whereConditions = ['1=1'];
    const values: any[] = [];
    let paramCount = 0;

    // 构建JOIN语句
    if (includeAuthor) {
      selectFields += ', u.username as author_username, u.avatar as author_avatar';
      joins += ' LEFT JOIN users u ON a.author_id = u.id';
    }

    if (includeCategory) {
      selectFields += ', c.name as category_name, c.slug as category_slug';
      joins += ' LEFT JOIN categories c ON a.category_id = c.id';
    }

    if (tagIds.length > 0) {
      joins += ' INNER JOIN article_tags at ON a.id = at.article_id';
      paramCount++;
      whereConditions.push(`at.tag_id = ANY($${paramCount})`);
      values.push(tagIds);
    }

    // 构建WHERE条件
    if (status) {
      paramCount++;
      whereConditions.push(`a.status = $${paramCount}`);
      values.push(status);
    }

    if (authorId) {
      paramCount++;
      whereConditions.push(`a.author_id = $${paramCount}`);
      values.push(authorId);
    }

    if (categoryId) {
      paramCount++;
      whereConditions.push(`a.category_id = $${paramCount}`);
      values.push(categoryId);
    }

    if (isPublic !== undefined) {
      paramCount++;
      whereConditions.push(`a.is_public = $${paramCount}`);
      values.push(isPublic);
    }

    if (search) {
      paramCount++;
      whereConditions.push(`(a.title ILIKE $${paramCount} OR a.content ILIKE $${paramCount} OR a.summary ILIKE $${paramCount})`);
      values.push(`%${search}%`);
    }

    const query = `
      SELECT ${selectFields}
      FROM articles a${joins}
      WHERE ${whereConditions.join(' AND ')}
      ORDER BY a.${orderBy} ${orderDirection}
      LIMIT $${paramCount + 1} OFFSET $${paramCount + 2}
    `;
    
    values.push(limit, offset);

    const result = await executeQuery(query, values);
    const articles = result.map(row => this.formatArticleResult(row, includeAuthor, includeCategory));

    // 如果需要包含标签
    if (includeTags) {
      for (const article of articles) {
        article.tags = await this.getArticleTags(article.id!);
      }
    }

    return articles;
  }

  // 更新文章
  static async updateById(id: number, updateData: IUpdateArticle): Promise<IArticle | null> {
    const { tagIds, ...articleData } = updateData;
    
    // 开始事务
    await executeQuery('BEGIN');
    
    try {
      // 更新文章基本信息
      const fields: string[] = [];
      const values: any[] = [];
      let paramCount = 0;

      Object.entries(articleData).forEach(([key, value]) => {
        if (value !== undefined) {
          paramCount++;
          const dbField = key === 'authorId' ? 'author_id' :
                         key === 'categoryId' ? 'category_id' :
                         key === 'featuredImage' ? 'featured_image' :
                         key === 'isPublic' ? 'is_public' :
                         key === 'publishedAt' ? 'published_at' : key;
          fields.push(`${dbField} = $${paramCount}`);
          values.push(value);
        }
      });

      if (fields.length > 0) {
        paramCount++;
        const updateQuery = `
          UPDATE articles 
          SET ${fields.join(', ')}, updated_at = CURRENT_TIMESTAMP
          WHERE id = $${paramCount}
          RETURNING *
        `;
        values.push(id);
        
        const result = await executeQuery(updateQuery, values);
        if (result.length === 0) {
          await executeQuery('ROLLBACK');
          return null;
        }
      }

      // 更新标签关联
      if (tagIds !== undefined) {
        // 删除现有标签关联
        await executeQuery('DELETE FROM article_tags WHERE article_id = $1', [id]);
        
        // 插入新的标签关联
        if (tagIds.length > 0) {
          const tagQuery = `
            INSERT INTO article_tags (article_id, tag_id)
            VALUES ${tagIds.map((_, index) => `($1, $${index + 2})`).join(', ')}
          `;
          const tagValues = [id, ...tagIds];
          await executeQuery(tagQuery, tagValues);
        }
      }

      await executeQuery('COMMIT');
      
      // 返回更新后的文章
      return await this.findById(id, { includeAuthor: true, includeCategory: true, includeTags: true });
    } catch (error) {
      await executeQuery('ROLLBACK');
      throw error;
    }
  }

  // 删除文章
  static async deleteById(id: number): Promise<boolean> {
    await executeQuery('BEGIN');
    
    try {
      // 删除文章标签关联
      await executeQuery('DELETE FROM article_tags WHERE article_id = $1', [id]);
      
      // 删除文章
      const result = await executeQuery('DELETE FROM articles WHERE id = $1 RETURNING id', [id]);
      
      await executeQuery('COMMIT');
      return result.length > 0;
    } catch (error) {
      await executeQuery('ROLLBACK');
      throw error;
    }
  }

  // 增加浏览量
  static async incrementViewCount(id: number): Promise<void> {
    await executeQuery(
      'UPDATE articles SET view_count = view_count + 1, updated_at = CURRENT_TIMESTAMP WHERE id = $1',
      [id]
    );
  }

  // 增加点赞量
  static async incrementLikeCount(id: number): Promise<void> {
    await executeQuery(
      'UPDATE articles SET like_count = like_count + 1, updated_at = CURRENT_TIMESTAMP WHERE id = $1',
      [id]
    );
  }

  // 减少点赞量
  static async decrementLikeCount(id: number): Promise<void> {
    await executeQuery(
      'UPDATE articles SET like_count = GREATEST(like_count - 1, 0), updated_at = CURRENT_TIMESTAMP WHERE id = $1',
      [id]
    );
  }

  // 统计文章数量
  static async count(options: Partial<IArticleQueryOptions> = {}): Promise<number> {
    const { status, authorId, categoryId, isPublic } = options;
    
    let whereConditions = ['1=1'];
    const values: any[] = [];
    let paramCount = 0;

    if (status) {
      paramCount++;
      whereConditions.push(`status = $${paramCount}`);
      values.push(status);
    }

    if (authorId) {
      paramCount++;
      whereConditions.push(`author_id = $${paramCount}`);
      values.push(authorId);
    }

    if (categoryId) {
      paramCount++;
      whereConditions.push(`category_id = $${paramCount}`);
      values.push(categoryId);
    }

    if (isPublic !== undefined) {
      paramCount++;
      whereConditions.push(`is_public = $${paramCount}`);
      values.push(isPublic);
    }

    const query = `SELECT COUNT(*) as count FROM articles WHERE ${whereConditions.join(' AND ')}`;
    const result = await executeQuery(query, values);
    return parseInt(result[0].count);
  }

  // 获取文章标签
  private static async getArticleTags(articleId: number): Promise<Array<{ id: number; name: string; slug: string; color?: string }>> {
    const query = `
      SELECT t.id, t.name, t.slug, t.color
      FROM tags t
      INNER JOIN article_tags at ON t.id = at.tag_id
      WHERE at.article_id = $1
      ORDER BY t.name
    `;
    
    const result = await executeQuery(query, [articleId]);
    return result as Array<{ id: number; name: string; slug: string; color?: string }>;
  }

  // 格式化文章结果
  private static formatArticleResult(row: any, includeAuthor: boolean, includeCategory: boolean): IArticle {
    const article: IArticle = {
      id: row.id,
      title: row.title,
      content: row.content,
      summary: row.summary,
      slug: row.slug,
      authorId: row.author_id,
      categoryId: row.category_id,
      status: row.status,
      featuredImage: row.featured_image,
      viewCount: row.view_count,
      likeCount: row.like_count,
      isPublic: row.is_public,
      publishedAt: row.published_at,
      createdAt: row.created_at,
      updatedAt: row.updated_at
    };

    if (includeAuthor && row.author_username) {
      article.author = {
        id: row.author_id,
        username: row.author_username,
        avatar: row.author_avatar
      };
    }

    if (includeCategory && row.category_name) {
      article.category = {
        id: row.category_id,
        name: row.category_name,
        slug: row.category_slug
      };
    }

    return article;
  }

  // 发布文章
  static async publish(id: number): Promise<IArticle | null> {
    const query = `
      UPDATE articles 
      SET status = 'published', published_at = CURRENT_TIMESTAMP, updated_at = CURRENT_TIMESTAMP
      WHERE id = $1 AND status = 'draft'
      RETURNING *
    `;
    
    const result = await executeQuery(query, [id]);
    return result.length > 0 ? (result[0] as IArticle) : null;
  }

  // 归档文章
  static async archive(id: number): Promise<IArticle | null> {
    const query = `
      UPDATE articles 
      SET status = 'archived', updated_at = CURRENT_TIMESTAMP
      WHERE id = $1 AND status IN ('draft', 'published')
      RETURNING *
    `;
    
    const result = await executeQuery(query, [id]);
    return result.length > 0 ? (result[0] as IArticle) : null;
  }
}