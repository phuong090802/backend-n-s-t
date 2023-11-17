import express from 'express';
import {
    handleCreateWork,
    handleGetAllWork,
    handleGetWork,
    handleUpdateWork
} from '../controllers/work.js';

const router = express.Router();

router.route('/:id')
    .get(handleGetWork)
    .put(handleUpdateWork)

router.route('/')
    .get(handleGetAllWork)
    .post(handleCreateWork)

export default router;