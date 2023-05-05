import mongoose from "mongoose";

// Создаём схему
const PostSchema = new mongoose.Schema(
    {
        title: {
            type: String,
            required: true
        },
        text: {
            type: String,
            required: true
        },
        tags: { // зашифрованный пароль
            type: Array,
            default: []
        },
        viewsCount: {
            type: Number,
            default: 0
        },
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true
        },
        imageUrl: String
    }, 
    {
        timestamps: true // дата создания и обновления
    }
);

export default mongoose.model('Post', PostSchema);