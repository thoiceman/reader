import { Request, Response } from 'express';
import { Category, ICategory } from '../models/Category';

// 创建分类
export const createCategory = async (req: Request, res: Response): Promise<void> => {
  try {
    const { name, description, parentId, sortOrder } = req.body;

    // 检查分类名称是否已存在
    const nameExists = await Category.isNameExists(name);
    if (nameExists) {
      res.status(400).json({
        success: false,
        message: '分类名称已存在'
      });
      return;
    }

    const newCategory = await Category.create({
      name,
      description,
      parentId,
      sortOrder
    });

    res.status(201).json({
      success: true,
      message: '分类创建成功',
      data: { category: newCategory }
    });
  } catch (error: any) {
    console.error('创建分类错误:', error);
    res.status(500).json({
      success: false,
      message: '服务器内部错误',
      error: error.message
    });
  }
};

// 获取所有分类
export const getCategories = async (req: Request, res: Response): Promise<void> => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 50;
    const offset = (page - 1) * limit;
    const parentId = req.query.parentId ? parseInt(req.query.parentId as string) : undefined;
    const includeChildren = req.query.includeChildren === 'true';
    const includeParent = req.query.includeParent === 'true';
    const includeArticleCount = req.query.includeArticleCount === 'true';

    const categories = await Category.findAll({
      limit,
      offset,
      orderBy: 'sort_order',
      orderDirection: 'ASC',
      isActive: true,
      parentId,
      includeParent,
      includeChildren,
      includeArticleCount
    });

    const total = await Category.count({ isActive: true, parentId });

    res.json({
      success: true,
      data: {
        categories,
        pagination: {
          current: page,
          pages: Math.ceil(total / limit),
          total
        }
      }
    });
  } catch (error: any) {
    console.error('获取分类列表错误:', error);
    res.status(500).json({
      success: false,
      message: '服务器内部错误',
      error: error.message
    });
  }
};

// 根据ID获取分类
export const getCategoryById = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const categoryId = parseInt(id);
    const includeChildren = req.query.includeChildren === 'true';
    const includeParent = req.query.includeParent === 'true';
    const includeArticleCount = req.query.includeArticleCount === 'true';

    if (isNaN(categoryId)) {
      res.status(400).json({
        success: false,
        message: '无效的分类ID'
      });
      return;
    }

    const category = await Category.findById(categoryId, {
      includeParent,
      includeChildren,
      includeArticleCount
    });

    if (!category) {
      res.status(404).json({
        success: false,
        message: '分类不存在'
      });
      return;
    }

    res.json({
      success: true,
      data: { category }
    });
  } catch (error: any) {
    console.error('获取分类错误:', error);
    res.status(500).json({
      success: false,
      message: '服务器内部错误',
      error: error.message
    });
  }
};

// 根据slug获取分类
export const getCategoryBySlug = async (req: Request, res: Response): Promise<void> => {
  try {
    const { slug } = req.params;
    const includeChildren = req.query.includeChildren === 'true';
    const includeParent = req.query.includeParent === 'true';
    const includeArticleCount = req.query.includeArticleCount === 'true';

    const category = await Category.findBySlug(slug, {
      includeParent,
      includeChildren,
      includeArticleCount
    });

    if (!category) {
      res.status(404).json({
        success: false,
        message: '分类不存在'
      });
      return;
    }

    res.json({
      success: true,
      data: { category }
    });
  } catch (error: any) {
    console.error('获取分类错误:', error);
    res.status(500).json({
      success: false,
      message: '服务器内部错误',
      error: error.message
    });
  }
};

// 更新分类
export const updateCategory = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const categoryId = parseInt(id);
    const updateData = req.body;

    if (isNaN(categoryId)) {
      res.status(400).json({
        success: false,
        message: '无效的分类ID'
      });
      return;
    }

    // 检查分类名称唯一性（如果要更新的话）
    if (updateData.name) {
      const nameExists = await Category.isNameExists(updateData.name, categoryId);
      if (nameExists) {
        res.status(400).json({
          success: false,
          message: '分类名称已存在'
        });
        return;
      }
    }

    // 检查slug唯一性（如果要更新的话）
    if (updateData.slug) {
      const slugExists = await Category.isSlugExists(updateData.slug, categoryId);
      if (slugExists) {
        res.status(400).json({
          success: false,
          message: '分类slug已存在'
        });
        return;
      }
    }

    const updatedCategory = await Category.updateById(categoryId, updateData);

    if (!updatedCategory) {
      res.status(404).json({
        success: false,
        message: '分类不存在'
      });
      return;
    }

    res.json({
      success: true,
      message: '分类更新成功',
      data: { category: updatedCategory }
    });
  } catch (error: any) {
    console.error('更新分类错误:', error);
    res.status(500).json({
      success: false,
      message: '服务器内部错误',
      error: error.message
    });
  }
};

// 删除分类（软删除）
export const deleteCategory = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const categoryId = parseInt(id);

    if (isNaN(categoryId)) {
      res.status(400).json({
        success: false,
        message: '无效的分类ID'
      });
      return;
    }

    const deleted = await Category.deleteById(categoryId);

    if (!deleted) {
      res.status(404).json({
        success: false,
        message: '分类不存在'
      });
      return;
    }

    res.json({
      success: true,
      message: '分类删除成功'
    });
  } catch (error: any) {
    console.error('删除分类错误:', error);
    res.status(500).json({
      success: false,
      message: '服务器内部错误',
      error: error.message
    });
  }
};

// 获取分类树结构
export const getCategoryTree = async (req: Request, res: Response): Promise<void> => {
  try {
    const includeArticleCount = req.query.includeArticleCount === 'true';

    // 获取所有顶级分类（parentId为null）
    const rootCategories = await Category.findAll({
      orderBy: 'sort_order',
      orderDirection: 'ASC',
      isActive: true,
      parentId: undefined,
      includeChildren: true,
      includeArticleCount
    });

    res.json({
      success: true,
      data: { categories: rootCategories }
    });
  } catch (error: any) {
    console.error('获取分类树错误:', error);
    res.status(500).json({
      success: false,
      message: '服务器内部错误',
      error: error.message
    });
  }
};

// 更新分类排序
export const updateCategorySort = async (req: Request, res: Response): Promise<void> => {
  try {
    const { sortData } = req.body; // [{ id: 1, sortOrder: 1 }, { id: 2, sortOrder: 2 }]

    if (!Array.isArray(sortData)) {
      res.status(400).json({
        success: false,
        message: '排序数据格式错误'
      });
      return;
    }

    // 批量更新排序
    for (const item of sortData) {
      if (item.id && typeof item.sortOrder === 'number') {
        await Category.updateById(item.id, { sortOrder: item.sortOrder });
      }
    }

    res.json({
      success: true,
      message: '分类排序更新成功'
    });
  } catch (error: any) {
    console.error('更新分类排序错误:', error);
    res.status(500).json({
      success: false,
      message: '服务器内部错误',
      error: error.message
    });
  }
};