import express from 'express';
import mongoose from 'mongoose';
import multer from 'multer';
import cors from 'cors';

import { loginValidation, postCreateValidation, registerValidation } from './validations.js';
import { checkAuth, handleValidationErrors } from './utils/index.js';

import { UserController, PostController } from './controllers/index.js';

mongoose
  .connect(
    'mongodb+srv://gleb:J0r8uwPkJsRJ7f6A@blog.r1jiuby.mongodb.net/blog?retryWrites=true&w=majority',
  )
  .then(() => console.log('DB OK'))
  .catch((err) => console.log('DB ERROR', err));

const app = express(); // создали express приложение

// сохранение загруженных файлов
const storage = multer.diskStorage({
  destination: (_, __, callback) => {
    callback(null, 'uploads');
  },
  filename: (_, file, callback) => {
    callback(null, file.originalname);
  },
});

// функция для загрузки файлов
const upload = multer({ storage });

app.use(express.json()); // указываем чтение json формата
app.use(cors());
app.use('/uploads', express.static('uploads'));

// получение информации о профиле
app.get('/auth/me', checkAuth, UserController.getMe);
// авторизация
app.post('/auth/login', loginValidation, handleValidationErrors, UserController.login);
// регистрация
// путь по которому придёт запрос, проверка, выполнение действий
app.post('/auth/register', registerValidation, handleValidationErrors, UserController.register);

app.post('/upload', checkAuth, upload.single('image'), (req, res) => {
  res.json({
    url: `/uploads/${req.file.originalname}`,
  });
});

app.get('/posts', PostController.getAll);
app.get('/posts/:id', PostController.getOne);
app.post('/posts', checkAuth, postCreateValidation, registerValidation, PostController.create);
app.delete('/posts/:id', checkAuth, PostController.remove);
app.patch('/posts/:id', postCreateValidation, registerValidation, checkAuth, PostController.update);

app.get('/tags', PostController.getLastTags);

app.listen(4444, (err) => {
  if (err) {
    return console.log(err);
  }

  console.log('server ok');
});
