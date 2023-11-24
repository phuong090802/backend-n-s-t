import express from 'express';
import {
    handleGetUser,
    handleDeleteUser,
    handleGetAllUser
} from '../controllers/admin.js';
import { isNotIdAdmin } from '../middlewares/auth.js';

const router = express.Router();

router.route('/users/:id')
    .get(isNotIdAdmin, handleGetUser)
    .delete(isNotIdAdmin, handleDeleteUser)

router.get('/users/', handleGetAllUser)

export default router;