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

// Инициализация переменных для хранения хеша и расширения файла
var hash = '';
var ext = '';

// Конфигурация хранения Multer для загрузки файлов
const storage = multer.diskStorage({
	destination: (_, __, callback) => {
		// Проверка существования папки 'upload'; создание, если её нет
		if (!fs.existsSync('upload')) {
			fs.mkdirSync('upload');
		}
		// Установка папки назначения для загруженных файлов
		callback(null, 'upload');
	},
	filename: (_, file, callback) => {
		hash = crypto.createHash('md5').update(Date.now().toString()).digest('hex'); // Генерация уникального имени файла с помощью хеша и текущего времени
		ext = path.extname(file.originalname); // Извлечение расширения из оригинального имени файла
		callback(null, `${hash}${ext}`); // назначение нового имени файла
	},
});

const upload = multer({ storage });

// Главная страница (тестовый эндпоинт)
app.get('/', (req, res) => {
	res.send('Hello world');
});

// Маршрут для загрузки картинки
app.post('/upload', checkAuth, upload.single('image'), (req, res) => {
	res.json({
		url: `/upload/${hash}${ext}`,
	});
});

// Маршрут для удаления картинки
app.delete(
	'/upload/:imageUrl/delete',
	checkAuth,
	SneakersController.removeImage
);

// Маршруты для регистрации и авторизации
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

// Маршруты для получения данных о брендах
app.get('/brand', BrandController.getPagesBrand);
app.get('/brand/:id', BrandController.getOneBrand);

// Маршрут для создания нового бренда
app.post(
	'/brand',
	checkAuth,
	brandCreateValidation,
	handleValidationErrors,
	BrandController.create
);

// Маршрут для удаления бренда
app.delete('/brand/:id', checkAuth, BrandController.remove);

// Маршрут для обновления бренда
app.patch(
	'/brand/:id',
	checkAuth,
	brandCreateValidation,
	handleValidationErrors,
	BrandController.update
);

// Маршрут для получения данных о текущем пользователе
app.post('/auth/me', checkAuth, UserController.getMe);

app.get('/sneakers', SneakersController.getPages); // Получение списка товаров (с пагинацией)
app.get('/sneakers_all', SneakersController.getAll); // Получение полного списка товаров
app.get('/sneakers_admin', SneakersController.getAllForAdmin); // Список товаров для администратора
app.get('/sneakers/:id', SneakersController.getOne); // Получение одного товара
app.post(
	'/sneakers',
	checkAuth,
	postCreateValidation,
	handleValidationErrors,
	SneakersController.create
); // Создание товара
app.delete('/sneakers/:id', checkAuth, SneakersController.remove); // Удаление товара
app.patch(
	'/sneakers/:id',
	checkAuth,
	postCreateValidation,
	handleValidationErrors,
	SneakersController.update
); // Обновление товара

// Запуск сервера на локальном хосте
app.listen(PORT, err => {
	if (err) {
		return console.log(err);
	} else {
		console.log('Server has been started...');
	}
});
