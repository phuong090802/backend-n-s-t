import { Schema, model } from 'mongoose';

const refreshTokenSchema = new Schema({
    token: {
        type: String,
        required: true,
        unique: [true, 'Token phải là duy nhất']
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
        type: mongoose.Schema.Types.ObjectId,
        ref: 'RefreshToken'
    },
    account: {
        type: mongoose.Schema.Types.ObjectId,
        required: [true, 'Token phải thuộc về người dùng'],
        ref: 'User'
    }
}, { collection: 'refresh-tokens', timestamps: true });

export default model('RefreshToken', refreshTokenSchema);