import catchAsyncErrors from '../middlewares/catchAsyncErrors.js';
import Todo from '../models/todo.js';
import { ToDoAPIFeatures } from '../utils/APIFeatures.js';
import formatVietnameseDate from '../utils/dateUtils.js';

export const handleCreateTodo = catchAsyncErrors(async (req, res, next) => {
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

export const handleGetAllTodo = catchAsyncErrors(async (req, res, next) => {
    const size = 4;

    const todoQuery = Todo.find({ user: req.user });

    const apiFeatures = new ToDoAPIFeatures(todoQuery, req.query)
        .search()
        .filter();

    let todos = await apiFeatures.query;
    const count = todos.length;

    const apiFeaturesPagination = new ToDoAPIFeatures(Todo.find(todoQuery), req.query)
        .search()
        .filter()
        .pagination(size);

    todos = await apiFeaturesPagination.query;

    const listTodo = todos.map(todo => ({
        _id: todo._id,
        name: todo.name,
        description: todo.description,
        status: todo.status,
        createdAt: formatVietnameseDate(todo.createdAt.toJSON()),
        updatedAt: formatVietnameseDate(todo.updatedAt.toJSON()),
        user: todo.user
    }));

    res.json({
        success: true,
        todos: listTodo,
        size,
        count
    })
});

export const handleGetTodo = catchAsyncErrors(async (req, res, next) => {
    const todo = await Todo.findById(req.params.id).select('-__v');

    if (!todo) {
        return next(new ErrorHandler('Không tìm thấy công việc', 404));
    }

    const todoData = {
        _id: todo._id,
        name: todo.name,
        description: todo.description,
        status: todo.status,
        createdAt: formatVietnameseDate(todo.createdAt.toJSON()),
        updatedAt: formatVietnameseDate(todo.updatedAt.toJSON()),
        user: todo.user
    };

    res.json({
        success: true,
        todo: todoData
    })
});

export const handleUpdateTodo = catchAsyncErrors(async (req, res, next) => {
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

export const handleUpdateStatusTodo = catchAsyncErrors(async (req, res, next) => {
    const todo = await Todo.findById(req.params.id);

    if (!todo) {
        return next(new ErrorHandler('Không tìm thấy công việc', 404));
    }

    await Todo.findByIdAndUpdate(req.params.id, { status: !todo.status }, {
        runValidators: true,
    });

    res.json({
        success: true,
        message: 'Cập nhật trạng thái công việc thành công'
    })
});

export const handleDeleteToDo = catchAsyncErrors(async (req, res, next) => {
    const todo = await Todo.findById(req.params.id);
    if (!todo) {
        return next(new ErrorHandler('Không tìm thấy công việc', 404));
    }
    await todo.deleteOne();
    res.json({
        success: true,
        message: 'Xóa công việc thành công'
    });
});