import express from 'express';
import auth from './routes/auth.js';
import corsMiddleware from './middlewares/corsMiddleware.js';

const app = express();
app.use(corsMiddleware);

app.use(express.json());
app.use('/api/v1/auth', auth);

export default app;