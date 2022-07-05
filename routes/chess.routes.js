import Router from 'express';
import { getChess } from '../controllers/chess.controller.js';
import authMiddleware from '../middlewares/auth.middleware.mjs';

const routePrefix = '';
const router = Router();

/* ------------------------------ chess ----------------------------- */
router.get(`${routePrefix}/`, authMiddleware, getChess);

export default router;
