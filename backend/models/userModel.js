import mongoose, { Schema } from 'mongoose';

const userSchema = new Schema({
    name: {
        type: String,
        trim: true,
        minlength: 5
    },
    email: {
        type: String,
        unique: true,
        required: true,
        trim: true
    },
    password: {
        type: String,
        required: true,
        trim: true,
        minlength: 5
    }
}, {
    timestamps: true
});

const User = mongoose.model('User', userSchema);

export default User; 