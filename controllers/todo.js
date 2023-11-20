import catchAsyncError from '../middlewares/catchAsyncErrors.js';
import Todo from '../models/todo.js';
import APIFeatures from '../utils/APIFeatures.js';

export const handleCreateTodo = catchAsyncError(async (req, res, next) => {
    const { name, description } = req.body;
    await Todo.create({
        name,
        description,
        user: req.user
    });

    res.json({
        success: true,
        message: 'Tạo công việc thành công'
    })
});

export const handleGetAllTodo = catchAsyncError(async (req, res, next) => {
    const size = 4;

    const todoQuery = Todo.find({ user: req.user });

    const apiFeatures = new APIFeatures(todoQuery, req.query)
        .search()
        .filter();

    let todos = await apiFeatures.query;
    const count = todos.length;

    const apiFeaturesPagination = new APIFeatures(Todo.find(todoQuery), req.query)
        .search()
        .filter()
        .pagination(size);

    todos = await apiFeaturesPagination.query;

    res.json({
        success: true,
        todos,
        size,
        count
    })
});

export const handleGetTodo = catchAsyncError(async (req, res, next) => {
    const todo = await Todo.findById(req.params.id).select('-__v');

    if (!todo) {
        return next(new ErrorHandler('Không tìm thấy công việc', 404));
    }

    res.json({
        success: true,
        todo
    })
});

export const handleUpdateTodo = catchAsyncError(async (req, res, next) => {
    const todo = await Todo.findById(req.params.id);

    if (!todo) {
        return next(new ErrorHandler('Không tìm thấy công việc', 404));
    }

    await Todo.findByIdAndUpdate(req.params.id, req.body, {
        runValidators: true,
    });

    res.json({
        success: true,
        message: 'Cập nhật công việc thành công'
    })
});

export const handleUpdateStatusTodo = catchAsyncError(async (req, res, next) => {
    const todo = await Todo.findById(req.params.id);

    if (!todo) {
        return next(new ErrorHandler('Không tìm thấy công việc', 404));
    }

    await Todo.findByIdAndUpdate(req.params.id, { status: req.body.status }, {
        runValidators: true,
    });

    res.json({
        success: true,
        message: 'Cập nhật trạng thái công việc thành công'
    })
});