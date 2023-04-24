import express from "express";
import jwt from "jsonwebtoken";
import bcrypt from 'bcrypt';
import mongoose from 'mongoose';
import { validationResult } from "express-validator";

import { registerValidation } from "./validations/auth.js";

import UserModel from './models/User.js';

mongoose
    .connect('mongodb+srv://gleb:J0r8uwPkJsRJ7f6A@blog.r1jiuby.mongodb.net/blog?retryWrites=true&w=majority')
    .then(() => console.log('DB OK'))
    .catch((err) => console.log('DB ERROR', err));

const app = express(); // создали express приложение

app.use(express.json()); // указываем чтение json формата

// путь по которому придёт запрос, проверка, выполнение действий
app.post('/auth/register', registerValidation, async (req, res) => {
    try {
        const errors = validationResult(req);

        if(!errors.isEmpty()) {
            return res.status(400).json(errors.array());
        }
    
        const password = req.body.password;
        const salt = await bcrypt.genSalt(10); // алгоритм шифрования
        const hash = await bcrypt.hash(password, salt);
    
        // док-т на создание пользователя
        const doc = new UserModel({
            email: req.body.email,
            fullName: req.body.fullName,
            avatarUrl: req.body.avatarUrl, 
            passwordHash: hash
        });
    
        const user = await doc.save(); // сохраняем пользователя в базу данных

        const token = jwt.sign(
            {
                _id: user._id
            }, 
            'secret123', 
            {
                expiresIn: '30d' // срок жизни токена
            }
        );

        const {passwordHash, ...userData} = user._doc;
    
        res.json({
            ...userData,
            token
        });
    } catch (err) {
        console.log(err);
        res.status(500).json({
            message: 'Не удалось зарегестрироваться'
        });
    }
})

app.get('/', (req, res) => {
    return res.send('Вова ЛОХ');
})

app.listen(4444, (err) => {
    if (err) {
        return console.log(err);
    }

    console.log('server ok');
});