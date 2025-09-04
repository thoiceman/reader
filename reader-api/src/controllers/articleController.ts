import { Request, Response } from 'express';
import { Article, IArticle } from '../models/Article';

// 创建文章
export const createArticle = async (req: Request, res: Response): Promise<void> => {
  try {
    const { title, content, summary, categoryId, tagIds, featuredImage, isPublic } = req.body;
    const authorId = (req as any).user?.userId; // 从JWT中获取用户ID

    if (!authorId) {
      res.status(401).json({
        success: false,
        message: '未授权访问'
      });
      return;
    }

    const newArticle = await Article.create({
      title,
      content,
      summary,
      authorId,
      categoryId,
      featuredImage,
      isPublic: isPublic ?? true,
      status: 'draft',
      tagIds
    });

    res.status(201).json({
      success: true,
      message: '文章创建成功',
      data: { article: newArticle }
    });
  } catch (error: any) {
    console.error('创建文章错误:', error);
    res.status(500).json({
      success: false,
      message: '服务器内部错误',
      error: error.message
    });
  }
};

// 获取所有文章
export const getArticles = async (req: Request, res: Response): Promise<void> => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    const offset = (page - 1) * limit;
    const status = req.query.status as string;
    const categoryId = req.query.categoryId ? parseInt(req.query.categoryId as string) : undefined;
    const authorId = req.query.authorId ? parseInt(req.query.authorId as string) : undefined;
    const search = req.query.search as string;
    const tagIds = req.query.tagIds ? (req.query.tagIds as string).split(',').map(id => parseInt(id)) : [];

    const articles = await Article.findAll({
      limit,
      offset,
      orderBy: 'created_at',
      orderDirection: 'DESC',
      status: (status as 'draft' | 'published' | 'archived') || 'published',
      categoryId,
      authorId,
      search,
      tagIds: tagIds.length > 0 ? tagIds : undefined,
      includeAuthor: true,
      includeCategory: true,
      includeTags: true
    });

    const total = await Article.count({
      status: (status as 'draft' | 'published' | 'archived') || 'published',
      categoryId,
      authorId,
      search,
      tagIds: tagIds.length > 0 ? tagIds : undefined
    });

    res.json({
      success: true,
      data: {
        articles,
        pagination: {
          current: page,
          pages: Math.ceil(total / limit),
          total
        }
      }
    });
  } catch (error: any) {
    console.error('获取文章列表错误:', error);
    res.status(500).json({
      success: false,
      message: '服务器内部错误',
      error: error.message
    });
  }
};

// 根据ID获取文章
export const getArticleById = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const articleId = parseInt(id);

    if (isNaN(articleId)) {
      res.status(400).json({
        success: false,
        message: '无效的文章ID'
      });
      return;
    }

    const article = await Article.findById(articleId, {
      includeAuthor: true,
      includeCategory: true,
      includeTags: true
    });

    if (!article) {
      res.status(404).json({
        success: false,
        message: '文章不存在'
      });
      return;
    }

    res.json({
      success: true,
      data: { article }
    });
  } catch (error: any) {
    console.error('获取文章错误:', error);
    res.status(500).json({
      success: false,
      message: '服务器内部错误',
      error: error.message
    });
  }
};

// 根据slug获取文章
export const getArticleBySlug = async (req: Request, res: Response): Promise<void> => {
  try {
    const { slug } = req.params;

    const article = await Article.findBySlug(slug, {
      includeAuthor: true,
      includeCategory: true,
      includeTags: true
    });

    if (!article) {
      res.status(404).json({
        success: false,
        message: '文章不存在'
      });
      return;
    }

    res.json({
      success: true,
      data: { article }
    });
  } catch (error: any) {
    console.error('获取文章错误:', error);
    res.status(500).json({
      success: false,
      message: '服务器内部错误',
      error: error.message
    });
  }
};

// 更新文章
export const updateArticle = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const articleId = parseInt(id);
    const updateData = req.body;
    const userId = (req as any).user?.userId;

    if (isNaN(articleId)) {
      res.status(400).json({
        success: false,
        message: '无效的文章ID'
      });
      return;
    }

    if (!userId) {
      res.status(401).json({
        success: false,
        message: '未授权访问'
      });
      return;
    }

    // 检查文章是否存在且用户有权限修改
    const existingArticle = await Article.findById(articleId);
    if (!existingArticle) {
      res.status(404).json({
        success: false,
        message: '文章不存在'
      });
      return;
    }

    if (existingArticle.authorId !== userId) {
      res.status(403).json({
        success: false,
        message: '无权限修改此文章'
      });
      return;
    }

    const updatedArticle = await Article.updateById(articleId, updateData);

    if (!updatedArticle) {
      res.status(404).json({
        success: false,
        message: '文章不存在'
      });
      return;
    }

    res.json({
      success: true,
      message: '文章更新成功',
      data: { article: updatedArticle }
    });
  } catch (error: any) {
    console.error('更新文章错误:', error);
    res.status(500).json({
      success: false,
      message: '服务器内部错误',
      error: error.message
    });
  }
};

