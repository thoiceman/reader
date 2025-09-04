import { executeQuery } from '../config/postgresql';

// 分类接口
export interface ICategory {
  id?: number;
  name: string;
  description?: string;
  slug?: string;
  parentId?: number;
  sortOrder: number;
  isActive: boolean;
  createdAt?: Date;
  updatedAt?: Date;
  // 关联数据
  parent?: {
    id: number;
    name: string;
    slug: string;
  };
  children?: ICategory[];
  articleCount?: number;
}

// 分类创建接口
export interface ICreateCategory {
  name: string;
  description?: string;
  parentId?: number;
  sortOrder?: number;
}

// 分类更新接口
export interface IUpdateCategory {
  name?: string;
  description?: string;
  parentId?: number;
  sortOrder?: number;
  isActive?: boolean;
}

// 分类查询选项
export interface ICategoryQueryOptions {
  limit?: number;
  offset?: number;
  orderBy?: string;
  orderDirection?: 'ASC' | 'DESC';
  isActive?: boolean;
  parentId?: number;
  includeParent?: boolean;
  includeChildren?: boolean;
  includeArticleCount?: boolean;
}

// 分类模型类
export class Category {
  // 创建分类
  static async create(categoryData: ICreateCategory): Promise<ICategory> {
    const {
      name,
      description,
      parentId,
      sortOrder = 0
    } = categoryData;

    const query = `
      INSERT INTO categories (name, description, parent_id, sort_order)
      VALUES ($1, $2, $3, $4)
      RETURNING *
    `;
    
    const values = [
      name,
      description || null,
      parentId || null,
      sortOrder
    ];

    const result = await executeQuery(query, values);
    return result[0] as ICategory;
  }

  // 根据ID查找分类
  static async findById(id: number, options: Partial<ICategoryQueryOptions> = {}): Promise<ICategory | null> {
    const {
      includeParent = false,
      includeChildren = false,
      includeArticleCount = false
    } = options;

    let selectFields = 'c.*';
    let joins = '';

    if (includeParent) {
      selectFields += ', p.name as parent_name, p.slug as parent_slug';
      joins += ' LEFT JOIN categories p ON c.parent_id = p.id';
    }

    if (includeArticleCount) {
      selectFields += ', COALESCE(ac.article_count, 0) as article_count';
      joins += ` LEFT JOIN (
        SELECT category_id, COUNT(*) as article_count 
        FROM articles 
        WHERE status = 'published' 
        GROUP BY category_id
      ) ac ON c.id = ac.category_id`;
    }

    const query = `SELECT ${selectFields} FROM categories c${joins} WHERE c.id = $1 AND c.is_active = true`;
    
    const result = await executeQuery(query, [id]);
    
    if (result.length === 0) {
      return null;
    }

    const category = this.formatCategoryResult(result[0], includeParent, includeArticleCount);

    // 如果需要包含子分类
    if (includeChildren) {
      category.children = await this.getChildren(id);
    }

    return category;
  }

  // 根据slug查找分类
  static async findBySlug(slug: string, options: Partial<ICategoryQueryOptions> = {}): Promise<ICategory | null> {
    const {
      includeParent = false,
      includeChildren = false,
      includeArticleCount = false
    } = options;

    let selectFields = 'c.*';
    let joins = '';

    if (includeParent) {
      selectFields += ', p.name as parent_name, p.slug as parent_slug';
      joins += ' LEFT JOIN categories p ON c.parent_id = p.id';
    }

    if (includeArticleCount) {
      selectFields += ', COALESCE(ac.article_count, 0) as article_count';
      joins += ` LEFT JOIN (
        SELECT category_id, COUNT(*) as article_count 
        FROM articles 
        WHERE status = 'published' 
        GROUP BY category_id
      ) ac ON c.id = ac.category_id`;
    }

    const query = `SELECT ${selectFields} FROM categories c${joins} WHERE c.slug = $1 AND c.is_active = true`;
    
    const result = await executeQuery(query, [slug]);
    
    if (result.length === 0) {
      return null;
    }

    const category = this.formatCategoryResult(result[0], includeParent, includeArticleCount);

    // 如果需要包含子分类
    if (includeChildren) {
      category.children = await this.getChildren(category.id!);
    }

    return category;
  }

