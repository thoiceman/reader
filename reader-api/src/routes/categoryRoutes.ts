import { Router } from 'express';
import {
  createCategory,
  getCategories,
  getCategoryById,
  getCategoryBySlug,
  updateCategory,
  deleteCategory,
  getCategoryTree,
  updateCategorySort
} from '../controllers/categoryController';

const router = Router();

// 分类CRUD路由
router.post('/', createCategory);
router.get('/', getCategories);
router.get('/tree', getCategoryTree);
router.get('/:id', getCategoryById);
router.get('/slug/:slug', getCategoryBySlug);
router.put('/:id', updateCategory);
router.delete('/:id', deleteCategory);

// 分类排序
router.patch('/sort', updateCategorySort);

export default router;