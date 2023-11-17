import catchAsyncError from '../middlewares/catchAsyncErrors.js';
import Work from '../models/work.js';
import APIFeatures from '../utils/APIFeatures.js';

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

export const handleGetAllWork = catchAsyncError(async (req, res, next) => {
    const size = 4;

    const workQuery = Work.find({ user: req.user });

    const apiFeatures = new APIFeatures(workQuery, req.query)
        .search()
        .filter();

    let works = await apiFeatures.query;
    const count = works.length;

    const apiFeaturesPagination = new APIFeatures(Work.find(workQuery), req.query)
        .search()
        .filter()
        .pagination(size);

    works = await apiFeaturesPagination.query;

    res.json({
        success: true,
        works,
        size,
        count
    })
});

export const handleGetWork = catchAsyncError(async (req, res, next) => {
    const work = await Work.findById(req.params.id).select('-__v -members -user');

    if (!work) {
        return next(new ErrorHandler('Không tìm thấy công việc', 404));
    }

    res.json({
        success: true,
        work
    })
});

export const handleUpdateWork = catchAsyncError(async (req, res, next) => {
    const work = await Work.findById(req.params.id);

    if (!work) {
        return next(new ErrorHandler('Không tìm thấy công việc', 404));
    }

    await Work.findByIdAndUpdate(req.params.id, req.body, {
        runValidators: true,
    });

    res.json({
        success: true,
        message: 'Cập nhật công việc thành công'
    })
});