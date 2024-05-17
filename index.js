import cors from 'cors';
import express from 'express';
import mongoose from 'mongoose';
import multer from 'multer';

import { SneakersController, UserController } from './controller/index.js';
import { checkAuth, handleValidationErrors } from './utils/index.js';
import {
	loginValidation,
	postCreateValidation,
	registerValidation,
} from './validation/index.js';

// Подключение к БД
mongoose
	.connect(
		'mongodb+srv://ruslan:jA2tJZzwALoaMLAW@cluster.yvem4p5.mongodb.net/sneakers'
	)
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
app.use('/upload', express.static('uploads')); // делаем папку с загрузками статической, чтобы запросом можно получать

const storage = multer.diskStorage({
	destination: (_, __, callback) => {
		callback(null, 'uploads');
	},
	filename: (_, file, callback) => {
		callback(null, file.originalname);
	},
});

const upload = multer({ storage });

app.post('/upload', checkAuth, upload.single('image'), (req, res) => {
	res.json({
		url: `/upload/${req.file.originalname}`,
	});
});

// Устанавливаем порт для прослушки
const PORT = process.env.PORT || 3000;

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

// Получение данных о нынешнем пользователе
app.post('/auth/me', checkAuth, UserController.getMe);

// CRUD - create, read, update, delete
app.get('/sneakers', SneakersController.getAll);
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
