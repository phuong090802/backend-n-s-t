import dotenv from 'dotenv';
import dbConnect from './config/dbConnect.js';
import errorMiddleware from './middlewares/errorMiddleware.js';
import express from 'express';
import auth from './routes/auth.js'
import cors from 'cors';


process.on('uncaughtException', err => {
    console.log(`error: ${err.stack}`);
    console.log('Server bị tắt do Uncaugth exception');
    process.exit(1);
});

dotenv.config();

dbConnect();

const app = express();

const corsOptions = {
    origin: process.env.FRONTEND_URL,
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization'],
};

app.use(cors(corsOptions));
app.use(errorMiddleware);
app.use(express.json());

app.use('/api/v1/auth', auth);


const PORT = process.env.PORT || 4000;

const server = app.listen(PORT, () => {
    console.log(`Server started on PORT: ${process.env.PORT}`);
});

process.on('unhandledRejection', err => {
    console.log(`error: ${err.stack}`);
    console.log('Server bị tắt do rejection Unhandle Promise');
    server.close(() => {
        process.exit(1);
    });
});


