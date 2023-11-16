import express from 'express';
import {
    handleCreateWork
} from '../controllers/work.js';

import {
    isAuthenticatedUser,
    authorizeRoles
} from '../middlewares/auth.js';



const router = express.Router();

router.post('/', isAuthenticatedUser, authorizeRoles('user', 'admin'), handleCreateWork);

export default router;