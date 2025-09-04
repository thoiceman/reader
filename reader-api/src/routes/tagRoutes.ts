import { Router } from 'express';
import {
  createTag,
  getTags,
  getTagById,
  getTagBySlug,
  getTagByName,
  updateTag,
  deleteTag,
  createOrFindTags,
  getUnusedTags,
  cleanupUnusedTags,
  mergeTags
} from '../controllers/tagController';

const router = Router();

// 标签CRUD路由
router.post('/', createTag);
router.get('/', getTags);
router.get('/unused', getUnusedTags);
router.get('/:id', getTagById);
router.get('/slug/:slug', getTagBySlug);
router.get('/name/:name', getTagByName);
router.put('/:id', updateTag);
router.delete('/:id', deleteTag);

// 标签批量操作
router.post('/batch', createOrFindTags);
router.delete('/cleanup', cleanupUnusedTags);
router.post('/merge', mergeTags);

export default router;