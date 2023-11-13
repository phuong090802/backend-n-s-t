import User from '../models/user.js';
import catchAsyncError from '../middlewares/catchAsyncErrors.js'

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
