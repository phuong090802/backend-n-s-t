import { Schema, model } from 'mongoose';
import * as validator from '../utils/validator.js';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import crypto from 'crypto';

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
            message: 'Quyền truy cập không hợp lệ',
        },
        default: 'user'
    },
    avatar: {
        publicId: {
            type: String,
        },
        url: {
            type: String,
        },
    },
    resetPasswordToken: String,
    resetPasswordExpire: Date

}, { timestamps: true });

userSchema.pre('save', async function (next) {
    if (!this.isModified('password')) {
        next();
    }
    this.password = await bcrypt.hash(this.password, 10);
});

userSchema.methods.comparePassword = async function (enteredPassword) {
    return await bcrypt.compare(enteredPassword, this.password);
}

userSchema.methods.getAccessToken = function () {
    return jwt.sign({ id: this._id }, process.env.SECRET_KEY, {
        expiresIn: process.env.ACCESS_TOKEN_EXPIRES_TIME
    });
}

userSchema.methods.getTokenResetPassword = function () {
    const resetToken = crypto.randomBytes(20).toString('hex');
    this.resetPasswordToken = crypto.createHash('sha256').update(resetToken).digest('hex');
    this.resetPasswordExpire = Date.now() + 5 * 60 * 1000;
    return resetToken;
}

export default model('User', userSchema);