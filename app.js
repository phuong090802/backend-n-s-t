import express from 'express';
import auth from './routes/auth.js';
import cors from 'cors';
import dotenv from 'dotenv'

dotenv.config();

const app = express();

console.log(process.env.FRONTEND_URL);
const corsOptions = {
    origin: process.env.FRONTEND_URL,
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization'],
};

app.use(cors(corsOptions));

app.use(express.json());
app.use('/api/v1/auth', auth);

export default app;