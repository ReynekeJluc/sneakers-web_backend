import { body } from 'express-validator';

export const brandCreateValidation = [
	body('brand', 'Некорректный брэнд1').isString().trim().isLength({
		min: 2,
	}),
	body('desc', 'Некорректное описание')
		.trim()
		.isLength({
			min: 10,
		})
		.isString(),
];
