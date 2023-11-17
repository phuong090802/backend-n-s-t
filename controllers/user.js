import User from '../models/user.js';
import catchAsyncError from '../middlewares/catchAsyncErrors.js';
import { v2 as cloudinary } from 'cloudinary';


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