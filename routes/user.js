import express from 'express';
import {
    handleUpdateProfile
} from '../controllers/user.js';
import {
    isAuthenticatedUser,
    authorizeRoles
} from '../middlewares/auth.js';

const router = express.Router();

router.post('/', isAuthenticatedUser, authorizeRoles('user', 'admin'), handleUpdateProfile);

export default router;