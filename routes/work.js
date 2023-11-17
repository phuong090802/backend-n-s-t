import express from 'express';
import {
    handleCreateWork,
    handleGetAllWork,
    handleGetWork
} from '../controllers/work.js';

const router = express.Router();

router.get('/:id', handleGetWork);

router.route('/')
    .get(handleGetAllWork)
    .post(handleCreateWork)

export default router;