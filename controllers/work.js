import catchAsyncError from '../middlewares/catchAsyncErrors.js';
import Work from '../models/work.js';

export const handleCreateWork = catchAsyncError(async (req, res, next) => {
    const { name, description } = req.body;
    await Work.create({
        name,
        description,
        user: req.user
    });

    res.json({
        success: true,
        message: 'Tạo công việc thành công'
    })
});