// 删除文章
export const deleteArticle = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const articleId = parseInt(id);
    const userId = (req as any).user?.userId;

    if (isNaN(articleId)) {
      res.status(400).json({
        success: false,
        message: '无效的文章ID'
      });
      return;
    }

    if (!userId) {
      res.status(401).json({
        success: false,
        message: '未授权访问'
      });
      return;
    }

    // 检查文章是否存在且用户有权限删除
    const existingArticle = await Article.findById(articleId);
    if (!existingArticle) {
      res.status(404).json({
        success: false,
        message: '文章不存在'
      });
      return;
    }

    if (existingArticle.authorId !== userId) {
      res.status(403).json({
        success: false,
        message: '无权限删除此文章'
      });
      return;
    }

    const deleted = await Article.deleteById(articleId);

    if (!deleted) {
      res.status(404).json({
        success: false,
        message: '文章不存在'
      });
      return;
    }

    res.json({
      success: true,
      message: '文章删除成功'
    });
  } catch (error: any) {
    console.error('删除文章错误:', error);
    res.status(500).json({
      success: false,
      message: '服务器内部错误',
      error: error.message
    });
  }
};

// 发布文章
export const publishArticle = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const articleId = parseInt(id);
    const userId = (req as any).user?.userId;

    if (isNaN(articleId)) {
      res.status(400).json({
        success: false,
        message: '无效的文章ID'
      });
      return;
    }

    if (!userId) {
      res.status(401).json({
        success: false,
        message: '未授权访问'
      });
      return;
    }

    // 检查文章是否存在且用户有权限发布
    const existingArticle = await Article.findById(articleId);
    if (!existingArticle) {
      res.status(404).json({
        success: false,
        message: '文章不存在'
      });
      return;
    }

    if (existingArticle.authorId !== userId) {
      res.status(403).json({
        success: false,
        message: '无权限发布此文章'
      });
      return;
    }

    const publishedArticle = await Article.publish(articleId);

    if (!publishedArticle) {
      res.status(404).json({
        success: false,
        message: '文章不存在'
      });
      return;
    }

    res.json({
      success: true,
      message: '文章发布成功',
      data: { article: publishedArticle }
    });
  } catch (error: any) {
    console.error('发布文章错误:', error);
    res.status(500).json({
      success: false,
      message: '服务器内部错误',
      error: error.message
    });
  }
};

// 归档文章
export const archiveArticle = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const articleId = parseInt(id);
    const userId = (req as any).user?.userId;

    if (isNaN(articleId)) {
      res.status(400).json({
        success: false,
        message: '无效的文章ID'
      });
      return;
    }

    if (!userId) {
      res.status(401).json({
        success: false,
        message: '未授权访问'
      });
      return;
    }

    // 检查文章是否存在且用户有权限归档
    const existingArticle = await Article.findById(articleId);
    if (!existingArticle) {
      res.status(404).json({
        success: false,
        message: '文章不存在'
      });
      return;
    }

    if (existingArticle.authorId !== userId) {
      res.status(403).json({
        success: false,
        message: '无权限归档此文章'
      });
      return;
    }

    const archivedArticle = await Article.archive(articleId);

    if (!archivedArticle) {
      res.status(404).json({
        success: false,
        message: '文章不存在'
      });
      return;
    }

    res.json({
      success: true,
      message: '文章归档成功',
      data: { article: archivedArticle }
    });
  } catch (error: any) {
    console.error('归档文章错误:', error);
    res.status(500).json({
      success: false,
      message: '服务器内部错误',
      error: error.message
    });
  }
};

// 增加文章浏览量
export const incrementViewCount = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const articleId = parseInt(id);

    if (isNaN(articleId)) {
      res.status(400).json({
        success: false,
        message: '无效的文章ID'
      });
      return;
    }

    await Article.incrementViewCount(articleId);

    res.json({
      success: true,
      message: '浏览量更新成功'
    });
  } catch (error: any) {
    console.error('更新浏览量错误:', error);
    res.status(500).json({
      success: false,
      message: '服务器内部错误',
      error: error.message
    });
  }
};

// 增加文章点赞量
export const incrementLikeCount = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const articleId = parseInt(id);

    if (isNaN(articleId)) {
      res.status(400).json({
        success: false,
        message: '无效的文章ID'
      });
      return;
    }

    await Article.incrementLikeCount(articleId);

    res.json({
      success: true,
      message: '点赞成功'
    });
  } catch (error: any) {
    console.error('点赞错误:', error);
    res.status(500).json({
      success: false,
      message: '服务器内部错误',
      error: error.message
    });
  }
};

// 减少文章点赞量
export const decrementLikeCount = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const articleId = parseInt(id);

    if (isNaN(articleId)) {
      res.status(400).json({
        success: false,
        message: '无效的文章ID'
      });
      return;
    }

    await Article.decrementLikeCount(articleId);

    res.json({
      success: true,
      message: '取消点赞成功'
    });
  } catch (error: any) {
    console.error('取消点赞错误:', error);
    res.status(500).json({
      success: false,
      message: '服务器内部错误',
      error: error.message
    });
  }
};