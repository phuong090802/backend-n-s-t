import User from '../models/user.js';
import catchAsyncError from '../middlewares/catchAsyncErrors.js';
import { sendToken, getRefreshToken } from '../utils/tokenUtils.js';
import ErrorHandler from '../utils/errorHandler.js';

export const registerUser = catchAsyncError(async (req, res, next) => {
    const { name, email, phone, password } = req.body;
    await User.create({
        name,
        email,
        phone,
        password,
    });

    res.json({
        success: true,
        message: 'Tạo tài khoản thành công'
    })
});

export const login = catchAsyncError(async (req, res, next) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return next(new ErrorHandler('Vui lòng nhập email và mật khẩu', 400));
    }

    const user = await User.findOne({ email }).select('+password');

    if (!user) {
        return next(new ErrorHandler('Email hoặc mật khẩu không hợp lệ', 401));
    }

    const isPasswordMatched = await user.comparePassword(password);
    if (!isPasswordMatched) {
        return next(new ErrorHandler('Email hoặc mật khẩu không hợp lệ', 401));
    }
    const token = await getRefreshToken(user);
    sendToken(user, token, res);
});