import { Router } from 'express';
import {
  createArticle,
  getArticles,
  getArticleById,
  getArticleBySlug,
  updateArticle,
  deleteArticle,
  publishArticle,
  archiveArticle
} from '../controllers/articleController';

const router = Router();

// 文章CRUD路由
router.post('/', createArticle);
router.get('/', getArticles);
router.get('/:id', getArticleById);
router.get('/slug/:slug', getArticleBySlug);
router.put('/:id', updateArticle);
router.delete('/:id', deleteArticle);

// 文章状态管理
router.patch('/:id/publish', publishArticle);
router.patch('/:id/archive', archiveArticle);

// 文章互动功能可以后续添加

export default router;