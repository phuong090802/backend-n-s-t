import User from '../models/user.js';
import catchAsyncError from '../middlewares/catchAsyncErrors.js';
import { v2 as cloudinary } from 'cloudinary';
import ErrorHandler from '../utils/errorHandler.js';
import sendEmail from '../utils/sendEmail.js';
import crypto from 'crypto';


export const handleUpdateProfile = catchAsyncError(async (req, res, next) => {
    const userData = { name: req.body.name, phone: req.body.phone };
    if (req.body.avatar && req.body.avatar !== '') {
        const user = await User.findById(req.user.id);
        const publicId = user.avatar.publicId;
        if (publicId) {
            await cloudinary.uploader.destroy(publicId);
        }
        const result = await cloudinary.uploader.upload(req.body.avatar,
            { folder: 'avatars', width: 512, height: 512, crop: 'scale', invalidate: true, }
        );
        userData.avatar = {
            publicId: result.public_id,
            url: result.secure_url
        }
    }

    await User.findByIdAndUpdate(req.user.id, userData, {
        runValidators: true,
    });

    res.json({
        success: true,
        message: 'Cập nhật thông tin thành công'
    })
});

export const handleUpdateEmail = catchAsyncError(async (req, res, next) => {
    await User.findByIdAndUpdate(req.user.id, { email: req.body.email }, {
        runValidators: true,
    });

    res.json({
        success: true,
        message: 'Cập nhật email thành công'
    })
});

export const handleUpdatePassword = catchAsyncError(async (req, res, next) => {
    const user = await User.findById(req.user.id).select('+password');

    const isPasswordMatched = await user.comparePassword(req.body.oldPassword);
    if (!isPasswordMatched) {
        return next(new ErrorHandler('Mật khẩu cũ không chính xác', 400));
    }

    user.password = req.body.newPassword;

    await user.save();

    res.json({
        success: true,
        message: 'Cập nhật mật khẩu thành công'
    });
});

export const handleForgotPassword = catchAsyncError(async (req, res, next) => {

    const user = await User.findOne({ email: req.body.email });
    if (!user) {
        return next(new ErrorHandler('Không tìm thấy người dùng', 404));
    }

    const resetToken = user.getResetPasswordToken();
    await user.save({ validateBeforeSave: false });


    const resetUrl = `${process.env.FRONTEND_URL}/password/reset/${resetToken}`;

    const message = `Vui lòng truy cập vào để đặt lại mật khẩu:\n\n${resetUrl}\n\nNếu bạn không yêu cầu đặt lại mật khẩu thì hãy bỏ qua nó.`;

    try {
        await sendEmail({
            email: user.email,
            subject: 'Quản Lí Công Việc Nhóm Đặt Lại Mật Khẩu',
            message
        });
        res.json({
            success: true,
            message: `Gửi email tới: ${user.email}`
        });
    } catch (err) {
        user.resetPasswordToken = undefined;
        user.resetPasswordExpire = undefined;
        await user.save({ validateBeforeSave: false });
        return next(new ErrorHandler(err.message, 500));
    }

});

export const handleResetPassword = catchAsyncError(async (req, res, next) => {
    const resetPasswordToken = crypto.createHash('sha256').update(req.params.token).digest('hex');
    const user = await User.findOne({
        resetPasswordToken,
        resetPasswordExpire: { $gt: Date.now() }
    });

    if (!user) {
        return next(new ErrorHandler('Mật khẩu phục hồi không hợp lệ', 400));
    }

    if (req.body.password !== req.body.confirmPassword) {
        return next(new ErrorHandler('Mật khẩu không khớp', 400));
    }

    user.password = req.body.password;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;

    await user.save();
    res.json({
        success: true,
        message: 'Cập nhật mật khẩu thành công'
    })
});