import fs from 'fs';
import jwt from 'jsonwebtoken';
import path from 'path';

import BrandSchema from '../models/Brand.js';
import SneakersModel from '../models/Sneakers.js';
import UserSchema from '../models/User.js';

const __dirname = import.meta.dirname;

export const getPages = async (req, res) => {
	try {
		const totalRecords = await SneakersModel.countDocuments();

		const { page = 1, pageSize = 3 } = req.query;

		const skip = (page - 1) * pageSize;

		const totalPages = Math.ceil(totalRecords / pageSize);

		const records = await SneakersModel.find()
			.populate('user')
			.populate('brand')
			.skip(skip)
			.limit(parseInt(pageSize))
			.exec();

		res.json({
			pages: {
				totalRecords,
				totalPages,
				currentPage: parseInt(page),
				pageSize: parseInt(pageSize),
			},
			data: records,
		});
	} catch (error) {
		console.log(error);
		res.status(400).json({
			error: 'Не удалось получить записи',
		});
	}
};

export const getAll = async (req, res) => {
	try {
		const records = await SneakersModel.find()
			.populate('user')
			.populate('brand')
			.exec();

		res.json({
			data: records,
		});
	} catch (error) {
		console.log(error);
		res.status(400).json({
			error: 'Не удалось получить записи',
		});
	}
};

export const getAllforAdmin = async (req, res) => {
	try {
		const token = req.headers.authorization; // Получаем токен
		const decoded = jwt.verify(token, 'secret'); // Декодируем токен
		const userId = decoded._id; // Извлекаем ID пользователя

		const user = await UserSchema.findOne({ _id: userId });

		if (user.isAdmin) {
			const records = await SneakersModel.find()
				.populate('user')
				.populate('brand')
				.exec();

			res.json({
				data: records,
			});
		} else {
			const records = await SneakersModel.find({ user: userId })
				.populate('user')
				.populate('brand')
				.exec();

			res.json({
				data: records,
			});
		}
	} catch (error) {
		console.log(error);
		res.status(400).json({
			error: 'Не удалось получить записи',
			message: error.message,
		});
	}
};

export const getOne = async (req, res) => {
	try {
		const sneakersId = req.params.id;

		const record = await SneakersModel.findById(sneakersId);

		if (!record) {
			return res.status(404).json({
				error: 'Кроссовки не найдены',
			});
		}

		res.json(record);
	} catch (error) {
		console.log(error);
		res.status(400).json({
			error: 'Не удалось получить запись',
		});
	}
};

export const remove = async (req, res) => {
	try {
		const sneakersId = req.params.id;

		const deletedSneakers = await SneakersModel.findOneAndDelete({
			_id: sneakersId,
		});

		if (!deletedSneakers) {
			return res.status(404).json({
				message: 'Не удалось найти запись',
			});
		}

		res.json({
			success: true,
		});
	} catch (error) {
		console.log(error.message);
		res.status(400).json({
			error: 'Не удалось удалить запись',
		});
	}
};

//! удаление картинки
export const removeImage = async (req, res) => {
	try {
		let imagePath = path.join(__dirname, 'upload', req.params.imageUrl);
		imagePath = imagePath.replace('controller', '');

		fs.unlink(imagePath, err => {
			if (err) {
				console.error('Ошибка при удалении файла:', err);
				res.status(500).json({ error: 'Не удалось удалить файл' });
				console.log(imagePath);
			} else {
				res.send('Файл успешно удален');
			}
		});
	} catch (error) {
		console.log(error.message);
		res.status(400).json({
			error: 'Не удалось удалить картинку',
		});
	}
};

export const create = async (req, res) => {
	try {
		const doc = new SneakersModel({
			title: req.body.title,
			brand: req.body.brand,
			desc: req.body.desc,
			price: req.body.price,
			sources: req.body.sources,
			imageUrl: req.body.imageUrl,
			user: req.userId,
		});

		const post = await doc.save();

		res.json(post);
	} catch (error) {
		console.log(error);
		res.status(400).send(error.message);
	}
};

export const update = async (req, res) => {
	try {
		const sneakersId = req.params.id;

		const updateSneakers = await SneakersModel.updateOne(
			{
				_id: sneakersId,
			},
			{
				title: req.body.title,
				brand: req.body.brand,
				desc: req.body.desc,
				price: req.body.price,
				sources: req.body.sources,
				imageUrl: req.body.imageUrl,
				user: req.userId,
			}
		);

		if (!updateSneakers) {
			return res.status(404).json({
				message: 'Не удалось найти запись',
			});
		}

		res.json({
			success: true,
		});
	} catch (error) {
		console.log(error.message);
		res.status(400).json({
			error: 'Не удалось обновить запись',
		});
	}
};
