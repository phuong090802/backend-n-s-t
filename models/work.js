import { Schema, model } from 'mongoose';

const workSchema = new Schema({
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
    members: [
        {
            type: Schema.Types.ObjectId,
            ref: 'User'
        }],
    user: {
        type: Schema.Types.ObjectId,
        required: [true, 'Công việc phải thuộc về người dùng'],
        ref: 'User'
    }
}, { timestamps: true });

export default model('Work', workSchema);