  // 查找所有分类
  static async findAll(options: ICategoryQueryOptions = {}): Promise<ICategory[]> {
    const {
      limit = 50,
      offset = 0,
      orderBy = 'sort_order',
      orderDirection = 'ASC',
      isActive = true,
      parentId,
      includeParent = false,
      includeChildren = false,
      includeArticleCount = false
    } = options;

    let selectFields = 'c.*';
    let joins = '';
    let whereConditions = ['1=1'];
    const values: any[] = [];
    let paramCount = 0;

    if (includeParent) {
      selectFields += ', p.name as parent_name, p.slug as parent_slug';
      joins += ' LEFT JOIN categories p ON c.parent_id = p.id';
    }

    if (includeArticleCount) {
      selectFields += ', COALESCE(ac.article_count, 0) as article_count';
      joins += ` LEFT JOIN (
        SELECT category_id, COUNT(*) as article_count 
        FROM articles 
        WHERE status = 'published' 
        GROUP BY category_id
      ) ac ON c.id = ac.category_id`;
    }

    // 构建WHERE条件
    if (isActive !== undefined) {
      paramCount++;
      whereConditions.push(`c.is_active = $${paramCount}`);
      values.push(isActive);
    }

    if (parentId !== undefined) {
      if (parentId === null) {
        whereConditions.push('c.parent_id IS NULL');
      } else {
        paramCount++;
        whereConditions.push(`c.parent_id = $${paramCount}`);
        values.push(parentId);
      }
    }

    const query = `
      SELECT ${selectFields}
      FROM categories c${joins}
      WHERE ${whereConditions.join(' AND ')}
      ORDER BY c.${orderBy} ${orderDirection}, c.name ASC
      LIMIT $${paramCount + 1} OFFSET $${paramCount + 2}
    `;
    
    values.push(limit, offset);

    const result = await executeQuery(query, values);
    const categories = result.map(row => this.formatCategoryResult(row, includeParent, includeArticleCount));

    // 如果需要包含子分类
    if (includeChildren) {
      for (const category of categories) {
        category.children = await this.getChildren(category.id!);
      }
    }

    return categories;
  }

  // 获取分类树
  static async getTree(): Promise<ICategory[]> {
    // 获取所有顶级分类
    const rootCategories = await this.findAll({
      parentId: undefined,
      includeArticleCount: true,
      orderBy: 'sort_order'
    });

    // 递归获取子分类
    for (const category of rootCategories) {
      category.children = await this.getChildrenRecursive(category.id!);
    }

    return rootCategories;
  }

  // 递归获取子分类
  private static async getChildrenRecursive(parentId: number): Promise<ICategory[]> {
    const children = await this.findAll({
      parentId,
      includeArticleCount: true,
      orderBy: 'sort_order'
    });

    for (const child of children) {
      child.children = await this.getChildrenRecursive(child.id!);
    }

    return children;
  }

  // 获取直接子分类
  private static async getChildren(parentId: number): Promise<ICategory[]> {
    return await this.findAll({
      parentId,
      includeArticleCount: true,
      orderBy: 'sort_order'
    });
  }

  // 更新分类
  static async updateById(id: number, updateData: IUpdateCategory): Promise<ICategory | null> {
    const fields: string[] = [];
    const values: any[] = [];
    let paramCount = 0;

    // 动态构建更新字段
    Object.entries(updateData).forEach(([key, value]) => {
      if (value !== undefined) {
        paramCount++;
        const dbField = key === 'parentId' ? 'parent_id' :
                       key === 'sortOrder' ? 'sort_order' :
                       key === 'isActive' ? 'is_active' : key;
        fields.push(`${dbField} = $${paramCount}`);
        values.push(value);
      }
    });

    if (fields.length === 0) {
      throw new Error('没有提供更新字段');
    }

    paramCount++;
    const query = `
      UPDATE categories 
      SET ${fields.join(', ')}, updated_at = CURRENT_TIMESTAMP
      WHERE id = $${paramCount} AND is_active = true
      RETURNING *
    `;
    values.push(id);

    const result = await executeQuery(query, values);
    return result.length > 0 ? (result[0] as ICategory) : null;
  }

