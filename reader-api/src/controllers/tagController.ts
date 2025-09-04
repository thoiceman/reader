import { Request, Response } from 'express';
import { Tag, ITag } from '../models/Tag';

// 创建标签
export const createTag = async (req: Request, res: Response): Promise<void> => {
  try {
    const { name, description, color } = req.body;

    // 检查标签名称是否已存在
    const nameExists = await Tag.isNameExists(name);
    if (nameExists) {
      res.status(400).json({
        success: false,
        message: '标签名称已存在'
      });
      return;
    }

    const newTag = await Tag.create({
      name,
      description,
      color
    });

    res.status(201).json({
      success: true,
      message: '标签创建成功',
      data: { tag: newTag }
    });
  } catch (error: any) {
    console.error('创建标签错误:', error);
    res.status(500).json({
      success: false,
      message: '服务器内部错误',
      error: error.message
    });
  }
};

// 获取所有标签
export const getTags = async (req: Request, res: Response): Promise<void> => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 50;
    const offset = (page - 1) * limit;
    const search = req.query.search as string;
    const includeArticleCount = req.query.includeArticleCount === 'true';
    const onlyUsed = req.query.onlyUsed === 'true';

    const tags = await Tag.findAll({
      limit,
      offset,
      orderBy: 'name',
      orderDirection: 'ASC',
      isActive: true,
      search,
      includeArticleCount
    });

    const total = await Tag.count({
      isActive: true,
      search
    });

    res.json({
      success: true,
      data: {
        tags,
        pagination: {
          current: page,
          pages: Math.ceil(total / limit),
          total
        }
      }
    });
  } catch (error: any) {
    console.error('获取标签列表错误:', error);
    res.status(500).json({
      success: false,
      message: '服务器内部错误',
      error: error.message
    });
  }
};

// 根据ID获取标签
export const getTagById = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const tagId = parseInt(id);
    const includeArticleCount = req.query.includeArticleCount === 'true';

    if (isNaN(tagId)) {
      res.status(400).json({
        success: false,
        message: '无效的标签ID'
      });
      return;
    }

    const tag = await Tag.findById(tagId, { includeArticleCount });

    if (!tag) {
      res.status(404).json({
        success: false,
        message: '标签不存在'
      });
      return;
    }

    res.json({
      success: true,
      data: { tag }
    });
  } catch (error: any) {
    console.error('获取标签错误:', error);
    res.status(500).json({
      success: false,
      message: '服务器内部错误',
      error: error.message
    });
  }
};

// 根据slug获取标签
export const getTagBySlug = async (req: Request, res: Response): Promise<void> => {
  try {
    const { slug } = req.params;
    const includeArticleCount = req.query.includeArticleCount === 'true';

    const tag = await Tag.findBySlug(slug, { includeArticleCount });

    if (!tag) {
      res.status(404).json({
        success: false,
        message: '标签不存在'
      });
      return;
    }

    res.json({
      success: true,
      data: { tag }
    });
  } catch (error: any) {
    console.error('获取标签错误:', error);
    res.status(500).json({
      success: false,
      message: '服务器内部错误',
      error: error.message
    });
  }
};

// 根据名称获取标签
export const getTagByName = async (req: Request, res: Response): Promise<void> => {
  try {
    const { name } = req.params;
    const includeArticleCount = req.query.includeArticleCount === 'true';

    const tag = await Tag.findByName(name, { includeArticleCount });

    if (!tag) {
      res.status(404).json({
        success: false,
        message: '标签不存在'
      });
      return;
    }

    res.json({
      success: true,
      data: { tag }
    });
  } catch (error: any) {
    console.error('获取标签错误:', error);
    res.status(500).json({
      success: false,
      message: '服务器内部错误',
      error: error.message
    });
  }
};

