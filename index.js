import cors from 'cors';
import crypto from 'crypto';
import express from 'express';
import fs from 'fs';
import mongoose from 'mongoose';
import multer from 'multer';
import path from 'path';

import {
	BrandController,
	SneakersController,
	UserController,
} from './controller/index.js';
import { checkAuth, handleValidationErrors } from './utils/index.js';
import {
	brandCreateValidation,
	loginValidation,
	postCreateValidation,
	registerValidation,
} from './validation/index.js';

// Подключение к БД
const con =
	process.env.MONGODB_URI ||
	'mongodb+srv://ruslan:jA2tJZzwALoaMLAW@cluster.yvem4p5.mongodb.net/sneakers';

// Устанавливаем порт для прослушки
const PORT = process.env.PORT || 3000;

mongoose
	.connect(con)
	.then(() => {
		console.log('DB ok');
	})
	.catch(err => {
		console.log('DB error - ', err);
	});

// Создание экземпляра приложения и указание что мы работаем с JSON
const app = express();
app.use(express.json());

// Убираем проблему с отправкой запросов с фронта
app.use(cors());

// Работа с загрузкой картинок через multer
app.use('/upload', express.static('upload')); // делаем папку с загрузками статической, чтобы запросом можно получать

var hash = '';
var ext = '';
const storage = multer.diskStorage({
	destination: (_, __, callback) => {
		if (!fs.existsSync('upload')) {
			fs.mkdirSync('upload');
		}
		callback(null, 'upload');
	},
	filename: (_, file, callback) => {
		hash = crypto.createHash('md5').update(Date.now().toString()).digest('hex');
		ext = path.extname(file.originalname);
		callback(null, `${hash}${ext}`);
	},
});

const upload = multer({ storage });

app.post('/upload', checkAuth, upload.single('image'), (req, res) => {
	res.json({
		url: `/upload/${hash}${ext}`,
	});
});
app.delete(
	'/upload/:imageUrl/delete',
	checkAuth,
	SneakersController.removeImage
);

// Главная страница
app.get('/', (req, res) => {
	res.send('Hello world');
});

// Регистрация и авторизация
app.post(
	'/auth/register',
	registerValidation,
	handleValidationErrors,
	UserController.register
);
app.post(
	'/auth/login',
	loginValidation,
	handleValidationErrors,
	UserController.login
);

// Получение брэндов
app.get('/brand', BrandController.getPagesBrand);
app.get('/brand/:id', BrandController.getOneBrand);

// Добавление брэнда
app.post('/brand', checkAuth, brandCreateValidation, BrandController.create);

// Получение данных о нынешнем пользователе
app.post('/auth/me', checkAuth, UserController.getMe);

// CRUD - create, read, update, delete
app.get('/sneakers', SneakersController.getPages);
app.get('/sneakers_all', SneakersController.getAll);
app.get('/sneakers_admin', SneakersController.getAllforAdmin);
app.get('/sneakers/:id', SneakersController.getOne);
app.post(
	'/sneakers',
	checkAuth,
	postCreateValidation,
	handleValidationErrors,
	SneakersController.create
);
app.delete('/sneakers/:id', checkAuth, SneakersController.remove);
app.patch(
	'/sneakers/:id',
	checkAuth,
	postCreateValidation,
	handleValidationErrors,
	SneakersController.update
);

// Запуск локалки
app.listen(PORT, err => {
	if (err) {
		return console.log(err);
	} else {
		console.log('Server has been started...');
	}
});
