import User from '../models/user.js';
import catchAsyncErrors from '../middlewares/catchAsyncErrors.js';
import { UserAPIFeatures } from '../utils/APIFeatures.js';
import Todo from '../models/todo.js';


export const handleGetUser = catchAsyncErrors(async (req, res, next) => {
    const user = await User.findById(req.params.id);

    if (!user) {
        return res.status(404).json({
            success: false,
            message: 'Không tìm thấy người dùng',
        });
    }

    const userData = {
        _id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        avatar: user.avatar.url
    };
    res.json({
        success: true,
        user: userData,
    })
});

export const handleDeleteUser = catchAsyncErrors(async (req, res, next) => {
    const user = await User.findById(req.params.id);
    await Todo.deleteMany({ user });
    if (!user) {
        return next(new ErrorHandler('Không tìm thấy người dùng', 404));
    }
    await user.deleteOne();
    res.json({
        success: true,
        message: 'Xóa người dùng thành công'
    });
});


export const handleGetAllUser = catchAsyncErrors(async (req, res, next) => {
    const size = 4;

    const userQuery = User.find({ _id: { $ne: req.user._id } }).select('-__v -resetPasswordExpire -resetPasswordToken -updatedAt');

    const apiFeatures = new UserAPIFeatures(userQuery, req.query)
        .search();

    let users = await apiFeatures.query;
    const count = users.length;

    const apiFeaturesPagination = new UserAPIFeatures(User.find(userQuery), req.query)
        .search()
        .pagination(size);

    users = await apiFeaturesPagination.query;

    res.json({
        success: true,
        users,
        size,
        count
    })
});