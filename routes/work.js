import express from 'express';
import {
    handleCreateWork,
    handleGetAllWork
} from '../controllers/work.js';

const router = express.Router();

router.route('/')
    .get(handleGetAllWork)
    .post(handleCreateWork)

export default router;