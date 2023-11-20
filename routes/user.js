import express from 'express';
import {
    handleUpdateEmail,
    handleUpdatePassword,
    handleUpdateProfile,
    handleForgotPassword,
    handleResetPassword
} from '../controllers/user.js';
import {
    isAuthenticatedUser,
    authorizeRoles
} from '../middlewares/auth.js';

const router = express.Router();

router.patch('/email', isAuthenticatedUser, authorizeRoles('user', 'admin'), handleUpdateEmail);

router.patch('/password', isAuthenticatedUser, authorizeRoles('user', 'admin'), handleUpdatePassword);

router.put('/', isAuthenticatedUser, authorizeRoles('user', 'admin'), handleUpdateProfile);

router.route('/password/forgot').post(handleForgotPassword);
router.route('/password/reset/:token').put(handleResetPassword);


export default router;