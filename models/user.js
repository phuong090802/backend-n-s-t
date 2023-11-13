import { Schema, model } from 'mongoose';
import * as validator from '../utils/validator.js';
import bcrypt from 'bcrypt';

const userSchema = new Schema({
    name: {
        type: String,
        required: [true, 'Vui lòng nhập tên'],
        maxLength: [25, 'Tên không được vượt quá 25 ký tự']
    },
    email: {
        type: String,
        required: [true, 'Vui lòng nhập email'],
        maxLength: [255, 'Email không được vượt quá 255 ký tự'],
        unique: true,
        validate: {
            validator: validator.isEmail,
            message: 'Vui lòng nhập email hợp lệ'
        }
    },
    phone: {
        type: String,
        required: [true, 'Vui lòng nhập số điện thoại'],
        maxLength: [11, 'Số điện thoại không được vượt quá 11 ký tự'],
        unique: true,
        validate: {
            validator: validator.isPhone,
            message: 'Vui lòng nhập số điện thoại hợp lệ'
        }
    },
    password: {
        type: String,
        required: [true, 'Vui lòng nhập mật khẩu'],
        minLength: [6, 'Mật khẩu phải dài hơn 6 ký tự'],
        select: false
    },
    avatar: {
        blobId: {
            type: String
        },
        url: {
            type: String,
        }
    },
    role: {
        type: String,
        enum: {
            values: [
                'admin',
                'user'
            ],
            message: 'Role không hợp lệ',
            default: 'user'
        }
    },
    isLeader: {
        type: Boolean
    }
}, { timestamps: true });

userSchema.pre('save', async function (next) {
    if (!this.isModified('password')) {
        next();
    }
    this.password = await bcrypt.hash(this.password, 10);
});

export default model('User', userSchema);