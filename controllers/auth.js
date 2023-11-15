import User from '../models/user.js';
import catchAsyncError from '../middlewares/catchAsyncErrors.js';
import { sendToken, getRefreshToken, deleteToken, clearToken, getNextRefreshToken } from '../utils/tokenUtils.js';
import ErrorHandler from '../utils/errorHandler.js';
import RefreshToken from '../models/refreshToken.js';

export const handleRegister = catchAsyncError(async (req, res, next) => {
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

export const handleLogin = catchAsyncError(async (req, res, next) => {
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

export const handleGetCurrentUser = catchAsyncError(async (req, res, next) => {
    const user = await User.findById(req.user.id);
    const { _id, name, email, phone, role } = user;
    res.json({
        success: true,
        user: { _id, name, email, phone, role },
    })
});

export const handleLogout = catchAsyncError(async (req, res, next) => {
    const token = req.cookies.refreshToken;
    const refreshToken = await RefreshToken.findOne({ token });
    if (refreshToken) {
        const parent = refreshToken.parent || refreshToken._id;
        await deleteToken(parent);
    }
    clearToken();
    res.json({
        success: true,
        message: 'Đăng xuất thành công'
    })
});

export const handleRefreshToken = catchAsyncError(async (req, res, next) => {
    const token = req.cookies.refreshToken;
    const refreshToken = await RefreshToken.findOne({ token });
    if (!refreshToken) {
        try {
            const token = Buffer.from(token, 'base64url').toString();
            const tokenObj = JSON.parse(token);
            const parentToken = await RefreshToken.findById(tokenObj.p);
            const parent = parentToken.parent || parentToken._id;
            await deleteToken(parent);
            return next(new ErrorHandler('Không đủ quyền truy cập', 400));
        } catch (err) {
            clearToken();
            return next(new ErrorHandler('Không đủ quyền truy cập', 400));
        }
    }


    const parent = refreshToken.parent || refreshToken._id;
    if (!refreshToken.status) {
        await deleteToken(parent);
        clearToken();
    }

    const user = await User.findById(refreshToken.user);
    await RefreshToken.findByIdAndUpdate(refreshToken._id, { status: false });
    const nextRefreshToken = await getNextRefreshToken(user._id, parent);
    sendToken(user, nextRefreshToken, res);

    res.json({
        success: true,
        message: 'Làm mới token thành công'
    })
});

