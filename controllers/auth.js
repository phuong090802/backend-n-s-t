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
    if (!token) {
        return next(new ErrorHandler('Không đủ quyền truy cập', 401));
    }
    const refreshToken = await RefreshToken.findOne({ token });
    if (refreshToken) {
        const parent = refreshToken.parent || refreshToken._id;
        await deleteToken(parent);
    }
    clearToken(res);
    res.json({
        success: true,
        message: 'Đăng xuất thành công'
    })
});

export const handleRefreshToken = catchAsyncError(async (req, res, next) => {
    const token = req.cookies.refreshToken;
    if (!token) {
        return next(new ErrorHandler('Không đủ quyền truy cập', 403));
    }
    const refreshToken = await RefreshToken.findOne({ token });
    if (!refreshToken) {
        try {
            const tokenEncoded = Buffer.from(token, 'base64url').toString();
            const tokenObject = JSON.parse(tokenEncoded);
            const parentToken = await RefreshToken.findById(tokenObject.p);
            const parent = parentToken.parent || parentToken._id;
            await deleteToken(parent);
            return next(new ErrorHandler('Không đủ quyền truy cập', 403));
        } catch {
            clearToken(res);
            return next(new ErrorHandler('Không đủ quyền truy cập', 403));
        }
    }


    const parent = refreshToken.parent || refreshToken._id;
    if (!refreshToken.status) {
        await deleteToken(parent);
        clearToken(res);
        return next(new ErrorHandler('Không đủ quyền truy cập', 403));
    }

    const user = await User.findById(refreshToken.user);
    if (!refreshToken.hasOwnProperty('parent')) {
        await RefreshToken.findByIdAndUpdate(refreshToken._id, { status: false });
        await RefreshToken.deleteMany({ parent: refreshToken._id });
    }
    const nextRefreshToken = await getNextRefreshToken(user._id, parent);
    sendToken(user, nextRefreshToken, res);
});

