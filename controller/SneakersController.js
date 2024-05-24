import BrandSchema from '../models/Brand.js';
import SneakersModel from '../models/Sneakers.js';

import fs from 'fs';
import path from 'path';

const __dirname = import.meta.dirname;

export const getAll = async (req, res) => {
	try {
		const records = await SneakersModel.find()
			.populate('user')
			.populate('brand')
			.exec();

		res.json(records);
	} catch (error) {
		console.log(error);
		res.status(500).json({
			error: 'Не удалось получить записи',
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
		res.status(500).json({
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
		res.status(500).json({
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
		res.status(500).json({
			error: 'Не удалось удалить картинку',
		});
	}
};

export const create = async (req, res) => {
	try {
		const brand = await BrandSchema.findOne({ brand: req.body.brand });

		const doc = new SneakersModel({
			title: req.body.title,
			brand: brand,
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
		res.status(500).json({
			error: 'Не удалось создать запись',
		});
	}
};

export const update = async (req, res) => {
	try {
		const sneakersId = req.params.id;
		const brand = await BrandSchema.findOne({ brand: req.body.brand });

		const updateSneakers = await SneakersModel.updateOne(
			{
				_id: sneakersId,
			},
			{
				title: req.body.title,
				brand: brand,
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
		res.status(500).json({
			error: 'Не удалось обновить запись',
		});
	}
};
