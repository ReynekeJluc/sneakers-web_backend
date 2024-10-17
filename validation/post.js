import BrandSchema from '../models/Brand.js';

import { body } from 'express-validator';

export const postCreateValidation = [
	body('title', 'Некорректное имя')
		.trim()
		.isLength({
			min: 3,
		})
		.isString(),
	body('brand', 'Некорректный брэнд').custom(async val => {
		const val_id = val._id;

		console.log(val_id);

		const brandEx = await BrandSchema.findOne({ _id: val_id });

		if (!brandEx) {
			throw new Error('Brand not exist');
		}
	}),
	body('desc', 'Некорректное описание')
		.trim()
		.isLength({
			min: 10,
		})
		.isString(),
	body('price', 'Некорректная цена')
		.isNumeric()
		.custom(value => {
			if (value < 0) return Promise.reject('Price should be positive');
			else return true;
		}),
	body('sources', 'Некорректные источники (нужен массив)').optional().isArray(),
	body('imageUrl', 'Неверная ссылка на картинку').optional(),
];
