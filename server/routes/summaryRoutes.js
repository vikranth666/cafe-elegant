import express from 'express';
import { createSummary, getSummaryById, getUserSummaries } from '../controllers/summaryController.js';

const router = express.Router();

router.post('/', createSummary);
router.get('/:summaryId', getSummaryById);
router.get('/user', getUserSummaries);

export default router;
