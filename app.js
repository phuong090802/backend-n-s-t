import express from 'express';
import auth from './routes/auth.js';
import cors from 'cors';

const corsOptions = {
    origin: process.env.FRONTEND_URL,
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization'],
};

const app = express();

app.use(cors(corsOptions));

app.use(express.json());

app.use('/api/v1/auth', auth);

export default app;