// 更新标签
export const updateTag = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const tagId = parseInt(id);
    const updateData = req.body;

    if (isNaN(tagId)) {
      res.status(400).json({
        success: false,
        message: '无效的标签ID'
      });
      return;
    }

    // 检查标签名称唯一性（如果要更新的话）
    if (updateData.name) {
      const nameExists = await Tag.isNameExists(updateData.name, tagId);
      if (nameExists) {
        res.status(400).json({
          success: false,
          message: '标签名称已存在'
        });
        return;
      }
    }

    // 检查slug唯一性（如果要更新的话）
    if (updateData.slug) {
      const slugExists = await Tag.isSlugExists(updateData.slug, tagId);
      if (slugExists) {
        res.status(400).json({
          success: false,
          message: '标签slug已存在'
        });
        return;
      }
    }

    const updatedTag = await Tag.updateById(tagId, updateData);

    if (!updatedTag) {
      res.status(404).json({
        success: false,
        message: '标签不存在'
      });
      return;
    }

    res.json({
      success: true,
      message: '标签更新成功',
      data: { tag: updatedTag }
    });
  } catch (error: any) {
    console.error('更新标签错误:', error);
    res.status(500).json({
      success: false,
      message: '服务器内部错误',
      error: error.message
    });
  }
};

// 删除标签（软删除）
export const deleteTag = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const tagId = parseInt(id);

    if (isNaN(tagId)) {
      res.status(400).json({
        success: false,
        message: '无效的标签ID'
      });
      return;
    }

    const deleted = await Tag.deleteById(tagId);

    if (!deleted) {
      res.status(404).json({
        success: false,
        message: '标签不存在'
      });
      return;
    }

    res.json({
      success: true,
      message: '标签删除成功'
    });
  } catch (error: any) {
    console.error('删除标签错误:', error);
    res.status(500).json({
      success: false,
      message: '服务器内部错误',
      error: error.message
    });
  }
};

// 批量创建或获取标签
export const createOrFindTags = async (req: Request, res: Response): Promise<void> => {
  try {
    const { tagNames } = req.body; // string[]

    if (!Array.isArray(tagNames)) {
      res.status(400).json({
        success: false,
        message: '标签名称必须是数组格式'
      });
      return;
    }

    const tags = await Tag.findOrCreateMany(tagNames);

    res.json({
      success: true,
      message: '标签处理成功',
      data: { tags }
    });
  } catch (error: any) {
    console.error('批量创建或获取标签错误:', error);
    res.status(500).json({
      success: false,
      message: '服务器内部错误',
      error: error.message
    });
  }
};

// 获取未使用的标签
export const getUnusedTags = async (req: Request, res: Response): Promise<void> => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 50;
    const offset = (page - 1) * limit;

    const tags = await Tag.getUnusedTags();
    const total = await Tag.count({ isActive: true });

    res.json({
      success: true,
      data: {
        tags,
        pagination: {
          current: page,
          pages: Math.ceil(total / limit),
          total
        }
      }
    });
  } catch (error: any) {
    console.error('获取未使用标签错误:', error);
    res.status(500).json({
      success: false,
      message: '服务器内部错误',
      error: error.message
    });
  }
};

// 清理未使用的标签
export const cleanupUnusedTags = async (req: Request, res: Response): Promise<void> => {
  try {
    const deletedCount = await Tag.cleanupUnusedTags();

    res.json({
      success: true,
      message: `成功清理了 ${deletedCount} 个未使用的标签`,
      data: { deletedCount }
    });
  } catch (error: any) {
    console.error('清理未使用标签错误:', error);
    res.status(500).json({
      success: false,
      message: '服务器内部错误',
      error: error.message
    });
  }
};

// 合并标签
export const mergeTags = async (req: Request, res: Response): Promise<void> => {
  try {
    const { sourceTagId, targetTagId } = req.body;

    if (!sourceTagId || !targetTagId) {
      res.status(400).json({
        success: false,
        message: '源标签ID和目标标签ID都是必需的'
      });
      return;
    }

    if (sourceTagId === targetTagId) {
      res.status(400).json({
        success: false,
        message: '源标签和目标标签不能相同'
      });
      return;
    }

    const result = await Tag.mergeTags(sourceTagId, targetTagId);

    // mergeTags 方法不返回值，只要没有抛出异常就表示成功

    res.json({
      success: true,
      message: '标签合并成功'
    });
  } catch (error: any) {
    console.error('合并标签错误:', error);
    res.status(500).json({
      success: false,
      message: '服务器内部错误',
      error: error.message
    });
  }
};