import express from 'express';
import {
    handleGetUser,
    handleDeleteUser,
    handleGetAllUser
} from '../controllers/admin.js';
import { isAdmin } from '../middlewares/auth.js';

const router = express.Router();

router.route('/users/:id')
    .get(isAdmin, handleGetUser)
    .delete(isAdmin, handleDeleteUser)

router.get('/users/', handleGetAllUser)

export default router;