  // 软删除分类
  static async deleteById(id: number): Promise<boolean> {
    // 检查是否有子分类
    const childrenCount = await this.count({ parentId: id });
    if (childrenCount > 0) {
      throw new Error('无法删除包含子分类的分类');
    }

    // 检查是否有关联文章
    const articleCountResult = await executeQuery(
      'SELECT COUNT(*) as count FROM articles WHERE category_id = $1',
      [id]
    );
    const articleCount = parseInt(articleCountResult[0].count);
    if (articleCount > 0) {
      throw new Error('无法删除包含文章的分类');
    }

    const query = `
      UPDATE categories 
      SET is_active = false, updated_at = CURRENT_TIMESTAMP
      WHERE id = $1 AND is_active = true
      RETURNING id
    `;
    
    const result = await executeQuery(query, [id]);
    return result.length > 0;
  }

  // 统计分类数量
  static async count(options: Partial<ICategoryQueryOptions> = {}): Promise<number> {
    const { isActive = true, parentId } = options;
    
    let whereConditions = ['1=1'];
    const values: any[] = [];
    let paramCount = 0;

    if (isActive !== undefined) {
      paramCount++;
      whereConditions.push(`is_active = $${paramCount}`);
      values.push(isActive);
    }

    if (parentId !== undefined) {
      if (parentId === null) {
        whereConditions.push('parent_id IS NULL');
      } else {
        paramCount++;
        whereConditions.push(`parent_id = $${paramCount}`);
        values.push(parentId);
      }
    }

    const query = `SELECT COUNT(*) as count FROM categories WHERE ${whereConditions.join(' AND ')}`;
    const result = await executeQuery(query, values);
    return parseInt(result[0].count);
  }

  // 检查分类名称是否存在
  static async isNameExists(name: string, excludeId?: number): Promise<boolean> {
    let query = 'SELECT COUNT(*) as count FROM categories WHERE name = $1 AND is_active = true';
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
    let query = 'SELECT COUNT(*) as count FROM categories WHERE slug = $1 AND is_active = true';
    const values: any[] = [slug];
    
    if (excludeId) {
      query += ' AND id != $2';
      values.push(excludeId);
    }
    
    const result = await executeQuery(query, values);
    return parseInt(result[0].count) > 0;
  }

  // 更新排序
  static async updateSortOrder(updates: Array<{ id: number; sortOrder: number }>): Promise<void> {
    await executeQuery('BEGIN');
    
    try {
      for (const update of updates) {
        await executeQuery(
          'UPDATE categories SET sort_order = $1, updated_at = CURRENT_TIMESTAMP WHERE id = $2',
          [update.sortOrder, update.id]
        );
      }
      
      await executeQuery('COMMIT');
    } catch (error) {
      await executeQuery('ROLLBACK');
      throw error;
    }
  }

  // 格式化分类结果
  private static formatCategoryResult(row: any, includeParent: boolean, includeArticleCount: boolean): ICategory {
    const category: ICategory = {
      id: row.id,
      name: row.name,
      description: row.description,
      slug: row.slug,
      parentId: row.parent_id,
      sortOrder: row.sort_order,
      isActive: row.is_active,
      createdAt: row.created_at,
      updatedAt: row.updated_at
    };

    if (includeParent && row.parent_name) {
      category.parent = {
        id: row.parent_id,
        name: row.parent_name,
        slug: row.parent_slug
      };
    }

    if (includeArticleCount && row.article_count !== undefined) {
      category.articleCount = parseInt(row.article_count);
    }

    return category;
  }
}