import dotenv from 'dotenv';
import dbConnect from './config/dbConnect.js';
import errorMiddleware from './middlewares/errorMiddleware.js';
import app from './app.js';

process.on('uncaughtException', err => {
    console.log(`error: ${err.stack}`);
    console.log('Server bị tắt do Uncaugth exception');
    process.exit(1);
});

dotenv.config();

dbConnect();

app.use(errorMiddleware);

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


