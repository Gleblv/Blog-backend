import express from "express";
import mongoose from 'mongoose';

import { registerValidation } from "./validations/auth.js";
import checkAuth from "./utils/checkAuth.js";

import * as UserController from "./controllers/UserController.js";

mongoose
    .connect('mongodb+srv://gleb:J0r8uwPkJsRJ7f6A@blog.r1jiuby.mongodb.net/blog?retryWrites=true&w=majority')
    .then(() => console.log('DB OK'))
    .catch((err) => console.log('DB ERROR', err));

const app = express(); // создали express приложение

app.use(express.json()); // указываем чтение json формата

// получение информации о профиле
app.get('/auth/me', checkAuth, UserController.getMe)

// авторизация
app.post('/auth/login', UserController.login)

// регистрация
// путь по которому придёт запрос, проверка, выполнение действий
app.post('/auth/register', registerValidation, UserController.register)

app.listen(4444, (err) => {
    if (err) {
        return console.log(err);
    }

    console.log('server ok');
});