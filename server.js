import dotenv from 'dotenv';
import dbConnect from './config/dbConnect.js';
import errorMiddleware from './middlewares/errorMiddleware.js';
import app from './app.js';
import { v2 as cloudinary } from 'cloudinary';



process.on('uncaughtException', err => {
    console.log(`error: ${err.stack}`);
    console.log('Server bị tắt do Uncaugth exception');
    process.exit(1);
});

dotenv.config();

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUD_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
    secure: true
});

dbConnect();

app.use(errorMiddleware);

const server = app.listen(process.env.PORT, () => {
    console.log(`Server started on PORT: ${process.env.PORT}`);
});

process.on('unhandledRejection', err => {
    console.log(`error: ${err.stack}`);
    console.log('Server bị tắt do rejection Unhandle Promise');
    server.close(() => {
        process.exit(1);
    });
});


