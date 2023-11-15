import express from 'express';
import {
    handleRegister,
    handleLogin,
    handleGetCurrentUser,
    handleLogout,
    handleRefreshToken,
} from '../controllers/auth.js';
import {
    isAuthenticatedUser,
    authorizeRoles
} from '../middlewares/auth.js';

const router = express.Router();

router.post('/register', handleRegister);
router.post('/login', handleLogin);
router.get('/me', isAuthenticatedUser, authorizeRoles('user', 'admin'), handleGetCurrentUser);
router.post('/logout', handleLogout);
router.post('/refresh-token', handleRefreshToken);

export default router;