import express from 'express';
import auth from './routes/auth.js';
import todo from './routes/todo.js';
import user from './routes/user.js';
import admin from './routes/admin.js';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import fileUpload from 'express-fileupload';
import bodyParser from 'body-parser';
import {
    isAuthenticatedUser,
    authorizeRoles,
} from './middlewares/auth.js';


const corsOptions = {
    origin: process.env.FRONTEND_URL,
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
    allowedHeaders: ['Content-Type', 'Authorization'],
};

const app = express();

app.use(cors(corsOptions));
app.use(express.json({ limit: '100mb' }));
app.use(bodyParser.urlencoded({ limit: '100mb', extended: true }));
app.use(fileUpload());

app.use(cookieParser());


app.use('/api/v1/admin', isAuthenticatedUser, isAuthenticatedUser, authorizeRoles('admin'), admin);
app.use('/api/v1/users', user);
app.use('/api/v1/auth', auth);
app.use('/api/v1/todos', isAuthenticatedUser, isAuthenticatedUser, authorizeRoles('user', 'admin'), todo);


export default app;