import mongoose from "mongoose";

// Создаём схему
const UserSchema = new mongoose.Schema(
    {
        fullName: {
            type: String,
            required: true
        },
        email: {
            type: String,
            required: true,
            unique: true
        },
        passwordHash: { // зашифрованный пароль
            type: String,
            required: true
        },
        avatarUrl: String
    }, 
    {
        timestamps: true // дата создания и обновления
    }
);

export default mongoose.model('User', UserSchema);