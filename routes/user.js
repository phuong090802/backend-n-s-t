import express from 'express';
import {
    handleUpdateEmail,
    handleUpdatePassword,
    handleUpdateProfile
} from '../controllers/user.js';
import {
    isAuthenticatedUser,
    authorizeRoles
} from '../middlewares/auth.js';

const router = express.Router();

router.patch('/email', isAuthenticatedUser, authorizeRoles('user', 'admin'), handleUpdateEmail);

router.patch('/password', isAuthenticatedUser, authorizeRoles('user', 'admin'), handleUpdatePassword);

router.put('/', isAuthenticatedUser, authorizeRoles('user', 'admin'), handleUpdateProfile);


export default router;