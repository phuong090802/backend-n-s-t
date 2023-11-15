import ErrorHandler from '../utils/errorHandler.js';

export default function errorMiddleware(err, req, res, next) {
    err.status = err.status || 500;
    err.message = err.message || 'Internal Server Error';

    let error = { ...err };
    error.message = err.message;

    if (err.name === 'CastError') {
        const message = `Tài nguyên không tìm thấy. Khôp hợp lệ ${err.path}`;
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
        const message = 'Xác thực thông thành công. Vui lòng đăng nhập lại';
        error = new ErrorHandler(message, 400);
    }

    if (err.name === 'TokenExpiredError') {
        const message = 'Xác thực thông thành công. Vui lòng đăng nhập lại';
        error = new ErrorHandler(message, 400);
    }

    if (err.name === 'ValidationError') {
        const message = Object.values(err.errors).map(value => value.message);
        error = new ErrorHandler(message, 400);
    }

    res.status(error.status).json({
        success: false,
        message: error.message || 'Lỗi Internal Server'
    });
}