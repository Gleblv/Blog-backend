import jwt from "jsonwebtoken";
import bcrypt from 'bcrypt';
import { validationResult } from "express-validator";

import UserModel from '../models/User.js';

export const register = async (req, res) => {
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
}

export const login = async (req, res) => {
    try {
        const user = await UserModel.findOne({email: req.body.email});

        if (!user) {
            return res.status(404).json({
                message: 'Пользователь не найден'
            });
        }

        // проверка пароля
        const isValidPass = await bcrypt.compare(req.body.password, user._doc.passwordHash);

        if (!isValidPass) {
            res.status(400).json({
                message: 'Неверный логин или пароль'
            });
        }

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
            message: 'Не удалось авторизоваться'
        });
    }
}

export const getMe = async (req, res) => {
    try {
        const user = await UserModel.findById(req.userId);

        if (!user) {
            return res.status(404).json({
                message: 'Пользователь не найден'
            })
        }

        const {passwordHash, ...userData} = user._doc;
    
        res.json(userData);
    } catch (err) {
        console.log(err);
        res.status(500).json({
            message: 'Нет доступа'
        });
    }
}