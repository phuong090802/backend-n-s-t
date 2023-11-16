import express from 'express';
import auth from './routes/auth.js';
import work from './routes/work.js';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import {
    isAuthenticatedUser,
    authorizeRoles
} from './middlewares/auth.js';


const corsOptions = {
    origin: process.env.FRONTEND_URL,
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization'],
};

const app = express();

app.use(cors(corsOptions));

app.use(cookieParser());

app.use(express.json());

app.use('/api/v1/auth', auth);
app.use('/api/v1/works', isAuthenticatedUser, isAuthenticatedUser, authorizeRoles('user', 'admin'), work);

export default app;