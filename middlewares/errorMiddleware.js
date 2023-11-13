import ErrorHandler from '../utils/errorHandler.js';

export default function errorMiddleware(err, req, res, next) {
    err.status = err.status || 500;
    err.message = err.message || 'Internal Server Error';

    let error = { ...err };
    error.message = err.message;

    if (err.name === 'CastError') {
        const message = `Resource not found. Invalid ${err.path}`;
        error = new ErrorHandler(message, 400);
    }

    if (err.code === 11000) {
        let field = 'Email';
        if (Object.keys(err.keyValue).includes('phone')) {
            field = 'Số điện thoại';
        }
        const message = `${field} đã được sử dụng`;
        error = new ErrorHandler(message, 400);
    }

    if (err.name === 'JsonWebTokenError') {
        const message = 'JSON Web Token is invalid. Try Again!!!';
        error = new ErrorHandler(message, 400);
    }

    if (err.name === 'TokenExpiredError') {
        const message = 'JSON Web Token is expired. Try Again!!!';
        error = new ErrorHandler(message, 400);
    }

    if (err.name === 'ValidationError') {
        const message = Object.values(err.errors).map(value => value.message);
        error = new ErrorHandler(message, 400);
    }

    res.status(error.status).json({
        success: false,
        message: error.message || 'Internal Server Error'
    });
}