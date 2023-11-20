import { Schema, model } from 'mongoose';

const todoSchema = new Schema({
    name: {
        type: String,
        required: [true, 'Vui lòng nhập tên công việc'],
        unique: [true, 'Công việc đã tồn tại']
    },
    description: {
        type: String
    },
    status: {
        type: Boolean,
        default: false
    },
    user: {
        type: Schema.Types.ObjectId,
        required: [true, 'Thiếu thông tin người dùng'],
        ref: 'User'
    }
}, { timestamps: true });

export default model('Todo', todoSchema);