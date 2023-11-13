import express from 'express';
import auth from './routes/auth.js';
import cors from 'cors';

const app = express();
const corsOptions = {
    origin: 'http://localhost:5173',
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization'],
};

app.use(cors(corsOptions));

app.use(express.json());
app.use('/api/v1/auth', auth);

export default app;