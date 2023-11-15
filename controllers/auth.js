import User from '../models/user.js';
import catchAsyncError from '../middlewares/catchAsyncErrors.js';
import { sendToken, getRefreshToken, deleteToken } from '../utils/tokenUtils.js';
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

export const currentUser = catchAsyncError(async (req, res, next) => {
    const user = await User.findById(req.user.id);
    const { _id, name, email, phone, role } = user;
    res.json({
        success: true,
        user: { _id, name, email, phone, role },
    })
});

export const logout = catchAsyncError(async (req, res, next) => {
    const token = req.cookies.refreshToken;
    await deleteToken(token);
    res.cookie('refreshToken', null, {
        expires: new Date(Date.now()),
        httpOnly: true
    });
    res.json({
        success: true,
        message: 'Đăng xuất thành công'
    })
});
