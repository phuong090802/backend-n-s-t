import { Schema, model } from 'mongoose';

const refreshTokenSchema = new Schema({
    token: {
        type: String,
        required: true,
        unique: [true, 'Token phải bị trùng']
    },
    status: {
        type: Boolean,
        default: true
    },
    expires: {
        type: Date,
        required: Date.now
    },
    parent: {
        type: Schema.Types.ObjectId,
        ref: 'RefreshToken'
    },
    user: {
        type: Schema.Types.ObjectId,
        required: [true, 'Thiếu thông tin người dùng'],
        ref: 'User'
    }
}, { collection: 'refresh-tokens', timestamps: true });

export default model('RefreshToken', refreshTokenSchema);