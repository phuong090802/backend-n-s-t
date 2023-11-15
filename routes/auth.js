import express from 'express';
import {
    registerUser,
    login,
    currentUser,
    logout
} from '../controllers/auth.js';
import {
    isAuthenticatedUser,
    authorizeRoles
} from '../middlewares/auth.js';

const router = express.Router();

router.post('/register', registerUser);
router.post('/login', login);
router.get('/me', isAuthenticatedUser, authorizeRoles('user', 'admin'), currentUser);
router.get('/logout', logout);

export default router;