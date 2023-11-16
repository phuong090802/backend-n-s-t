import { query } from 'express';
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
    const resPerPage = 4;
    const apiFeatures = new APIFeatures(Work.find({ user: req.user }), req.query)
        .search()
        .filter()
        // .pagination(resPerPage);

    const works = await apiFeatures.query;
    const filteredWorksCount = works.length;
    res.json({
        success: true,
        works,
        filteredWorksCount
    })
});